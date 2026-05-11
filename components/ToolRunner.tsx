"use client";

/* eslint-disable @next/next/no-img-element */
import { useEffect, useMemo, useRef, useState } from "react";
import { FileUploadDropzone } from "@/components/FileUploadDropzone";
import { GeminiAiTool } from "@/components/tools/GeminiAiTool";
import { ShiftHoursCalculator } from "@/components/tools/ShiftHoursCalculator";
import { Button, Input, ResultCard, SecondaryButton, Select, Textarea } from "@/components/ui";
import { formatBytes } from "@/lib/utils";

type Output = { url: string; name: string; size: number; type?: string };

const gradePoints: Record<string, number> = {
  "A+": 4,
  A: 4,
  "A-": 3.7,
  "B+": 3.3,
  B: 3,
  "B-": 2.7,
  "C+": 2.3,
  C: 2,
  "C-": 1.7,
  D: 1,
  F: 0
};

function downloadBlob(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  return { url, name, size: blob.size, type: blob.type };
}

function bytesToPdfBlob(bytes: Uint8Array) {
  const buffer = new ArrayBuffer(bytes.byteLength);
  new Uint8Array(buffer).set(bytes);
  return new Blob([buffer], { type: "application/pdf" });
}

function Download({ output }: { output: Output | null }) {
  if (!output) return null;
  return (
    <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 shadow-sm">
      <p className="text-sm font-black uppercase tracking-wide text-emerald-700">Output ready</p>
      <p className="mt-1 break-words text-sm font-bold text-emerald-900">{output.name} · {formatBytes(output.size)}</p>
      <a className="mt-4 inline-flex min-h-11 items-center rounded-2xl bg-emerald-600 px-5 py-2.5 text-sm font-black text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-emerald-700" href={output.url} download={output.name}>
        Download
      </a>
    </div>
  );
}

function ErrorMessage({ message }: { message: string }) {
  if (!message) return null;
  return <p className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-bold leading-6 text-red-700">Something needs attention: {message}</p>;
}

function useObjectUrlCleanup(output: Output | null) {
  useEffect(() => () => {
    if (output?.url) URL.revokeObjectURL(output.url);
  }, [output]);
}

async function fileToImage(file: File) {
  const image = new Image();
  image.src = URL.createObjectURL(file);
  await new Promise<void>((resolve, reject) => {
    image.onload = () => resolve();
    image.onerror = () => reject(new Error("Unable to load image."));
  });
  URL.revokeObjectURL(image.src);
  return image;
}

async function canvasFromImage(file: File, width?: number, height?: number, fill = false) {
  const image = await fileToImage(file);
  const canvas = document.createElement("canvas");
  canvas.width = width ?? image.naturalWidth;
  canvas.height = height ?? image.naturalHeight;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas is not supported in this browser.");
  if (fill) {
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
  return { canvas, image };
}

function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality = 0.85) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error("Unable to create output image."));
    }, type, quality);
  });
}

function parseRanges(input: string, pageCount: number) {
  const pages: number[] = [];
  for (const part of input.split(",").map((item) => item.trim()).filter(Boolean)) {
    if (part.includes("-")) {
      const [startRaw, endRaw] = part.split("-");
      const start = Number(startRaw);
      const end = Number(endRaw);
      if (!Number.isInteger(start) || !Number.isInteger(end) || start < 1 || end < start || end > pageCount) {
        throw new Error(`Invalid page range: ${part}`);
      }
      for (let page = start; page <= end; page += 1) pages.push(page - 1);
    } else {
      const page = Number(part);
      if (!Number.isInteger(page) || page < 1 || page > pageCount) throw new Error(`Invalid page number: ${part}`);
      pages.push(page - 1);
    }
  }
  return pages;
}

async function loadPdfDocument(PDFDocument: typeof import("pdf-lib").PDFDocument, file: File) {
  return PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption: true });
}

function FileInfo({ file }: { file: File | null }) {
  return file ? (
    <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs font-black uppercase tracking-wide text-slate-500">Selected file</p>
      <p className="mt-1 break-words text-sm font-bold text-slate-800">{file.name} · {formatBytes(file.size)}</p>
    </div>
  ) : (
    <p className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm font-semibold text-slate-500">Choose a file to enable this tool.</p>
  );
}

function ImageCompressor() {
  const [file, setFile] = useState<File | null>(null);
  const [quality, setQuality] = useState(0.75);
  const [output, setOutput] = useState<Output | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [before, setBefore] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  useObjectUrlCleanup(output);

  useEffect(() => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setBefore(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  async function compress() {
    if (!file) return;
    setError("");
    setBusy(true);
    try {
      const { canvas } = await canvasFromImage(file);
      const type = file.type === "image/png" ? "image/png" : file.type === "image/webp" ? "image/webp" : "image/jpeg";
      const blob = await canvasToBlob(canvas, type, quality);
      if (preview) URL.revokeObjectURL(preview);
      setPreview(URL.createObjectURL(blob));
      setOutput(downloadBlob(blob, `compressed-${file.name.replace(/\.[^.]+$/, type === "image/png" ? ".png" : type === "image/webp" ? ".webp" : ".jpg")}`));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Compression failed.");
    } finally {
      setBusy(false);
    }
  }

  function reset() {
    setFile(null);
    setOutput(null);
    setPreview(null);
    setBefore(null);
    setError("");
    setQuality(0.75);
  }

  const reduction = file && output ? Math.max(0, ((file.size - output.size) / file.size) * 100) : 0;

  return (
    <div>
      <FileUploadDropzone label="Upload an image" accept="image/jpeg,image/png,image/webp" onFiles={(files) => setFile(files[0] ?? null)} />
      <FileInfo file={file} />
      <label className="mt-5 block text-sm font-bold text-slate-700">Quality: {quality.toFixed(2)}</label>
      <input className="mt-2 w-full accent-brand-600" type="range" min="0.1" max="1" step="0.05" value={quality} onChange={(event) => setQuality(Number(event.target.value))} />
      <div className="mt-4 flex flex-wrap gap-3">
        <Button onClick={compress} disabled={!file || busy}>{busy ? "Compressing..." : "Compress"}</Button>
        <SecondaryButton onClick={reset}>Reset</SecondaryButton>
      </div>
      {output && file ? <p className="mt-4 text-sm font-bold text-slate-700">Original {formatBytes(file.size)} → compressed {formatBytes(output.size)}. Reduction: {reduction.toFixed(1)}%</p> : null}
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {before ? <img className="max-h-72 w-full rounded-2xl border border-slate-200 bg-slate-50 object-contain p-2" src={before} alt="Original preview" /> : null}
        {preview ? <img className="max-h-72 w-full rounded-2xl border border-slate-200 bg-slate-50 object-contain p-2" src={preview} alt="Compressed preview" /> : null}
      </div>
      <ErrorMessage message={error} />
      <Download output={output} />
    </div>
  );
}

function ImageConverter({ mode }: { mode: "png-to-jpg" | "jpg-to-png" | "webp" }) {
  const [file, setFile] = useState<File | null>(null);
  const [quality, setQuality] = useState(0.85);
  const [output, setOutput] = useState<Output | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  useObjectUrlCleanup(output);

  async function convert() {
    if (!file) return;
    setError("");
    setBusy(true);
    try {
      const isJpg = mode === "png-to-jpg";
      const { canvas } = await canvasFromImage(file, undefined, undefined, isJpg);
      const type = isJpg ? "image/jpeg" : mode === "jpg-to-png" ? "image/png" : "image/webp";
      const ext = isJpg ? "jpg" : mode === "jpg-to-png" ? "png" : "webp";
      const blob = await canvasToBlob(canvas, type, quality);
      if (preview) URL.revokeObjectURL(preview);
      setPreview(URL.createObjectURL(blob));
      setOutput(downloadBlob(blob, `${file.name.replace(/\.[^.]+$/, "")}.${ext}`));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Conversion failed.");
    } finally {
      setBusy(false);
    }
  }

  function reset() {
    setFile(null);
    setOutput(null);
    setPreview(null);
    setError("");
    setQuality(0.85);
  }

  const accept = mode === "png-to-jpg" ? "image/png" : mode === "jpg-to-png" ? "image/jpeg" : "image/jpeg,image/png";

  return (
    <div>
      <FileUploadDropzone label="Upload image" accept={accept} onFiles={(files) => setFile(files[0] ?? null)} />
      <FileInfo file={file} />
      {mode === "webp" ? (
        <>
          <label className="mt-5 block text-sm font-bold text-slate-700">Quality: {quality.toFixed(2)}</label>
          <input className="mt-2 w-full accent-brand-600" type="range" min="0.1" max="1" step="0.05" value={quality} onChange={(event) => setQuality(Number(event.target.value))} />
        </>
      ) : null}
      <div className="mt-4 flex flex-wrap gap-3">
        <Button onClick={convert} disabled={!file || busy}>{busy ? "Converting..." : "Convert"}</Button>
        <SecondaryButton onClick={reset}>Reset</SecondaryButton>
      </div>
      {preview ? <img className="mt-5 max-h-80 w-full rounded-2xl border border-slate-200 bg-slate-50 object-contain p-2" src={preview} alt="Converted preview" /> : null}
      <ErrorMessage message={error} />
      <Download output={output} />
    </div>
  );
}

function ImageResizer() {
  const [file, setFile] = useState<File | null>(null);
  const [width, setWidth] = useState(800);
  const [height, setHeight] = useState(600);
  const [ratio, setRatio] = useState(true);
  const [natural, setNatural] = useState({ width: 0, height: 0 });
  const [output, setOutput] = useState<Output | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  useObjectUrlCleanup(output);

  async function setImage(files: File[]) {
    const next = files[0] ?? null;
    setFile(next);
    if (next) {
      const image = await fileToImage(next);
      setNatural({ width: image.naturalWidth, height: image.naturalHeight });
      setWidth(image.naturalWidth);
      setHeight(image.naturalHeight);
    }
  }

  function updateWidth(value: number) {
    setWidth(value);
    if (ratio && natural.width) setHeight(Math.round((value / natural.width) * natural.height));
  }

  function updateHeight(value: number) {
    setHeight(value);
    if (ratio && natural.height) setWidth(Math.round((value / natural.height) * natural.width));
  }

  async function resize() {
    if (!file) return;
    setError("");
    setBusy(true);
    try {
      const { canvas } = await canvasFromImage(file, width, height);
      const type = file.type || "image/png";
      const blob = await canvasToBlob(canvas, type, 0.9);
      if (preview) URL.revokeObjectURL(preview);
      setPreview(URL.createObjectURL(blob));
      setOutput(downloadBlob(blob, `resized-${file.name}`));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Resize failed.");
    } finally {
      setBusy(false);
    }
  }

  function reset() {
    setFile(null);
    setOutput(null);
    setPreview(null);
    setError("");
    setNatural({ width: 0, height: 0 });
    setWidth(800);
    setHeight(600);
    setRatio(true);
  }

  return (
    <div>
      <FileUploadDropzone label="Upload an image" accept="image/jpeg,image/png,image/webp" onFiles={setImage} />
      <FileInfo file={file} />
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="text-sm font-bold text-slate-700">Width <Input type="number" min={1} value={width} onChange={(event) => updateWidth(Number(event.target.value))} /></label>
        <label className="text-sm font-bold text-slate-700">Height <Input type="number" min={1} value={height} onChange={(event) => updateHeight(Number(event.target.value))} /></label>
      </div>
      <label className="mt-4 flex items-center gap-2 text-sm font-bold text-slate-700"><input type="checkbox" checked={ratio} onChange={(event) => setRatio(event.target.checked)} /> Maintain aspect ratio</label>
      <div className="mt-4 flex flex-wrap gap-3">
        <Button onClick={resize} disabled={!file || busy}>{busy ? "Resizing..." : "Resize image"}</Button>
        <SecondaryButton onClick={reset}>Reset</SecondaryButton>
      </div>
      {preview ? <img className="mt-5 max-h-80 w-full rounded-2xl border border-slate-200 bg-slate-50 object-contain p-2" src={preview} alt="Resized preview" /> : null}
      <ErrorMessage message={error} />
      <Download output={output} />
    </div>
  );
}

function PdfTool({ mode }: { mode: "merge" | "split" | "compress" | "rotate" | "extract" }) {
  const [files, setFiles] = useState<File[]>([]);
  const [ranges, setRanges] = useState("1");
  const [rotation, setRotation] = useState("90");
  const [output, setOutput] = useState<Output | null>(null);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [pageCount, setPageCount] = useState<number | null>(null);
  const [pageCountStatus, setPageCountStatus] = useState("");
  useObjectUrlCleanup(output);

  async function handlePdfFiles(nextFiles: File[]) {
    setFiles(nextFiles);
    setOutput(null);
    setMessage("");
    setPageCount(null);
    setPageCountStatus("");

    if (!nextFiles.length || mode === "merge") return;

    setPageCountStatus("Reading page count...");
    try {
      const { PDFDocument } = await import("pdf-lib");
      const source = await loadPdfDocument(PDFDocument, nextFiles[0]);
      const count = source.getPageCount();
      setPageCount(count);
      setRanges(count > 1 ? `1-${count}` : "1");
      setPageCountStatus("");
    } catch (err) {
      const detail = err instanceof Error ? err.message : "";
      const encrypted = detail.toLowerCase().includes("encrypt") || detail.toLowerCase().includes("password");
      setPageCountStatus(
        encrypted
          ? "This PDF may be password-protected, so the page count could not be read."
          : "Page count could not be read. You can still try entering a page range."
      );
    }
  }

  async function run() {
    if (!files.length) return;
    setBusy(true);
    setMessage("");
    try {
      const { PDFDocument, degrees } = await import("pdf-lib");
      if (mode === "merge") {
        const merged = await PDFDocument.create();
        for (const file of files) {
          const source = await loadPdfDocument(PDFDocument, file);
          const pages = await merged.copyPages(source, source.getPageIndices());
          pages.forEach((page) => merged.addPage(page));
        }
        const bytes = await merged.save();
        setOutput(downloadBlob(bytesToPdfBlob(bytes), "merged.pdf"));
      } else {
        const file = files[0];
        const source = await loadPdfDocument(PDFDocument, file);
        const result = await PDFDocument.create();
        if (mode === "rotate") {
          const copied = await result.copyPages(source, source.getPageIndices());
          copied.forEach((page) => {
            page.setRotation(degrees(Number(rotation)));
            result.addPage(page);
          });
        } else if (mode === "compress") {
          const copied = await result.copyPages(source, source.getPageIndices());
          copied.forEach((page) => result.addPage(page));
          result.setTitle("");
          result.setAuthor("");
          result.setSubject("");
          result.setKeywords([]);
          result.setProducer("FreeToolKit");
          result.setCreator("FreeToolKit");
        } else {
          const selected = parseRanges(ranges, source.getPageCount());
          const copied = await result.copyPages(source, selected);
          copied.forEach((page) => result.addPage(page));
        }
        const bytes = await result.save({ useObjectStreams: true });
        const name = mode === "split" ? "split.pdf" : mode === "extract" ? "extracted-pages.pdf" : mode === "rotate" ? "rotated.pdf" : "optimized.pdf";
        setOutput(downloadBlob(bytesToPdfBlob(bytes), name));
        if (mode === "compress") setMessage(`Original ${formatBytes(file.size)}. Optimized ${formatBytes(bytes.length)}.`);
      }
    } catch (err) {
      const detail = err instanceof Error ? err.message : "";
      const encrypted = detail.toLowerCase().includes("encrypt") || detail.toLowerCase().includes("password");
      setMessage(
        encrypted
          ? "This PDF appears to be password-protected or restricted. Try exporting an unlocked copy from your PDF viewer, then upload that copy here."
          : detail || "PDF action failed. Please try a different PDF file."
      );
    } finally {
      setBusy(false);
    }
  }

  const multiple = mode === "merge";

  function reset() {
    setFiles([]);
    setRanges("1");
    setRotation("90");
    setOutput(null);
    setMessage("");
    setBusy(false);
    setPageCount(null);
    setPageCountStatus("");
  }

  return (
    <div>
      <FileUploadDropzone label={multiple ? "Upload PDF files" : "Upload a PDF"} accept="application/pdf" multiple={multiple} onFiles={handlePdfFiles} />
      {files.length ? (
        <div className="mt-4 rounded-2xl bg-slate-50 p-4">
          <p className="text-sm font-bold text-slate-700">File order</p>
          <ol className="mt-2 grid list-decimal gap-1 pl-5 text-sm text-slate-600">
            {files.map((file) => <li key={`${file.name}-${file.size}`}>{file.name} ({formatBytes(file.size)})</li>)}
          </ol>
        </div>
      ) : null}
      {(mode === "split" || mode === "extract") ? (
        <div className="mt-5 rounded-2xl border border-brand-100 bg-brand-50 p-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <label className="text-sm font-black text-slate-800" htmlFor="pdf-ranges">Pages or ranges</label>
            <span className="text-sm font-bold text-brand-700">
              {pageCount ? `This PDF has ${pageCount} page${pageCount === 1 ? "" : "s"}` : pageCountStatus || "Upload a PDF to see the page count"}
            </span>
          </div>
          <Input id="pdf-ranges" className="mt-3 bg-white" value={ranges} onChange={(event) => setRanges(event.target.value)} placeholder={pageCount ? `Example: 1-3,5 or 1-${pageCount}` : "1-3,5,7-9"} />
          <p className="mt-2 text-xs font-semibold leading-5 text-slate-600">
            Use commas for separate pages and hyphens for ranges. Example: <span className="font-black">1-3,5</span>.
          </p>
        </div>
      ) : null}
      {mode === "rotate" ? (
        <label className="mt-5 block text-sm font-bold text-slate-700">Rotation <Select className="mt-2" value={rotation} onChange={(event) => setRotation(event.target.value)}><option value="90">90 degrees</option><option value="180">180 degrees</option><option value="270">270 degrees</option></Select></label>
      ) : null}
      {mode === "compress" ? <p className="mt-4 rounded-2xl bg-amber-50 p-4 text-sm font-semibold leading-6 text-amber-800">Browser PDF optimization may reduce metadata and rebuild structure, but it cannot always heavily compress scanned image PDFs.</p> : null}
      <div className="mt-5 flex flex-wrap gap-3">
        <Button onClick={run} disabled={!files.length || busy}>{busy ? "Working..." : mode === "merge" ? "Merge PDFs" : mode === "compress" ? "Optimize PDF" : mode === "rotate" ? "Rotate PDF" : "Generate PDF"}</Button>
        <SecondaryButton onClick={reset}>Reset</SecondaryButton>
      </div>
      {message ? <p className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm font-bold leading-6 text-slate-700">{message}</p> : null}
      <Download output={output} />
    </div>
  );
}

function GpaCalculator() {
  const [rows, setRows] = useState([{ name: "", credits: 3, grade: "A" }, { name: "", credits: 3, grade: "B+" }]);
  const result = useMemo(() => {
    const credits = rows.reduce((sum, row) => sum + Number(row.credits || 0), 0);
    const points = rows.reduce((sum, row) => sum + Number(row.credits || 0) * gradePoints[row.grade], 0);
    return credits ? points / credits : 0;
  }, [rows]);
  return (
    <div>
      <div className="grid gap-3">
        {rows.map((row, index) => (
          <div key={index} className="grid gap-3 rounded-2xl bg-slate-50 p-3 md:grid-cols-[1fr_130px_130px_auto]">
            <Input placeholder="Course name" value={row.name} onChange={(event) => setRows(rows.map((item, i) => i === index ? { ...item, name: event.target.value } : item))} />
            <Input type="number" min={0} step={0.5} value={row.credits} onChange={(event) => setRows(rows.map((item, i) => i === index ? { ...item, credits: Number(event.target.value) } : item))} />
            <Select value={row.grade} onChange={(event) => setRows(rows.map((item, i) => i === index ? { ...item, grade: event.target.value } : item))}>{Object.keys(gradePoints).map((grade) => <option key={grade}>{grade}</option>)}</Select>
            <SecondaryButton onClick={() => setRows(rows.filter((_, i) => i !== index))}>Remove</SecondaryButton>
          </div>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap gap-3">
        <SecondaryButton onClick={() => setRows([...rows, { name: "", credits: 3, grade: "A" }])}>Add course</SecondaryButton>
        <SecondaryButton onClick={() => setRows([{ name: "", credits: 3, grade: "A" }, { name: "", credits: 3, grade: "B+" }])}>Reset</SecondaryButton>
      </div>
      <div className="mt-5 rounded-2xl border border-brand-100 bg-brand-50 p-5 shadow-sm">
        <p className="text-sm font-bold text-brand-700">Formula: total grade points / total credit hours</p>
        <p className="mt-2 text-4xl font-black text-brand-700">{result.toFixed(2)}</p>
      </div>
    </div>
  );
}

function CgpaCalculator() {
  const [previous, setPrevious] = useState(3.2);
  const [completed, setCompleted] = useState(60);
  const [current, setCurrent] = useState(3.6);
  const [currentCredits, setCurrentCredits] = useState(15);
  const total = completed + currentCredits;
  const cgpa = total ? ((previous * completed) + (current * currentCredits)) / total : 0;
  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-sm font-bold text-slate-700">Previous CGPA <Input type="number" step={0.01} value={previous} onChange={(event) => setPrevious(Number(event.target.value))} /></label>
        <label className="text-sm font-bold text-slate-700">Completed credits <Input type="number" step={0.5} value={completed} onChange={(event) => setCompleted(Number(event.target.value))} /></label>
        <label className="text-sm font-bold text-slate-700">Current semester GPA <Input type="number" step={0.01} value={current} onChange={(event) => setCurrent(Number(event.target.value))} /></label>
        <label className="text-sm font-bold text-slate-700">Current semester credits <Input type="number" step={0.5} value={currentCredits} onChange={(event) => setCurrentCredits(Number(event.target.value))} /></label>
      </div>
      <div className="mt-5 rounded-2xl border border-brand-100 bg-brand-50 p-5 shadow-sm">
        <p className="text-sm font-bold text-brand-700">((previous CGPA * completed credits) + (current GPA * current credits)) / total credits</p>
        <p className="mt-2 text-4xl font-black text-brand-700">{cgpa.toFixed(2)}</p>
        <SecondaryButton className="mt-4" onClick={() => { setPrevious(3.2); setCompleted(60); setCurrent(3.6); setCurrentCredits(15); }}>Reset</SecondaryButton>
      </div>
    </div>
  );
}

function GradePercentageCalculator() {
  const [rows, setRows] = useState([{ obtained: 85, total: 100 }]);
  const obtained = rows.reduce((sum, row) => sum + Number(row.obtained || 0), 0);
  const total = rows.reduce((sum, row) => sum + Number(row.total || 0), 0);
  const pct = total ? (obtained / total) * 100 : 0;
  const grade = pct >= 90 ? "A" : pct >= 80 ? "B" : pct >= 70 ? "C" : pct >= 60 ? "D" : "F";
  return (
    <div>
      <div className="grid gap-3">
        {rows.map((row, index) => (
          <div key={index} className="grid gap-3 rounded-2xl bg-slate-50 p-3 sm:grid-cols-[1fr_1fr_auto]">
            <Input type="number" step={0.01} value={row.obtained} onChange={(event) => setRows(rows.map((item, i) => i === index ? { ...item, obtained: Number(event.target.value) } : item))} placeholder="Marks obtained" />
            <Input type="number" step={0.01} value={row.total} onChange={(event) => setRows(rows.map((item, i) => i === index ? { ...item, total: Number(event.target.value) } : item))} placeholder="Total marks" />
            <SecondaryButton onClick={() => setRows(rows.filter((_, i) => i !== index))}>Remove</SecondaryButton>
          </div>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap gap-3">
        <SecondaryButton onClick={() => setRows([...rows, { obtained: 0, total: 100 }])}>Add assessment</SecondaryButton>
        <SecondaryButton onClick={() => setRows([{ obtained: 85, total: 100 }])}>Reset</SecondaryButton>
      </div>
      <div className="mt-5 rounded-2xl border border-brand-100 bg-brand-50 p-5 shadow-sm">
        <p className="text-sm font-bold text-brand-700">{obtained} / {total}</p>
        <p className="mt-2 text-4xl font-black text-brand-700">{pct.toFixed(2)}% · Grade {grade}</p>
      </div>
    </div>
  );
}

function StudyTimer() {
  const [focus, setFocus] = useState(25);
  const [breakMin, setBreakMin] = useState(5);
  const [mode, setMode] = useState<"Focus" | "Break">("Focus");
  const [seconds, setSeconds] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const total = (mode === "Focus" ? focus : breakMin) * 60;

  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => {
      setSeconds((value) => {
        if (value > 1) return value - 1;
        const nextMode = mode === "Focus" ? "Break" : "Focus";
        setMode(nextMode);
        return (nextMode === "Focus" ? focus : breakMin) * 60;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [running, mode, focus, breakMin]);

  function reset(nextMode = mode) {
    setRunning(false);
    setMode(nextMode);
    setSeconds((nextMode === "Focus" ? focus : breakMin) * 60);
  }

  const minutes = Math.floor(seconds / 60).toString().padStart(2, "0");
  const secs = (seconds % 60).toString().padStart(2, "0");
  const progress = total ? ((total - seconds) / total) * 100 : 0;

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-sm font-bold text-slate-700">Focus minutes <Input type="number" min={1} value={focus} onChange={(event) => { setFocus(Number(event.target.value)); if (mode === "Focus") setSeconds(Number(event.target.value) * 60); }} /></label>
        <label className="text-sm font-bold text-slate-700">Break minutes <Input type="number" min={1} value={breakMin} onChange={(event) => { setBreakMin(Number(event.target.value)); if (mode === "Break") setSeconds(Number(event.target.value) * 60); }} /></label>
      </div>
      <div className="mt-6 rounded-2xl bg-slate-50 p-6 text-center">
        <p className="text-sm font-black uppercase tracking-wide text-brand-600">{mode}</p>
        <p className="mt-2 text-6xl font-black text-slate-950">{minutes}:{secs}</p>
        <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-200"><div className="h-full rounded-full bg-brand-600" style={{ width: `${progress}%` }} /></div>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <Button onClick={() => setRunning(true)}>Start</Button>
          <SecondaryButton onClick={() => setRunning(false)}>Pause</SecondaryButton>
          <SecondaryButton onClick={() => reset()}>Reset</SecondaryButton>
          <SecondaryButton onClick={() => reset(mode === "Focus" ? "Break" : "Focus")}>Switch</SecondaryButton>
        </div>
      </div>
    </div>
  );
}

function WordCounter() {
  const [text, setText] = useState("");
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const chars = text.length;
  const charsNoSpaces = text.replace(/\s/g, "").length;
  const sentences = text.trim() ? (text.match(/[^.!?]+[.!?]+|[^.!?]+$/g) ?? []).length : 0;
  const paragraphs = text.trim() ? text.split(/\n+/).filter((item) => item.trim()).length : 0;
  const stats = [
    ["Words", words],
    ["Characters", chars],
    ["Without spaces", charsNoSpaces],
    ["Sentences", sentences],
    ["Paragraphs", paragraphs],
    ["Reading time", `${Math.max(1, Math.ceil(words / 200))} min`],
    ["Speaking time", `${Math.max(1, Math.ceil(words / 130))} min`]
  ];
  return (
    <div>
      <Textarea value={text} onChange={(event) => setText(event.target.value)} placeholder="Type or paste your text here..." />
      <div className="mt-4 flex flex-wrap gap-3">
        <Button onClick={() => navigator.clipboard?.writeText(text)} disabled={!text}>Copy</Button>
        <SecondaryButton onClick={() => setText("")}>Clear</SecondaryButton>
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(([label, value]) => (
          <div key={label} className="rounded-2xl bg-slate-50 p-4">
            <p className="text-xs font-black uppercase tracking-wide text-slate-500">{label}</p>
            <p className="mt-2 text-2xl font-black text-slate-950">{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function CopyAction({ value, label = "Copy" }: { value: string; label?: string }) {
  return <SecondaryButton onClick={() => navigator.clipboard?.writeText(value)} disabled={!value}>{label}</SecondaryButton>;
}

function ResultBox({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-brand-100 bg-brand-50 p-5 shadow-sm">
      <p className="text-xs font-black uppercase tracking-wide text-brand-700">{label}</p>
      <div className="mt-2 break-words text-2xl font-black text-slate-950">{value}</div>
    </div>
  );
}

function QrCodeGenerator() {
  const [text, setText] = useState("https://www.freetoolkitapp.com");
  const [qr, setQr] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function generate() {
    setError("");
    if (!text.trim()) {
      setError("Enter text or a URL before generating a QR code.");
      return;
    }
    setBusy(true);
    try {
      const QRCode = await import("qrcode");
      setQr(await QRCode.toDataURL(text.trim(), { width: 768, margin: 2, errorCorrectionLevel: "M" }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to generate QR code.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <label className="text-sm font-bold text-slate-700">Text or URL <Textarea className="mt-2 min-h-36" value={text} onChange={(event) => setText(event.target.value)} placeholder="Enter a URL, note, contact text, or message..." /></label>
      <div className="mt-4 flex flex-wrap gap-3">
        <Button onClick={generate} disabled={busy || !text.trim()}>{busy ? "Generating..." : "Generate QR code"}</Button>
        <CopyAction value={text} label="Copy text" />
        <SecondaryButton onClick={() => { setText(""); setQr(""); setError(""); }}>Reset</SecondaryButton>
      </div>
      {qr ? (
        <div className="mt-6 grid gap-5 rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:grid-cols-[220px_1fr] sm:items-center">
          <img src={qr} alt="Generated QR code" className="mx-auto h-52 w-52 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm" />
          <div>
            <p className="text-sm font-bold leading-6 text-slate-600">Your QR code is ready. Test it with a phone camera before printing or sharing.</p>
            <a className="mt-4 inline-flex min-h-11 items-center rounded-2xl bg-brand-600 px-5 py-2.5 text-sm font-black text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-brand-700" href={qr} download="freetoolkit-qr-code.png">Download PNG</a>
          </div>
        </div>
      ) : null}
      <ErrorMessage message={error} />
    </div>
  );
}

function toTitleCase(value: string) {
  return value.toLowerCase().replace(/\b[a-z0-9]/g, (char) => char.toUpperCase());
}

function toSentenceCase(value: string) {
  const lower = value.toLowerCase();
  return lower.replace(/(^\s*[a-z])|([.!?]\s+[a-z])/g, (match) => match.toUpperCase());
}

function CaseConverter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const convert = (mode: string) => {
    const value = mode === "upper" ? input.toUpperCase() : mode === "lower" ? input.toLowerCase() : mode === "title" ? toTitleCase(input) : mode === "sentence" ? toSentenceCase(input) : input.replace(/\b[a-z]/g, (char) => char.toUpperCase());
    setOutput(value);
  };
  return (
    <div>
      <Textarea value={input} onChange={(event) => setInput(event.target.value)} placeholder="Paste text to convert..." />
      <div className="mt-4 flex flex-wrap gap-3">
        <Button onClick={() => convert("upper")} disabled={!input}>Uppercase</Button>
        <Button onClick={() => convert("lower")} disabled={!input}>Lowercase</Button>
        <SecondaryButton onClick={() => convert("title")} disabled={!input}>Title case</SecondaryButton>
        <SecondaryButton onClick={() => convert("sentence")} disabled={!input}>Sentence case</SecondaryButton>
        <SecondaryButton onClick={() => convert("capitalized")} disabled={!input}>Capitalized</SecondaryButton>
      </div>
      <Textarea className="mt-5" value={output} onChange={(event) => setOutput(event.target.value)} placeholder="Converted text appears here..." />
      <div className="mt-4 flex flex-wrap gap-3"><CopyAction value={output} /><SecondaryButton onClick={() => { setInput(""); setOutput(""); }}>Reset</SecondaryButton></div>
    </div>
  );
}

function WordToPdf() {
  const [title, setTitle] = useState("Untitled Document");
  const [body, setBody] = useState("");
  const [output, setOutput] = useState<Output | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  useObjectUrlCleanup(output);

  async function createPdf() {
    setError("");
    if (!body.trim() && !title.trim()) {
      setError("Add a title or body text before creating a PDF.");
      return;
    }
    setBusy(true);
    try {
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF({ unit: "pt", format: "a4" });
      const margin = 56;
      let y = margin;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(20);
      doc.text(title.trim() || "Untitled Document", margin, y);
      y += 34;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      const lines = doc.splitTextToSize(body || " ", 483) as string[];
      for (const line of lines) {
        if (y > 780) {
          doc.addPage();
          y = margin;
        }
        doc.text(line, margin, y);
        y += 17;
      }
      const blob = doc.output("blob");
      setOutput(downloadBlob(blob, `${(title || "document").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "document"}.pdf`));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to create PDF.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <label className="text-sm font-bold text-slate-700">Document title <Input className="mt-2" value={title} onChange={(event) => setTitle(event.target.value)} /></label>
      <label className="mt-5 block text-sm font-bold text-slate-700">Body text <Textarea className="mt-2" value={body} onChange={(event) => setBody(event.target.value)} placeholder="Write or paste the document body..." /></label>
      <div className="mt-4 flex flex-wrap gap-3"><Button onClick={createPdf} disabled={busy || (!title.trim() && !body.trim())}>{busy ? "Creating..." : "Create PDF"}</Button><SecondaryButton onClick={() => { setTitle("Untitled Document"); setBody(""); setOutput(null); setError(""); }}>Reset</SecondaryButton></div>
      <ErrorMessage message={error} />
      <Download output={output} />
    </div>
  );
}

type ImagePdfItem = {
  id: string;
  file: File;
  dataUrl: string;
};

function readImageAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(new Error("Unable to read this image file."));
    reader.readAsDataURL(file);
  });
}

function getImageSize(src: string) {
  return new Promise<{ width: number; height: number }>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve({ width: image.naturalWidth, height: image.naturalHeight });
    image.onerror = () => reject(new Error("Unable to load image preview."));
    image.src = src;
  });
}

function ImageToPdf() {
  const [images, setImages] = useState<ImagePdfItem[]>([]);
  const [orientation, setOrientation] = useState<"portrait" | "landscape">("portrait");
  const [fit, setFit] = useState<"contain" | "fill">("contain");
  const [pageSize, setPageSize] = useState<"a4" | "letter">("a4");
  const [dragId, setDragId] = useState("");
  const [output, setOutput] = useState<Output | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  useObjectUrlCleanup(output);

  async function load(files: File[]) {
    setError("");
    setOutput(null);
    const valid = files.filter((file) => ["image/jpeg", "image/png", "image/webp"].includes(file.type));
    if (!valid.length) {
      setError("Upload JPG, PNG, or WebP images.");
      return;
    }
    try {
      const next = await Promise.all(
        valid.map(async (file, index) => ({
          id: `${Date.now()}-${index}-${file.name}`,
          file,
          dataUrl: await readImageAsDataUrl(file)
        }))
      );
      setImages((current) => [...current, ...next]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to read images.");
    }
  }

  function moveImage(targetId: string) {
    if (!dragId || dragId === targetId) return;
    setImages((current) => {
      const from = current.findIndex((item) => item.id === dragId);
      const to = current.findIndex((item) => item.id === targetId);
      if (from < 0 || to < 0) return current;
      const copy = [...current];
      const [moved] = copy.splice(from, 1);
      copy.splice(to, 0, moved);
      return copy;
    });
  }

  async function convert() {
    if (!images.length) return;
    setBusy(true);
    setError("");
    setOutput(null);
    try {
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF({ unit: "pt", format: pageSize, orientation });
      for (let index = 0; index < images.length; index += 1) {
        if (index > 0) doc.addPage(pageSize, orientation);
        const item = images[index];
        const size = await getImageSize(item.dataUrl);
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const pageRatio = pageWidth / pageHeight;
        const imageRatio = size.width / size.height;
        let width = pageWidth;
        let height = pageHeight;

        if (fit === "contain") {
          if (imageRatio > pageRatio) {
            width = pageWidth;
            height = pageWidth / imageRatio;
          } else {
            height = pageHeight;
            width = pageHeight * imageRatio;
          }
        } else if (imageRatio > pageRatio) {
          height = pageHeight;
          width = pageHeight * imageRatio;
        } else {
          width = pageWidth;
          height = pageWidth / imageRatio;
        }

        const x = (pageWidth - width) / 2;
        const y = (pageHeight - height) / 2;
        const format = item.file.type === "image/png" ? "PNG" : item.file.type === "image/webp" ? "WEBP" : "JPEG";
        doc.addImage(item.dataUrl, format, x, y, width, height);
      }
      const blob = doc.output("blob");
      setOutput(downloadBlob(blob, "images-to-pdf.pdf"));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to create PDF.");
    } finally {
      setBusy(false);
    }
  }

  function reset() {
    setImages([]);
    setOutput(null);
    setError("");
    setBusy(false);
    setOrientation("portrait");
    setFit("contain");
    setPageSize("a4");
  }

  return (
    <div>
      <FileUploadDropzone label="Upload images" accept="image/jpeg,image/png,image/webp" multiple onFiles={load} />
      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        <label className="text-sm font-bold text-slate-700">Page orientation <Select className="mt-2" value={orientation} onChange={(event) => setOrientation(event.target.value as "portrait" | "landscape")}><option value="portrait">Portrait</option><option value="landscape">Landscape</option></Select></label>
        <label className="text-sm font-bold text-slate-700">Image fit <Select className="mt-2" value={fit} onChange={(event) => setFit(event.target.value as "contain" | "fill")}><option value="contain">Contain</option><option value="fill">Fill</option></Select></label>
        <label className="text-sm font-bold text-slate-700">Page size <Select className="mt-2" value={pageSize} onChange={(event) => setPageSize(event.target.value as "a4" | "letter")}><option value="a4">A4</option><option value="letter">Letter</option></Select></label>
      </div>

      {images.length ? (
        <div className="mt-6">
          <p className="text-sm font-black uppercase tracking-wide text-brand-600">Preview and reorder</p>
          <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {images.map((item, index) => (
              <div
                key={item.id}
                draggable
                onDragStart={() => setDragId(item.id)}
                onDragOver={(event) => event.preventDefault()}
                onDrop={() => moveImage(item.id)}
                onDragEnd={() => setDragId("")}
                className="cursor-move rounded-2xl border border-slate-200 bg-white p-3 shadow-sm transition hover:border-brand-200"
              >
                <img className="h-44 w-full rounded-xl bg-slate-50 object-contain" src={item.dataUrl} alt={`Image ${index + 1} preview`} />
                <p className="mt-3 break-words text-sm font-bold text-slate-800 [overflow-wrap:anywhere]">{index + 1}. {item.file.name}</p>
                <p className="mt-1 text-xs font-semibold text-slate-500">{formatBytes(item.file.size)}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm font-semibold text-slate-500">Choose JPG, PNG, or WebP images to enable this tool.</p>
      )}

      <div className="mt-5 flex flex-wrap gap-3">
        <Button onClick={convert} disabled={!images.length || busy}>{busy ? "Creating PDF..." : "Convert to PDF"}</Button>
        <SecondaryButton onClick={reset}>Reset</SecondaryButton>
      </div>
      <ErrorMessage message={error} />
      <Download output={output} />
    </div>
  );
}

function ImageToWord() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [text, setText] = useState("");
  const [output, setOutput] = useState<Output | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [ocrProgress, setOcrProgress] = useState(0);
  useObjectUrlCleanup(output);

  async function load(files: File[]) {
    const next = files[0] ?? null;
    setFile(next);
    setText("");
    setOutput(null);
    setError("");
    setOcrProgress(0);
    if (preview) URL.revokeObjectURL(preview);
    if (!next) {
      setPreview("");
      return;
    }
    if (!["image/jpeg", "image/png"].includes(next.type)) {
      setError("Upload a JPG or PNG image.");
      setPreview("");
      return;
    }
    setPreview(URL.createObjectURL(next));
  }

  async function extractText() {
    if (!file) return;
    setBusy(true);
    setError("");
    setOcrProgress(0);
    try {
      const Tesseract = await import("tesseract.js");
      const result = await Tesseract.recognize(file, "eng", {
        logger: (message) => {
          if (message.status === "recognizing text") setOcrProgress(Math.round(message.progress * 100));
        }
      });
      setText(result.data.text.trim());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to extract text from this image.");
    } finally {
      setBusy(false);
    }
  }

  async function downloadDocx() {
    setError("");
    if (!text.trim()) {
      setError("Extract or enter text before downloading a Word document.");
      return;
    }
    try {
      const { Document, Packer, Paragraph, TextRun } = await import("docx");
      const paragraphs = text
        .split(/\n+/)
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => new Paragraph({ children: [new TextRun(line)] }));
      const doc = new Document({
        sections: [
          {
            properties: {},
            children: paragraphs.length ? paragraphs : [new Paragraph({ children: [new TextRun(text.trim())] })]
          }
        ]
      });
      const blob = await Packer.toBlob(doc);
      setOutput(downloadBlob(blob, `${(file?.name || "image-text").replace(/\.[^.]+$/, "") || "image-text"}.docx`));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to create Word document.");
    }
  }

  function reset() {
    setFile(null);
    if (preview) URL.revokeObjectURL(preview);
    setPreview("");
    setText("");
    setOutput(null);
    setError("");
    setBusy(false);
    setOcrProgress(0);
  }

  return (
    <div>
      <FileUploadDropzone label="Upload a JPG or PNG image" accept="image/jpeg,image/png" onFiles={load} />
      <FileInfo file={file} />
      <p className="mt-4 rounded-2xl border border-brand-100 bg-brand-50 p-4 text-sm font-semibold leading-6 text-brand-700">
        This tool extracts text from images. Formatting and layout may not be preserved.
      </p>

      {preview ? <img className="mt-5 max-h-80 w-full rounded-2xl border border-slate-200 bg-slate-50 object-contain p-2" src={preview} alt="Uploaded image preview" /> : null}

      <div className="mt-5 flex flex-wrap gap-3">
        <Button onClick={extractText} disabled={!file || busy}>{busy ? `Extracting${ocrProgress ? ` ${ocrProgress}%` : "..."}` : "Extract text"}</Button>
        <SecondaryButton onClick={downloadDocx} disabled={!text.trim()}>Download DOCX</SecondaryButton>
        <SecondaryButton onClick={reset}>Reset</SecondaryButton>
      </div>

      <label className="mt-5 block text-sm font-bold text-slate-700">
        Extracted text
        <Textarea className="mt-2 min-h-72" value={text} onChange={(event) => setText(event.target.value)} placeholder="Extracted text will appear here. You can edit it before downloading as DOCX." />
      </label>
      <ErrorMessage message={error} />
      <Download output={output} />
    </div>
  );
}

function AiImageToWord() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [markdown, setMarkdown] = useState("");
  const [output, setOutput] = useState<Output | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [successfulUses, setSuccessfulUses] = useState(0);
  useObjectUrlCleanup(output);

  useEffect(() => {
    const raw = window.localStorage.getItem("freetoolkit-ai-image-to-word-usage");
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw) as { date?: string; count?: number };
      setSuccessfulUses(parsed.date === new Date().toISOString().slice(0, 10) ? parsed.count ?? 0 : 0);
    } catch {
      setSuccessfulUses(0);
    }
  }, []);

  const remaining = Math.max(0, 3 - successfulUses);

  async function load(files: File[]) {
    const next = files[0] ?? null;
    setFile(next);
    setMarkdown("");
    setOutput(null);
    setError("");
    if (preview) URL.revokeObjectURL(preview);
    if (!next) {
      setPreview("");
      return;
    }
    if (!["image/jpeg", "image/png", "image/webp"].includes(next.type)) {
      setError("Upload a JPG, PNG, or WebP image.");
      setPreview("");
      return;
    }
    setPreview(URL.createObjectURL(next));
  }

  function saveSuccessfulUse(nextCount: number) {
    setSuccessfulUses(nextCount);
    window.localStorage.setItem("freetoolkit-ai-image-to-word-usage", JSON.stringify({ date: new Date().toISOString().slice(0, 10), count: nextCount }));
  }

  async function extract() {
    if (!file || remaining <= 0) return;
    setBusy(true);
    setError("");
    setOutput(null);
    try {
      const imageBase64 = await readImageAsDataUrl(file);
      const response = await fetch("/api/ai-tools/image-to-word", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageBase64,
          mimeType: file.type
        })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || "AI is busy, try again later.");
      setMarkdown(data.output || "");
      saveSuccessfulUse(successfulUses + 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : "AI is busy, try again later.");
    } finally {
      setBusy(false);
    }
  }

  async function downloadDocx() {
    setError("");
    if (!markdown.trim()) {
      setError("Extract or enter text before downloading a Word document.");
      return;
    }
    try {
      const { Document, HeadingLevel, Packer, Paragraph, TextRun } = await import("docx");
      const children = markdown.split(/\r?\n/).map((rawLine) => {
        const line = rawLine.trim();
        if (!line) return new Paragraph({ text: "" });
        const heading = line.match(/^(#{1,3})\s+(.+)/);
        if (heading) {
          return new Paragraph({
            text: heading[2],
            heading: heading[1].length === 1 ? HeadingLevel.HEADING_1 : HeadingLevel.HEADING_2
          });
        }
        const bullet = line.match(/^[-*]\s+(.+)/);
        if (bullet) {
          return new Paragraph({ text: bullet[1], bullet: { level: 0 } });
        }
        const numbered = line.match(/^\d+\.\s+(.+)/);
        if (numbered) {
          return new Paragraph({ text: numbered[1], numbering: { reference: "numbered-list", level: 0 } });
        }
        return new Paragraph({ children: [new TextRun(line.replace(/\*\*/g, ""))] });
      });
      const doc = new Document({
        numbering: {
          config: [
            {
              reference: "numbered-list",
              levels: [
                {
                  level: 0,
                  format: "decimal",
                  text: "%1.",
                  alignment: "left"
                }
              ]
            }
          ]
        },
        sections: [{ properties: {}, children }]
      });
      const blob = await Packer.toBlob(doc);
      setOutput(downloadBlob(blob, `${(file?.name || "ai-image-to-word").replace(/\.[^.]+$/, "") || "ai-image-to-word"}.docx`));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to create Word document.");
    }
  }

  function reset() {
    setFile(null);
    if (preview) URL.revokeObjectURL(preview);
    setPreview("");
    setMarkdown("");
    setOutput(null);
    setError("");
    setBusy(false);
  }

  return (
    <div>
      <FileUploadDropzone label="Upload a JPG, PNG, or WebP image" accept="image/jpeg,image/png,image/webp" onFiles={load} />
      <FileInfo file={file} />
      <p className="mt-4 rounded-2xl border border-brand-100 bg-brand-50 p-4 text-sm font-semibold leading-6 text-brand-700">
        This AI tool extracts and structures text from images. Complex layouts, handwriting, and scanned documents may not be perfectly preserved.
      </p>
      <p className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-600">
        {remaining} AI image conversion{remaining === 1 ? "" : "s"} remaining today in this browser.
      </p>

      {preview ? <img className="mt-5 max-h-80 w-full rounded-2xl border border-slate-200 bg-slate-50 object-contain p-2" src={preview} alt="Uploaded image preview" /> : null}

      <div className="mt-5 flex flex-wrap gap-3">
        <Button onClick={extract} disabled={!file || busy || remaining <= 0}>{busy ? "Extracting with AI..." : "Extract with AI"}</Button>
        <SecondaryButton onClick={downloadDocx} disabled={!markdown.trim()}>Download Word Document</SecondaryButton>
        <SecondaryButton onClick={reset}>Reset</SecondaryButton>
      </div>

      <label className="mt-5 block text-sm font-bold text-slate-700">
        Extracted structured text / Markdown
        <Textarea className="mt-2 min-h-80 font-mono" value={markdown} onChange={(event) => setMarkdown(event.target.value)} placeholder="AI-extracted Markdown will appear here. You can edit it before downloading as DOCX." />
      </label>
      <ErrorMessage message={error} />
      <Download output={output} />
    </div>
  );
}

function PdfToWord() {
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState("");
  const [output, setOutput] = useState<Output | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  useObjectUrlCleanup(output);

  function load(files: File[]) {
    setFile(files[0] ?? null);
    setText("");
    setOutput(null);
    setError("");
  }

  async function createDocxFromText(sourceText: string) {
    const cleaned = sourceText.trim();
    if (!cleaned) throw new Error("No readable PDF text was found.");
    const { Document, HeadingLevel, Packer, Paragraph, TextRun } = await import("docx");
    const children = cleaned.split("\n").map((line) => {
      const trimmed = line.trim();
      if (!trimmed) return new Paragraph({ text: "" });
      if (/^Page \d+$/i.test(trimmed)) {
        return new Paragraph({
          text: trimmed,
          heading: HeadingLevel.HEADING_2
        });
      }
      return new Paragraph({
        children: [new TextRun(trimmed)],
        spacing: { after: 120 }
      });
    });

    const doc = new Document({
      sections: [
        {
          children
        }
      ]
    });
    const blob = await Packer.toBlob(doc);
    const name = `${(file?.name || "converted-pdf").replace(/\.[^.]+$/, "") || "converted-pdf"}.docx`;
    setOutput(downloadBlob(blob, name));
  }

  async function convert() {
    if (!file) {
      setError("Please upload a PDF first.");
      return;
    }
    setBusy(true);
    setError("");
    setOutput(null);
    try {
      const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
      pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.legacy.min.js";
      const loadingTask = pdfjs.getDocument({ data: new Uint8Array(await file.arrayBuffer()) });
      const pdf = await loadingTask.promise;
      const pages: string[] = [];

      for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
        const page = await pdf.getPage(pageNumber);
        const content = await page.getTextContent();
        const pageText = (content.items as Array<{ str?: string }>)
          .map((item) => item.str || "")
          .join(" ")
          .replace(/\s+/g, " ")
          .trim();
        if (pageText) pages.push(`Page ${pageNumber}\n${pageText}`);
      }

      const extracted = pages.join("\n\n").trim();
      if (!extracted) {
        throw new Error("No readable text was found. Scanned PDFs may need OCR.");
      }
      setText(extracted);
      await createDocxFromText(extracted);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to convert this PDF.");
    } finally {
      setBusy(false);
    }
  }

  function reset() {
    setFile(null);
    setText("");
    setOutput(null);
    setError("");
  }

  return (
    <div className="grid gap-6">
      <FileUploadDropzone label="Upload a PDF" accept="application/pdf" onFiles={load} />

      {file ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-black uppercase tracking-wide text-brand-600">Selected file</p>
          <p className="mt-2 break-words text-base font-bold text-slate-950 [overflow-wrap:anywhere]">{file.name}</p>
          <p className="mt-1 text-sm font-semibold text-slate-500">{formatBytes(file.size)}</p>
        </div>
      ) : null}

      <div className="rounded-2xl border border-brand-100 bg-brand-50 p-5 text-sm leading-6 text-brand-800 shadow-sm">
        <p className="font-black">Text-based PDF to Word conversion</p>
        <p className="mt-2">
          This tool extracts readable text from your PDF in the browser and creates a downloadable DOCX file.
        </p>
        <p className="mt-2 font-semibold">
          Scanned PDFs, handwriting, tables, and complex layouts may need OCR or a dedicated layout converter.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button type="button" onClick={convert} disabled={!file || busy}>
          {busy ? "Converting..." : "Convert to DOCX"}
        </Button>
        <SecondaryButton type="button" onClick={() => createDocxFromText(text).catch((err) => setError(err instanceof Error ? err.message : "Unable to create DOCX."))} disabled={!text.trim() || busy}>
          Create edited DOCX
        </SecondaryButton>
        <SecondaryButton type="button" onClick={reset}>
          Reset
        </SecondaryButton>
      </div>

      {text ? (
        <label className="block text-sm font-bold text-slate-700">
          Extracted text
          <Textarea className="mt-2 min-h-72 font-mono" value={text} onChange={(event) => setText(event.target.value)} />
        </label>
      ) : null}

      <ErrorMessage message={error} />
      <Download output={output} />

      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm leading-6 text-slate-600">
        <p className="font-bold text-slate-950">Text-based conversion note</p>
        <p className="mt-2">
          This converter focuses on readable PDF text. Complex formatting, tables, scanned pages, handwriting, and exact page layout may not be preserved.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <a className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-center text-sm font-black text-slate-800 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700" href="/extract-pdf-pages">
          Extract PDF Pages
        </a>
        <a className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-center text-sm font-black text-slate-800 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700" href="/add-text-to-pdf">
          Add Text to PDF
        </a>
        <a className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-center text-sm font-black text-slate-800 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700" href="/word-to-pdf">
          Word to PDF
        </a>
      </div>
    </div>
  );
}

function PdfToJpg() {
  const [file, setFile] = useState<File | null>(null);
  const [ranges, setRanges] = useState("");
  const [outputs, setOutputs] = useState<Output[]>([]);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => () => {
    outputs.forEach((output) => URL.revokeObjectURL(output.url));
  }, [outputs]);

  function load(files: File[]) {
    outputs.forEach((output) => URL.revokeObjectURL(output.url));
    setFile(files[0] ?? null);
    setOutputs([]);
    setError("");
  }

  async function convert() {
    if (!file) {
      setError("Please upload a PDF first.");
      return;
    }
    setBusy(true);
    setError("");
    outputs.forEach((output) => URL.revokeObjectURL(output.url));
    setOutputs([]);
    try {
      if (!window.DOMMatrix) throw new Error("PDF rendering is not supported in this browser.");
      const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
      pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.legacy.min.js";
      const loadingTask = pdfjs.getDocument({ data: new Uint8Array(await file.arrayBuffer()) });
      const pdf = await loadingTask.promise;
      const selectedPages = ranges.trim() ? parseRanges(ranges, pdf.numPages).map((page) => page + 1) : Array.from({ length: pdf.numPages }, (_, index) => index + 1);
      const nextOutputs: Output[] = [];

      for (const pageNumber of selectedPages.slice(0, 20)) {
        const page = await pdf.getPage(pageNumber);
        const viewport = page.getViewport({ scale: 2 });
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("Canvas is not supported in this browser.");
        canvas.width = Math.floor(viewport.width);
        canvas.height = Math.floor(viewport.height);
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        await page.render({ canvas, canvasContext: ctx, viewport }).promise;
        const blob = await canvasToBlob(canvas, "image/jpeg", 0.9);
        const baseName = (file.name || "pdf-page").replace(/\.[^.]+$/, "");
        nextOutputs.push(downloadBlob(blob, `${baseName}-page-${pageNumber}.jpg`));
      }

      setOutputs(nextOutputs);
      if (selectedPages.length > 20) setError("Converted the first 20 selected pages to keep the browser responsive.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to convert this PDF to JPG.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid gap-6">
      <FileUploadDropzone label="Upload a PDF" accept="application/pdf" onFiles={load} />
      <FileInfo file={file} />
      <label className="text-sm font-bold text-slate-700">
        Pages or ranges
        <Input className="mt-2" value={ranges} onChange={(event) => setRanges(event.target.value)} placeholder="Leave empty for all pages, or use 1-3,5" />
      </label>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button type="button" onClick={convert} disabled={!file || busy}>{busy ? "Converting..." : "Convert to JPG"}</Button>
        <SecondaryButton type="button" onClick={() => { load([]); setRanges(""); }}>Reset</SecondaryButton>
      </div>
      <ErrorMessage message={error} />
      {outputs.length ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {outputs.map((output) => (
            <a key={output.url} className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-black text-emerald-800 shadow-sm transition hover:-translate-y-0.5 hover:bg-emerald-100" href={output.url} download={output.name}>
              Download {output.name} · {formatBytes(output.size)}
            </a>
          ))}
        </div>
      ) : null}
      <p className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm font-semibold leading-6 text-slate-600">JPG files are image exports. Text will not remain editable, and very large PDFs may take longer on mobile devices.</p>
    </div>
  );
}

function DiscountCalculator() {
  const [price, setPrice] = useState(100);
  const [discount, setDiscount] = useState(20);
  const [tax, setTax] = useState(0);
  const savings = Math.max(0, price * (discount / 100));
  const salePrice = Math.max(0, price - savings);
  const taxAmount = salePrice * (Math.max(0, tax) / 100);
  const total = salePrice + taxAmount;

  return (
    <div className="grid gap-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <label className="text-sm font-bold text-slate-700">Original price <Input className="mt-2" type="number" min={0} value={price} onChange={(event) => setPrice(Number(event.target.value))} /></label>
        <label className="text-sm font-bold text-slate-700">Discount % <Input className="mt-2" type="number" min={0} max={100} value={discount} onChange={(event) => setDiscount(Number(event.target.value))} /></label>
        <label className="text-sm font-bold text-slate-700">Tax % optional <Input className="mt-2" type="number" min={0} value={tax} onChange={(event) => setTax(Number(event.target.value))} /></label>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <ResultCard title="You save"><p className="text-3xl font-black text-slate-950">${savings.toFixed(2)}</p></ResultCard>
        <ResultCard title="Sale price"><p className="text-3xl font-black text-slate-950">${salePrice.toFixed(2)}</p></ResultCard>
        <ResultCard title="Estimated total"><p className="text-3xl font-black text-slate-950">${total.toFixed(2)}</p></ResultCard>
      </div>
      <SecondaryButton onClick={() => { setPrice(100); setDiscount(20); setTax(0); }}>Reset</SecondaryButton>
    </div>
  );
}

function BmiCalculator() {
  const [unit, setUnit] = useState<"metric" | "imperial">("metric");
  const [height, setHeight] = useState(170);
  const [weight, setWeight] = useState(70);
  const bmi = unit === "metric"
    ? weight / Math.pow(height / 100, 2)
    : (weight / Math.pow(height, 2)) * 703;
  const category = bmi < 18.5 ? "Underweight" : bmi < 25 ? "Normal range" : bmi < 30 ? "Overweight" : "Obesity range";

  return (
    <div className="grid gap-6">
      <label className="text-sm font-bold text-slate-700">Units <Select className="mt-2" value={unit} onChange={(event) => setUnit(event.target.value as "metric" | "imperial")}><option value="metric">Metric (cm, kg)</option><option value="imperial">Imperial (in, lb)</option></Select></label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-sm font-bold text-slate-700">Height ({unit === "metric" ? "cm" : "in"}) <Input className="mt-2" type="number" min={1} value={height} onChange={(event) => setHeight(Number(event.target.value))} /></label>
        <label className="text-sm font-bold text-slate-700">Weight ({unit === "metric" ? "kg" : "lb"}) <Input className="mt-2" type="number" min={1} value={weight} onChange={(event) => setWeight(Number(event.target.value))} /></label>
      </div>
      <ResultCard title="BMI result">
        <p className="text-4xl font-black text-slate-950">{Number.isFinite(bmi) ? bmi.toFixed(1) : "0.0"}</p>
        <p className="mt-2 text-sm font-bold text-slate-600">{category}</p>
      </ResultCard>
      <p className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm font-semibold leading-6 text-amber-900">BMI is a general screening estimate, not medical advice. It does not measure muscle, body composition, age, pregnancy, or individual health risk.</p>
    </div>
  );
}

function PdfUnlockTool() {
  const [file, setFile] = useState<File | null>(null);
  const [output, setOutput] = useState<Output | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  useObjectUrlCleanup(output);

  async function unlock() {
    if (!file) return;
    setBusy(true);
    setError("");
    setOutput(null);
    try {
      const { PDFDocument } = await import("pdf-lib");
      const pdf = await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption: true });
      const bytes = await pdf.save({ useObjectStreams: false });
      setOutput(downloadBlob(bytesToPdfBlob(bytes), `${file.name.replace(/\.[^.]+$/, "") || "unlocked"}.pdf`));
    } catch (err) {
      setError(err instanceof Error ? err.message : "This PDF could not be unlocked in the browser.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid gap-6">
      <FileUploadDropzone label="Upload a PDF you own or have permission to edit" accept="application/pdf" onFiles={(files) => { setFile(files[0] ?? null); setOutput(null); setError(""); }} />
      <FileInfo file={file} />
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button type="button" onClick={unlock} disabled={!file || busy}>{busy ? "Trying unlock..." : "Try Unlock PDF"}</Button>
        <SecondaryButton type="button" onClick={() => { setFile(null); setOutput(null); setError(""); }}>Reset</SecondaryButton>
      </div>
      <p className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm font-semibold leading-6 text-amber-900">Only use this on PDFs you own or have permission to modify. Strong encryption or password-required files may not work.</p>
      <ErrorMessage message={error} />
      <Download output={output} />
    </div>
  );
}

function UrlEncoderDecoder() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  function run(mode: "encode" | "decode") {
    setError("");
    try {
      setOutput(mode === "encode" ? encodeURIComponent(input) : decodeURIComponent(input));
    } catch {
      setError("This text is not valid URL-encoded content.");
    }
  }
  return (
    <div>
      <Textarea value={input} onChange={(event) => setInput(event.target.value)} placeholder="Paste a URL, query parameter, or encoded value..." />
      <div className="mt-4 flex flex-wrap gap-3"><Button onClick={() => run("encode")} disabled={!input}>Encode URL</Button><SecondaryButton onClick={() => run("decode")} disabled={!input}>Decode URL</SecondaryButton><CopyAction value={output} /><SecondaryButton onClick={() => { setInput(""); setOutput(""); setError(""); }}>Reset</SecondaryButton></div>
      <Textarea className="mt-5" value={output} onChange={(event) => setOutput(event.target.value)} placeholder="Output appears here..." />
      <ErrorMessage message={error} />
    </div>
  );
}

function JsonFormatter() {
  const [input, setInput] = useState('{"name":"FreeToolKit","free":true}');
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  function run(minify = false) {
    setError("");
    try {
      setOutput(JSON.stringify(JSON.parse(input), null, minify ? 0 : 2));
    } catch (err) {
      setOutput("");
      setError(err instanceof Error ? err.message : "Invalid JSON.");
    }
  }
  return (
    <div>
      <Textarea value={input} onChange={(event) => setInput(event.target.value)} placeholder="Paste JSON here..." />
      <div className="mt-4 flex flex-wrap gap-3"><Button onClick={() => run(false)} disabled={!input}>Format JSON</Button><SecondaryButton onClick={() => run(true)} disabled={!input}>Minify JSON</SecondaryButton><CopyAction value={output} /><SecondaryButton onClick={() => { setInput(""); setOutput(""); setError(""); }}>Reset</SecondaryButton></div>
      <Textarea className="mt-5 font-mono" value={output} onChange={(event) => setOutput(event.target.value)} placeholder="Formatted JSON appears here..." />
      <ErrorMessage message={error} />
    </div>
  );
}

function PasswordGenerator() {
  const [length, setLength] = useState(16);
  const [upper, setUpper] = useState(true);
  const [lower, setLower] = useState(true);
  const [numbers, setNumbers] = useState(true);
  const [symbols, setSymbols] = useState(true);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const strength = length >= 18 && [upper, lower, numbers, symbols].filter(Boolean).length >= 3 ? "Strong" : length >= 12 ? "Good" : "Basic";
  function generate() {
    const pools = [upper ? "ABCDEFGHIJKLMNOPQRSTUVWXYZ" : "", lower ? "abcdefghijklmnopqrstuvwxyz" : "", numbers ? "0123456789" : "", symbols ? "!@#$%^&*()-_=+[]{};:,.?/" : ""].join("");
    if (!pools) {
      setError("Choose at least one character type.");
      return;
    }
    setError("");
    const bytes = new Uint32Array(length);
    crypto.getRandomValues(bytes);
    setPassword(Array.from(bytes, (byte) => pools[byte % pools.length]).join(""));
  }
  return (
    <div>
      <label className="text-sm font-bold text-slate-700">Length: {length}<input className="mt-3 w-full accent-brand-600" type="range" min="8" max="64" value={length} onChange={(event) => setLength(Number(event.target.value))} /></label>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {[["Uppercase", upper, setUpper], ["Lowercase", lower, setLower], ["Numbers", numbers, setNumbers], ["Symbols", symbols, setSymbols]].map(([label, checked, setter]) => (
          <label key={label as string} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm font-bold text-slate-700"><input className="mr-2" type="checkbox" checked={checked as boolean} onChange={(event) => (setter as (value: boolean) => void)(event.target.checked)} />{label as string}</label>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap gap-3"><Button onClick={generate}>Generate password</Button><CopyAction value={password} /><SecondaryButton onClick={() => { setPassword(""); setError(""); }}>Reset</SecondaryButton></div>
      {password ? <div className="mt-5 rounded-2xl border border-brand-100 bg-brand-50 p-5"><p className="text-xs font-black uppercase tracking-wide text-brand-700">Strength: {strength}</p><p className="mt-2 break-all font-mono text-xl font-black text-slate-950">{password}</p></div> : null}
      <ErrorMessage message={error} />
    </div>
  );
}

function UuidGenerator() {
  const [count, setCount] = useState(5);
  const [ids, setIds] = useState<string[]>([]);
  function generate() {
    const amount = Math.min(100, Math.max(1, count));
    setIds(Array.from({ length: amount }, () => crypto.randomUUID()));
  }
  return (
    <div>
      <label className="text-sm font-bold text-slate-700">How many UUIDs? <Input className="mt-2" type="number" min={1} max={100} value={count} onChange={(event) => setCount(Number(event.target.value))} /></label>
      <div className="mt-4 flex flex-wrap gap-3"><Button onClick={generate}>Generate UUIDs</Button><CopyAction value={ids.join("\n")} label="Copy all" /><SecondaryButton onClick={() => setIds([])}>Reset</SecondaryButton></div>
      <div className="mt-5 grid gap-2">{ids.map((id) => <div key={id} className="flex flex-col gap-2 rounded-2xl bg-slate-50 p-3 text-sm font-bold text-slate-700 sm:flex-row sm:items-center sm:justify-between"><span className="break-all font-mono">{id}</span><CopyAction value={id} /></div>)}</div>
    </div>
  );
}

function encodeBase64(value: string) {
  const bytes = new TextEncoder().encode(value);
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary);
}

function decodeBase64(value: string) {
  return new TextDecoder().decode(Uint8Array.from(atob(value), (char) => char.charCodeAt(0)));
}

function Base64EncoderDecoder() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  function run(mode: "encode" | "decode") {
    setError("");
    try {
      setOutput(mode === "encode" ? encodeBase64(input) : decodeBase64(input));
    } catch {
      setOutput("");
      setError("The input could not be decoded as valid Base64 text.");
    }
  }
  return (
    <div>
      <Textarea value={input} onChange={(event) => setInput(event.target.value)} placeholder="Paste text or Base64 here..." />
      <div className="mt-4 flex flex-wrap gap-3"><Button onClick={() => run("encode")} disabled={!input}>Encode Base64</Button><SecondaryButton onClick={() => run("decode")} disabled={!input}>Decode Base64</SecondaryButton><CopyAction value={output} /><SecondaryButton onClick={() => { setInput(""); setOutput(""); setError(""); }}>Reset</SecondaryButton></div>
      <Textarea className="mt-5 font-mono" value={output} onChange={(event) => setOutput(event.target.value)} placeholder="Output appears here..." />
      <ErrorMessage message={error} />
    </div>
  );
}

function AgeCalculator() {
  const [dob, setDob] = useState("2000-01-01");
  const [result, setResult] = useState<{ years: number; months: number; days: number; next: string } | null>(null);
  const [error, setError] = useState("");
  function calculate() {
    const birth = new Date(`${dob}T00:00:00`);
    const today = new Date();
    if (!dob || birth > today) {
      setError("Enter a valid date of birth in the past.");
      setResult(null);
      return;
    }
    setError("");
    let years = today.getFullYear() - birth.getFullYear();
    let months = today.getMonth() - birth.getMonth();
    let days = today.getDate() - birth.getDate();
    if (days < 0) {
      months -= 1;
      days += new Date(today.getFullYear(), today.getMonth(), 0).getDate();
    }
    if (months < 0) {
      years -= 1;
      months += 12;
    }
    const nextBirthday = new Date(today.getFullYear(), birth.getMonth(), birth.getDate());
    if (nextBirthday < today) nextBirthday.setFullYear(today.getFullYear() + 1);
    const nextDays = Math.ceil((nextBirthday.getTime() - today.getTime()) / 86400000);
    setResult({ years, months, days, next: nextDays === 0 ? "Today" : `${nextDays} day${nextDays === 1 ? "" : "s"}` });
  }
  return (
    <div>
      <label className="text-sm font-bold text-slate-700">Date of birth <Input className="mt-2" type="date" value={dob} onChange={(event) => setDob(event.target.value)} /></label>
      <div className="mt-4 flex flex-wrap gap-3"><Button onClick={calculate}>Calculate age</Button><SecondaryButton onClick={() => { setDob(""); setResult(null); setError(""); }}>Reset</SecondaryButton></div>
      {result ? <div className="mt-5 grid gap-3 sm:grid-cols-4"><ResultBox label="Years" value={result.years} /><ResultBox label="Months" value={result.months} /><ResultBox label="Days" value={result.days} /><ResultBox label="Next birthday" value={result.next} /></div> : null}
      <ErrorMessage message={error} />
    </div>
  );
}

const unitGroups = {
  length: { Meter: 1, Kilometer: 1000, Centimeter: 0.01, Millimeter: 0.001, Mile: 1609.344, Yard: 0.9144, Foot: 0.3048, Inch: 0.0254 },
  mass: { Kilogram: 1, Gram: 0.001, Milligram: 0.000001, Pound: 0.45359237, Ounce: 0.0283495231 },
  area: { "Square meter": 1, "Square kilometer": 1000000, "Square foot": 0.09290304, Acre: 4046.8564224, Hectare: 10000 },
  volume: { Liter: 1, Milliliter: 0.001, "Cubic meter": 1000, Gallon: 3.785411784, Cup: 0.2365882365 },
  speed: { "Meter/second": 1, "Kilometer/hour": 0.2777777778, "Mile/hour": 0.44704, Knot: 0.514444 },
  temperature: { Celsius: 1, Fahrenheit: 1, Kelvin: 1 }
};

function UnitConverter() {
  const [category, setCategory] = useState<keyof typeof unitGroups>("length");
  const [value, setValue] = useState(1);
  const units = Object.keys(unitGroups[category]);
  const [from, setFrom] = useState("Meter");
  const [to, setTo] = useState("Kilometer");
  useEffect(() => {
    const nextUnits = Object.keys(unitGroups[category]);
    setFrom(nextUnits[0]);
    setTo(nextUnits[1] ?? nextUnits[0]);
  }, [category]);
  const result = useMemo(() => {
    if (category === "temperature") {
      const c = from === "Celsius" ? value : from === "Fahrenheit" ? (value - 32) * 5 / 9 : value - 273.15;
      return to === "Celsius" ? c : to === "Fahrenheit" ? c * 9 / 5 + 32 : c + 273.15;
    }
    const group = unitGroups[category] as Record<string, number>;
    return (value * group[from]) / group[to];
  }, [category, from, to, value]);
  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-sm font-bold text-slate-700">Category <Select className="mt-2" value={category} onChange={(event) => setCategory(event.target.value as keyof typeof unitGroups)}>{Object.keys(unitGroups).map((item) => <option key={item} value={item}>{toTitleCase(item)}</option>)}</Select></label>
        <label className="text-sm font-bold text-slate-700">Value <Input className="mt-2" type="number" value={value} onChange={(event) => setValue(Number(event.target.value))} /></label>
        <label className="text-sm font-bold text-slate-700">From <Select className="mt-2" value={from} onChange={(event) => setFrom(event.target.value)}>{units.map((unit) => <option key={unit}>{unit}</option>)}</Select></label>
        <label className="text-sm font-bold text-slate-700">To <Select className="mt-2" value={to} onChange={(event) => setTo(event.target.value)}>{units.map((unit) => <option key={unit}>{unit}</option>)}</Select></label>
      </div>
      <div className="mt-5"><ResultBox label="Converted result" value={`${Number.isFinite(result) ? result.toLocaleString(undefined, { maximumFractionDigits: 6 }) : "0"} ${to}`} /></div>
    </div>
  );
}

function PercentageCalculator() {
  const [mode, setMode] = useState("of");
  const [a, setA] = useState(20);
  const [b, setB] = useState(100);
  const result = mode === "of" ? (a / 100) * b : mode === "share" ? b ? (a / b) * 100 : 0 : a ? ((b - a) / a) * 100 : 0;
  return (
    <div>
      <div className="grid gap-2 sm:grid-cols-3">{[["of", "Percent of number"], ["share", "X is what % of Y"], ["change", "Increase/decrease"]].map(([value, label]) => <button key={value} className={`rounded-2xl border px-4 py-3 text-sm font-black ${mode === value ? "border-brand-200 bg-brand-50 text-brand-700" : "border-slate-200 bg-white text-slate-700"}`} onClick={() => setMode(value)}>{label}</button>)}</div>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="text-sm font-bold text-slate-700">{mode === "change" ? "Original value" : mode === "share" ? "X value" : "Percentage"} <Input className="mt-2" type="number" value={a} onChange={(event) => setA(Number(event.target.value))} /></label>
        <label className="text-sm font-bold text-slate-700">{mode === "change" ? "New value" : mode === "share" ? "Y value" : "Number"} <Input className="mt-2" type="number" value={b} onChange={(event) => setB(Number(event.target.value))} /></label>
      </div>
      <div className="mt-5"><ResultBox label="Result" value={mode === "of" ? result.toLocaleString(undefined, { maximumFractionDigits: 4 }) : `${result.toLocaleString(undefined, { maximumFractionDigits: 4 })}%`} /></div>
    </div>
  );
}

function LoanEmiCalculator() {
  const [amount, setAmount] = useState(25000);
  const [rate, setRate] = useState(6.5);
  const [years, setYears] = useState(5);
  const months = years * 12;
  const monthlyRate = rate / 12 / 100;
  const emi = monthlyRate ? amount * monthlyRate * ((1 + monthlyRate) ** months) / (((1 + monthlyRate) ** months) - 1) : amount / months;
  const total = emi * months;
  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-3">
        <label className="text-sm font-bold text-slate-700">Loan amount <Input className="mt-2" type="number" value={amount} onChange={(event) => setAmount(Number(event.target.value))} /></label>
        <label className="text-sm font-bold text-slate-700">Annual interest % <Input className="mt-2" type="number" step={0.01} value={rate} onChange={(event) => setRate(Number(event.target.value))} /></label>
        <label className="text-sm font-bold text-slate-700">Term in years <Input className="mt-2" type="number" step={0.5} value={years} onChange={(event) => setYears(Number(event.target.value))} /></label>
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-3"><ResultBox label="Monthly EMI" value={`$${emi.toFixed(2)}`} /><ResultBox label="Total interest" value={`$${(total - amount).toFixed(2)}`} /><ResultBox label="Total payment" value={`$${total.toFixed(2)}`} /></div>
    </div>
  );
}

const fallbackTimeZones = [
  ["Pacific/Auckland", "Auckland, New Zealand"],
  ["Australia/Sydney", "Sydney, Australia"],
  ["Australia/Melbourne", "Melbourne, Australia"],
  ["Australia/Perth", "Perth, Australia"],
  ["Asia/Kathmandu", "Kathmandu, Nepal"],
  ["Asia/Kolkata", "Delhi / Mumbai, India"],
  ["Asia/Dhaka", "Dhaka, Bangladesh"],
  ["Asia/Karachi", "Karachi, Pakistan"],
  ["Asia/Dubai", "Dubai, UAE"],
  ["Asia/Riyadh", "Riyadh, Saudi Arabia"],
  ["Asia/Singapore", "Singapore"],
  ["Asia/Bangkok", "Bangkok, Thailand"],
  ["Asia/Jakarta", "Jakarta, Indonesia"],
  ["Asia/Manila", "Manila, Philippines"],
  ["Asia/Shanghai", "Beijing / Shanghai, China"],
  ["Asia/Hong_Kong", "Hong Kong"],
  ["Asia/Taipei", "Taipei, Taiwan"],
  ["Asia/Seoul", "Seoul, South Korea"],
  ["Asia/Tokyo", "Tokyo, Japan"],
  ["Europe/London", "London, United Kingdom"],
  ["Europe/Dublin", "Dublin, Ireland"],
  ["Europe/Paris", "Paris, France"],
  ["Europe/Berlin", "Berlin, Germany"],
  ["Europe/Madrid", "Madrid, Spain"],
  ["Europe/Rome", "Rome, Italy"],
  ["Europe/Amsterdam", "Amsterdam, Netherlands"],
  ["Europe/Zurich", "Zurich, Switzerland"],
  ["Europe/Stockholm", "Stockholm, Sweden"],
  ["Europe/Istanbul", "Istanbul, Turkey"],
  ["Europe/Moscow", "Moscow, Russia"],
  ["Africa/Cairo", "Cairo, Egypt"],
  ["Africa/Johannesburg", "Johannesburg, South Africa"],
  ["Africa/Nairobi", "Nairobi, Kenya"],
  ["America/New_York", "New York, United States"],
  ["America/Chicago", "Chicago, United States"],
  ["America/Denver", "Denver, United States"],
  ["America/Los_Angeles", "Los Angeles, United States"],
  ["America/Toronto", "Toronto, Canada"],
  ["America/Vancouver", "Vancouver, Canada"],
  ["America/Mexico_City", "Mexico City, Mexico"],
  ["America/Sao_Paulo", "Sao Paulo, Brazil"],
  ["America/Argentina/Buenos_Aires", "Buenos Aires, Argentina"],
  ["America/Santiago", "Santiago, Chile"],
  ["UTC", "UTC / GMT"]
];

function formatTimeZoneLabel(zone: string) {
  if (zone === "UTC") return "UTC / GMT";
  const parts = zone.split("/");
  const city = (parts[parts.length - 1] ?? zone).replace(/_/g, " ");
  const region = parts[0]?.replace(/_/g, " ");
  return `${city}, ${region} (${zone})`;
}

function getTimeZoneOptions() {
  const intlWithZones = Intl as typeof Intl & { supportedValuesOf?: (key: "timeZone") => string[] };
  const zones = intlWithZones.supportedValuesOf?.("timeZone");
  if (!zones?.length) return fallbackTimeZones;
  return Array.from(new Set(["UTC", ...zones]))
    .map((zone) => [zone, formatTimeZoneLabel(zone)])
    .sort((a, b) => a[1].localeCompare(b[1]));
}

function zoneOffset(date: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false
  }).formatToParts(date);
  const map = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  const year = Number(map.year);
  const month = Number(map.month);
  const day = Number(map.day);
  const minute = Number(map.minute);
  const second = Number(map.second);
  let hour = Number(map.hour);

  if (![year, month, day, hour, minute, second].every(Number.isFinite)) {
    return 0;
  }

  // Some engines can emit hour "24" for midnight; normalize to next day 00:xx.
  if (hour === 24) {
    const nextDay = new Date(Date.UTC(year, month - 1, day, 0, minute, second));
    return nextDay.getTime() - date.getTime();
  }

  return Date.UTC(year, month - 1, day, hour, minute, second) - date.getTime();
}

function dateTimeInZone(value: string, timeZone: string) {
  const [datePart, timePart = "00:00"] = value.split("T");
  const [year, month, day] = datePart.split("-").map(Number);
  const [hour, minute] = timePart.split(":").map(Number);

  if (![year, month, day, hour, minute].every(Number.isFinite)) {
    return new Date(NaN);
  }

  // Convert "wall time in source zone" -> absolute instant.
  // Two-pass approach handles DST boundaries more reliably.
  const utcGuess = Date.UTC(year, month - 1, day, hour, minute, 0);
  const first = new Date(utcGuess - zoneOffset(new Date(utcGuess), timeZone));
  const refined = new Date(utcGuess - zoneOffset(first, timeZone));
  return refined;
}

function TimeZoneConverter() {
  const now = new Date();
  const localValue = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}T${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
  const timeZones = useMemo(() => getTimeZoneOptions(), []);
  const [from, setFrom] = useState("Australia/Sydney");
  const [to, setTo] = useState("Europe/London");
  const [value, setValue] = useState(localValue);
  const [result, setResult] = useState<{ source: string; target: string } | null>(null);
  const [error, setError] = useState("");
  function convert() {
    setError("");
    const date = dateTimeInZone(value, from);
    if (Number.isNaN(date.getTime())) {
      setResult(null);
      setError("Please enter a valid date and time.");
      return;
    }
    const fmt = (zone: string) => new Intl.DateTimeFormat("en-AU", { timeZone: zone, dateStyle: "full", timeStyle: "short" }).format(date);
    setResult({ source: fmt(from), target: fmt(to) });
  }
  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-3">
        <label className="text-sm font-bold text-slate-700">From <Select className="mt-2" value={from} onChange={(event) => setFrom(event.target.value)}>{timeZones.map(([zone, label]) => <option key={zone} value={zone}>{label}</option>)}</Select></label>
        <label className="text-sm font-bold text-slate-700">To <Select className="mt-2" value={to} onChange={(event) => setTo(event.target.value)}>{timeZones.map(([zone, label]) => <option key={zone} value={zone}>{label}</option>)}</Select></label>
        <label className="text-sm font-bold text-slate-700">Date and time <Input className="mt-2" type="datetime-local" value={value} onChange={(event) => setValue(event.target.value)} /></label>
      </div>
      <div className="mt-4 flex flex-wrap gap-3"><Button onClick={convert}>Convert time</Button><SecondaryButton onClick={() => { setResult(null); setError(""); }}>Reset result</SecondaryButton></div>
      <ErrorMessage message={error} />
      {result ? <div className="mt-5 grid gap-3 sm:grid-cols-2"><ResultBox label="Source time" value={result.source} /><ResultBox label="Converted time" value={result.target} /></div> : null}
    </div>
  );
}

const palworldPals = [
  "Lamball",
  "Cattiva",
  "Chikipi",
  "Foxparks",
  "Pengullet",
  "Lifmunk",
  "Tanzee",
  "Daedream",
  "Eikthyrdeer",
  "Nitewing",
  "Vanwyrm",
  "Anubis"
];

// Gaming tools intentionally use simplified labels and local datasets.
// Avoid importing copyrighted logos/assets; keep visuals generic and UI-native.
const palworldBreedingMap: Record<string, string> = {
  "Cattiva|Lamball": "Chikipi",
  "Foxparks|Lamball": "Lifmunk",
  "Daedream|Foxparks": "Tanzee",
  "Pengullet|Tanzee": "Eikthyrdeer",
  "Nitewing|Pengullet": "Vanwyrm",
  "Anubis|Lifmunk": "Anubis",
  "Anubis|Foxparks": "Anubis",
  "Anubis|Pengullet": "Anubis",
  "Tanzee|Vanwyrm": "Nitewing",
  "Daedream|Nitewing": "Vanwyrm"
};

function palPairKey(a: string, b: string) {
  return [a, b].sort().join("|");
}

function PalworldBreedingCalculator() {
  const [query, setQuery] = useState("");
  const [parentA, setParentA] = useState(palworldPals[0]);
  const [parentB, setParentB] = useState(palworldPals[1]);
  const [target, setTarget] = useState("");

  const filteredPals = useMemo(() => {
    const needle = query.toLowerCase().trim();
    return !needle ? palworldPals : palworldPals.filter((pal) => pal.toLowerCase().includes(needle));
  }, [query]);

  const offspring = palworldBreedingMap[palPairKey(parentA, parentB)] ?? "No direct mapping found for this pair.";
  const reverseMatches = useMemo(() => {
    const needle = target.trim();
    if (!needle) return [];
    return Object.entries(palworldBreedingMap)
      .filter(([, result]) => result.toLowerCase() === needle.toLowerCase())
      .map(([pair, result]) => ({ pair: pair.split("|"), result }));
  }, [target]);

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <label className="block text-sm font-bold text-slate-700">
          Search pals
          <Input className="mt-2" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Type a pal name..." />
        </label>
        <p className="mt-2 text-xs font-semibold text-slate-500">{filteredPals.length} pals matched</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-sm font-bold text-slate-700">
          Parent A
          <Select className="mt-2" value={parentA} onChange={(event) => setParentA(event.target.value)}>
            {filteredPals.map((pal) => <option key={pal} value={pal}>{pal}</option>)}
          </Select>
        </label>
        <label className="text-sm font-bold text-slate-700">
          Parent B
          <Select className="mt-2" value={parentB} onChange={(event) => setParentB(event.target.value)}>
            {filteredPals.map((pal) => <option key={pal} value={pal}>{pal}</option>)}
          </Select>
        </label>
      </div>
      <ResultCard title="Offspring result">
        <p className="text-sm font-semibold text-slate-700">{parentA} + {parentB}</p>
        <p className="mt-2 text-lg font-black text-slate-950">{offspring}</p>
      </ResultCard>
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <label className="text-sm font-bold text-slate-700">
          Reverse breeding lookup
          <Input className="mt-2" value={target} onChange={(event) => setTarget(event.target.value)} placeholder="Enter target offspring (e.g. Anubis)" />
        </label>
        <div className="mt-3 space-y-2">
          {!target.trim() ? <p className="text-sm text-slate-500">Enter an offspring name to find possible parent pairs.</p> : null}
          {target.trim() && !reverseMatches.length ? <p className="text-sm text-slate-500">No mapped parent pairs found for this target.</p> : null}
          {reverseMatches.map((match, index) => (
            <p key={`${match.result}-${index}`} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700">
              {match.pair[0]} + {match.pair[1]} → {match.result}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

const sensitivityToValorant: Record<string, number> = {
  Valorant: 1,
  "CS2 / CSGO": 0.31496,
  "Apex Legends": 0.30287,
  "Overwatch 2": 0.3,
  "Rainbow Six Siege": 0.129,
  Fortnite: 0.123
};

function ValorantSensitivityConverter() {
  const games = Object.keys(sensitivityToValorant);
  const [fromGame, setFromGame] = useState("CS2 / CSGO");
  const [toGame, setToGame] = useState("Valorant");
  const [inputSens, setInputSens] = useState("2.0");
  const [output, setOutput] = useState<number | null>(null);
  const [error, setError] = useState("");

  function convert() {
    setError("");
    const value = Number(inputSens);
    if (!Number.isFinite(value) || value <= 0) {
      setOutput(null);
      setError("Enter a valid sensitivity greater than 0.");
      return;
    }
    const fromFactor = sensitivityToValorant[fromGame];
    const toFactor = sensitivityToValorant[toGame];
    const valorantEquivalent = value * fromFactor;
    const converted = valorantEquivalent / toFactor;
    setOutput(Number(converted.toFixed(6)));
  }

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-3">
        <label className="text-sm font-bold text-slate-700">
          From game
          <Select className="mt-2" value={fromGame} onChange={(event) => setFromGame(event.target.value)}>
            {games.map((game) => <option key={game}>{game}</option>)}
          </Select>
        </label>
        <label className="text-sm font-bold text-slate-700">
          To game
          <Select className="mt-2" value={toGame} onChange={(event) => setToGame(event.target.value)}>
            {games.map((game) => <option key={game}>{game}</option>)}
          </Select>
        </label>
        <label className="text-sm font-bold text-slate-700">
          Sensitivity
          <Input className="mt-2" value={inputSens} onChange={(event) => setInputSens(event.target.value)} placeholder="2.0" />
        </label>
      </div>
      <div className="flex gap-3">
        <Button onClick={convert}>Convert sensitivity</Button>
      </div>
      <ErrorMessage message={error} />
      {output !== null ? <ResultBox label="Converted sensitivity" value={`${output}`} /> : null}
    </div>
  );
}

const minecraftRecipes: Record<string, Record<string, number>> = {
  "Diamond Sword": { Stick: 1, Diamond: 2 },
  "Iron Pickaxe": { Stick: 2, "Iron Ingot": 3 },
  "Torch x4": { Stick: 1, Coal: 1 },
  "Chest": { "Oak Planks": 8 },
  "Golden Apple": { Apple: 1, "Gold Ingot": 8 },
  "Powered Rail x6": { Stick: 1, "Gold Ingot": 6, Redstone: 1 }
};

function MinecraftCraftingCalculator() {
  const recipes = Object.keys(minecraftRecipes);
  const [item, setItem] = useState(recipes[0]);
  const [count, setCount] = useState(1);

  const materials = useMemo(() => {
    const recipe = minecraftRecipes[item] ?? {};
    return Object.entries(recipe).map(([name, qty]) => ({ name, qty: qty * count }));
  }, [item, count]);

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-sm font-bold text-slate-700">
          Craft item
          <Select className="mt-2" value={item} onChange={(event) => setItem(event.target.value)}>
            {recipes.map((name) => <option key={name}>{name}</option>)}
          </Select>
        </label>
        <label className="text-sm font-bold text-slate-700">
          Quantity
          <Input className="mt-2" type="number" min={1} max={999} value={count} onChange={(event) => setCount(Math.max(1, Number(event.target.value) || 1))} />
        </label>
      </div>
      <ResultCard title="Required materials">
        <div className="space-y-2">
          {materials.map((material) => (
            <p key={material.name} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700">
              {material.name}: {material.qty}
            </p>
          ))}
        </div>
      </ResultCard>
    </div>
  );
}

type PokemonType =
  | "Normal" | "Fire" | "Water" | "Electric" | "Grass" | "Ice" | "Fighting" | "Poison" | "Ground"
  | "Flying" | "Psychic" | "Bug" | "Rock" | "Ghost" | "Dragon" | "Dark" | "Steel" | "Fairy";

const pokemonTypes: PokemonType[] = ["Normal", "Fire", "Water", "Electric", "Grass", "Ice", "Fighting", "Poison", "Ground", "Flying", "Psychic", "Bug", "Rock", "Ghost", "Dragon", "Dark", "Steel", "Fairy"];
const pokemonChart: Record<PokemonType, Partial<Record<PokemonType, number>>> = {
  Normal: { Rock: 0.5, Ghost: 0, Steel: 0.5 },
  Fire: { Fire: 0.5, Water: 0.5, Grass: 2, Ice: 2, Bug: 2, Rock: 0.5, Dragon: 0.5, Steel: 2 },
  Water: { Fire: 2, Water: 0.5, Grass: 0.5, Ground: 2, Rock: 2, Dragon: 0.5 },
  Electric: { Water: 2, Electric: 0.5, Grass: 0.5, Ground: 0, Flying: 2, Dragon: 0.5 },
  Grass: { Fire: 0.5, Water: 2, Grass: 0.5, Poison: 0.5, Ground: 2, Flying: 0.5, Bug: 0.5, Rock: 2, Dragon: 0.5, Steel: 0.5 },
  Ice: { Fire: 0.5, Water: 0.5, Grass: 2, Ground: 2, Flying: 2, Dragon: 2, Steel: 0.5 },
  Fighting: { Normal: 2, Ice: 2, Poison: 0.5, Flying: 0.5, Psychic: 0.5, Bug: 0.5, Rock: 2, Ghost: 0, Dark: 2, Steel: 2, Fairy: 0.5 },
  Poison: { Grass: 2, Poison: 0.5, Ground: 0.5, Rock: 0.5, Ghost: 0.5, Steel: 0, Fairy: 2 },
  Ground: { Fire: 2, Electric: 2, Grass: 0.5, Poison: 2, Flying: 0, Bug: 0.5, Rock: 2, Steel: 2 },
  Flying: { Electric: 0.5, Grass: 2, Fighting: 2, Bug: 2, Rock: 0.5, Steel: 0.5 },
  Psychic: { Fighting: 2, Poison: 2, Psychic: 0.5, Dark: 0, Steel: 0.5 },
  Bug: { Fire: 0.5, Grass: 2, Fighting: 0.5, Poison: 0.5, Flying: 0.5, Psychic: 2, Ghost: 0.5, Dark: 2, Steel: 0.5, Fairy: 0.5 },
  Rock: { Fire: 2, Ice: 2, Fighting: 0.5, Ground: 0.5, Flying: 2, Bug: 2, Steel: 0.5 },
  Ghost: { Normal: 0, Psychic: 2, Ghost: 2, Dark: 0.5 },
  Dragon: { Dragon: 2, Steel: 0.5, Fairy: 0 },
  Dark: { Fighting: 0.5, Psychic: 2, Ghost: 2, Dark: 0.5, Fairy: 0.5 },
  Steel: { Fire: 0.5, Water: 0.5, Electric: 0.5, Ice: 2, Rock: 2, Steel: 0.5, Fairy: 2 },
  Fairy: { Fire: 0.5, Fighting: 2, Poison: 0.5, Dragon: 2, Dark: 2, Steel: 0.5 }
};

function PokemonTypeCalculator() {
  const [attack, setAttack] = useState<PokemonType>("Fire");
  const [defPrimary, setDefPrimary] = useState<PokemonType>("Grass");
  const [defSecondary, setDefSecondary] = useState<"None" | PokemonType>("None");

  const multiplier = useMemo(() => {
    const againstPrimary = pokemonChart[attack][defPrimary] ?? 1;
    const againstSecondary = defSecondary === "None" ? 1 : pokemonChart[attack][defSecondary] ?? 1;
    return againstPrimary * againstSecondary;
  }, [attack, defPrimary, defSecondary]);

  const label = multiplier === 0 ? "No effect" : multiplier >= 4 ? "Extremely effective" : multiplier > 1 ? "Super effective" : multiplier < 1 ? "Not very effective" : "Neutral";

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-3">
        <label className="text-sm font-bold text-slate-700">
          Attack type
          <Select className="mt-2" value={attack} onChange={(event) => setAttack(event.target.value as PokemonType)}>
            {pokemonTypes.map((type) => <option key={type}>{type}</option>)}
          </Select>
        </label>
        <label className="text-sm font-bold text-slate-700">
          Defender primary
          <Select className="mt-2" value={defPrimary} onChange={(event) => setDefPrimary(event.target.value as PokemonType)}>
            {pokemonTypes.map((type) => <option key={type}>{type}</option>)}
          </Select>
        </label>
        <label className="text-sm font-bold text-slate-700">
          Defender secondary
          <Select className="mt-2" value={defSecondary} onChange={(event) => setDefSecondary(event.target.value as "None" | PokemonType)}>
            <option value="None">None</option>
            {pokemonTypes.map((type) => <option key={type}>{type}</option>)}
          </Select>
        </label>
      </div>
      <ResultCard title="Type effectiveness">
        <p className="text-sm font-semibold text-slate-700">{attack} vs {defPrimary}{defSecondary !== "None" ? ` / ${defSecondary}` : ""}</p>
        <p className="mt-2 text-2xl font-black text-slate-950">{multiplier}x</p>
        <p className="mt-1 text-sm font-semibold text-slate-600">{label}</p>
      </ResultCard>
    </div>
  );
}

function stylize(value: string, offsetUpper: number, offsetLower: number) {
  return Array.from(value, (char) => {
    const code = char.charCodeAt(0);
    if (code >= 65 && code <= 90) return String.fromCodePoint(offsetUpper + code - 65);
    if (code >= 97 && code <= 122) return String.fromCodePoint(offsetLower + code - 97);
    return char;
  }).join("");
}

function TextFormatter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const format = (mode: string) => setOutput(mode === "bold" ? stylize(input, 0x1d400, 0x1d41a) : mode === "italic" ? stylize(input, 0x1d434, 0x1d44e) : mode === "upper" ? input.toUpperCase() : mode === "lower" ? input.toLowerCase() : mode === "title" ? toTitleCase(input) : input.replace(/\s*\n\s*/g, " "));
  return (
    <div>
      <Textarea value={input} onChange={(event) => setInput(event.target.value)} placeholder="Paste text to format..." />
      <div className="mt-4 flex flex-wrap gap-3"><Button onClick={() => format("bold")} disabled={!input}>Bold unicode</Button><SecondaryButton onClick={() => format("italic")} disabled={!input}>Italic unicode</SecondaryButton><SecondaryButton onClick={() => format("upper")} disabled={!input}>Uppercase</SecondaryButton><SecondaryButton onClick={() => format("lower")} disabled={!input}>Lowercase</SecondaryButton><SecondaryButton onClick={() => format("title")} disabled={!input}>Title case</SecondaryButton><SecondaryButton onClick={() => format("lines")} disabled={!input}>Remove line breaks</SecondaryButton></div>
      <Textarea className="mt-5" value={output} onChange={(event) => setOutput(event.target.value)} placeholder="Formatted output appears here..." />
      <div className="mt-4 flex flex-wrap gap-3"><CopyAction value={output} /><SecondaryButton onClick={() => { setInput(""); setOutput(""); }}>Reset</SecondaryButton></div>
    </div>
  );
}

function DuplicateLineRemover() {
  const [input, setInput] = useState("");
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [output, setOutput] = useState("");
  function remove() {
    const seen = new Set<string>();
    const result = input.split(/\r?\n/).filter((line) => {
      const key = caseSensitive ? line : line.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
    setOutput(result.join("\n"));
  }
  const before = input ? input.split(/\r?\n/).length : 0;
  const after = output ? output.split(/\r?\n/).length : 0;
  return (
    <div>
      <Textarea value={input} onChange={(event) => setInput(event.target.value)} placeholder="Paste one item per line..." />
      <label className="mt-4 flex items-center gap-2 text-sm font-bold text-slate-700"><input type="checkbox" checked={caseSensitive} onChange={(event) => setCaseSensitive(event.target.checked)} /> Case-sensitive matching</label>
      <div className="mt-4 flex flex-wrap gap-3"><Button onClick={remove} disabled={!input}>Remove duplicates</Button><CopyAction value={output} /><SecondaryButton onClick={() => { setInput(""); setOutput(""); }}>Reset</SecondaryButton></div>
      <div className="mt-5 grid gap-3 sm:grid-cols-2"><ResultBox label="Before lines" value={before} /><ResultBox label="After lines" value={after} /></div>
      <Textarea className="mt-5" value={output} onChange={(event) => setOutput(event.target.value)} placeholder="Cleaned lines appear here..." />
    </div>
  );
}

const loremWords = "lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua facilisis gravida neque convallis a cras semper auctor neque vitae tempus quam pellentesque nec nam aliquam sem et tortor consequat".split(" ");

function RandomTextGenerator() {
  const [type, setType] = useState("paragraphs");
  const [count, setCount] = useState(3);
  const [output, setOutput] = useState("");
  const sentence = (words = 12) => `${Array.from({ length: words }, (_, i) => loremWords[(i + Math.floor(Math.random() * loremWords.length)) % loremWords.length]).join(" ").replace(/^./, (char) => char.toUpperCase())}.`;
  function generate() {
    const amount = Math.min(100, Math.max(1, count));
    if (type === "words") setOutput(Array.from({ length: amount }, (_, i) => loremWords[i % loremWords.length]).join(" "));
    else if (type === "sentences") setOutput(Array.from({ length: amount }, () => sentence(10 + Math.floor(Math.random() * 10))).join(" "));
    else setOutput(Array.from({ length: amount }, () => Array.from({ length: 4 }, () => sentence(10 + Math.floor(Math.random() * 10))).join(" ")).join("\n\n"));
  }
  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2"><label className="text-sm font-bold text-slate-700">Output type <Select className="mt-2" value={type} onChange={(event) => setType(event.target.value)}><option value="words">Words</option><option value="sentences">Sentences</option><option value="paragraphs">Paragraphs</option></Select></label><label className="text-sm font-bold text-slate-700">Amount <Input className="mt-2" type="number" min={1} max={100} value={count} onChange={(event) => setCount(Number(event.target.value))} /></label></div>
      <div className="mt-4 flex flex-wrap gap-3"><Button onClick={generate}>Generate text</Button><CopyAction value={output} /><SecondaryButton onClick={() => setOutput("")}>Reset</SecondaryButton></div>
      <Textarea className="mt-5" value={output} onChange={(event) => setOutput(event.target.value)} placeholder="Random text appears here..." />
    </div>
  );
}

function TextSorter() {
  const [input, setInput] = useState("");
  const [direction, setDirection] = useState("az");
  const [dedupe, setDedupe] = useState(false);
  const [output, setOutput] = useState("");
  function sort() {
    let lines = input.split(/\r?\n/).filter(Boolean);
    if (dedupe) lines = Array.from(new Set(lines));
    lines.sort((a, b) => direction === "az" ? a.localeCompare(b) : b.localeCompare(a));
    setOutput(lines.join("\n"));
  }
  return (
    <div>
      <Textarea value={input} onChange={(event) => setInput(event.target.value)} placeholder="Paste one item per line..." />
      <div className="mt-4 grid gap-4 sm:grid-cols-2"><label className="text-sm font-bold text-slate-700">Sort direction <Select className="mt-2" value={direction} onChange={(event) => setDirection(event.target.value)}><option value="az">A-Z</option><option value="za">Z-A</option></Select></label><label className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm font-bold text-slate-700"><input type="checkbox" checked={dedupe} onChange={(event) => setDedupe(event.target.checked)} /> Remove duplicates</label></div>
      <div className="mt-4 flex flex-wrap gap-3"><Button onClick={sort} disabled={!input}>Sort lines</Button><CopyAction value={output} /><SecondaryButton onClick={() => { setInput(""); setOutput(""); }}>Reset</SecondaryButton></div>
      <Textarea className="mt-5" value={output} onChange={(event) => setOutput(event.target.value)} placeholder="Sorted output appears here..." />
    </div>
  );
}

function RemoveExtraSpaces() {
  const [input, setInput] = useState("");
  const [removeBlank, setRemoveBlank] = useState(true);
  const [output, setOutput] = useState("");
  function clean() {
    const lines = input.split(/\r?\n/).map((line) => line.replace(/[ \t]+/g, " ").trim());
    setOutput((removeBlank ? lines.filter(Boolean) : lines).join("\n"));
  }
  return (
    <div>
      <Textarea value={input} onChange={(event) => setInput(event.target.value)} placeholder="Paste messy text..." />
      <label className="mt-4 flex items-center gap-2 text-sm font-bold text-slate-700"><input type="checkbox" checked={removeBlank} onChange={(event) => setRemoveBlank(event.target.checked)} /> Remove blank lines</label>
      <div className="mt-4 flex flex-wrap gap-3"><Button onClick={clean} disabled={!input}>Clean spaces</Button><CopyAction value={output} /><SecondaryButton onClick={() => { setInput(""); setOutput(""); }}>Reset</SecondaryButton></div>
      <Textarea className="mt-5" value={output} onChange={(event) => setOutput(event.target.value)} placeholder="Cleaned text appears here..." />
    </div>
  );
}

function ImageCropper() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [natural, setNatural] = useState({ width: 0, height: 0 });
  const [crop, setCrop] = useState({ x: 0, y: 0, width: 400, height: 400 });
  const [ratio, setRatio] = useState("free");
  const [output, setOutput] = useState<Output | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  useObjectUrlCleanup(output);

  function centeredCrop(imageWidth: number, imageHeight: number, nextRatio: string) {
    if (nextRatio === "free") return { x: 0, y: 0, width: imageWidth, height: imageHeight };
    const [ratioWidth, ratioHeight] = nextRatio.split(":").map(Number);
    const target = ratioWidth / ratioHeight;
    const imageRatio = imageWidth / imageHeight;
    const width = imageRatio > target ? Math.round(imageHeight * target) : imageWidth;
    const height = imageRatio > target ? imageHeight : Math.round(imageWidth / target);
    return {
      x: Math.max(0, Math.round((imageWidth - width) / 2)),
      y: Math.max(0, Math.round((imageHeight - height) / 2)),
      width,
      height
    };
  }

  async function load(files: File[]) {
    const next = files[0] ?? null;
    setFile(next);
    setOutput(null);
    setError("");
    if (preview) URL.revokeObjectURL(preview);
    if (!next) return;
    const image = await fileToImage(next);
    setNatural({ width: image.naturalWidth, height: image.naturalHeight });
    setRatio("free");
    setCrop(centeredCrop(image.naturalWidth, image.naturalHeight, "free"));
    setPreview(URL.createObjectURL(next));
  }

  function applyRatio(nextRatio: string) {
    setRatio(nextRatio);
    if (!natural.width || !natural.height) return;
    setCrop(centeredCrop(natural.width, natural.height, nextRatio));
    setOutput(null);
  }

  function updateCrop(next: Partial<typeof crop>) {
    const merged = { ...crop, ...next };
    if (ratio !== "free" && "width" in next) {
      const [w, h] = ratio.split(":").map(Number);
      merged.height = Math.round((merged.width * h) / w);
    }
    if (ratio !== "free" && "height" in next) {
      const [w, h] = ratio.split(":").map(Number);
      merged.width = Math.round((merged.height * w) / h);
    }
    const width = Math.max(1, Math.min(Math.round(merged.width), natural.width || merged.width));
    const height = Math.max(1, Math.min(Math.round(merged.height), natural.height || merged.height));
    const x = Math.max(0, Math.min(Math.round(merged.x), Math.max(0, (natural.width || width) - width)));
    const y = Math.max(0, Math.min(Math.round(merged.y), Math.max(0, (natural.height || height) - height)));
    setCrop({ x, y, width, height });
    setOutput(null);
  }

  async function cropImage() {
    if (!file) return;
    setBusy(true);
    setError("");
    try {
      const image = await fileToImage(file);
      const sx = Math.max(0, Math.min(crop.x, image.naturalWidth - 1));
      const sy = Math.max(0, Math.min(crop.y, image.naturalHeight - 1));
      const sw = Math.max(1, Math.min(crop.width, image.naturalWidth - sx));
      const sh = Math.max(1, Math.min(crop.height, image.naturalHeight - sy));
      const canvas = document.createElement("canvas");
      canvas.width = sw;
      canvas.height = sh;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas is not supported in this browser.");
      ctx.drawImage(image, sx, sy, sw, sh, 0, 0, sw, sh);
      const blob = await canvasToBlob(canvas, file.type || "image/png", 0.9);
      setOutput(downloadBlob(blob, `cropped-${file.name}`));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to crop image.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <FileUploadDropzone label="Upload an image" accept="image/jpeg,image/png,image/webp" onFiles={load} />
      <FileInfo file={file} />
      {preview ? <img className="mt-5 max-h-80 w-full rounded-2xl border border-slate-200 bg-slate-50 object-contain p-2" src={preview} alt="Image preview" /> : null}
      {file ? (
        <>
          <div className="mt-5 grid gap-2 sm:grid-cols-4">{[["free", "Free"], ["1:1", "1:1"], ["16:9", "16:9"], ["4:3", "4:3"]].map(([value, label]) => <button key={value} className={`rounded-2xl border px-4 py-3 text-sm font-black ${ratio === value ? "border-brand-200 bg-brand-50 text-brand-700" : "border-slate-200 bg-white text-slate-700"}`} onClick={() => applyRatio(value)}>{label}</button>)}</div>
          <p className="mt-4 text-sm font-bold text-slate-600">Image size: {natural.width} × {natural.height}px</p>
          <p className="mt-2 rounded-2xl border border-brand-100 bg-brand-50 px-4 py-3 text-sm font-bold text-brand-700">
            Current crop: {crop.width} × {crop.height}px from X {crop.x}, Y {crop.y}. Aspect buttons center the largest matching crop inside your image.
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-4">
            {(["x", "y", "width", "height"] as const).map((key) => <label key={key} className="text-sm font-bold capitalize text-slate-700">{key}<Input className="mt-2" type="number" min={0} value={crop[key]} onChange={(event) => updateCrop({ [key]: Number(event.target.value) })} /></label>)}
          </div>
          <div className="mt-4 flex flex-wrap gap-3"><Button onClick={cropImage} disabled={busy}>{busy ? "Cropping..." : "Crop image"}</Button><SecondaryButton onClick={() => { setFile(null); setPreview(""); setOutput(null); setError(""); }}>Reset</SecondaryButton></div>
        </>
      ) : null}
      <ErrorMessage message={error} />
      <Download output={output} />
    </div>
  );
}

function ImageToBase64() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  function load(files: File[]) {
    const next = files[0] ?? null;
    setFile(next);
    setOutput("");
    setError("");
    if (preview) URL.revokeObjectURL(preview);
    if (!next) return;
    setPreview(URL.createObjectURL(next));
    const reader = new FileReader();
    reader.onload = () => setOutput(String(reader.result ?? ""));
    reader.onerror = () => setError("Unable to read this image file.");
    reader.readAsDataURL(next);
  }
  return (
    <div>
      <FileUploadDropzone label="Upload an image" accept="image/jpeg,image/png,image/webp,image/gif" onFiles={load} />
      <FileInfo file={file} />
      {preview ? <img className="mt-5 max-h-72 w-full rounded-2xl border border-slate-200 bg-slate-50 object-contain p-2" src={preview} alt="Uploaded preview" /> : null}
      <div className="mt-4 flex flex-wrap gap-3"><CopyAction value={output} label="Copy Base64" /><SecondaryButton onClick={() => { setFile(null); setPreview(""); setOutput(""); setError(""); }}>Reset</SecondaryButton></div>
      <Textarea className="mt-5 min-h-48 font-mono" value={output} onChange={(event) => setOutput(event.target.value)} placeholder="Base64 data URL appears here..." />
      <ErrorMessage message={error} />
    </div>
  );
}

function FinalGradeCalculator() {
  const [current, setCurrent] = useState(82);
  const [target, setTarget] = useState(90);
  const [finalWeight, setFinalWeight] = useState(30);
  const currentWeight = 100 - finalWeight;
  const needed = finalWeight ? (target - (current * currentWeight / 100)) / (finalWeight / 100) : 0;
  const status = needed <= 0 ? "You have already reached this target based on these inputs." : needed > 100 ? "This target likely needs extra credit or a higher current grade." : "This target is mathematically reachable.";
  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-3">
        <label className="text-sm font-bold text-slate-700">Current grade % <Input className="mt-2" type="number" value={current} onChange={(event) => setCurrent(Number(event.target.value))} /></label>
        <label className="text-sm font-bold text-slate-700">Target grade % <Input className="mt-2" type="number" value={target} onChange={(event) => setTarget(Number(event.target.value))} /></label>
        <label className="text-sm font-bold text-slate-700">Final exam weight % <Input className="mt-2" type="number" min={1} max={100} value={finalWeight} onChange={(event) => setFinalWeight(Number(event.target.value))} /></label>
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <ResultBox label="Needed on final" value={`${Number.isFinite(needed) ? needed.toFixed(2) : "0.00"}%`} />
        <ResultBox label="Current coursework weight" value={`${currentWeight}%`} />
      </div>
      <p className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm font-bold leading-6 text-slate-700">{status}</p>
    </div>
  );
}

function WeightedGradeCalculator() {
  const [rows, setRows] = useState([{ name: "Assignments", score: 88, weight: 40 }, { name: "Exam", score: 76, weight: 60 }]);
  const weightTotal = rows.reduce((sum, row) => sum + Number(row.weight || 0), 0);
  const weighted = rows.reduce((sum, row) => sum + Number(row.score || 0) * Number(row.weight || 0), 0);
  const result = weightTotal ? weighted / weightTotal : 0;
  return (
    <div>
      <div className="grid gap-3">
        {rows.map((row, index) => (
          <div key={index} className="grid gap-3 rounded-2xl bg-slate-50 p-3 md:grid-cols-[1fr_130px_130px_auto]">
            <Input placeholder="Category or assessment" value={row.name} onChange={(event) => setRows(rows.map((item, i) => i === index ? { ...item, name: event.target.value } : item))} />
            <Input type="number" value={row.score} onChange={(event) => setRows(rows.map((item, i) => i === index ? { ...item, score: Number(event.target.value) } : item))} placeholder="Score %" />
            <Input type="number" value={row.weight} onChange={(event) => setRows(rows.map((item, i) => i === index ? { ...item, weight: Number(event.target.value) } : item))} placeholder="Weight %" />
            <SecondaryButton onClick={() => setRows(rows.filter((_, i) => i !== index))}>Remove</SecondaryButton>
          </div>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap gap-3">
        <SecondaryButton onClick={() => setRows([...rows, { name: "", score: 100, weight: 0 }])}>Add row</SecondaryButton>
        <SecondaryButton onClick={() => setRows([{ name: "Assignments", score: 88, weight: 40 }, { name: "Exam", score: 76, weight: 60 }])}>Reset</SecondaryButton>
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <ResultBox label="Weighted grade" value={`${result.toFixed(2)}%`} />
        <ResultBox label="Weight total" value={`${weightTotal}%`} />
      </div>
    </div>
  );
}

function AttendanceCalculator() {
  const [held, setHeld] = useState(40);
  const [attended, setAttended] = useState(34);
  const [required, setRequired] = useState(75);
  const percentage = held ? (attended / held) * 100 : 0;
  const canMiss = useMemo(() => {
    let missed = 0;
    while (held + missed + 1 > 0 && (attended / (held + missed + 1)) * 100 >= required && missed < 1000) missed += 1;
    return missed;
  }, [attended, held, required]);
  const needAttend = useMemo(() => {
    let extra = 0;
    while (((attended + extra) / (held + extra || 1)) * 100 < required && extra < 1000) extra += 1;
    return extra;
  }, [attended, held, required]);
  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-3">
        <label className="text-sm font-bold text-slate-700">Classes held <Input className="mt-2" type="number" min={0} value={held} onChange={(event) => setHeld(Number(event.target.value))} /></label>
        <label className="text-sm font-bold text-slate-700">Classes attended <Input className="mt-2" type="number" min={0} value={attended} onChange={(event) => setAttended(Number(event.target.value))} /></label>
        <label className="text-sm font-bold text-slate-700">Required attendance % <Input className="mt-2" type="number" min={1} max={100} value={required} onChange={(event) => setRequired(Number(event.target.value))} /></label>
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <ResultBox label="Current attendance" value={`${percentage.toFixed(2)}%`} />
        <ResultBox label="Can miss" value={percentage >= required ? `${canMiss} classes` : "0 classes"} />
        <ResultBox label="Need to attend" value={percentage >= required ? "Target met" : `${needAttend} classes`} />
      </div>
      {attended > held ? <ErrorMessage message="Classes attended cannot be greater than classes held." /> : null}
    </div>
  );
}

function InterestCalculator() {
  const [principal, setPrincipal] = useState(1000);
  const [rate, setRate] = useState(5);
  const [years, setYears] = useState(3);
  const [frequency, setFrequency] = useState(12);
  const simpleInterest = principal * (rate / 100) * years;
  const simpleAmount = principal + simpleInterest;
  const compoundAmount = principal * ((1 + (rate / 100) / frequency) ** (frequency * years));
  const compoundInterest = compoundAmount - principal;
  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-sm font-bold text-slate-700">Principal <Input className="mt-2" type="number" value={principal} onChange={(event) => setPrincipal(Number(event.target.value))} /></label>
        <label className="text-sm font-bold text-slate-700">Annual rate % <Input className="mt-2" type="number" step={0.01} value={rate} onChange={(event) => setRate(Number(event.target.value))} /></label>
        <label className="text-sm font-bold text-slate-700">Time in years <Input className="mt-2" type="number" step={0.1} value={years} onChange={(event) => setYears(Number(event.target.value))} /></label>
        <label className="text-sm font-bold text-slate-700">Compound frequency <Select className="mt-2" value={frequency} onChange={(event) => setFrequency(Number(event.target.value))}><option value={1}>Yearly</option><option value={2}>Half-yearly</option><option value={4}>Quarterly</option><option value={12}>Monthly</option><option value={365}>Daily</option></Select></label>
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <ResultBox label="Simple interest" value={`$${simpleInterest.toFixed(2)}`} />
        <ResultBox label="Simple amount" value={`$${simpleAmount.toFixed(2)}`} />
        <ResultBox label="Compound interest" value={`$${compoundInterest.toFixed(2)}`} />
        <ResultBox label="Compound amount" value={`$${compoundAmount.toFixed(2)}`} />
      </div>
    </div>
  );
}

function GpaToPercentageConverter() {
  const [scale, setScale] = useState("10-india");
  const [gpa, setGpa] = useState(8.2);
  const percentage = scale === "10-india" ? gpa * 9.5 : scale === "10-direct" ? gpa * 10 : (gpa / 4) * 100;
  const max = scale === "4-direct" ? 4 : 10;
  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-sm font-bold text-slate-700">Formula <Select className="mt-2" value={scale} onChange={(event) => setScale(event.target.value)}><option value="10-india">10 point CGPA × 9.5</option><option value="10-direct">10 point GPA × 10</option><option value="4-direct">4.0 GPA ÷ 4 × 100</option></Select></label>
        <label className="text-sm font-bold text-slate-700">GPA / CGPA <Input className="mt-2" type="number" min={0} max={max} step={0.01} value={gpa} onChange={(event) => setGpa(Number(event.target.value))} /></label>
      </div>
      <div className="mt-5"><ResultBox label="Estimated percentage" value={`${percentage.toFixed(2)}%`} /></div>
      <p className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm font-bold leading-6 text-amber-800">Use this as an estimate only. Schools, universities, and application portals may require their own official conversion formula.</p>
    </div>
  );
}

function imageOutputName(file: File, prefix: string, type?: string) {
  const ext = type === "image/png" ? "png" : type === "image/webp" ? "webp" : "jpg";
  return `${prefix}-${file.name.replace(/\.[^.]+$/, "")}.${ext}`;
}

function AdvancedImageConverter({ mode }: { mode: "rotate" | "convert" | "watermark" | "grayscale" }) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [output, setOutput] = useState<Output | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [rotation, setRotation] = useState("90");
  const [flip, setFlip] = useState("none");
  const [format, setFormat] = useState("image/webp");
  const [quality, setQuality] = useState(0.85);
  const [watermark, setWatermark] = useState("FreeToolKit");
  const [position, setPosition] = useState("bottom-right");
  const [opacity, setOpacity] = useState(0.65);
  const [fontSize, setFontSize] = useState(42);
  useObjectUrlCleanup(output);

  function setImage(files: File[]) {
    const next = files[0] ?? null;
    setFile(next);
    setOutput(null);
    setError("");
    if (preview) URL.revokeObjectURL(preview);
    setPreview(next ? URL.createObjectURL(next) : "");
  }

  async function run() {
    if (!file) return;
    setBusy(true);
    setError("");
    try {
      const image = await fileToImage(file);
      const angle = mode === "rotate" ? Number(rotation) : 0;
      const swap = angle === 90 || angle === 270;
      const canvas = document.createElement("canvas");
      canvas.width = swap ? image.naturalHeight : image.naturalWidth;
      canvas.height = swap ? image.naturalWidth : image.naturalHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas is not supported in this browser.");
      if (mode === "convert" && format === "image/jpeg") {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      if (mode === "rotate") {
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((angle * Math.PI) / 180);
        const scaleX = flip === "horizontal" ? -1 : 1;
        const scaleY = flip === "vertical" ? -1 : 1;
        ctx.scale(scaleX, scaleY);
        ctx.drawImage(image, -image.naturalWidth / 2, -image.naturalHeight / 2);
      } else {
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
      }
      if (mode === "grayscale") {
        const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
        for (let index = 0; index < data.data.length; index += 4) {
          const gray = Math.round(data.data[index] * 0.299 + data.data[index + 1] * 0.587 + data.data[index + 2] * 0.114);
          data.data[index] = gray;
          data.data[index + 1] = gray;
          data.data[index + 2] = gray;
        }
        ctx.putImageData(data, 0, 0);
      }
      if (mode === "watermark") {
        ctx.globalAlpha = opacity;
        ctx.fillStyle = "#ffffff";
        ctx.strokeStyle = "rgba(15, 23, 42, 0.55)";
        ctx.lineWidth = Math.max(2, Math.round(fontSize / 12));
        ctx.font = `700 ${fontSize}px Arial, sans-serif`;
        const metrics = ctx.measureText(watermark || "Watermark");
        const padding = Math.max(20, Math.round(fontSize * 0.65));
        const x = position === "center" ? (canvas.width - metrics.width) / 2 : position === "top-left" ? padding : canvas.width - metrics.width - padding;
        const y = position === "center" ? canvas.height / 2 : position === "top-left" ? padding + fontSize : canvas.height - padding;
        ctx.strokeText(watermark || "Watermark", x, y);
        ctx.fillText(watermark || "Watermark", x, y);
        ctx.globalAlpha = 1;
      }
      const type = mode === "convert" ? format : file.type || "image/png";
      const blob = await canvasToBlob(canvas, type, quality);
      setOutput(downloadBlob(blob, imageOutputName(file, mode === "rotate" ? "transformed" : mode === "watermark" ? "watermarked" : mode === "grayscale" ? "grayscale" : "converted", type)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Image processing failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <FileUploadDropzone label="Upload an image" accept="image/jpeg,image/png,image/webp" onFiles={setImage} />
      <FileInfo file={file} />
      {preview ? <img className="mt-5 max-h-80 w-full rounded-2xl border border-slate-200 bg-slate-50 object-contain p-2" src={preview} alt="Preview" /> : null}
      {file && mode === "rotate" ? <div className="mt-5 grid gap-4 sm:grid-cols-2"><label className="text-sm font-bold text-slate-700">Rotate <Select className="mt-2" value={rotation} onChange={(event) => setRotation(event.target.value)}><option value="90">90 degrees</option><option value="180">180 degrees</option><option value="270">270 degrees</option></Select></label><label className="text-sm font-bold text-slate-700">Flip <Select className="mt-2" value={flip} onChange={(event) => setFlip(event.target.value)}><option value="none">No flip</option><option value="horizontal">Flip horizontal</option><option value="vertical">Flip vertical</option></Select></label></div> : null}
      {file && mode === "convert" ? <div className="mt-5 grid gap-4 sm:grid-cols-2"><label className="text-sm font-bold text-slate-700">Output format <Select className="mt-2" value={format} onChange={(event) => setFormat(event.target.value)}><option value="image/jpeg">JPG</option><option value="image/png">PNG</option><option value="image/webp">WebP</option></Select></label><label className="text-sm font-bold text-slate-700">Quality: {quality.toFixed(2)}<input className="mt-3 w-full accent-brand-600" type="range" min="0.1" max="1" step="0.05" value={quality} onChange={(event) => setQuality(Number(event.target.value))} /></label></div> : null}
      {file && mode === "watermark" ? <div className="mt-5 grid gap-4 sm:grid-cols-2"><label className="text-sm font-bold text-slate-700">Watermark text <Input className="mt-2" value={watermark} onChange={(event) => setWatermark(event.target.value)} /></label><label className="text-sm font-bold text-slate-700">Position <Select className="mt-2" value={position} onChange={(event) => setPosition(event.target.value)}><option value="top-left">Top-left</option><option value="center">Center</option><option value="bottom-right">Bottom-right</option></Select></label><label className="text-sm font-bold text-slate-700">Opacity: {opacity.toFixed(2)}<input className="mt-3 w-full accent-brand-600" type="range" min="0.1" max="1" step="0.05" value={opacity} onChange={(event) => setOpacity(Number(event.target.value))} /></label><label className="text-sm font-bold text-slate-700">Font size <Input className="mt-2" type="number" min={12} value={fontSize} onChange={(event) => setFontSize(Number(event.target.value))} /></label></div> : null}
      <div className="mt-4 flex flex-wrap gap-3"><Button onClick={run} disabled={!file || busy}>{busy ? "Working..." : mode === "rotate" ? "Apply transform" : mode === "watermark" ? "Add watermark" : mode === "grayscale" ? "Convert to grayscale" : "Convert image"}</Button><SecondaryButton onClick={() => { setImage([]); setOutput(null); }}>Reset</SecondaryButton></div>
      <ErrorMessage message={error} />
      <Download output={output} />
      {output ? <img className="mt-5 max-h-80 w-full rounded-2xl border border-emerald-200 bg-emerald-50 object-contain p-2" src={output.url} alt="Result preview" /> : null}
    </div>
  );
}

async function inspectImage(file: File) {
  const image = await fileToImage(file);
  const buffer = await file.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  const details: Array<[string, string]> = [
    ["File name", file.name],
    ["File size", formatBytes(file.size)],
    ["File type", file.type || "Unknown"],
    ["Dimensions", `${image.naturalWidth} × ${image.naturalHeight}px`],
    ["Last modified", new Date(file.lastModified).toLocaleString()]
  ];
  const readAscii = (start: number, end: number) => {
    let value = "";
    for (let index = start; index < end; index += 1) value += String.fromCharCode(bytes[index]);
    return value;
  };
  let dpi = "Not available";
  if (bytes[0] === 0xff && bytes[1] === 0xd8) {
    for (let offset = 2; offset < bytes.length - 10;) {
      if (bytes[offset] !== 0xff) break;
      const marker = bytes[offset + 1];
      const length = (bytes[offset + 2] << 8) + bytes[offset + 3];
      if (marker === 0xe0 && readAscii(offset + 4, offset + 9) === "JFIF\0") {
        const unit = bytes[offset + 11];
        const x = (bytes[offset + 12] << 8) + bytes[offset + 13];
        const y = (bytes[offset + 14] << 8) + bytes[offset + 15];
        dpi = unit === 1 ? `${x} × ${y} DPI` : unit === 2 ? `${Math.round(x * 2.54)} × ${Math.round(y * 2.54)} DPI` : "Density stored without unit";
        details.push(["JPEG density", dpi]);
        break;
      }
      offset += 2 + length;
    }
  }
  if (bytes[0] === 0x89 && bytes[1] === 0x50) {
    for (let offset = 8; offset < bytes.length - 16;) {
      const length = (bytes[offset] << 24) + (bytes[offset + 1] << 16) + (bytes[offset + 2] << 8) + bytes[offset + 3];
      const type = readAscii(offset + 4, offset + 8);
      if (type === "pHYs") {
        const x = ((bytes[offset + 8] << 24) + (bytes[offset + 9] << 16) + (bytes[offset + 10] << 8) + bytes[offset + 11]) >>> 0;
        const y = ((bytes[offset + 12] << 24) + (bytes[offset + 13] << 16) + (bytes[offset + 14] << 8) + bytes[offset + 15]) >>> 0;
        dpi = bytes[offset + 16] === 1 ? `${Math.round(x * 0.0254)} × ${Math.round(y * 0.0254)} DPI` : "Pixel density stored without meter unit";
        details.push(["PNG density", dpi]);
        break;
      }
      offset += 12 + length;
    }
  }
  details.push(["DPI", dpi]);
  return { details, dpi, width: image.naturalWidth, height: image.naturalHeight };
}

function ImageMetadataTool({ dpiOnly = false }: { dpiOnly?: boolean }) {
  const [file, setFile] = useState<File | null>(null);
  const [details, setDetails] = useState<Array<[string, string]>>([]);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function load(files: File[]) {
    const next = files[0] ?? null;
    setFile(next);
    setDetails([]);
    setError("");
    if (!next) return;
    setBusy(true);
    try {
      const info = await inspectImage(next);
      setDetails(dpiOnly ? info.details.filter(([key]) => ["File name", "File size", "File type", "Dimensions", "DPI", "JPEG density", "PNG density"].includes(key)) : info.details);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to inspect this image.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <div>
      <FileUploadDropzone label="Upload an image" accept="image/jpeg,image/png,image/webp" onFiles={load} />
      <FileInfo file={file} />
      {busy ? <p className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm font-bold text-slate-600">Reading image details...</p> : null}
      <div className="mt-5 grid gap-3 sm:grid-cols-2">{details.map(([key, value]) => <div key={key} className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><p className="text-xs font-black uppercase tracking-wide text-slate-500">{key}</p><p className="mt-2 break-words text-lg font-black text-slate-950">{value}</p></div>)}</div>
      <div className="mt-4"><SecondaryButton onClick={() => { setFile(null); setDetails([]); setError(""); }}>Reset</SecondaryButton></div>
      <ErrorMessage message={error} />
    </div>
  );
}

function ImageColorPicker() {
  const [file, setFile] = useState<File | null>(null);
  const [color, setColor] = useState<{ hex: string; rgb: string; x: number; y: number } | null>(null);
  const [error, setError] = useState("");
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!file) {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (canvas && ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
      return;
    }
    const currentFile = file;
    let cancelled = false;
    async function drawImage() {
      try {
        const image = await fileToImage(currentFile);
        if (cancelled) return;
        const canvas = canvasRef.current;
        if (!canvas) {
          setError("Image preview is not ready yet. Please try again.");
          return;
        }
        canvas.width = image.naturalWidth;
        canvas.height = image.naturalHeight;
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        if (!ctx) {
          setError("Could not read image colors in this browser.");
          return;
        }
        ctx.drawImage(image, 0, 0);
        setError("");
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Unable to load image colors.");
      }
    }
    drawImage();
    return () => {
      cancelled = true;
    };
  }, [file]);

  function load(files: File[]) {
    const next = files[0] ?? null;
    setFile(next);
    setColor(null);
    setError("");
  }

  function pick(clientX: number, clientY: number) {
    const canvas = canvasRef.current;
    if (!canvas || !canvas.width || !canvas.height) {
      setError("Image is not ready yet. Please try again.");
      return;
    }
    try {
      const rect = canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) {
        setError("Image preview is not ready yet. Please try again.");
        return;
      }
      const x = Math.max(0, Math.min(canvas.width - 1, Math.floor((clientX - rect.left) * (canvas.width / rect.width))));
      const y = Math.max(0, Math.min(canvas.height - 1, Math.floor((clientY - rect.top) * (canvas.height / rect.height))));
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) {
        setError("Could not read image colors.");
        return;
      }
      const pixel = ctx.getImageData(x, y, 1, 1).data;
      const r = pixel[0];
      const g = pixel[1];
      const b = pixel[2];
      const hex = `#${[r, g, b].map((part) => part.toString(16).padStart(2, "0")).join("").toUpperCase()}`;
      setColor({ hex, rgb: `rgb(${r}, ${g}, ${b})`, x, y });
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to pick a color.");
    }
  }
  return (
    <div>
      <FileUploadDropzone label="Upload an image" accept="image/jpeg,image/png,image/webp" onFiles={load} />
      <FileInfo file={file} />
      {file ? (
        <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-2">
          <canvas
            ref={canvasRef}
            className="mx-auto max-h-96 max-w-full cursor-crosshair rounded-xl"
            onClick={(event) => pick(event.clientX, event.clientY)}
            onPointerDown={(event) => pick(event.clientX, event.clientY)}
            aria-label="Click image to pick a color"
          />
        </div>
      ) : null}
      {color ? <div className="mt-5 grid gap-3 sm:grid-cols-3"><ResultBox label="HEX" value={color.hex} /><ResultBox label="RGB" value={color.rgb} /><ResultBox label="Pixel" value={`${color.x}, ${color.y}`} /><CopyAction value={color.hex} label="Copy HEX" /><CopyAction value={color.rgb} label="Copy RGB" /><div className="min-h-16 rounded-2xl border border-slate-200" style={{ backgroundColor: color.hex }} /></div> : null}
      <div className="mt-4"><SecondaryButton onClick={() => { setFile(null); setColor(null); setError(""); }}>Reset</SecondaryButton></div>
      <ErrorMessage message={error} />
    </div>
  );
}

type PdfTextItem = {
  id: string;
  page: number;
  text: string;
  x: number;
  y: number;
  size: number;
  color: string;
};

type PdfSignatureItem = {
  id: string;
  page: number;
  dataUrl: string;
  x: number;
  y: number;
  width: number;
  height: number;
};

function hexToPdfRgb(hex: string) {
  const clean = hex.replace("#", "");
  const r = parseInt(clean.slice(0, 2), 16) / 255;
  const g = parseInt(clean.slice(2, 4), 16) / 255;
  const b = parseInt(clean.slice(4, 6), 16) / 255;
  return { r: Number.isFinite(r) ? r : 0, g: Number.isFinite(g) ? g : 0, b: Number.isFinite(b) ? b : 0 };
}

function AddTextToPdf() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [pageSizes, setPageSizes] = useState<Array<{ width: number; height: number }>>([]);
  const [page, setPage] = useState(1);
  const [text, setText] = useState("");
  const [size, setSize] = useState(18);
  const [color, setColor] = useState("#0F172A");
  const [x, setX] = useState(120);
  const [y, setY] = useState(120);
  const [items, setItems] = useState<PdfTextItem[]>([]);
  const [signatureItems, setSignatureItems] = useState<PdfSignatureItem[]>([]);
  const [signatureWidth, setSignatureWidth] = useState(160);
  const [hasSignature, setHasSignature] = useState(false);
  const [activePdfTab, setActivePdfTab] = useState<"text" | "signature">("text");
  const [signatureMode, setSignatureMode] = useState<"type" | "draw" | "upload">("draw");
  const [typedSignature, setTypedSignature] = useState("");
  const [uploadedSignature, setUploadedSignature] = useState("");
  const [output, setOutput] = useState<Output | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [renderingPreview, setRenderingPreview] = useState(false);
  const previewCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const signatureCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawingSignatureRef = useRef(false);
  useObjectUrlCleanup(output);

  const currentSize = pageSizes[page - 1] ?? { width: 612, height: 792 };
  const pageItems = items.filter((item) => item.page === page);
  const pageSignatureItems = signatureItems.filter((item) => item.page === page);
  const signatureHeight = Math.round(signatureWidth * 0.35);

  useEffect(() => {
    if (!file || !pageCount) return;
    const pdfFile = file;
    let cancelled = false;
    let renderTask: { cancel: () => void; promise: Promise<unknown> } | null = null;
    async function renderPreview() {
      if (typeof window === "undefined") return;
      if (!window.DOMMatrix) {
        setError("PDF preview is not supported in this browser. You can still use page number and X/Y inputs.");
        setRenderingPreview(false);
        return;
      }

      setRenderingPreview(true);
      try {
        const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
        pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.legacy.min.js";
        const source = new Uint8Array(await pdfFile.arrayBuffer());
        const loadingTask = pdfjs.getDocument({ data: source });
        const pdf = await loadingTask.promise;
        const pdfPage = await pdf.getPage(page);
        const viewport = pdfPage.getViewport({ scale: 1.35 });
        const canvas = previewCanvasRef.current;
        if (!canvas || cancelled) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          setError("Could not render the PDF preview in this browser.");
          return;
        }
        canvas.width = Math.floor(viewport.width);
        canvas.height = Math.floor(viewport.height);
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        renderTask = pdfPage.render({ canvas, canvasContext: ctx, viewport });
        await renderTask.promise;
        if (!cancelled) setError("");
      } catch (err) {
        if (!cancelled && !(err instanceof Error && err.name === "RenderingCancelledException")) {
          setError(err instanceof Error ? err.message : "Unable to render the PDF preview.");
        }
      } finally {
        if (!cancelled) setRenderingPreview(false);
      }
    }
    renderPreview();
    return () => {
      cancelled = true;
      renderTask?.cancel();
    };
  }, [file, page, pageCount]);

  useEffect(() => {
    const canvas = signatureCanvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#0f172a";
  }, [file]);

  async function load(files: File[]) {
    const next = files[0] ?? null;
    setFile(next);
    setItems([]);
    setSignatureItems([]);
    setHasSignature(false);
    setTypedSignature("");
    setUploadedSignature("");
    setOutput(null);
    setError("");
    setPage(1);
    if (!next) {
      setPageCount(0);
      setPageSizes([]);
      return;
    }
    if (next.type && next.type !== "application/pdf") {
      setError("Please upload a valid PDF file.");
      return;
    }
    setBusy(true);
    try {
      const { PDFDocument } = await import("pdf-lib");
      const pdf = await PDFDocument.load(await next.arrayBuffer(), { ignoreEncryption: true });
      setPageCount(pdf.getPageCount());
      setPageSizes(pdf.getPages().map((pdfPage) => {
        const dimensions = pdfPage.getSize();
        return { width: dimensions.width, height: dimensions.height };
      }));
      const first = pdf.getPage(0).getSize();
      setX(Math.round(first.width / 2));
      setY(Math.round(first.height / 2));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to read this PDF. Try an unlocked PDF file.");
    } finally {
      setBusy(false);
    }
  }

  function placeFromClick(event: React.MouseEvent<HTMLCanvasElement>) {
    const canvas = previewCanvasRef.current;
    if (!canvas) {
      setError("PDF preview is not ready yet. Please try again.");
      return;
    }
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) {
      setError("PDF preview is not ready yet. Please try again.");
      return;
    }
    const nextX = Math.round((event.clientX - rect.left) * (currentSize.width / rect.width));
    const nextY = Math.round(currentSize.height - ((event.clientY - rect.top) * (currentSize.height / rect.height)));
    setX(Math.max(0, Math.min(Math.round(currentSize.width), nextX)));
    setY(Math.max(0, Math.min(Math.round(currentSize.height), nextY)));
    setError("");
  }

  function addItem() {
    if (!file) {
      setError("Upload a PDF before adding text.");
      return;
    }
    if (!text.trim()) {
      setError("Enter text to add to the PDF.");
      return;
    }
    setError("");
    setItems([...items, { id: crypto.randomUUID(), page, text: text.trim(), x, y, size, color }]);
    setOutput(null);
  }

  function signaturePoint(event: React.PointerEvent<HTMLCanvasElement>) {
    const canvas = signatureCanvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    return {
      x: (event.clientX - rect.left) * (canvas.width / rect.width),
      y: (event.clientY - rect.top) * (canvas.height / rect.height)
    };
  }

  function startSignature(event: React.PointerEvent<HTMLCanvasElement>) {
    const canvas = signatureCanvasRef.current;
    const point = signaturePoint(event);
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx || !point) {
      setError("Signature pad is not ready yet. Please try again.");
      return;
    }
    event.currentTarget.setPointerCapture(event.pointerId);
    drawingSignatureRef.current = true;
    setHasSignature(true);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#0f172a";
    ctx.beginPath();
    ctx.moveTo(point.x, point.y);
  }

  function drawSignature(event: React.PointerEvent<HTMLCanvasElement>) {
    if (!drawingSignatureRef.current) return;
    const point = signaturePoint(event);
    const ctx = signatureCanvasRef.current?.getContext("2d");
    if (!ctx || !point) return;
    ctx.lineTo(point.x, point.y);
    ctx.stroke();
  }

  function stopSignature() {
    drawingSignatureRef.current = false;
  }

  function clearSignature() {
    const canvas = signatureCanvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (canvas && ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
  }

  function typedSignatureDataUrl() {
    const canvas = document.createElement("canvas");
    canvas.width = 720;
    canvas.height = 220;
    const ctx = canvas.getContext("2d");
    if (!ctx) return "";
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#0f172a";
    ctx.font = "96px Brush Script MT, Segoe Script, Snell Roundhand, cursive";
    ctx.textBaseline = "middle";
    ctx.fillText(typedSignature.trim(), 32, 112);
    return canvas.toDataURL("image/png");
  }

  function currentSignatureDataUrl() {
    if (signatureMode === "type") return typedSignature.trim() ? typedSignatureDataUrl() : "";
    if (signatureMode === "upload") return uploadedSignature;
    const canvas = signatureCanvasRef.current;
    return canvas && hasSignature ? canvas.toDataURL("image/png") : "";
  }

  function addSignature() {
    const canvas = signatureCanvasRef.current;
    if (!file) {
      setError("Upload a PDF before adding a signature.");
      return;
    }
    const dataUrl = currentSignatureDataUrl();
    if (!dataUrl) {
      setError(signatureMode === "type" ? "Type a signature before adding it to the PDF." : signatureMode === "upload" ? "Upload a signature image before adding it to the PDF." : "Draw a signature before adding it to the PDF.");
      return;
    }
    setSignatureItems([...signatureItems, { id: crypto.randomUUID(), page, dataUrl, x, y, width: signatureWidth, height: signatureHeight }]);
    setError("");
    setOutput(null);
  }

  function loadSignatureImage(files: FileList | null) {
    const next = files?.[0];
    setUploadedSignature("");
    if (!next) return;
    if (!next.type.startsWith("image/")) {
      setError("Please upload a PNG or JPG signature image.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setUploadedSignature(String(reader.result ?? ""));
      setError("");
    };
    reader.onerror = () => setError("Unable to read the signature image.");
    reader.readAsDataURL(next);
  }

  async function applyText() {
    if (!file || (!items.length && !signatureItems.length)) return;
    setBusy(true);
    setError("");
    try {
      const { PDFDocument, StandardFonts, rgb } = await import("pdf-lib");
      const pdf = await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption: true });
      const font = await pdf.embedFont(StandardFonts.Helvetica);
      items.forEach((item) => {
        const pdfPage = pdf.getPage(item.page - 1);
        const pageHeight = pdfPage.getSize().height;
        const colorValue = hexToPdfRgb(item.color);
        pdfPage.drawText(item.text, {
          x: item.x,
          y: Math.max(0, Math.min(pageHeight, item.y)),
          size: item.size,
          font,
          color: rgb(colorValue.r, colorValue.g, colorValue.b)
        });
      });
      for (const signature of signatureItems) {
        const pdfPage = pdf.getPage(signature.page - 1);
        const embeddedSignature = signature.dataUrl.startsWith("data:image/jpeg") || signature.dataUrl.startsWith("data:image/jpg") ? await pdf.embedJpg(signature.dataUrl) : await pdf.embedPng(signature.dataUrl);
        pdfPage.drawImage(embeddedSignature, {
          x: signature.x,
          y: signature.y,
          width: signature.width,
          height: signature.height
        });
      }
      const bytes = await pdf.save();
      setOutput(downloadBlob(bytesToPdfBlob(bytes), `edited-${file.name.replace(/\.[^.]+$/, ".pdf")}`));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to add text to this PDF.");
    } finally {
      setBusy(false);
    }
  }

  function reset() {
    setFile(null);
    setPageCount(0);
    setPageSizes([]);
    setPage(1);
    setText("");
    setSize(18);
    setColor("#0F172A");
    setX(120);
    setY(120);
    setItems([]);
    setSignatureItems([]);
    setSignatureWidth(160);
    setHasSignature(false);
    setActivePdfTab("text");
    setSignatureMode("draw");
    setTypedSignature("");
    setUploadedSignature("");
    clearSignature();
    setOutput(null);
    setError("");
  }

  return (
    <div>
      <FileUploadDropzone label="Upload a PDF" accept="application/pdf" onFiles={load} />
      <FileInfo file={file} />
      {busy && !output ? <p className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm font-bold text-slate-600">Reading or updating PDF...</p> : null}
      {file && pageCount ? (
        <div className="mt-5 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(360px,520px)]">
          <div className="grid gap-4">
            <label className="text-sm font-bold text-slate-700">Page <Select className="mt-2" value={page} onChange={(event) => setPage(Number(event.target.value))}>{Array.from({ length: pageCount }, (_, index) => <option key={index + 1} value={index + 1}>Page {index + 1}</option>)}</Select></label>
            <div className="grid grid-cols-2 gap-2 rounded-2xl bg-slate-100 p-1">
              {(["text", "signature"] as const).map((tab) => (
                <button key={tab} className={`rounded-xl px-4 py-3 text-sm font-black ${activePdfTab === tab ? "bg-white text-brand-700 shadow-sm" : "text-slate-600"}`} onClick={() => setActivePdfTab(tab)}>
                  {tab === "text" ? "Add Text" : "Sign PDF"}
                </button>
              ))}
            </div>
            <p className="rounded-2xl border border-brand-100 bg-brand-50 px-4 py-3 text-sm font-bold leading-6 text-brand-700">
              Click on the real PDF preview to place your {activePdfTab === "text" ? "text" : "signature"}. Your PDF is processed in your browser where supported. Files are not uploaded to a server by this tool.
            </p>
            {activePdfTab === "text" ? (
              <>
                <label className="text-sm font-bold text-slate-700">Text to add <Input className="mt-2" value={text} onChange={(event) => setText(event.target.value)} placeholder="Date, note, label, or name..." /></label>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="text-sm font-bold text-slate-700">Font size: {size}<input className="mt-3 w-full accent-brand-600" type="range" min={8} max={72} value={size} onChange={(event) => setSize(Number(event.target.value))} /></label>
                  <label className="text-sm font-bold text-slate-700">Text color <Input className="mt-2 h-12 p-1" type="color" value={color} onChange={(event) => setColor(event.target.value)} /></label>
                </div>
              </>
            ) : (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="grid gap-2 sm:grid-cols-3">
                  {(["type", "draw", "upload"] as const).map((mode) => (
                    <button key={mode} className={`rounded-xl border px-4 py-3 text-sm font-black capitalize ${signatureMode === mode ? "border-brand-200 bg-brand-50 text-brand-700" : "border-slate-200 bg-white text-slate-700"}`} onClick={() => setSignatureMode(mode)}>
                      {mode}
                    </button>
                  ))}
                </div>
                {signatureMode === "type" ? (
                  <div className="mt-4">
                    <label className="text-sm font-bold text-slate-700">Typed signature <Input className="mt-2" value={typedSignature} onChange={(event) => setTypedSignature(event.target.value)} placeholder="Your name" /></label>
                    {typedSignature ? <p className="mt-3 rounded-2xl bg-white p-4 text-4xl text-slate-950 [font-family:'Brush_Script_MT','Segoe_Script',cursive]">{typedSignature}</p> : null}
                  </div>
                ) : null}
                {signatureMode === "draw" ? (
                  <>
                    <canvas
                      ref={signatureCanvasRef}
                      width={520}
                      height={180}
                      className="mt-4 h-36 w-full touch-none rounded-2xl border border-dashed border-slate-300 bg-white shadow-inner"
                      onPointerDown={startSignature}
                      onPointerMove={drawSignature}
                      onPointerUp={stopSignature}
                      onPointerCancel={stopSignature}
                      aria-label="Draw signature"
                    />
                    <SecondaryButton className="mt-3" onClick={clearSignature}>Clear drawing</SecondaryButton>
                  </>
                ) : null}
                {signatureMode === "upload" ? (
                  <div className="mt-4">
                    <label className="text-sm font-bold text-slate-700">Upload signature image <Input className="mt-2" type="file" accept="image/png,image/jpeg" onChange={(event) => loadSignatureImage(event.target.files)} /></label>
                    {uploadedSignature ? <img src={uploadedSignature} alt="Uploaded signature preview" className="mt-3 max-h-32 rounded-2xl border border-slate-200 bg-white p-3" /> : null}
                  </div>
                ) : null}
                <label className="mt-4 block text-sm font-bold text-slate-700">Signature width: {signatureWidth}px<input className="mt-2 w-full accent-brand-600" type="range" min={80} max={320} value={signatureWidth} onChange={(event) => setSignatureWidth(Number(event.target.value))} /></label>
              </div>
            )}
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-bold text-slate-700">X position <Input className="mt-2" type="number" min={0} max={Math.round(currentSize.width)} value={x} onChange={(event) => setX(Number(event.target.value))} /></label>
              <label className="text-sm font-bold text-slate-700">Y position <Input className="mt-2" type="number" min={0} max={Math.round(currentSize.height)} value={y} onChange={(event) => setY(Number(event.target.value))} /></label>
            </div>
            <div className="flex flex-wrap gap-3">
              {activePdfTab === "text" ? <Button onClick={addItem} disabled={!file || !text.trim()}>Add Text</Button> : <Button onClick={addSignature} disabled={!file}>Add Signature</Button>}
              <Button onClick={applyText} disabled={!file || (!items.length && !signatureItems.length) || busy}>{busy ? "Applying..." : "Apply changes"}</Button>
              <SecondaryButton onClick={reset}>Reset</SecondaryButton>
            </div>
            {(items.length || signatureItems.length) ? (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-black text-slate-800">PDF items</p>
                <div className="mt-3 grid gap-2">
                  {items.map((item) => <div key={item.id} className="flex flex-col gap-2 rounded-xl bg-white p-3 text-sm font-bold text-slate-700 sm:flex-row sm:items-center sm:justify-between"><span>Page {item.page}: {item.text}</span><SecondaryButton onClick={() => setItems(items.filter((entry) => entry.id !== item.id))}>Remove</SecondaryButton></div>)}
                  {signatureItems.map((item) => <div key={item.id} className="flex flex-col gap-2 rounded-xl bg-white p-3 text-sm font-bold text-slate-700 sm:flex-row sm:items-center sm:justify-between"><span>Page {item.page}: Signature at X {item.x}, Y {item.y}</span><SecondaryButton onClick={() => setSignatureItems(signatureItems.filter((entry) => entry.id !== item.id))}>Remove</SecondaryButton></div>)}
                </div>
              </div>
            ) : null}
          </div>
          <div>
            <p className="mb-2 text-sm font-bold text-slate-700">Real PDF preview. Click the page to set X/Y.</p>
            {renderingPreview ? <p className="mb-3 rounded-2xl bg-slate-50 p-3 text-sm font-bold text-slate-600">Rendering page preview...</p> : null}
            <div className="relative mx-auto w-full max-w-[520px] overflow-hidden rounded-2xl border border-slate-300 bg-white shadow-inner">
              <canvas ref={previewCanvasRef} className="block h-auto w-full cursor-crosshair" onClick={placeFromClick} aria-label="PDF page preview" />
              <div className="pointer-events-none absolute inset-0">
              {[...pageItems, ...(text.trim() ? [{ id: "draft", page, text, x, y, size, color }] : [])].map((item) => (
                <span key={item.id} className="absolute max-w-[85%] -translate-y-full break-words rounded-md bg-white/80 px-1 font-bold shadow-sm" style={{ left: `${(item.x / currentSize.width) * 100}%`, top: `${100 - (item.y / currentSize.height) * 100}%`, color: item.color, fontSize: Math.max(10, Math.round(item.size * (520 / currentSize.width))) }}>
                  {item.text}
                </span>
              ))}
              {pageSignatureItems.map((item) => (
                <img key={item.id} src={item.dataUrl} alt="Signature placement preview" className="absolute -translate-y-full rounded-sm bg-white/70" style={{ left: `${(item.x / currentSize.width) * 100}%`, top: `${100 - (item.y / currentSize.height) * 100}%`, width: `${(item.width / currentSize.width) * 100}%`, height: "auto" }} />
              ))}
              {activePdfTab === "signature" && currentSignatureDataUrl() ? <img src={currentSignatureDataUrl()} alt="Draft signature placement preview" className="absolute -translate-y-full rounded-sm bg-white/70" style={{ left: `${(x / currentSize.width) * 100}%`, top: `${100 - (y / currentSize.height) * 100}%`, width: `${(signatureWidth / currentSize.width) * 100}%`, height: "auto" }} /> : null}
              </div>
            </div>
            <p className="mt-2 text-xs font-semibold leading-5 text-slate-500">PDF coordinates start at the bottom-left, while browser clicks start at the top-left. FreeToolKit maps the click position automatically.</p>
          </div>
        </div>
      ) : null}
      <ErrorMessage message={error} />
      <Download output={output} />
    </div>
  );
}

type AiResumeOutput = {
  resume: string;
  coverLetter: string;
  keywords: string;
  improvements: string;
};

function aiSection(output: string, name: string) {
  const pattern = new RegExp(`---${name}---\\s*([\\s\\S]*?)(?=\\n---[A-Z ]+---|$)`, "i");
  return output.match(pattern)?.[1]?.trim() ?? "";
}

function parseAiResumeOutput(output: string): AiResumeOutput {
  return {
    resume: aiSection(output, "RESUME") || output.trim(),
    coverLetter: aiSection(output, "COVER LETTER"),
    keywords: aiSection(output, "KEYWORDS"),
    improvements: aiSection(output, "IMPROVEMENTS")
  };
}

const AI_USAGE_KEY = "freetoolkit_ai_student_usage";
const AI_CLIENT_LIMIT = 3;
const AI_RESUME_UNAVAILABLE_MESSAGE = "AI resume generation is temporarily unavailable. Please try again later.";

function localDateKey() {
  return new Date().toISOString().slice(0, 10);
}

function readAiUsage() {
  if (typeof window === "undefined") return { date: localDateKey(), count: 0 };
  try {
    const parsed = JSON.parse(localStorage.getItem(AI_USAGE_KEY) || "{}") as { date?: string; count?: number };
    if (parsed.date === localDateKey()) return { date: parsed.date, count: Number(parsed.count ?? 0) };
  } catch {
    // Ignore corrupt localStorage and reset below.
  }
  return { date: localDateKey(), count: 0 };
}

function writeAiUsage(count: number) {
  localStorage.setItem(AI_USAGE_KEY, JSON.stringify({ date: localDateKey(), count }));
}

function downloadTextFile(name: string, content: string) {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  link.click();
  URL.revokeObjectURL(url);
}

const aiExpansionSlugs = new Set([
  "ai-humanizer",
  "ai-homework-helper",
  "ai-essay-writer",
  "ai-prompt-generator",
  "ai-interview-answer-generator",
  "ai-linkedin-summary-generator",
  "ai-business-name-generator",
  "ai-notes-cleaner",
  "transcript-summarizer"
]);

const fileWorkflowSlugs = new Set([
  "heic-to-jpg",
  "background-remover",
  "passport-photo-maker",
  "excel-to-pdf",
  "pdf-watermark",
  "pdf-password-protector",
  "pdf-metadata-editor",
  "pdf-reader-online",
  "compare-pdf-files",
  "file-checksum"
]);

const utilityLabels: Record<string, { label: string; placeholder: string; button: string }> = {
  "svg-to-png": { label: "SVG markup or upload notes", placeholder: "<svg viewBox=\"0 0 100 100\">...</svg>", button: "Prepare PNG preview" },
  "png-to-webp": { label: "Upload or describe PNG file", placeholder: "Upload a PNG file above or note the conversion requirement.", button: "Prepare conversion notes" },
  "webp-to-png": { label: "Upload or describe WebP file", placeholder: "Upload a WebP file above or note the conversion requirement.", button: "Prepare conversion notes" },
  "blur-image": { label: "Upload or describe image", placeholder: "Upload an image and choose blur strength.", button: "Prepare blur workflow" },
  "favicon-generator": { label: "Site name or initials", placeholder: "FT or FreeToolKit", button: "Generate favicon plan" },
  "photo-collage-maker": { label: "Collage notes", placeholder: "Describe the images and layout you want.", button: "Create collage plan" },
  "youtube-thumbnail-downloader": { label: "YouTube video URL", placeholder: "https://www.youtube.com/watch?v=VIDEO_ID", button: "Get thumbnail links" },
  "apa-citation-generator": { label: "Source details", placeholder: "Author, year, title, website/book/journal, URL, accessed date...", button: "Generate citation draft" },
  "mla-citation-generator": { label: "Source details", placeholder: "Author, title, container, publisher, date, URL...", button: "Generate citation draft" },
  "harvard-reference-generator": { label: "Source details", placeholder: "Author, year, title, publisher/site, URL...", button: "Generate reference draft" },
  "pomodoro-timer": { label: "Session plan", placeholder: "25 minute focus, 5 minute break, 4 rounds", button: "Create timer plan" },
  "flashcard-generator": { label: "Notes or terms", placeholder: "Paste notes or key terms, one per line.", button: "Generate flashcards" },
  "assignment-planner": { label: "Assignment details", placeholder: "Topic, due date, requirements, milestones...", button: "Create plan" },
  "study-schedule-generator": { label: "Subjects and available time", placeholder: "Math exam Friday, English essay Monday, 2 hours per day...", button: "Create schedule" },
  "scientific-calculator": { label: "Expression", placeholder: "sqrt(144) + sin(30) or 2^8", button: "Calculate" },
  "regex-tester": { label: "Pattern and sample text", placeholder: "Pattern: \\b\\w+@\\w+\\.com\\b\nText: email me at test@example.com", button: "Test regex" },
  "jwt-decoder": { label: "JWT token", placeholder: "eyJhbGciOi...", button: "Decode JWT" },
  "sql-formatter": { label: "SQL", placeholder: "select * from users where active = true order by created_at desc", button: "Format SQL" },
  "html-formatter": { label: "HTML", placeholder: "<main><h1>Hello</h1><p>Text</p></main>", button: "Format HTML" },
  "css-formatter": { label: "CSS", placeholder: "body{color:#111;background:#fff}.card{padding:1rem}", button: "Format CSS" },
  "markdown-previewer": { label: "Markdown", placeholder: "# Heading\n\n- Item one\n- Item two", button: "Preview Markdown" },
  "json-validator": { label: "JSON", placeholder: "{\"name\":\"FreeToolKit\"}", button: "Validate JSON" },
  "curl-to-fetch": { label: "cURL command", placeholder: "curl -X POST https://api.example.com -H 'Content-Type: application/json' -d '{\"ok\":true}'", button: "Convert to fetch" },
  "password-strength-checker": { label: "Password", placeholder: "Type a password to check locally", button: "Check strength" },
  "sha256-generator": { label: "Text", placeholder: "Text to hash", button: "Generate SHA-256" },
  "md5-generator": { label: "Text", placeholder: "Text to hash", button: "Generate MD5-style checksum" },
  "random-token-generator": { label: "Token length", placeholder: "32", button: "Generate token" },
  "meta-tag-generator": { label: "Page details", placeholder: "Title: ...\nDescription: ...\nURL: https://example.com/page", button: "Generate meta tags" },
  "open-graph-generator": { label: "Social preview details", placeholder: "Title: ...\nDescription: ...\nURL: ...\nImage: ...", button: "Generate Open Graph tags" },
  "robots-txt-generator": { label: "Site URL", placeholder: "https://example.com", button: "Generate robots.txt" },
  "sitemap-generator": { label: "URLs", placeholder: "https://example.com/\nhttps://example.com/about", button: "Generate sitemap" },
  "serp-preview": { label: "Title, URL, and description", placeholder: "Title: ...\nURL: https://example.com/page\nDescription: ...", button: "Preview SERP" },
  "keyword-density-checker": { label: "Page text", placeholder: "Paste page copy to check repeated terms...", button: "Check density" },
  "slug-generator": { label: "Title or phrase", placeholder: "Best Free Online PDF Tools", button: "Generate slug" },
  "schema-markup-generator": { label: "Page details", placeholder: "Type: Article\nTitle: ...\nDescription: ...\nURL: ...", button: "Generate JSON-LD" },
  "hashtag-counter": { label: "Hashtags", placeholder: "#seo #tools #productivity", button: "Count hashtags" },
  "instagram-caption-formatter": { label: "Caption", placeholder: "Paste caption text with line breaks...", button: "Format caption" },
  "tiktok-caption-generator": { label: "Video topic", placeholder: "A quick video about compressing PDFs online", button: "Generate captions" },
  "youtube-tags-extractor": { label: "YouTube text", placeholder: "Paste title, description, tags, or hashtags...", button: "Extract tags" },
  "twitter-character-counter": { label: "Post text", placeholder: "Write your post here...", button: "Count characters" },
  "social-bio-generator": { label: "Profile details", placeholder: "Role, niche, audience, personality...", button: "Generate bios" }
};

function LightweightUtilityTool({ slug }: { slug: string }) {
  const config = utilityLabels[slug] ?? { label: "Input", placeholder: "Enter text or details...", button: "Generate" };
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  async function generate() {
    setCopied(false);
    setOutput(await runUtility(slug, input));
  }

  async function copy() {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <div className="space-y-4">
        <label className="block text-sm font-bold text-slate-700">
          {config.label}
          <Textarea className="mt-2 min-h-72" value={input} onChange={(event) => setInput(event.target.value)} placeholder={config.placeholder} />
        </label>
        <div className="flex flex-wrap gap-3">
          <Button onClick={generate}>{config.button}</Button>
          <SecondaryButton onClick={() => { setInput(""); setOutput(""); }}>Reset</SecondaryButton>
        </div>
      </div>
      <ResultCard title="Output">
        {output ? <pre className="min-h-72 whitespace-pre-wrap break-words text-sm leading-7 text-slate-800 [overflow-wrap:anywhere]">{output}</pre> : <p className="min-h-72 text-sm leading-7 text-slate-500">Your result will appear here.</p>}
        <div className="mt-4 flex flex-wrap gap-3">
          <SecondaryButton onClick={copy} disabled={!output}>{copied ? "Copied" : "Copy"}</SecondaryButton>
          <SecondaryButton onClick={() => downloadTextFile(`${slug}.txt`, output)} disabled={!output}>Download TXT</SecondaryButton>
        </div>
      </ResultCard>
    </div>
  );
}

function FileWorkflowTool({ slug }: { slug: string }) {
  const [files, setFiles] = useState<File[]>([]);
  const [note, setNote] = useState("");
  const fileSummary = files.map((file) => `${file.name} (${formatBytes(file.size)})`).join("\n");
  const isChecksum = slug === "file-checksum";

  async function run() {
    if (isChecksum && files[0]) {
      const hash = await crypto.subtle.digest("SHA-256", await files[0].arrayBuffer());
      setNote(`SHA-256\n${hex(hash)}\n\nFile\n${files[0].name}\n${formatBytes(files[0].size)}`);
      return;
    }
    setNote(`Selected file workflow\n${fileSummary || "No file selected"}\n\nThis browser-first tool prepares the workflow and shows file details. Advanced conversion quality depends on browser support and may require a dedicated processor for complex files.`);
  }

  return (
    <div>
      <FileUploadDropzone label="Upload file" accept="*/*" multiple onFiles={(selected) => setFiles(selected)} />
      <FileInfo file={files[0] ?? null} />
      {files.length > 1 ? <p className="mt-3 text-sm font-bold text-slate-600">{files.length} files selected.</p> : null}
      <div className="mt-4 flex flex-wrap gap-3">
        <Button onClick={run}>{isChecksum ? "Generate checksum" : "Review workflow"}</Button>
        <SecondaryButton onClick={() => { setFiles([]); setNote(""); }}>Reset</SecondaryButton>
      </div>
      {note ? <ResultCard title="Browser workflow note" className="mt-5"><pre className="whitespace-pre-wrap break-words text-sm leading-7 text-slate-700">{note}</pre></ResultCard> : null}
    </div>
  );
}

function sanitizeBaseName(filename: string) {
  return filename.replace(/\.[^.]+$/, "").replace(/[^a-zA-Z0-9-_]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "") || "output";
}

async function loadPdfJs() {
  return import("pdfjs-dist/legacy/build/pdf.mjs");
}

function OcrPdfTool() {
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [output, setOutput] = useState("");
  const [pagesDone, setPagesDone] = useState(0);
  const MAX_PAGES = 5;

  async function runOcr() {
    if (!file) return;
    setBusy(true);
    setError("");
    setOutput("");
    setPagesDone(0);
    try {
      const pdfjs = await loadPdfJs();
      const { createWorker } = await import("tesseract.js");
      const worker = await createWorker("eng");
      const bytes = new Uint8Array(await file.arrayBuffer());
      const task = pdfjs.getDocument({ data: bytes, disableWorker: true } as unknown as Parameters<typeof pdfjs.getDocument>[0]);
      const pdf = await task.promise;
      const pages = Math.min(pdf.numPages, MAX_PAGES);
      const chunks: string[] = [];

      for (let pageNumber = 1; pageNumber <= pages; pageNumber += 1) {
        const page = await pdf.getPage(pageNumber);
        const viewport = page.getViewport({ scale: 1.6 });
        const canvas = document.createElement("canvas");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("Canvas context is unavailable.");
        await page.render({ canvasContext: ctx, viewport, canvas }).promise;
        const recognized = await worker.recognize(canvas);
        chunks.push(`Page ${pageNumber}\n${recognized.data.text.trim()}`);
        setPagesDone(pageNumber);
      }

      await worker.terminate();
      setOutput(chunks.join("\n\n---\n\n"));
    } catch (err) {
      setError(err instanceof Error ? err.message : "OCR failed.");
    } finally {
      setBusy(false);
    }
  }

  function reset() {
    setFile(null);
    setBusy(false);
    setError("");
    setOutput("");
    setPagesDone(0);
  }

  return (
    <div>
      <FileUploadDropzone label="Upload PDF for OCR" accept="application/pdf" onFiles={(files) => setFile(files[0] ?? null)} />
      <FileInfo file={file} />
      <p className="mt-3 text-sm leading-7 text-slate-600">
        Extract text from scanned PDFs. This browser OCR run processes up to {MAX_PAGES} pages per file for faster results.
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        <Button onClick={runOcr} disabled={!file || busy}>{busy ? `Running OCR... ${pagesDone}/${MAX_PAGES}` : "Extract text"}</Button>
        <SecondaryButton onClick={reset}>Reset</SecondaryButton>
      </div>
      <ErrorMessage message={error} />
      <ResultCard title="Extracted text" className="mt-5">
        {output ? (
          <pre className="max-h-[28rem] overflow-auto whitespace-pre-wrap break-words text-sm leading-7 text-slate-800">{output}</pre>
        ) : (
          <p className="text-sm leading-7 text-slate-500">Your OCR result will appear here.</p>
        )}
        <div className="mt-4 flex flex-wrap gap-3">
          <SecondaryButton onClick={() => void navigator.clipboard.writeText(output)} disabled={!output}>Copy</SecondaryButton>
          <SecondaryButton onClick={() => downloadTextFile(`${file ? sanitizeBaseName(file.name) : "ocr-result"}.txt`, output)} disabled={!output}>Download TXT</SecondaryButton>
        </div>
      </ResultCard>
    </div>
  );
}

function PdfToExcelTool() {
  const [file, setFile] = useState<File | null>(null);
  const [rows, setRows] = useState<string[][]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function extractRows() {
    if (!file) return;
    setBusy(true);
    setError("");
    setRows([]);
    try {
      const pdfjs = await loadPdfJs();
      const bytes = new Uint8Array(await file.arrayBuffer());
      const task = pdfjs.getDocument({ data: bytes, disableWorker: true } as unknown as Parameters<typeof pdfjs.getDocument>[0]);
      const pdf = await task.promise;
      const allRows: string[][] = [];
      const maxPages = Math.min(pdf.numPages, 8);

      for (let pageNumber = 1; pageNumber <= maxPages; pageNumber += 1) {
        const page = await pdf.getPage(pageNumber);
        const text = await page.getTextContent();
        const lines = text.items
          .map((item: unknown) => (item as { str?: string }).str ?? "")
          .join(" ")
          .split(/\s{2,}|\n/)
          .map((line) => line.trim())
          .filter(Boolean);

        for (const line of lines) {
          const cells = line.split(/\s{2,}|\t|,| \| /).map((cell) => cell.trim()).filter(Boolean);
          if (cells.length > 0) allRows.push(cells);
        }
      }

      if (!allRows.length) {
        throw new Error("No structured rows found. Try a clearer table PDF or OCR first.");
      }

      setRows(allRows);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Table extraction failed.");
    } finally {
      setBusy(false);
    }
  }

  async function downloadExcel() {
    if (!rows.length || !file) return;
    const XLSX = await import("xlsx");
    const worksheet = XLSX.utils.aoa_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Extracted");
    XLSX.writeFile(workbook, `${sanitizeBaseName(file.name)}.xlsx`);
  }

  function downloadCsv() {
    if (!rows.length || !file) return;
    const csv = rows.map((row) => row.map((cell) => `"${cell.replace(/"/g, "\"\"")}"`).join(",")).join("\n");
    downloadTextFile(`${sanitizeBaseName(file.name)}.csv`, csv);
  }

  function reset() {
    setFile(null);
    setRows([]);
    setBusy(false);
    setError("");
  }

  return (
    <div>
      <FileUploadDropzone label="Upload PDF with tables" accept="application/pdf" onFiles={(files) => setFile(files[0] ?? null)} />
      <FileInfo file={file} />
      <p className="mt-3 text-sm leading-7 text-slate-600">
        Extract likely table rows from text-based PDFs. For scanned documents, run OCR PDF first for better extraction.
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        <Button onClick={extractRows} disabled={!file || busy}>{busy ? "Extracting..." : "Extract table rows"}</Button>
        <SecondaryButton onClick={reset}>Reset</SecondaryButton>
      </div>
      <ErrorMessage message={error} />
      <ResultCard title="Preview rows" className="mt-5">
        {rows.length ? (
          <div className="max-h-[26rem] overflow-auto rounded-xl border border-slate-200 bg-white">
            <table className="w-full text-left text-sm">
              <tbody>
                {rows.slice(0, 80).map((row, index) => (
                  <tr key={`${index}-${row.join("|")}`} className="border-b border-slate-100">
                    {row.map((cell, cellIndex) => (
                      <td key={`${index}-${cellIndex}`} className="px-3 py-2 align-top text-slate-700">{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm leading-7 text-slate-500">Extracted rows will appear here.</p>
        )}
        <div className="mt-4 flex flex-wrap gap-3">
          <SecondaryButton onClick={downloadExcel} disabled={!rows.length}>Download XLSX</SecondaryButton>
          <SecondaryButton onClick={downloadCsv} disabled={!rows.length}>Download CSV</SecondaryButton>
        </div>
      </ResultCard>
    </div>
  );
}

function ImageUpscalerTool() {
  const [file, setFile] = useState<File | null>(null);
  const [scale, setScale] = useState<2 | 4>(2);
  const [smoothing, setSmoothing] = useState<"high" | "medium" | "low">("high");
  const [output, setOutput] = useState<Output | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  useObjectUrlCleanup(output);

  async function upscale() {
    if (!file) return;
    setBusy(true);
    setError("");
    try {
      const image = await fileToImage(file);
      const canvas = document.createElement("canvas");
      canvas.width = image.naturalWidth * scale;
      canvas.height = image.naturalHeight * scale;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas context unavailable.");
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = smoothing;
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
      const blob = await canvasToBlob(canvas, "image/png", 0.95);
      if (preview) URL.revokeObjectURL(preview);
      const previewUrl = URL.createObjectURL(blob);
      setPreview(previewUrl);
      setOutput(downloadBlob(blob, `${sanitizeBaseName(file.name)}-${scale}x-upscaled.png`));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upscaling failed.");
    } finally {
      setBusy(false);
    }
  }

  function reset() {
    setFile(null);
    setScale(2);
    setSmoothing("high");
    setOutput(null);
    setPreview(null);
    setError("");
  }

  return (
    <div>
      <FileUploadDropzone label="Upload image to upscale" accept="image/jpeg,image/png,image/webp" onFiles={(files) => setFile(files[0] ?? null)} />
      <FileInfo file={file} />
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="text-sm font-bold text-slate-700">
          Scale factor
          <Select className="mt-2" value={scale} onChange={(event) => setScale(Number(event.target.value) as 2 | 4)}>
            <option value={2}>2x</option>
            <option value={4}>4x</option>
          </Select>
        </label>
        <label className="text-sm font-bold text-slate-700">
          Smoothing quality
          <Select className="mt-2" value={smoothing} onChange={(event) => setSmoothing(event.target.value as "high" | "medium" | "low")}>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </Select>
        </label>
      </div>
      <div className="mt-4 flex flex-wrap gap-3">
        <Button onClick={upscale} disabled={!file || busy}>{busy ? "Upscaling..." : "Upscale image"}</Button>
        <SecondaryButton onClick={reset}>Reset</SecondaryButton>
      </div>
      <p className="mt-3 text-sm leading-7 text-slate-600">
        This browser upscaler enlarges image dimensions for previews and drafts. For advanced AI enhancement, a model-based service is typically required.
      </p>
      {preview ? <img className="mt-5 max-h-96 w-full rounded-2xl border border-slate-200 bg-slate-50 object-contain p-2" src={preview} alt="Upscaled preview" /> : null}
      <ErrorMessage message={error} />
      <Download output={output} />
    </div>
  );
}

function EditPdfTool() {
  const [file, setFile] = useState<File | null>(null);
  const [mode, setMode] = useState<"rotate" | "delete" | "reorder">("rotate");
  const [rotateBy, setRotateBy] = useState<90 | 180 | 270>(90);
  const [deletePages, setDeletePages] = useState("");
  const [reorderPages, setReorderPages] = useState("");
  const [output, setOutput] = useState<Output | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  useObjectUrlCleanup(output);

  async function processPdf() {
    if (!file) return;
    setBusy(true);
    setError("");
    try {
      const { PDFDocument, degrees } = await import("pdf-lib");
      const source = await loadPdfDocument(PDFDocument, file);
      if (mode === "rotate") {
        const pages = source.getPages();
        for (const page of pages) {
          page.setRotation(degrees(rotateBy));
        }
        const bytes = await source.save();
        const blob = bytesToPdfBlob(bytes);
        setOutput(downloadBlob(blob, `${sanitizeBaseName(file.name)}-rotated.pdf`));
        return;
      }

      if (mode === "delete") {
        const total = source.getPageCount();
        const toDelete = new Set(parseRanges(deletePages, total));
        if (!toDelete.size) throw new Error("Enter page numbers to delete, e.g. 2,4-5");
        const keepIndices = Array.from({ length: total }, (_, index) => index).filter((index) => !toDelete.has(index));
        if (!keepIndices.length) throw new Error("Cannot delete all pages.");
        const resultDoc = await PDFDocument.create();
        const copied = await resultDoc.copyPages(source, keepIndices);
        copied.forEach((page) => resultDoc.addPage(page));
        const bytes = await resultDoc.save();
        const blob = bytesToPdfBlob(bytes);
        setOutput(downloadBlob(blob, `${sanitizeBaseName(file.name)}-edited.pdf`));
        return;
      }

      const total = source.getPageCount();
      const order = reorderPages
        .split(",")
        .map((value) => Number(value.trim()))
        .filter((value) => Number.isInteger(value) && value >= 1 && value <= total)
        .map((value) => value - 1);
      if (!order.length || order.length !== total || new Set(order).size !== total) {
        throw new Error(`Enter exactly ${total} unique page numbers, e.g. 2,1,3.`);
      }
      const resultDoc = await PDFDocument.create();
      const copied = await resultDoc.copyPages(source, order);
      copied.forEach((page) => resultDoc.addPage(page));
      const bytes = await resultDoc.save();
      const blob = bytesToPdfBlob(bytes);
      setOutput(downloadBlob(blob, `${sanitizeBaseName(file.name)}-reordered.pdf`));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Editing PDF failed.");
    } finally {
      setBusy(false);
    }
  }

  function reset() {
    setFile(null);
    setMode("rotate");
    setRotateBy(90);
    setDeletePages("");
    setReorderPages("");
    setError("");
    setOutput(null);
  }

  return (
    <div>
      <FileUploadDropzone label="Upload PDF to edit" accept="application/pdf" onFiles={(files) => setFile(files[0] ?? null)} />
      <FileInfo file={file} />
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="text-sm font-bold text-slate-700">
          Action
          <Select className="mt-2" value={mode} onChange={(event) => setMode(event.target.value as "rotate" | "delete" | "reorder")}>
            <option value="rotate">Rotate all pages</option>
            <option value="delete">Delete selected pages</option>
            <option value="reorder">Reorder pages</option>
          </Select>
        </label>
        {mode === "rotate" ? (
          <label className="text-sm font-bold text-slate-700">
            Rotation
            <Select className="mt-2" value={rotateBy} onChange={(event) => setRotateBy(Number(event.target.value) as 90 | 180 | 270)}>
              <option value={90}>90 degrees</option>
              <option value={180}>180 degrees</option>
              <option value={270}>270 degrees</option>
            </Select>
          </label>
        ) : null}
      </div>
      {mode === "delete" ? (
        <label className="mt-4 block text-sm font-bold text-slate-700">
          Pages to delete
          <Input className="mt-2" value={deletePages} onChange={(event) => setDeletePages(event.target.value)} placeholder="2,4-5" />
        </label>
      ) : null}
      {mode === "reorder" ? (
        <label className="mt-4 block text-sm font-bold text-slate-700">
          New page order
          <Input className="mt-2" value={reorderPages} onChange={(event) => setReorderPages(event.target.value)} placeholder="2,1,3,4" />
        </label>
      ) : null}
      <div className="mt-4 flex flex-wrap gap-3">
        <Button onClick={processPdf} disabled={!file || busy}>{busy ? "Processing..." : "Apply edits"}</Button>
        <SecondaryButton onClick={reset}>Reset</SecondaryButton>
      </div>
      <ErrorMessage message={error} />
      <Download output={output} />
    </div>
  );
}

function summarizeTranscript(input: string) {
  const cleaned = input
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  const bullets = cleaned.slice(0, 80);
  const topPoints = bullets.slice(0, 6);
  const actionItems = bullets.filter((line) => /\b(todo|action|next step|follow up|deadline|owner)\b/i.test(line)).slice(0, 6);
  const decisions = bullets.filter((line) => /\b(decide|decision|approved|agreed|final)\b/i.test(line)).slice(0, 5);

  const summaryLines = [
    "## Summary",
    topPoints.length ? topPoints.map((point) => `- ${point}`).join("\n") : "- No strong summary points detected.",
    "",
    "## Key Decisions",
    decisions.length ? decisions.map((point) => `- ${point}`).join("\n") : "- No explicit decisions detected.",
    "",
    "## Action Items",
    actionItems.length ? actionItems.map((point) => `- ${point}`).join("\n") : "- No explicit action items detected.",
    "",
    "## Notes",
    `- Input lines processed: ${cleaned.length}`,
    "- Review and edit this summary before sharing."
  ];

  return summaryLines.join("\n");
}

function TranscriptSummarizerTool() {
  const [sourceType, setSourceType] = useState<"meeting" | "youtube">("meeting");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [transcript, setTranscript] = useState("");
  const [output, setOutput] = useState("");

  function buildSummary() {
    const fromTranscript = transcript.trim();
    if (fromTranscript.length < 30) {
      setOutput("Please paste a longer transcript or meeting notes to summarize.");
      return;
    }
    const header = sourceType === "youtube" && youtubeUrl.trim() ? `Source: ${youtubeUrl.trim()}\n\n` : "";
    setOutput(`${header}${summarizeTranscript(fromTranscript)}`);
  }

  function reset() {
    setSourceType("meeting");
    setYoutubeUrl("");
    setTranscript("");
    setOutput("");
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <div className="space-y-4">
        <label className="block text-sm font-bold text-slate-700">
          Transcript type
          <Select className="mt-2" value={sourceType} onChange={(event) => setSourceType(event.target.value as "meeting" | "youtube")}>
            <option value="meeting">Meeting notes / transcript</option>
            <option value="youtube">YouTube transcript</option>
          </Select>
        </label>
        {sourceType === "youtube" ? (
          <label className="block text-sm font-bold text-slate-700">
            YouTube URL (optional reference)
            <Input className="mt-2" value={youtubeUrl} onChange={(event) => setYoutubeUrl(event.target.value)} placeholder="https://www.youtube.com/watch?v=..." />
          </label>
        ) : null}
        <label className="block text-sm font-bold text-slate-700">
          Paste transcript or notes
          <Textarea className="mt-2 min-h-72" value={transcript} onChange={(event) => setTranscript(event.target.value)} placeholder="Paste meeting notes or transcript text..." />
        </label>
        <div className="flex flex-wrap gap-3">
          <Button onClick={buildSummary}>Summarize</Button>
          <SecondaryButton onClick={reset}>Reset</SecondaryButton>
        </div>
      </div>
      <ResultCard title="Summary output">
        {output ? <pre className="min-h-72 whitespace-pre-wrap break-words text-sm leading-7 text-slate-800 [overflow-wrap:anywhere]">{output}</pre> : <p className="min-h-72 text-sm leading-7 text-slate-500">Your summary will appear here.</p>}
        <div className="mt-4 flex flex-wrap gap-3">
          <SecondaryButton onClick={() => void navigator.clipboard.writeText(output)} disabled={!output}>Copy</SecondaryButton>
          <SecondaryButton onClick={() => downloadTextFile("transcript-summary.txt", output)} disabled={!output}>Download TXT</SecondaryButton>
        </div>
      </ResultCard>
    </div>
  );
}

function InvoiceGeneratorTool() {
  const [prompt, setPrompt] = useState("");
  const [fromName, setFromName] = useState("FreeToolKit Services");
  const [toName, setToName] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState(`INV-${Date.now().toString().slice(-6)}`);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [itemsRaw, setItemsRaw] = useState("Design work,2,80\nContent writing,1,120");
  const [notes, setNotes] = useState("Thank you for your business.");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const parsedItems = useMemo(() => {
    return itemsRaw
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const [name, qtyRaw, priceRaw] = line.split(",").map((part) => part.trim());
        const qty = Number(qtyRaw);
        const price = Number(priceRaw);
        return { name: name || "Item", qty: Number.isFinite(qty) ? qty : 0, price: Number.isFinite(price) ? price : 0 };
      });
  }, [itemsRaw]);

  const subtotal = parsedItems.reduce((sum, item) => sum + item.qty * item.price, 0);

  async function generateWithAi() {
    if (prompt.trim().length < 15 || busy) return;
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/ai-tools/invoice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, fromName, toName })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || "AI invoice generation failed.");
      const draft = data?.draft as {
        fromName?: string;
        toName?: string;
        invoiceNumber?: string;
        notes?: string;
        items?: Array<{ name?: string; qty?: number; price?: number }>;
      };
      setFromName(draft.fromName || fromName);
      setToName(draft.toName || toName);
      setInvoiceNumber(draft.invoiceNumber || invoiceNumber);
      setNotes(draft.notes || notes);
      if (Array.isArray(draft.items) && draft.items.length) {
        setItemsRaw(draft.items.map((item) => `${item.name || "Service"},${Number(item.qty ?? 1)},${Number(item.price ?? 0)}`).join("\n"));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "AI invoice generation failed.");
    } finally {
      setBusy(false);
    }
  }

  async function downloadPdfInvoice() {
    try {
      setError("");
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF();
      doc.setFontSize(20);
      doc.text("INVOICE", 14, 20);
      doc.setFontSize(11);
      doc.text(`Invoice #: ${invoiceNumber}`, 14, 30);
      doc.text(`Date: ${date}`, 14, 37);
      doc.text(`From: ${fromName}`, 14, 47);
      doc.text(`Bill To: ${toName || "Client"}`, 14, 54);
      doc.line(14, 60, 196, 60);
      let y = 68;
      doc.text("Item", 14, y);
      doc.text("Qty", 120, y);
      doc.text("Price", 145, y);
      doc.text("Total", 172, y);
      y += 6;
      doc.line(14, y, 196, y);
      y += 8;
      for (const item of parsedItems) {
        const total = item.qty * item.price;
        doc.text(item.name.slice(0, 50), 14, y);
        doc.text(String(item.qty), 120, y);
        doc.text(item.price.toFixed(2), 145, y);
        doc.text(total.toFixed(2), 172, y);
        y += 8;
        if (y > 265) break;
      }
      doc.line(14, y, 196, y);
      y += 10;
      doc.text(`Subtotal: ${subtotal.toFixed(2)}`, 145, y);
      y += 12;
      doc.text(`Notes: ${notes.slice(0, 120)}`, 14, y);
      doc.save(`${invoiceNumber || "invoice"}.pdf`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate invoice PDF.");
    }
  }

  function reset() {
    setPrompt("");
    setFromName("FreeToolKit Services");
    setToName("");
    setInvoiceNumber(`INV-${Date.now().toString().slice(-6)}`);
    setDate(new Date().toISOString().slice(0, 10));
    setItemsRaw("Design work,2,80\nContent writing,1,120");
    setNotes("Thank you for your business.");
    setError("");
  }

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-brand-100 bg-gradient-to-b from-brand-50 to-white p-4 shadow-sm">
        <p className="text-xs font-black uppercase tracking-wide text-brand-700">AI invoice brief</p>
        <p className="mt-1 text-sm font-semibold leading-6 text-slate-600">Describe services, pricing style, and client context. AI drafts the invoice structure and you can export PDF instantly.</p>
        <label className="mt-3 block text-sm font-bold text-slate-700">
          Request
          <Textarea
            className="mt-2 min-h-24"
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            placeholder="Example: Create an invoice for logo design and social media templates for Acme Co. Include 3 line items."
          />
        </label>
        <div className="mt-3 flex flex-wrap gap-3">
          <Button onClick={() => void generateWithAi()} disabled={busy || prompt.trim().length < 15}>
            {busy ? "Generating draft..." : "Generate with AI"}
          </Button>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <p className="text-xs font-black uppercase tracking-wide text-slate-500">Invoice details</p>
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-bold text-slate-700">From <Input className="mt-2" value={fromName} onChange={(event) => setFromName(event.target.value)} /></label>
          <label className="text-sm font-bold text-slate-700">Bill To <Input className="mt-2" value={toName} onChange={(event) => setToName(event.target.value)} placeholder="Client name" /></label>
          <label className="text-sm font-bold text-slate-700">Invoice Number <Input className="mt-2" value={invoiceNumber} onChange={(event) => setInvoiceNumber(event.target.value)} /></label>
          <label className="text-sm font-bold text-slate-700">Date <Input className="mt-2" type="date" value={date} onChange={(event) => setDate(event.target.value)} /></label>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <label className="block rounded-2xl border border-slate-200 bg-white p-4 text-sm font-bold text-slate-700 shadow-sm">
          Line items (one per line: item,quantity,price)
          <Textarea className="mt-2 min-h-40" value={itemsRaw} onChange={(event) => setItemsRaw(event.target.value)} />
        </label>
        <label className="block rounded-2xl border border-slate-200 bg-white p-4 text-sm font-bold text-slate-700 shadow-sm">
          Notes
          <Textarea className="mt-2 min-h-40" value={notes} onChange={(event) => setNotes(event.target.value)} />
        </label>
      </div>

      <ResultCard title="AI Invoice Preview" className="border-slate-200 bg-gradient-to-b from-white to-slate-50">
        <div className="grid gap-1 text-sm font-semibold text-slate-700 sm:grid-cols-2">
          <p>From: {fromName}</p>
          <p>To: {toName || "Client"}</p>
          <p>Invoice: {invoiceNumber}</p>
          <p>Date: {date}</p>
        </div>
        <div className="mt-4 rounded-xl border border-slate-200 bg-white">
          {parsedItems.map((item, index) => (
            <div key={`${item.name}-${index}`} className="flex items-center justify-between gap-3 border-b border-slate-100 px-3 py-2 text-sm text-slate-700 last:border-b-0">
              <span className="truncate">{item.name}</span>
              <span className="whitespace-nowrap">{item.qty} x {item.price.toFixed(2)} = {(item.qty * item.price).toFixed(2)}</span>
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm font-black text-slate-900">Subtotal: {subtotal.toFixed(2)}</p>
      </ResultCard>

      <div className="flex flex-wrap gap-3">
        <Button onClick={() => void downloadPdfInvoice()}>Download PDF Invoice</Button>
        <SecondaryButton onClick={reset}>Reset</SecondaryButton>
      </div>
      <ErrorMessage message={error} />
    </div>
  );
}

async function runUtility(slug: string, input: string) {
  const value = input.trim();
  if (!value) return "Enter some input first.";
  if (slug === "slug-generator") return value.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  if (slug === "sha256-generator") return hex(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value)));
  if (slug === "md5-generator") return `MD5 is weak and not available in Web Crypto.\n\nUse this SHA-256 value instead for safer checks:\n${hex(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value)))}`;
  if (slug === "random-token-generator") {
    const length = Math.min(256, Math.max(8, Number(value) || 32));
    const bytes = crypto.getRandomValues(new Uint8Array(Math.ceil(length / 2)));
    return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("").slice(0, length);
  }
  if (slug === "password-strength-checker") {
    const checks = [value.length >= 12, /[a-z]/.test(value), /[A-Z]/.test(value), /\d/.test(value), /[^A-Za-z0-9]/.test(value)];
    const score = checks.filter(Boolean).length;
    return `Score: ${score}/5\nLength: ${value.length}\nLowercase: ${checks[1] ? "yes" : "no"}\nUppercase: ${checks[2] ? "yes" : "no"}\nNumbers: ${checks[3] ? "yes" : "no"}\nSymbols: ${checks[4] ? "yes" : "no"}\n\nUse a long unique password and store it in a trusted password manager.`;
  }
  if (slug === "jwt-decoder") return decodeJwt(value);
  if (slug === "json-validator") {
    try { return `Valid JSON\n\n${JSON.stringify(JSON.parse(value), null, 2)}`; } catch (error) { return `Invalid JSON\n${error instanceof Error ? error.message : "Parse failed"}`; }
  }
  if (slug === "keyword-density-checker") return keywordDensity(value);
  if (slug === "hashtag-counter") {
    const tags = value.match(/#[A-Za-z0-9_]+/g) ?? [];
    return `Hashtags: ${tags.length}\n\n${Array.from(new Set(tags)).join("\n")}`;
  }
  if (slug === "twitter-character-counter") return `Characters: ${value.length}\nRemaining from 280: ${280 - value.length}\nWords: ${value.split(/\s+/).filter(Boolean).length}`;
  if (slug === "youtube-thumbnail-downloader") return youtubeThumbnails(value);
  if (slug === "robots-txt-generator") return `User-agent: *\nAllow: /\n\nSitemap: ${value.replace(/\/$/, "")}/sitemap.xml`;
  if (slug === "sitemap-generator") return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${value.split(/\s+/).filter(Boolean).map((url) => `  <url><loc>${escapeHtml(url)}</loc></url>`).join("\n")}\n</urlset>`;
  if (slug === "meta-tag-generator") return metaTags(value);
  if (slug === "open-graph-generator") return openGraphTags(value);
  if (slug === "schema-markup-generator") return schemaMarkup(value);
  if (slug === "curl-to-fetch") return curlToFetch(value);
  if (slug === "regex-tester") return testRegex(value);
  if (slug === "sql-formatter") return value.replace(/\b(select|from|where|and|or|order by|group by|limit|join|left join|right join|inner join)\b/gi, "\n$1").trim();
  if (slug === "html-formatter" || slug === "css-formatter") return value.replace(/></g, ">\n<").replace(/[{};]/g, (match) => `${match}\n`).replace(/\n{2,}/g, "\n").trim();
  if (slug === "markdown-previewer") return value.replace(/^# (.*)$/gm, "<h1>$1</h1>").replace(/^## (.*)$/gm, "<h2>$1</h2>").replace(/^- (.*)$/gm, "<li>$1</li>");
  if (slug.includes("citation") || slug.includes("reference")) return citationDraft(slug, value);
  if (slug.includes("caption") || slug.includes("bio")) return socialDraft(slug, value);
  if (slug.includes("schedule") || slug.includes("planner") || slug === "flashcard-generator" || slug === "pomodoro-timer") return studyDraft(slug, value);
  if (slug === "scientific-calculator") return calculateExpression(value);
  return `Prepared output for ${slug}\n\n${value}`;
}

function hex(buffer: ArrayBuffer) {
  return Array.from(new Uint8Array(buffer), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function decodeJwt(token: string) {
  const parts = token.split(".");
  if (parts.length < 2) return "This does not look like a JWT.";
  const decode = (part: string) => JSON.stringify(JSON.parse(atob(part.replace(/-/g, "+").replace(/_/g, "/"))), null, 2);
  try { return `Header\n${decode(parts[0])}\n\nPayload\n${decode(parts[1])}\n\nSignature is not verified by this tool.`; } catch { return "Unable to decode token payload."; }
}

function keywordDensity(text: string) {
  const words = text.toLowerCase().match(/[a-z0-9]{3,}/g) ?? [];
  const counts = new Map<string, number>();
  words.forEach((word) => counts.set(word, (counts.get(word) ?? 0) + 1));
  return Array.from(counts.entries()).sort((a, b) => b[1] - a[1]).slice(0, 20).map(([word, count]) => `${word}: ${count} (${((count / words.length) * 100).toFixed(2)}%)`).join("\n");
}

function youtubeThumbnails(url: string) {
  const id = url.match(/(?:v=|youtu\.be\/|shorts\/)([A-Za-z0-9_-]{6,})/)?.[1];
  if (!id) return "Could not find a YouTube video ID.";
  return ["maxresdefault", "hqdefault", "mqdefault", "sddefault"].map((name) => `https://img.youtube.com/vi/${id}/${name}.jpg`).join("\n");
}

function field(input: string, name: string) {
  return input.match(new RegExp(`${name}:\\s*(.+)`, "i"))?.[1]?.trim() ?? "";
}

function metaTags(input: string) {
  const title = field(input, "title") || "Page title";
  const description = field(input, "description") || "Page description";
  const url = field(input, "url") || "https://example.com/page";
  return `<title>${escapeHtml(title)}</title>\n<meta name="description" content="${escapeHtml(description)}" />\n<link rel="canonical" href="${escapeHtml(url)}" />\n<meta name="robots" content="index, follow" />`;
}

function openGraphTags(input: string) {
  const title = field(input, "title") || "Page title";
  const description = field(input, "description") || "Page description";
  const url = field(input, "url") || "https://example.com/page";
  const image = field(input, "image") || "https://example.com/og-image.jpg";
  return `<meta property="og:title" content="${escapeHtml(title)}" />\n<meta property="og:description" content="${escapeHtml(description)}" />\n<meta property="og:url" content="${escapeHtml(url)}" />\n<meta property="og:image" content="${escapeHtml(image)}" />\n<meta name="twitter:card" content="summary_large_image" />`;
}

function schemaMarkup(input: string) {
  return JSON.stringify({ "@context": "https://schema.org", "@type": field(input, "type") || "WebPage", name: field(input, "title") || "Page title", description: field(input, "description") || "Page description", url: field(input, "url") || "https://example.com/page" }, null, 2);
}

function curlToFetch(input: string) {
  const url = input.match(/https?:\/\/[^\s'"]+/)?.[0] ?? "https://example.com";
  const method = input.match(/-X\s+([A-Z]+)/)?.[1] ?? (input.includes("-d ") ? "POST" : "GET");
  return `fetch("${url}", {\n  method: "${method}",\n  headers: {\n    "Content-Type": "application/json"\n  }\n});`;
}

function testRegex(input: string) {
  const pattern = field(input, "pattern") || input.split("\n")[0];
  const text = field(input, "text") || input.split("\n").slice(1).join("\n");
  try {
    const matches = Array.from(text.matchAll(new RegExp(pattern, "g"))).map((match) => match[0]);
    return `Matches: ${matches.length}\n\n${matches.join("\n") || "No matches found."}`;
  } catch (error) {
    return `Invalid regex\n${error instanceof Error ? error.message : "Regex failed"}`;
  }
}

function citationDraft(slug: string, input: string) {
  const style = slug.includes("apa") ? "APA" : slug.includes("mla") ? "MLA" : "Harvard";
  return `${style} citation draft\n${input}\n\nReview punctuation, italics, capitalization, and source type against your required style guide.`;
}

function socialDraft(slug: string, input: string) {
  if (slug === "instagram-caption-formatter") return input.replace(/\n{3,}/g, "\n\n").trim();
  if (slug === "tiktok-caption-generator") return [`Quick tip: ${input}`, `Try this before your next post: ${input}`, `Save this if you care about ${input}`].join("\n");
  return [`${input}\nBuilding useful things and sharing the process.`, `${input}\nSimple, practical, and always learning.`, `${input}\nHelping people work faster with better tools.`].join("\n\n");
}

function studyDraft(slug: string, input: string) {
  if (slug === "flashcard-generator") return input.split("\n").filter(Boolean).map((line, index) => `Q${index + 1}: What should I remember about ${line}?\nA${index + 1}: ${line}`).join("\n\n");
  return `Study plan draft\n\n1. Review requirements\n2. Break the work into milestones\n3. Schedule focused blocks\n4. Review and revise\n\nInput:\n${input}`;
}

function calculateExpression(input: string) {
  const safe = input.replace(/\^/g, "**").replace(/\bsqrt\(/g, "Math.sqrt(").replace(/\bsin\(/g, "Math.sin(").replace(/\bcos\(/g, "Math.cos(").replace(/\btan\(/g, "Math.tan(");
  if (!/^[0-9+\-*/().\sMathsqrtincotaPIE*]+$/.test(safe)) return "Unsupported expression. Use numbers, +, -, *, /, parentheses, sqrt(), sin(), cos(), or tan().";
  try {
    // eslint-disable-next-line no-new-func
    return String(Function(`"use strict"; return (${safe})`)());
  } catch {
    return "Could not calculate that expression.";
  }
}

function escapeHtml(text: string) {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function AiResumeCoverLetterGenerator() {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [roleTitle, setRoleTitle] = useState("");
  const [tone, setTone] = useState("Professional");
  const [experienceLevel, setExperienceLevel] = useState("Student");
  const [outputType, setOutputType] = useState("Both");
  const [confirmed, setConfirmed] = useState(false);
  const [activeOutput, setActiveOutput] = useState<keyof AiResumeOutput>("resume");
  const [result, setResult] = useState<AiResumeOutput | null>(null);
  const [copied, setCopied] = useState("");
  const [usageCount, setUsageCount] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setUsageCount(readAiUsage().count);
  }, []);

  async function loadResume(files: File[]) {
    const next = files[0] ?? null;
    setResumeFile(next);
    setResult(null);
    setError("");
    if (!next) return;
    const name = next.name.toLowerCase();
    const isTxt = next.type === "text/plain" || name.endsWith(".txt");
    if (!isTxt) {
      if (next.type === "application/pdf" || name.endsWith(".pdf")) {
        setError("PDF resume upload is coming soon. Please copy and paste your resume text.");
      } else {
        setError("Only TXT resume upload is supported right now. Please copy and paste DOCX or PDF resume text.");
      }
      return;
    }

    try {
      setResumeText((await next.text()).trim());
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to read that TXT file.");
    }
  }

  async function copyText(label: string, content: string) {
    if (!content.trim()) return;
    await navigator.clipboard.writeText(content);
    setCopied(label);
    window.setTimeout(() => setCopied(""), 1600);
  }

  async function generate() {
    setError("");
    setCopied("");
    if (resumeText.trim().length < 200) {
      setError("Paste at least 200 characters of resume text before generating.");
      return;
    }
    if (jobDescription.trim().length < 100) {
      setError("Paste at least 100 characters of job description before generating.");
      return;
    }
    if (!confirmed) {
      setError("Please confirm that the generated content should only use your real experience.");
      return;
    }
    const usage = readAiUsage();
    if (usage.count >= AI_CLIENT_LIMIT) {
      setError("Daily free limit reached. Please try again tomorrow.");
      return;
    }
    setBusy(true);
    setResult({ resume: "", coverLetter: "", keywords: "", improvements: "" });
    setActiveOutput("resume");
    try {
      const trimmedResume = resumeText.slice(0, 3000);
      const trimmedJD = jobDescription.slice(0, 1500);
      const response = await fetch("/api/student-tools/ai-generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText: trimmedResume, jobDescription: trimmedJD, roleTitle, tone, experienceLevel, outputType })
      });

      if (!response.ok) {
        const contentType = response.headers.get("content-type") ?? "";
        const errorText = contentType.includes("application/json")
          ? String(((await response.json()) as { error?: string }).error ?? "")
          : await response.text();
        throw new Error(errorText || "Unable to generate right now.");
      }

      if (!response.body) throw new Error("Unable to stream AI output in this browser.");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let streamedText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        streamedText += decoder.decode(value, { stream: true });
        setResult({ resume: streamedText, coverLetter: "", keywords: "", improvements: "" });
      }

      streamedText += decoder.decode();
      if (streamedText.trim() === AI_RESUME_UNAVAILABLE_MESSAGE) {
        setResult(null);
        throw new Error(AI_RESUME_UNAVAILABLE_MESSAGE);
      }
      if (!streamedText.trim()) throw new Error("AI returned an empty response. Please try again.");
      const nextResult = parseAiResumeOutput(streamedText);
      setResult(nextResult);
      setActiveOutput(outputType === "Cover Letter" ? "coverLetter" : "resume");
      writeAiUsage(usage.count + 1);
      setUsageCount(usage.count + 1);
    } catch (err) {
      const message = err instanceof Error ? err.message : "";
      if (message === AI_RESUME_UNAVAILABLE_MESSAGE) {
        setError(AI_RESUME_UNAVAILABLE_MESSAGE);
      } else if (message.includes("Daily AI usage limit")) {
        setError("Daily AI usage limit reached. Please try again later.");
      } else if (message.includes("Resume text") || message.includes("Job description")) {
        setError(message);
      } else {
        setError(AI_RESUME_UNAVAILABLE_MESSAGE);
      }
    } finally {
      setBusy(false);
    }
  }

  function reset() {
    setResumeFile(null);
    setResumeText("");
    setJobDescription("");
    setRoleTitle("");
    setTone("Professional");
    setExperienceLevel("Student");
    setOutputType("Both");
    setConfirmed(false);
    setActiveOutput("resume");
    setResult(null);
    setCopied("");
    setError("");
  }

  const outputLabels: Record<keyof AiResumeOutput, string> = {
    resume: "Resume",
    coverLetter: "Cover Letter",
    keywords: "Keywords",
    improvements: "Improvements"
  };
  const currentOutput = result?.[activeOutput] ?? "";
  const resumeLength = resumeText.trim().length;
  const jobDescriptionLength = jobDescription.trim().length;
  const fileUploaded = Boolean(resumeFile);

  return (
    <div className="min-w-0 overflow-hidden">
      <div className="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.9fr)]">
        <div className="grid min-w-0 gap-5">
          <div className="min-w-0">
            <p className="mb-2 text-sm font-bold text-slate-700">Optional TXT upload</p>
            <FileUploadDropzone label="Upload a TXT resume" accept=".txt,text/plain" onFiles={loadResume} />
            {resumeFile ? (
              <FileInfo file={resumeFile} />
            ) : !resumeText.trim() ? (
              <p className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm font-semibold text-slate-500">
                Choose a file or paste your resume text to enable this tool.
              </p>
            ) : null}
            <p className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm font-bold leading-6 text-slate-600">
              PDF resume upload is coming soon. Please copy and paste your resume text.
            </p>
          </div>
          {resumeText ? (
            <div className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-black uppercase tracking-wide text-slate-500">Resume preview</p>
              <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-relaxed text-slate-700 [overflow-wrap:anywhere]">{resumeText.slice(0, 500)}{resumeText.length > 500 ? "..." : ""}</p>
            </div>
          ) : null}
          <label className="text-sm font-bold text-slate-700">
            Paste your resume
            <Textarea
              className="mt-2 min-h-72"
              value={resumeText}
              onChange={(event) => {
                setResumeText(event.target.value);
                setResult(null);
                setError("");
              }}
              onPaste={(event) => {
                setTimeout(() => {
                  const el = event.target as HTMLTextAreaElement;
                  setResumeText(el.value);
                }, 0);
              }}
              placeholder="Paste your resume here."
            />
          </label>
          <div className="flex min-w-0 flex-col gap-2 text-xs font-semibold text-slate-500 sm:flex-row sm:items-center sm:justify-between">
            <p className="min-w-0 break-words [overflow-wrap:anywhere]">Copy your resume from Word, PDF, or LinkedIn and paste it here.</p>
            <p className="font-black text-slate-600">{resumeLength.toLocaleString()} characters</p>
          </div>
          <p className="break-words rounded-2xl border border-slate-200 bg-white p-4 text-sm font-bold leading-6 text-slate-600 [overflow-wrap:anywhere]">
            For PDF resumes, copy the text from your PDF and paste it here. PDF upload support is coming soon.
          </p>
          {resumeLength > 0 && resumeLength < 200 ? (
            <p className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm font-bold leading-6 text-amber-800">
              Add at least {200 - resumeLength} more characters of resume text before generating.
            </p>
          ) : null}
          <label className="text-sm font-bold text-slate-700">
            Job description
            <Textarea className="mt-2 min-h-56" value={jobDescription} onChange={(event) => setJobDescription(event.target.value)} placeholder="Paste job description here..." />
          </label>
          <p className="text-xs font-black text-slate-600">{jobDescriptionLength.toLocaleString()} job description characters</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-bold text-slate-700">Role title <Input className="mt-2" value={roleTitle} onChange={(event) => setRoleTitle(event.target.value)} placeholder="Software Intern, Marketing Assistant..." /></label>
            <label className="text-sm font-bold text-slate-700">Tone <Select className="mt-2" value={tone} onChange={(event) => setTone(event.target.value)}>{["Professional", "Friendly", "Confident"].map((item) => <option key={item}>{item}</option>)}</Select></label>
            <label className="text-sm font-bold text-slate-700">Experience level <Select className="mt-2" value={experienceLevel} onChange={(event) => setExperienceLevel(event.target.value)}>{["Student", "Graduate", "Entry-level"].map((item) => <option key={item}>{item}</option>)}</Select></label>
            <label className="text-sm font-bold text-slate-700">Output type <Select className="mt-2" value={outputType} onChange={(event) => setOutputType(event.target.value)}>{["Resume", "Cover Letter", "Both"].map((item) => <option key={item}>{item}</option>)}</Select></label>
          </div>
          <label className="flex gap-3 rounded-2xl border border-brand-100 bg-brand-50 p-4 text-sm font-bold leading-6 text-brand-800">
            <input className="mt-1 h-5 w-5 accent-brand-600" type="checkbox" checked={confirmed} onChange={(event) => setConfirmed(event.target.checked)} />
            I confirm the generated content should only use my real experience.
          </label>
          <div className="flex flex-wrap gap-3">
            <Button onClick={generate} disabled={!resumeText.trim() && !fileUploaded}>
              {busy ? "Generating..." : "Generate"}
            </Button>
            <SecondaryButton onClick={reset}>Reset</SecondaryButton>
          </div>
          <p className="rounded-2xl border border-slate-200 bg-white p-4 text-sm font-bold leading-6 text-slate-600">
            This tool improves your resume using AI based on your input. Always review before using.
          </p>
          <p className="text-xs font-semibold text-slate-500">Daily free usage: {usageCount}/{AI_CLIENT_LIMIT} requests used in this browser.</p>
          {busy ? <p className="rounded-2xl bg-slate-50 p-4 text-sm font-bold text-slate-600">Generating your tailored resume and cover letter...</p> : null}
          <ErrorMessage message={error} />
        </div>

        <div className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="grid grid-cols-2 gap-2 rounded-2xl bg-slate-100 p-1 sm:grid-cols-4">
            {(Object.keys(outputLabels) as Array<keyof AiResumeOutput>).map((key) => (
              <button key={key} className={`min-w-0 rounded-xl px-2 py-3 text-xs font-black leading-tight sm:px-3 sm:text-sm ${activeOutput === key ? "bg-white text-brand-700 shadow-sm" : "text-slate-600"}`} onClick={() => setActiveOutput(key)}>
                {outputLabels[key]}
              </button>
            ))}
          </div>
          <div className="mt-4 min-h-[28rem] min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-4">
            {currentOutput ? (
              <pre className="max-w-full whitespace-pre-wrap break-words text-sm leading-7 text-slate-800 [overflow-wrap:anywhere]">{currentOutput}</pre>
            ) : (
              <div className="flex min-h-[24rem] items-center justify-center text-center">
                <div className="min-w-0">
                  <p className="break-words text-lg font-black text-slate-900 [overflow-wrap:anywhere]">Your AI output will appear here</p>
                  <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">Your AI output will appear here.</p>
                </div>
              </div>
            )}
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            <SecondaryButton onClick={() => copyText(outputLabels[activeOutput], currentOutput)} disabled={!currentOutput}>
              {copied === outputLabels[activeOutput] ? "Copied" : "Copy"}
            </SecondaryButton>
            <SecondaryButton onClick={() => downloadTextFile(`${activeOutput}.txt`, currentOutput)} disabled={!currentOutput}>
              Download TXT
            </SecondaryButton>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ToolRunner({ slug }: { slug: string }) {
  if (aiExpansionSlugs.has(slug)) return <GeminiAiTool slug={slug} />;
  if (fileWorkflowSlugs.has(slug)) return <FileWorkflowTool slug={slug} />;
  if (utilityLabels[slug]) return <LightweightUtilityTool slug={slug} />;

  const map: Record<string, React.ReactNode> = {
    "image-compressor": <ImageCompressor />,
    "png-to-jpg": <ImageConverter mode="png-to-jpg" />,
    "jpg-to-png": <ImageConverter mode="jpg-to-png" />,
    "webp-converter": <ImageConverter mode="webp" />,
    "image-resizer": <ImageResizer />,
    "image-to-pdf": <ImageToPdf />,
    "image-to-word": <ImageToWord />,
    "ai-image-to-word": <AiImageToWord />,
    "merge-pdf": <PdfTool mode="merge" />,
    "split-pdf": <PdfTool mode="split" />,
    "compress-pdf": <PdfTool mode="compress" />,
    "rotate-pdf": <PdfTool mode="rotate" />,
    "extract-pdf-pages": <PdfTool mode="extract" />,
    "gpa-calculator": <GpaCalculator />,
    "cgpa-calculator": <CgpaCalculator />,
    "grade-percentage-calculator": <GradePercentageCalculator />,
    "study-timer": <StudyTimer />,
    "word-counter": <WordCounter />,
    "qr-code-generator": <QrCodeGenerator />,
    "case-converter": <CaseConverter />,
    "word-to-pdf": <WordToPdf />,
    "pdf-to-word": <PdfToWord />,
    "pdf-to-jpg": <PdfToJpg />,
    "ocr-pdf": <OcrPdfTool />,
    "pdf-to-excel": <PdfToExcelTool />,
    "edit-pdf": <EditPdfTool />,
    "pdf-unlock": <PdfUnlockTool />,
    "url-encoder-decoder": <UrlEncoderDecoder />,
    "json-formatter": <JsonFormatter />,
    "password-generator": <PasswordGenerator />,
    "uuid-generator": <UuidGenerator />,
    "base64-encoder-decoder": <Base64EncoderDecoder />,
    "age-calculator": <AgeCalculator />,
    "unit-converter": <UnitConverter />,
    "percentage-calculator": <PercentageCalculator />,
    "discount-calculator": <DiscountCalculator />,
    "bmi-calculator": <BmiCalculator />,
    "loan-emi-calculator": <LoanEmiCalculator />,
    "time-zone-converter": <TimeZoneConverter />,
    "palworld-breeding-calculator": <PalworldBreedingCalculator />,
    "valorant-sensitivity-converter": <ValorantSensitivityConverter />,
    "minecraft-crafting-calculator": <MinecraftCraftingCalculator />,
    "pokemon-type-calculator": <PokemonTypeCalculator />,
    "text-formatter": <TextFormatter />,
    "duplicate-line-remover": <DuplicateLineRemover />,
    "random-text-generator": <RandomTextGenerator />,
    "text-sorter": <TextSorter />,
    "remove-extra-spaces": <RemoveExtraSpaces />,
    "image-cropper": <ImageCropper />,
    "image-to-base64": <ImageToBase64 />,
    "final-grade-calculator": <FinalGradeCalculator />,
    "weighted-grade-calculator": <WeightedGradeCalculator />,
    "attendance-calculator": <AttendanceCalculator />,
    "interest-calculator": <InterestCalculator />,
    "shift-hours-calculator": <ShiftHoursCalculator />,
    "gpa-to-percentage-converter": <GpaToPercentageConverter />,
    "image-rotator": <AdvancedImageConverter mode="rotate" />,
    "image-converter": <AdvancedImageConverter mode="convert" />,
    "image-watermark": <AdvancedImageConverter mode="watermark" />,
    "image-metadata": <ImageMetadataTool />,
    "image-color-picker": <ImageColorPicker />,
    "image-dpi-checker": <ImageMetadataTool dpiOnly />,
    "image-grayscale": <AdvancedImageConverter mode="grayscale" />,
    "image-upscaler": <ImageUpscalerTool />,
    "invoice-generator": <InvoiceGeneratorTool />,
    "add-text-to-pdf": <AddTextToPdf />,
    "ai-resume-cover-letter": <AiResumeCoverLetterGenerator />,
    "ai-text-summarizer": <GeminiAiTool slug="ai-text-summarizer" />,
    "paraphrasing-tool": <GeminiAiTool slug="paraphrasing-tool" />,
    "keyword-extractor": <GeminiAiTool slug="keyword-extractor" />,
    "grammar-fixer": <GeminiAiTool slug="grammar-fixer" />,
    "title-generator": <GeminiAiTool slug="title-generator" />,
    "bio-generator": <GeminiAiTool slug="bio-generator" />,
    "faq-generator": <GeminiAiTool slug="faq-generator" />,
    "text-to-bullet-points": <GeminiAiTool slug="text-to-bullet-points" />,
    "ai-study-notes": <GeminiAiTool slug="ai-study-notes" />,
    "explain-simple": <GeminiAiTool slug="explain-simple" />,
    "ai-email-writer": <GeminiAiTool slug="ai-email-writer" />,
    "chat-reply-generator": <GeminiAiTool slug="chat-reply-generator" />,
    "content-rewriter": <GeminiAiTool slug="content-rewriter" />,
    "productivity-assistant": <GeminiAiTool slug="productivity-assistant" />,
    "ai-caption-generator": <GeminiAiTool slug="ai-caption-generator" />,
    "ai-youtube-title-generator": <GeminiAiTool slug="ai-youtube-title-generator" />,
    "ai-hashtag-generator": <GeminiAiTool slug="ai-hashtag-generator" />,
    "resume-ats-checker": <GeminiAiTool slug="resume-ats-checker" />
  };

  return <div>{map[slug] ?? <p className="text-sm text-slate-600">Tool coming soon.</p>}</div>;
}

export default ToolRunner;
