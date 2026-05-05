import { NextResponse } from "next/server";

export const maxDuration = 60;
export const dynamic = "force-dynamic";

const MODELS = [
  "gemini-2.5-flash-lite",
  "gemini-2.5-flash",
  "gemini-1.5-flash-latest"
];

const DAILY_LIMIT = 10;
const usage = new Map<string, { date: string; count: number }>();

type Payload = {
  imageBase64?: string;
  mimeType?: string;
};

const prompt = `Extract all readable text from this image and structure it for a Word document.

Rules:
- Preserve headings where possible
- Preserve paragraphs
- Preserve bullet points and numbered lists
- Detect simple tables if possible
- Do not invent missing text
- If something is unclear, mark it as [unclear]
- Return clean structured Markdown suitable for DOCX generation`;

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function getIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return request.headers.get("x-real-ip") || "unknown";
}

function getUsage(ip: string) {
  const today = todayKey();
  const record = usage.get(ip);
  if (!record || record.date !== today) {
    const fresh = { date: today, count: 0 };
    usage.set(ip, fresh);
    return fresh;
  }
  return record;
}

function safeError(status: number) {
  if (status === 429) return "Daily AI image conversion limit reached. Please try again later.";
  return "AI is busy, try again later.";
}

export async function POST(request: Request) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("Gemini image-to-word error", {
      model: MODELS[0],
      status: 401,
      message: "GEMINI_API_KEY is missing"
    });
    return NextResponse.json({ error: "AI is busy, try again later." }, { status: 401 });
  }

  let payload: Payload;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request. Please send JSON." }, { status: 400 });
  }

  const imageBase64 = payload.imageBase64?.replace(/^data:[^;]+;base64,/, "").trim() ?? "";
  const mimeType = payload.mimeType?.trim() ?? "";

  if (!imageBase64 || !["image/jpeg", "image/png", "image/webp"].includes(mimeType)) {
    return NextResponse.json({ error: "Please upload a JPG, PNG, or WebP image." }, { status: 400 });
  }

  const ip = getIp(request);
  const record = getUsage(ip);
  if (record.count >= DAILY_LIMIT) {
    return NextResponse.json({ error: safeError(429) }, { status: 429 });
  }

  let output = "";
  let lastError = 500;

  for (const model of MODELS) {
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                { text: prompt },
                {
                  inlineData: {
                    mimeType,
                    data: imageBase64
                  }
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 1600
          }
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Gemini image-to-word model failed", {
          model,
          status: response.status,
          message: errorText.slice(0, 300)
        });
        lastError = response.status;
        continue;
      }

      const data = await response.json();
      output =
        data?.candidates?.[0]?.content?.parts
          ?.map((part: { text?: string }) => part.text ?? "")
          .join("")
          .trim() ?? "";

      if (output) break;
    } catch (error) {
      console.error("Gemini image-to-word fetch error", {
        model,
        status: 500,
        message: error instanceof Error ? error.message : "Unknown Gemini fetch error"
      });
      lastError = 500;
    }
  }

  if (!output) {
    return NextResponse.json({ error: safeError(lastError) }, { status: lastError });
  }

  record.count += 1;
  usage.set(ip, record);

  return NextResponse.json({ output });
}
