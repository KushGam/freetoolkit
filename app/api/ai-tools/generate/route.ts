import { NextResponse } from "next/server";

export const maxDuration = 60;
export const dynamic = "force-dynamic";

// ✅ Use fallback models (important)
const MODELS = [
  "gemini-2.5-flash-lite",
  "gemini-2.5-flash",
  "gemini-1.5-flash-latest"
];

const DAILY_LIMIT = 20;
const usage = new Map<string, { date: string; count: number }>();

type AiPayload = {
  toolType?: string;
  input?: unknown;
  options?: Record<string, unknown>;
};

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

function stringifyInput(input: unknown) {
  if (typeof input === "string") return input.trim();
  if (input && typeof input === "object") {
    return Object.entries(input as Record<string, unknown>)
      .map(([key, value]) => `${key}: ${typeof value === "string" ? value.trim() : String(value ?? "")}`)
      .join("\n")
      .trim();
  }
  return "";
}

function promptFor(toolType: string, input: string, options: Record<string, unknown> = {}) {
  const optionText = Object.entries(options)
    .map(([key, value]) => `${key}: ${String(value ?? "")}`)
    .join("\n");

  const exactPrompts: Record<string, string> = {
    notes: `You are a study assistant.
Convert the text into structured notes.
- Use headings
- Use bullet points
- Highlight key terms
- Do NOT add new info`,
    explain: `Explain the text simply.
- Use basic language
- No jargon
- Short and clear`,
    email: `Write a professional email.
- Include subject
- Clear structure
- Concise`,
    reply: `Generate 3 short replies.
- Natural tone
- Human-like
- No long paragraphs`,
    rewrite: `Rewrite the text.
- Keep meaning same
- Improve clarity
- No added content`,
    productivity: `Convert into to-do list.
- Clear tasks
- Logical order
- Short phrases`,
    "AI Caption Generator": `Create social media caption options.
- Keep captions concise
- Match the selected tone
- Do not invent facts, prices, results, or claims
- Return 5 caption options`,
    "AI YouTube Title Generator": `Create YouTube title ideas.
- Make them clear and clickable without being misleading
- Keep titles concise
- Do not invent facts
- Return 10 title options`,
    "AI Hashtag Generator": `Generate relevant hashtags.
- Group hashtags into broad, niche, and branded-style ideas
- Do not invent trending claims
- Keep output clean and copy-friendly`,
    "Resume ATS Checker": `You are a resume ATS review assistant.
Compare the resume text with the job description.
- Do not invent experience, companies, degrees, dates, or skills
- Identify keyword gaps
- Give formatting and clarity suggestions
- Return a concise ATS score estimate, strengths, gaps, and improvements`
  };

  const basePrompt = exactPrompts[toolType] ?? `You are a concise writing assistant for FreeToolKit.

TOOL TYPE:
${toolType}

RULES:
- Keep responses concise.
- Do not include citations.
- Do not mention Gemini.
- Do not invent facts.
- Return clean structured output.
- Avoid long essays unless the user selected detailed mode.
- If information is missing, say what is needed instead of inventing it.

Generate the best output for this tool type.`;

  return `${basePrompt}

USER INPUT:
${input}

OPTIONS:
${optionText || "none"}`;
}

function friendlyError(status: number) {
  if (status === 429) return "Daily AI usage limit reached. Please try again later.";
  return "AI is busy, try again later";
}

export async function POST(request: Request) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.error("Gemini AI tool error", {
      model: MODELS[0],
      status: 401,
      message: "GEMINI_API_KEY is missing"
    });
    return NextResponse.json(
      { error: "AI is busy, try again later" },
      { status: 401 }
    );
  }

  let payload: AiPayload;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request. Please send JSON." },
      { status: 400 }
    );
  }

  const toolType = typeof payload.toolType === "string" ? payload.toolType.trim() : "";
  const input = stringifyInput(payload.input);
  const options = payload.options ?? {};

  const strictTools = new Set(["notes", "explain", "email", "reply", "rewrite", "productivity"]);
  const minimumInputLength = strictTools.has(toolType) ? 50 : 10;

  if (!toolType || input.length < minimumInputLength) {
    return NextResponse.json(
      { error: "Please enter more text" },
      { status: 400 }
    );
  }

  const ip = getIp(request);
  const record = getUsage(ip);

  if (record.count >= DAILY_LIMIT) {
    return NextResponse.json(
      { error: "Daily AI usage limit reached. Please try again later." },
      { status: 429 }
    );
  }

  let output = "";
  let lastError: number | null = null;

  // ✅ MODEL FALLBACK LOOP
  for (const model of MODELS) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    try {
      const geminiResponse = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: promptFor(toolType, input.slice(0, 6000), options)
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.35,
            maxOutputTokens: 900
          }
        })
      });

      if (!geminiResponse.ok) {
        const errorText = await geminiResponse.text();

        console.error("Gemini model failed", {
          model,
          status: geminiResponse.status,
          message: errorText.slice(0, 300)
        });

        lastError = geminiResponse.status;
        continue;
      }

      const data = await geminiResponse.json();

      output =
        data?.candidates?.[0]?.content?.parts
          ?.map((part: { text?: string }) => part.text ?? "")
          .join("")
          .trim() ?? "";

      if (output) {
        console.log("Gemini success with model:", model);
        break;
      }
    } catch (error) {
      console.error("Gemini fetch error", {
        model,
        status: 500,
        message: error instanceof Error ? error.message : "Unknown Gemini fetch error"
      });
      lastError = 500;
    }
  }

  // ❌ If all models fail
  if (!output) {
    return NextResponse.json(
      { error: friendlyError(lastError || 500) },
      { status: lastError || 500 }
    );
  }

  // ✅ Increment usage only on success
  record.count += 1;
  usage.set(ip, record);

  return NextResponse.json({ output });
}
