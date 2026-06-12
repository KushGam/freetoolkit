"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Button, Input, SecondaryButton, Textarea } from "@/components/ui";

type QrType = "url" | "text" | "wifi" | "email" | "phone";

function buildPayload(type: QrType, fields: Record<string, string>) {
  if (type === "url") return fields.url.trim();
  if (type === "text") return fields.text;
  if (type === "wifi") {
    const security = fields.security || "WPA";
    const pass = fields.password.replace(/[;:,\\]/g, "\\$&");
    const ssid = fields.ssid.replace(/[;:,\\]/g, "\\$&");
    return `WIFI:T:${security};S:${ssid};P:${pass};;`;
  }
  if (type === "email") {
    const params = new URLSearchParams();
    if (fields.subject) params.set("subject", fields.subject);
    if (fields.body) params.set("body", fields.body);
    const qs = params.toString();
    return `mailto:${fields.email}${qs ? `?${qs}` : ""}`;
  }
  return `tel:${fields.phone.replace(/\s/g, "")}`;
}

export function QrCodeGeneratorTool() {
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
  const [ecc, setEcc] = useState<"L" | "M" | "Q" | "H">("M");
  const [qr, setQr] = useState("");
  const [error, setError] = useState("");

  const fields = useMemo(
    () => ({ url, text, ssid, password, security, email, subject, body, phone }),
    [url, text, ssid, password, security, email, subject, body, phone]
  );

  const generate = useCallback(async () => {
    setError("");
    const payload = buildPayload(type, fields).trim();
    if (!payload) {
      setError("Enter the required fields before generating.");
      setQr("");
      return;
    }
    try {
      const QRCode = await import("qrcode");
      setQr(await QRCode.toDataURL(payload, { width: size, margin: 2, errorCorrectionLevel: ecc }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to generate QR code.");
      setQr("");
    }
  }, [type, fields, size, ecc]);

  useEffect(() => {
    void generate();
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
            className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${type === tab.id ? "bg-gold text-[#0a0a0f]" : "border border-white/[0.08] bg-surface-card text-ink-secondary"}`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="mt-4 space-y-3">
        {type === "url" ? <Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://example.com" /> : null}
        {type === "text" ? <Textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Any text message..." className="min-h-28" /> : null}
        {type === "wifi" ? (
          <>
            <Input value={ssid} onChange={(e) => setSsid(e.target.value)} placeholder="Wi-Fi network name (SSID)" />
            <Input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" type="password" />
            <select className="input-dark mt-2 w-full" value={security} onChange={(e) => setSecurity(e.target.value)}>
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
        <label className="text-sm font-bold text-ink-secondary">
          Size: {size}px
          <input className="mt-2 w-full accent-gold" type="range" min={128} max={512} step={8} value={size} onChange={(e) => setSize(Number(e.target.value))} />
        </label>
        <label className="text-sm font-bold text-ink-secondary">
          Error correction
          <select className="input-dark mt-2 w-full" value={ecc} onChange={(e) => setEcc(e.target.value as typeof ecc)}>
            <option value="L">L — Low</option>
            <option value="M">M — Medium</option>
            <option value="Q">Q — Quartile</option>
            <option value="H">H — High</option>
          </select>
        </label>
      </div>
      <p className="mt-3 text-xs font-semibold text-emerald-400">Generated in your browser — nothing sent to any server.</p>
      {qr ? (
        <div className="mt-6 flex flex-col items-center gap-4 rounded-2xl border border-white/[0.08] bg-surface-card p-6 sm:flex-row">
          <img src={qr} alt="Generated QR code" className="h-52 w-52 rounded-xl border border-white/[0.08] bg-white p-3" />
          <div>
            <a className="inline-flex rounded-xl bg-gold px-5 py-2.5 text-sm font-bold text-[#0a0a0f]" href={qr} download="qr-code.png">
              Download PNG
            </a>
            <Button className="ml-3" onClick={() => void generate()}>
              Refresh
            </Button>
          </div>
        </div>
      ) : null}
      {error ? <p className="mt-3 text-sm font-semibold text-red-400">{error}</p> : null}
      <SecondaryButton className="mt-4" onClick={() => { setUrl(""); setText(""); setQr(""); setError(""); }}>
        Clear
      </SecondaryButton>
    </div>
  );
}
