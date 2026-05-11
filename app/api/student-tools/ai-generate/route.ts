import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";

type UsageBucket = { date: string; count: number };
type GenerateBody = {
  resumeText: string;
  jobDescription: string;
  roleTitle: string;
  tone: string;
  experienceLevel: string;
  outputType: string;
};

const MODEL = "claude-haiku-4-5-20251001";
const SERVER_LIMIT = 10;
const usage = new Map<string, UsageBucket>();
const RESUME_UNAVAILABLE_MESSAGE = "AI resume generation is temporarily unavailable. Please try again later.";

export const runtime = "nodejs";
export const maxDuration = 60;
export const dynamic = "force-dynamic";

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

function normalizeBody(body: Record<string, unknown>): GenerateBody {
  return {
    resumeText: String(body.resumeText ?? ""),
    jobDescription: String(body.jobDescription ?? ""),
    roleTitle: String(body.roleTitle ?? ""),
    tone: String(body.tone ?? "Professional"),
    experienceLevel: String(body.experienceLevel ?? "Student"),
    outputType: String(body.outputType ?? "Both")
  };
}

function getAnthropicStatus(error: unknown) {
  if (typeof error === "object" && error !== null && "status" in error) {
    const status = Number((error as { status?: unknown }).status);
    return Number.isFinite(status) ? status : undefined;
  }
  return undefined;
}

function getAnthropicMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  if (typeof error === "object" && error !== null && "message" in error) {
    return String((error as { message?: unknown }).message ?? "");
  }
  return "Unknown Anthropic error";
}

function publicErrorForStatus(status?: number) {
  if (status === 401 || status === 403 || status === 404) return { status: 503, message: RESUME_UNAVAILABLE_MESSAGE };
  if (status === 429) return { status, message: "Daily AI usage limit reached. Please try again later." };
  if (status && status >= 500) return { status, message: RESUME_UNAVAILABLE_MESSAGE };
  return { status: 503, message: RESUME_UNAVAILABLE_MESSAGE };
}

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    return NextResponse.json({ error: "Only JSON requests are supported." }, { status: 415 });
  }

  const rawBody = await request.json().catch(() => null);
  if (!rawBody || typeof rawBody !== "object") {
    return NextResponse.json({ error: "Invalid JSON request body." }, { status: 400 });
  }

  const body = normalizeBody(rawBody as Record<string, unknown>);
  const resumeText = body.resumeText.trim();
  const jobDescription = body.jobDescription.trim();
  const trimmedResume = resumeText.slice(0, 3000);
  const trimmedJD = jobDescription.slice(0, 1500);

  if (resumeText.length < 200) {
    return NextResponse.json({ error: "Resume text must be at least 200 characters." }, { status: 400 });
  }

  if (jobDescription.length < 100) {
    return NextResponse.json({ error: "Job description must be at least 100 characters." }, { status: 400 });
  }

  const ip = getClientIp(request);
  // TODO: Use durable storage for production rate limiting across server instances.
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: "Daily AI usage limit reached. Please try again later." }, { status: 429 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error("Anthropic resume generation is not configured", {
      model: MODEL,
      reason: "missing_api_key"
    });
    return NextResponse.json({ error: RESUME_UNAVAILABLE_MESSAGE }, { status: 503 });
  }

  const prompt = `You are a professional resume and cover letter assistant.

INPUT RESUME:
${trimmedResume}

JOB DESCRIPTION:
${trimmedJD}

ROLE TITLE:
${body.roleTitle}

TONE:
${body.tone}

EXPERIENCE LEVEL:
${body.experienceLevel}

OUTPUT TYPE:
${body.outputType}

RULES:
- Do not invent experience, companies, degrees, certifications, dates, or skills.
- Only improve and rephrase information provided by the user.
- Make the resume ATS-friendly.
- Use clear professional formatting.
- Keep output concise and realistic.
- If information is missing, add a “Suggested Improvements” section instead of inventing details.

OUTPUT EXACTLY IN THIS STRUCTURE:

---RESUME---
[tailored resume here]

---COVER LETTER---
[cover letter here]

---KEYWORDS---
- keyword 1
- keyword 2

---IMPROVEMENTS---
- improvement 1
- improvement 2`;

  try {
    const anthropic = new Anthropic({ apiKey });
    const stream = await anthropic.messages.stream({
      model: MODEL,
      max_tokens: 1500,
      temperature: 0.4,
      messages: [{ role: "user", content: prompt }]
    });

    return new Response(
      new ReadableStream({
        async start(controller) {
          const encoder = new TextEncoder();
          let receivedText = false;

          try {
            for await (const chunk of stream) {
              if (chunk.type === "content_block_delta" && chunk.delta.type === "text_delta") {
                receivedText = true;
                controller.enqueue(encoder.encode(chunk.delta.text));
              }
            }

            if (receivedText) incrementUsage(ip);
            controller.close();
          } catch (error) {
            console.error("Anthropic stream failed", {
              statusCode: getAnthropicStatus(error) ?? "unknown",
              model: MODEL,
              message: getAnthropicMessage(error)
            });
            if (!receivedText) {
              controller.enqueue(encoder.encode(RESUME_UNAVAILABLE_MESSAGE));
              controller.close();
              return;
            }
            controller.close();
          }
        }
      }),
      {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Cache-Control": "no-store"
        }
      }
    );
  } catch (error) {
    const status = getAnthropicStatus(error);
    const publicError = publicErrorForStatus(status);
    console.error("Anthropic generation failed", {
      statusCode: status ?? "unknown",
      model: MODEL,
      message: getAnthropicMessage(error)
    });
    return NextResponse.json({ error: publicError.message }, { status: publicError.status });
  }
}
