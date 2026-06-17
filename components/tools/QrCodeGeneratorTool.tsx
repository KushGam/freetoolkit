"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button, Input, SecondaryButton, Textarea } from "@/components/ui";
import { qrCodeToCanvas, qrCodeToDataUrl, type QrErrorCorrection } from "@/lib/qrcode-client";

type QrType = "url" | "text" | "wifi" | "email" | "phone";

function buildPayload(type: QrType, fields: Record<string, string>) {
  if (type === "url") return fields.url.trim();
  if (type === "text") return fields.text.trim();
  if (type === "wifi") {
    const security = fields.security || "WPA";
    const pass = fields.password.replace(/[;:,\\]/g, "\\$&");
    const ssid = fields.ssid.replace(/[;:,\\]/g, "\\$&");
    return `WIFI:T:${security};S:${ssid};P:${pass};;`;
  }
  if (type === "email") {
    const email = fields.email.trim();
    if (!email) return "";
    const params = new URLSearchParams();
    if (fields.subject) params.set("subject", fields.subject);
    if (fields.body) params.set("body", fields.body);
    const qs = params.toString();
    return `mailto:${email}${qs ? `?${qs}` : ""}`;
  }
  return fields.phone.trim() ? `tel:${fields.phone.replace(/\s/g, "")}` : "";
}

function validatePayload(type: QrType, fields: Record<string, string>) {
  if (type === "url" && !fields.url.trim()) return "Enter a URL to generate a QR code.";
  if (type === "text" && !fields.text.trim()) return "Enter text to generate a QR code.";
  if (type === "wifi" && !fields.ssid.trim()) return "Enter a Wi-Fi network name (SSID).";
  if (type === "email" && !fields.email.trim()) return "Enter an email address.";
  if (type === "phone" && !fields.phone.trim()) return "Enter a phone number.";
  return "";
}

export function QrCodeGeneratorTool() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [type, setType] = useState<QrType>("url");
  const [url, setUrl] = useState("https://www.freetoolkitapp.com");
  const [text, setText] = useState("");
  const [ssid, setSsid] = useState("");
  const [password, setPassword] = useState("");
  const [security, setSecurity] = useState("WPA");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [phone, setPhone] = useState("");
  const [size, setSize] = useState(256);
  const [ecc, setEcc] = useState<QrErrorCorrection>("M");
  const [qr, setQr] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const fields = useMemo(
    () => ({ url, text, ssid, password, security, email, subject, body, phone }),
    [url, text, ssid, password, security, email, subject, body, phone]
  );

  const generate = useCallback(async () => {
    setError("");
    const validationError = validatePayload(type, fields);
    if (validationError) {
      setError(validationError);
      setQr("");
      return;
    }

    const payload = buildPayload(type, fields);
    setBusy(true);
    try {
      const options = { width: size, margin: 2, errorCorrectionLevel: ecc };
      const canvas = canvasRef.current;
      if (canvas) {
        await qrCodeToCanvas(canvas, payload, options);
        setQr(canvas.toDataURL("image/png"));
      } else {
        setQr(await qrCodeToDataUrl(payload, options));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to generate QR code.");
      setQr("");
    } finally {
      setBusy(false);
    }
  }, [type, fields, size, ecc]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void generate();
    }, 250);
    return () => window.clearTimeout(timer);
  }, [generate]);

  const tabs: Array<{ id: QrType; label: string }> = [
    { id: "url", label: "URL" },
    { id: "text", label: "Text" },
    { id: "wifi", label: "Wi-Fi" },
    { id: "email", label: "Email" },
    { id: "phone", label: "Phone" }
  ];

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setType(tab.id)}
            className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
              type === tab.id ? "bg-gold text-[#0a0a0f]" : "border border-border bg-bg3 text-text-2"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mt-4 space-y-3">
        {type === "url" ? (
          <Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://example.com" />
        ) : null}
        {type === "text" ? (
          <Textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Any text message..." className="min-h-28" />
        ) : null}
        {type === "wifi" ? (
          <>
            <Input value={ssid} onChange={(e) => setSsid(e.target.value)} placeholder="Wi-Fi network name (SSID)" />
            <Input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" type="password" />
            <select
              className="input-dark mt-2 w-full"
              value={security}
              onChange={(e) => setSecurity(e.target.value)}
              aria-label="Wi-Fi security type"
            >
              <option value="WPA">WPA/WPA2</option>
              <option value="WEP">WEP</option>
              <option value="nopass">None</option>
            </select>
          </>
        ) : null}
        {type === "email" ? (
          <>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@example.com" />
            <Input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Subject (optional)" />
            <Textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="Body (optional)" />
          </>
        ) : null}
        {type === "phone" ? <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 555 000 0000" /> : null}
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="text-sm font-bold text-text-2">
          Size: {size}px
          <input
            className="mt-2 w-full accent-gold"
            type="range"
            min={128}
            max={512}
            step={8}
            value={size}
            onChange={(e) => setSize(Number(e.target.value))}
          />
        </label>
        <label className="text-sm font-bold text-text-2">
          Error correction
          <select
            className="input-dark mt-2 w-full"
            value={ecc}
            onChange={(e) => setEcc(e.target.value as QrErrorCorrection)}
            aria-label="QR error correction level"
          >
            <option value="L">L — Low</option>
            <option value="M">M — Medium</option>
            <option value="Q">Q — Quartile</option>
            <option value="H">H — High</option>
          </select>
        </label>
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        <Button type="button" onClick={() => void generate()} disabled={busy}>
          {busy ? "Generating..." : "Generate QR code"}
        </Button>
        <SecondaryButton
          type="button"
          onClick={() => {
            setUrl("https://www.freetoolkitapp.com");
            setText("");
            setSsid("");
            setPassword("");
            setEmail("");
            setSubject("");
            setBody("");
            setPhone("");
            setQr("");
            setError("");
          }}
        >
          Clear
        </SecondaryButton>
      </div>

      <p className="mt-3 text-xs font-semibold text-emerald-400">Generated in your browser — nothing sent to any server.</p>

      <canvas ref={canvasRef} className="hidden" aria-hidden="true" />

      {qr ? (
        <div className="mt-6 flex flex-col items-center gap-4 rounded-2xl border border-border bg-bg3 p-6 sm:flex-row sm:items-start">
          <img src={qr} alt="Generated QR code" className="h-52 w-52 rounded-xl border border-border bg-white p-3" />
          <div>
            <p className="text-sm text-text-2">Scan with your phone camera to test before sharing or printing.</p>
            <a
              className="mt-4 inline-flex min-h-[44px] items-center rounded-xl bg-gold px-5 py-2.5 text-sm font-bold text-[#0a0a0f]"
              href={qr}
              download="qr-code.png"
            >
              Download PNG
            </a>
          </div>
        </div>
      ) : null}

      {error ? <p className="mt-3 text-sm font-semibold text-red-400">{error}</p> : null}
    </div>
  );
}
