import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";

type UsageBucket = { date: string; count: number };
type AiOutput = { resume: string; coverLetter: string; keywords: string; improvements: string };
type DomMatrixGlobal = typeof globalThis & { DOMMatrix?: typeof DOMMatrix };

const SERVER_LIMIT = 10;
const usage = new Map<string, UsageBucket>();

export const runtime = "nodejs";

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function getClientIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return request.headers.get("x-real-ip") ?? "unknown";
}

function isRateLimited(ip: string) {
  const date = todayKey();
  const current = usage.get(ip);
  return Boolean(current && current.date === date && current.count >= SERVER_LIMIT);
}

function incrementUsage(ip: string) {
  const date = todayKey();
  const current = usage.get(ip);
  if (!current || current.date !== date) {
    usage.set(ip, { date, count: 1 });
    return;
  }
  usage.set(ip, { date, count: current.count + 1 });
}

function section(output: string, name: string) {
  const pattern = new RegExp(`---${name}---\\\\s*([\\\\s\\\\S]*?)(?=\\\\n---[A-Z ]+---|$)`, "i");
  return output.match(pattern)?.[1]?.trim() ?? "";
}

function parseClaudeOutput(output: string): AiOutput {
  return {
    resume: section(output, "RESUME") || output.trim(),
    coverLetter: section(output, "COVER LETTER"),
    keywords: section(output, "KEYWORDS"),
    improvements: section(output, "IMPROVEMENTS")
  };
}

async function ensureServerDomMatrix() {
  const globalWithDomMatrix = globalThis as DomMatrixGlobal;
  if (globalWithDomMatrix.DOMMatrix) return;

  const dynamicRequire = eval("require") as NodeRequire;
  const canvasModule = dynamicRequire("@napi-rs/canvas") as { DOMMatrix: typeof DOMMatrix };
  globalWithDomMatrix.DOMMatrix = canvasModule.DOMMatrix;
}

async function extractResumeText(file: File) {
  const name = file.name.toLowerCase();
  const type = file.type;

  if (type === "text/plain" || name.endsWith(".txt")) {
    return (await file.text()).trim();
  }

  if (type === "application/pdf" || name.endsWith(".pdf")) {
    await ensureServerDomMatrix();
    const { PDFParse } = await import("pdf-parse");
    const parser = new PDFParse({ data: Buffer.from(await file.arrayBuffer()) });
    try {
      const data = await parser.getText();
      return data.text.trim();
    } finally {
      await parser.destroy();
    }
  }

  if (type.includes("wordprocessingml") || name.endsWith(".docx")) {
    const mammoth = await import("mammoth");
    const result = await mammoth.extractRawText({ buffer: Buffer.from(await file.arrayBuffer()) });
    return result.value.trim();
  }

  throw new Error("Please upload a PDF, Word DOCX, or TXT resume file.");
}

async function requestBody(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";
  if (contentType.includes("multipart/form-data")) {
    const formData = await request.formData();
    const fileValue = formData.get("resumeFile");
    const file = fileValue instanceof File ? fileValue : null;
    const resumeText = file ? await extractResumeText(file) : String(formData.get("resumeText") ?? "");
    return {
      action: String(formData.get("action") ?? "generate"),
      resumeText,
      jobDescription: String(formData.get("jobDescription") ?? ""),
      roleTitle: String(formData.get("roleTitle") ?? ""),
      tone: String(formData.get("tone") ?? "Professional"),
      experienceLevel: String(formData.get("experienceLevel") ?? "Student"),
      outputType: String(formData.get("outputType") ?? "Both")
    };
  }

  const body = await request.json().catch(() => ({})) as Record<string, unknown>;
  return {
    action: String(body.action ?? "generate"),
    resumeText: String(body.resumeText ?? ""),
    jobDescription: String(body.jobDescription ?? ""),
    roleTitle: String(body.roleTitle ?? ""),
    tone: String(body.tone ?? "Professional"),
    experienceLevel: String(body.experienceLevel ?? "Student"),
    outputType: String(body.outputType ?? "Both")
  };
}

export async function POST(request: Request) {
  let body: Awaited<ReturnType<typeof requestBody>>;
  try {
    body = await requestBody(request);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to read resume file." }, { status: 400 });
  }

  if (body.action === "extract") {
    if (!body.resumeText.trim()) {
      return NextResponse.json({ error: "No readable resume text was found in that file." }, { status: 400 });
    }
    return NextResponse.json({ resumeText: body.resumeText });
  }

  const ip = getClientIp(request);
  // TODO: Use Upstash Redis for production rate limiting across server instances.
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: "Daily server limit reached. Please try again tomorrow." }, { status: 429 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "AI generation is not configured yet. Add ANTHROPIC_API_KEY to the server environment." }, { status: 500 });
  }

  const resumeText = body.resumeText.trim();
  const jobDescription = body.jobDescription.trim();
  if (!resumeText || !jobDescription) {
    return NextResponse.json({ error: "Resume text and job description are required." }, { status: 400 });
  }

  const prompt = `
You are a professional resume and career expert.

INPUT:
Resume:
${resumeText.slice(0, 10000)}

Job Description:
${jobDescription.slice(0, 7000)}

Context:
- Role title: ${body.roleTitle || "Not specified"}
- Tone: ${body.tone || "Professional"}
- Experience level: ${body.experienceLevel || "Student"}
- Output type requested: ${body.outputType || "Both"}

TASK:
1. Improve and tailor the resume for this job
2. Generate a professional cover letter
3. Extract ATS keywords
4. Suggest improvements

RULES:
- DO NOT invent experience
- DO NOT add fake companies, degrees, dates, certifications, awards, projects, or skills
- Only improve and rephrase existing content
- Make it ATS-friendly
- Keep formatting clean and structured
- Keep the resume and cover letter concise

OUTPUT FORMAT:

---RESUME---
[structured resume]

---COVER LETTER---
[cover letter]

---KEYWORDS---
[list]

---IMPROVEMENTS---
[list]
`;

  try {
    const anthropic = new Anthropic({ apiKey });
    const response = await anthropic.messages.create({
      model: "claude-3-haiku-20240307",
      max_tokens: 1500,
      messages: [{ role: "user", content: prompt }]
    });
    const text = response.content
      .map((part) => (part.type === "text" ? part.text : ""))
      .join("\n")
      .trim();

    if (!text) throw new Error("Empty Claude response.");
    incrementUsage(ip);
    return NextResponse.json(parseClaudeOutput(text));
  } catch (error) {
    console.error("Claude generation failed:", error);
    return NextResponse.json({ error: "AI is currently busy. Please try again shortly." }, { status: 503 });
  }
}
