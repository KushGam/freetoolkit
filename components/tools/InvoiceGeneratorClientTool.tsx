"use client";

import { useMemo, useState } from "react";
import { Button, Input, SecondaryButton, Textarea } from "@/components/ui";

type LineItem = { id: string; description: string; quantity: number; unitPrice: number };

const CURRENCIES: Record<string, string> = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  INR: "₹",
  AUD: "A$",
  CAD: "C$"
};

function defaultDueDate() {
  const d = new Date();
  d.setDate(d.getDate() + 30);
  return d.toISOString().slice(0, 10);
}

function newItem(): LineItem {
  return { id: crypto.randomUUID(), description: "", quantity: 1, unitPrice: 0 };
}

export function InvoiceGeneratorClientTool() {
  const [fromName, setFromName] = useState("");
  const [fromAddress, setFromAddress] = useState("");
  const [fromEmail, setFromEmail] = useState("");
  const [fromPhone, setFromPhone] = useState("");
  const [toName, setToName] = useState("");
  const [toAddress, setToAddress] = useState("");
  const [toEmail, setToEmail] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState("INV-001");
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().slice(0, 10));
  const [dueDate, setDueDate] = useState(defaultDueDate());
  const [currency, setCurrency] = useState("USD");
  const [items, setItems] = useState<LineItem[]>([newItem(), newItem()]);
  const [taxPct, setTaxPct] = useState(0);
  const [discountPct, setDiscountPct] = useState(0);
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  const sym = CURRENCIES[currency] ?? "$";
  const subtotal = useMemo(() => items.reduce((s, i) => s + i.quantity * i.unitPrice, 0), [items]);
  const taxAmt = subtotal * (taxPct / 100);
  const discountAmt = subtotal * (discountPct / 100);
  const total = subtotal + taxAmt - discountAmt;

  function updateItem(id: string, patch: Partial<LineItem>) {
    setItems((rows) => rows.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  }

  async function downloadPdf() {
    setError("");
    try {
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF();
      let y = 20;
      doc.setFontSize(22);
      doc.text("INVOICE", 14, y);
      y += 12;
      doc.setFontSize(10);
      doc.text(`Invoice #: ${invoiceNumber}`, 14, y);
      y += 6;
      doc.text(`Date: ${invoiceDate}  |  Due: ${dueDate}`, 14, y);
      y += 10;
      doc.setFont("helvetica", "bold");
      doc.text("From", 14, y);
      doc.text("Bill To", 110, y);
      y += 6;
      doc.setFont("helvetica", "normal");
      doc.text(fromName || "Your business", 14, y);
      doc.text(toName || "Client", 110, y);
      y += 5;
      fromAddress.split("\n").slice(0, 3).forEach((line) => { doc.text(line, 14, y); y += 5; });
      let y2 = y - fromAddress.split("\n").slice(0, 3).length * 5;
      toAddress.split("\n").slice(0, 3).forEach((line) => { doc.text(line, 110, y2); y2 += 5; });
      y = Math.max(y, y2) + 8;
      doc.line(14, y, 196, y);
      y += 8;
      doc.setFont("helvetica", "bold");
      doc.text("Description", 14, y);
      doc.text("Qty", 120, y);
      doc.text("Price", 145, y);
      doc.text("Total", 175, y);
      y += 6;
      doc.setFont("helvetica", "normal");
      for (const item of items) {
        const lineTotal = item.quantity * item.unitPrice;
        doc.text(item.description.slice(0, 40) || "Item", 14, y);
        doc.text(String(item.quantity), 120, y);
        doc.text(`${sym}${item.unitPrice.toFixed(2)}`, 145, y);
        doc.text(`${sym}${lineTotal.toFixed(2)}`, 175, y);
        y += 7;
        if (y > 260) { doc.addPage(); y = 20; }
      }
      y += 6;
      doc.text(`Subtotal: ${sym}${subtotal.toFixed(2)}`, 145, y);
      y += 6;
      if (taxPct) { doc.text(`Tax (${taxPct}%): ${sym}${taxAmt.toFixed(2)}`, 145, y); y += 6; }
      if (discountPct) { doc.text(`Discount (${discountPct}%): -${sym}${discountAmt.toFixed(2)}`, 145, y); y += 6; }
      doc.setFont("helvetica", "bold");
      doc.text(`Total Due: ${sym}${total.toFixed(2)}`, 145, y);
      if (notes) {
        y += 12;
        doc.setFont("helvetica", "normal");
        doc.text(`Notes: ${notes.slice(0, 200)}`, 14, y);
      }
      doc.save(`${invoiceNumber.replace(/[^a-z0-9-]/gi, "-") || "invoice"}.pdf`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate PDF.");
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-5">
        <div className="rounded-2xl border border-white/[0.08] bg-surface-card p-4">
          <p className="text-xs font-black uppercase text-ink-muted">From</p>
          <Input className="mt-2" placeholder="Your name / company" value={fromName} onChange={(e) => setFromName(e.target.value)} />
          <Textarea className="mt-2" placeholder="Your address" value={fromAddress} onChange={(e) => setFromAddress(e.target.value)} />
          <Input className="mt-2" placeholder="Email" value={fromEmail} onChange={(e) => setFromEmail(e.target.value)} />
          <Input className="mt-2" placeholder="Phone" value={fromPhone} onChange={(e) => setFromPhone(e.target.value)} />
        </div>
        <div className="rounded-2xl border border-white/[0.08] bg-surface-card p-4">
          <p className="text-xs font-black uppercase text-ink-muted">Bill To</p>
          <Input className="mt-2" placeholder="Client name / company" value={toName} onChange={(e) => setToName(e.target.value)} />
          <Textarea className="mt-2" placeholder="Client address" value={toAddress} onChange={(e) => setToAddress(e.target.value)} />
          <Input className="mt-2" placeholder="Client email" value={toEmail} onChange={(e) => setToEmail(e.target.value)} />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="text-sm font-bold text-ink-secondary">Invoice # <Input value={invoiceNumber} onChange={(e) => setInvoiceNumber(e.target.value)} /></label>
          <label className="text-sm font-bold text-ink-secondary">
            Currency
            <select className="input-dark mt-2 w-full" value={currency} onChange={(e) => setCurrency(e.target.value)}>
              {Object.keys(CURRENCIES).map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </label>
          <label className="text-sm font-bold text-ink-secondary">Invoice date <Input type="date" value={invoiceDate} onChange={(e) => setInvoiceDate(e.target.value)} /></label>
          <label className="text-sm font-bold text-ink-secondary">Due date <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} /></label>
        </div>
        <div className="space-y-2">
          <p className="text-xs font-black uppercase text-ink-muted">Line items</p>
          {items.map((item) => (
            <div key={item.id} className="grid gap-2 rounded-xl border border-white/[0.06] p-3 sm:grid-cols-[1fr_80px_100px_auto]">
              <Input placeholder="Description" value={item.description} onChange={(e) => updateItem(item.id, { description: e.target.value })} />
              <Input type="number" min={0} placeholder="Qty" value={item.quantity} onChange={(e) => updateItem(item.id, { quantity: Number(e.target.value) || 0 })} />
              <Input type="number" min={0} step="0.01" placeholder="Price" value={item.unitPrice} onChange={(e) => updateItem(item.id, { unitPrice: Number(e.target.value) || 0 })} />
              <SecondaryButton onClick={() => setItems((rows) => rows.filter((r) => r.id !== item.id))}>Remove</SecondaryButton>
            </div>
          ))}
          <Button onClick={() => setItems((rows) => [...rows, newItem()])}>Add item</Button>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="text-sm font-bold text-ink-secondary">Tax % <Input type="number" min={0} value={taxPct} onChange={(e) => setTaxPct(Number(e.target.value) || 0)} /></label>
          <label className="text-sm font-bold text-ink-secondary">Discount % <Input type="number" min={0} value={discountPct} onChange={(e) => setDiscountPct(Number(e.target.value) || 0)} /></label>
        </div>
        <Textarea placeholder="Notes (optional)" value={notes} onChange={(e) => setNotes(e.target.value)} />
        <div className="flex flex-wrap gap-3">
          <Button onClick={() => void downloadPdf()}>Download PDF</Button>
          <SecondaryButton onClick={() => setItems([newItem()])}>Clear form</SecondaryButton>
        </div>
        {error ? <p className="text-sm text-red-400">{error}</p> : null}
      </div>
      <div className="hidden rounded-2xl border border-white/[0.08] bg-surface-card p-6 lg:block">
        <p className="text-xs font-black uppercase text-ink-muted">Preview</p>
        <h3 className="mt-2 text-2xl font-black text-ink-primary">INVOICE</h3>
        <p className="mt-1 text-sm text-ink-muted">#{invoiceNumber} · {invoiceDate}</p>
        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
          <div><p className="font-bold text-ink-secondary">From</p><p>{fromName || "—"}</p></div>
          <div><p className="font-bold text-ink-secondary">To</p><p>{toName || "—"}</p></div>
        </div>
        <table className="mt-4 w-full text-sm">
          <thead><tr className="text-left text-ink-muted"><th>Item</th><th>Total</th></tr></thead>
          <tbody>
            {items.map((i) => (
              <tr key={i.id} className="border-t border-white/[0.06]">
                <td className="py-2">{i.description || "Item"} × {i.quantity}</td>
                <td>{sym}{(i.quantity * i.unitPrice).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-4 text-lg font-black text-ink-primary">Total: {sym}{total.toFixed(2)}</p>
      </div>
    </div>
  );
}
