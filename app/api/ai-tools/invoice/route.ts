import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";

type InvoiceItem = { name: string; qty: number; price: number };
type InvoiceDraft = {
  fromName: string;
  toName: string;
  notes: string;
  invoiceNumber?: string;
  items: InvoiceItem[];
};

const MODEL = "claude-haiku-4-5-20251001";
const DAILY_LIMIT = 15;
const usage = new Map<string, { date: string; count: number }>();

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function getIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return request.headers.get("x-real-ip") ?? "unknown";
}

function isRateLimited(ip: string) {
  const date = todayKey();
  const current = usage.get(ip);
  return Boolean(current && current.date === date && current.count >= DAILY_LIMIT);
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

function extractJson(text: string) {
  const fenced = text.match(/```json\s*([\s\S]*?)```/i);
  const raw = fenced?.[1] ?? text;
  return raw.trim();
}

function safeDraft(input: Partial<InvoiceDraft>): InvoiceDraft {
  const items = Array.isArray(input.items) ? input.items : [];
  const normalizedItems = items
    .map((item) => ({
      name: String(item?.name ?? "Service"),
      qty: Number(item?.qty ?? 1),
      price: Number(item?.price ?? 0)
    }))
    .filter((item) => item.name.trim().length > 0 && Number.isFinite(item.qty) && Number.isFinite(item.price))
    .slice(0, 20);

  return {
    fromName: String(input.fromName ?? "FreeToolKit Services").trim() || "FreeToolKit Services",
    toName: String(input.toName ?? "Client").trim() || "Client",
    notes: String(input.notes ?? "Thank you for your business.").trim() || "Thank you for your business.",
    invoiceNumber: String(input.invoiceNumber ?? "").trim() || undefined,
    items: normalizedItems.length ? normalizedItems : [{ name: "Service", qty: 1, price: 100 }]
  };
}

export async function POST(request: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "AI invoice generation is temporarily unavailable." }, { status: 503 });
  }

  const body = await request.json().catch(() => null) as { prompt?: string; fromName?: string; toName?: string } | null;
  const prompt = String(body?.prompt ?? "").trim();
  if (prompt.length < 15) {
    return NextResponse.json({ error: "Please add more invoice details before generating." }, { status: 400 });
  }

  const ip = getIp(request);
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: "Daily AI usage limit reached. Please try again later." }, { status: 429 });
  }

  try {
    const anthropic = new Anthropic({ apiKey });
    const result = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 700,
      temperature: 0.3,
      messages: [
        {
          role: "user",
          content: `Create a professional invoice draft using this user request:
${prompt}

Return ONLY JSON with this exact shape:
{
  "fromName": "string",
  "toName": "string",
  "invoiceNumber": "string",
  "notes": "string",
  "items": [
    { "name": "string", "qty": number, "price": number }
  ]
}

Rules:
- Do not include markdown unless needed.
- Keep qty and price realistic positive numbers.
- Include 2-6 line items.
- No explanations outside JSON.`
        }
      ]
    });

    const text = result.content
      .map((block) => ("text" in block ? block.text : ""))
      .join("")
      .trim();

    const parsed = JSON.parse(extractJson(text)) as Partial<InvoiceDraft>;
    const draft = safeDraft(parsed);
    incrementUsage(ip);
    return NextResponse.json({ draft });
  } catch {
    return NextResponse.json({ error: "AI invoice generation failed. Please try again." }, { status: 500 });
  }
}
