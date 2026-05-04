import { NextResponse } from "next/server";

type UsageBucket = { date: string; count: number };
type GeminiCandidate = { content?: { parts?: Array<{ text?: string }> } };

const SERVER_LIMIT = 10;
const GEMINI_MODELS = [
  "gemini-2.0-flash",
  "gemini-1.5-flash",
  "gemini-1.5-pro"
];
const usage = new Map<string, UsageBucket>();

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

function cleanJsonText(text: string) {
  return text
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
}

function parseGeminiOutput(text: string) {
  try {
    const parsed = JSON.parse(cleanJsonText(text)) as { resume?: string; coverLetter?: string; keywords?: string[] | string };
    return {
      resume: String(parsed.resume ?? "").trim(),
      coverLetter: String(parsed.coverLetter ?? "").trim(),
      keywords: Array.isArray(parsed.keywords) ? parsed.keywords.join(", ") : String(parsed.keywords ?? "").trim()
    };
  } catch {
    return { resume: text.trim(), coverLetter: "", keywords: "" };
  }
}

export async function POST(request: Request) {
  const ip = getClientIp(request);
  // TODO: Use Upstash Redis for production rate limiting across server instances.
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: "Daily server limit reached. Please try again tomorrow." }, { status: 429 });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "AI generation is not configured yet. Add GEMINI_API_KEY to the server environment." }, { status: 500 });
  }

  const body = await request.json().catch(() => null) as {
    resumeText?: string;
    jobDescription?: string;
    roleTitle?: string;
    tone?: string;
    experienceLevel?: string;
    outputType?: string;
  } | null;

  if (!body?.resumeText?.trim() || !body.jobDescription?.trim()) {
    return NextResponse.json({ error: "Resume text and job description are required." }, { status: 400 });
  }

  const prompt = `You are a professional career assistant.

TASK:
Given:
- User resume text
- Job description

Generate:
1. Tailored resume (structured sections)
2. Tailored cover letter
3. ATS keywords used

Keep the response concise:
- Resume: maximum 450 words.
- Cover letter: maximum 260 words.
- Keywords: maximum 20 short items.

OPTIONS:
- Role title: ${body.roleTitle || "Not specified"}
- Tone: ${body.tone || "Professional"}
- Experience level: ${body.experienceLevel || "Student"}
- Output type requested: ${body.outputType || "Both"}

RULES:
- Do NOT invent experience, companies, degrees, dates, certifications, awards, projects, or skills.
- Only improve, organize, and rephrase existing content from the resume text.
- Align with job description keywords only when supported by the resume.
- Keep formatting clean, concise, professional, and ATS-friendly.
- If a requested detail is missing, write a neutral placeholder reminder instead of fabricating it.
- Return strict JSON only with keys: resume, coverLetter, keywords.
- The keywords value must be an array of short strings.

USER RESUME TEXT:
${body.resumeText.slice(0, 8000)}

JOB DESCRIPTION:
${body.jobDescription.slice(0, 6000)}`;

  let finalError = "";
  for (const model of GEMINI_MODELS) {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 2600,
          responseMimeType: "application/json"
        }
      })
    });

    if (response.ok) {
      const data = await response.json() as { candidates?: GeminiCandidate[] };
      const text = data.candidates?.[0]?.content?.parts?.map((part) => part.text ?? "").join("\n").trim() ?? "";
      if (!text) {
        finalError = "The AI response was empty.";
        console.error("Gemini model failed:", model, 502, finalError);
        continue;
      }
      incrementUsage(ip);
      return NextResponse.json(parseGeminiOutput(text));
    }

    const errorText = await response.text().catch(() => "");
    finalError = errorText;
    console.error("Gemini model failed:", model, response.status, errorText);
    const lower = errorText.toLowerCase();
    const retryable =
      response.status === 404 ||
      response.status === 429 ||
      response.status === 503 ||
      lower.includes("high demand") ||
      lower.includes("overloaded");
    if (!retryable) break;
  }

  return NextResponse.json(
    { error: "AI is currently busy. Please try again shortly.", details: finalError.slice(0, 240) },
    { status: 503 }
  );
}
