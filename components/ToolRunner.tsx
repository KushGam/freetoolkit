"use client";

/* eslint-disable @next/next/no-img-element */
import { useEffect, useMemo, useRef, useState } from "react";
import { FileUploadDropzone } from "@/components/FileUploadDropzone";
import { Button, Input, SecondaryButton, Select, Textarea } from "@/components/ui";
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
  const parts = new Intl.DateTimeFormat("en-US", { timeZone, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }).formatToParts(date);
  const map = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return Date.UTC(Number(map.year), Number(map.month) - 1, Number(map.day), Number(map.hour), Number(map.minute), Number(map.second)) - date.getTime();
}

function dateTimeInZone(value: string, timeZone: string) {
  const [datePart, timePart = "00:00"] = value.split("T");
  const [year, month, day] = datePart.split("-").map(Number);
  const [hour, minute] = timePart.split(":").map(Number);
  const guess = new Date(Date.UTC(year, month - 1, day, hour, minute, 0));
  return new Date(guess.getTime() - zoneOffset(guess, timeZone));
}

function TimeZoneConverter() {
  const now = new Date();
  const localValue = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}T${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
  const timeZones = useMemo(() => getTimeZoneOptions(), []);
  const [from, setFrom] = useState("Australia/Sydney");
  const [to, setTo] = useState("Europe/London");
  const [value, setValue] = useState(localValue);
  const [result, setResult] = useState<{ source: string; target: string } | null>(null);
  function convert() {
    const date = dateTimeInZone(value, from);
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
      <div className="mt-4 flex flex-wrap gap-3"><Button onClick={convert}>Convert time</Button><SecondaryButton onClick={() => setResult(null)}>Reset result</SecondaryButton></div>
      {result ? <div className="mt-5 grid gap-3 sm:grid-cols-2"><ResultBox label="Source time" value={result.source} /><ResultBox label="Converted time" value={result.target} /></div> : null}
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

const AI_USAGE_KEY = "freetoolkit_ai_student_usage";
const AI_CLIENT_LIMIT = 3;

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
  const [extracting, setExtracting] = useState(false);
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
    const isSupported = name.endsWith(".txt") || name.endsWith(".pdf") || name.endsWith(".docx");
    if (!isSupported) {
      setError("Please upload a PDF, Word DOCX, or TXT resume file.");
      return;
    }

    setExtracting(true);
    try {
      const formData = new FormData();
      formData.append("action", "extract");
      formData.append("resumeFile", next);
      const response = await fetch("/api/student-tools/ai-generate", { method: "POST", body: formData });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to extract resume text.");
      setResumeText(String(data.resumeText ?? "").trim());
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to extract resume text.");
    } finally {
      setExtracting(false);
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
    if (!resumeText.trim()) {
      setError("Paste your resume or upload a .txt resume before generating.");
      return;
    }
    if (!jobDescription.trim()) {
      setError("Paste the job description before generating.");
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
    try {
      const response = await fetch("/api/student-tools/ai-generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText, jobDescription, roleTitle, tone, experienceLevel, outputType })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to generate right now.");
      const nextResult = {
        resume: String(data.resume ?? "").trim(),
        coverLetter: String(data.coverLetter ?? "").trim(),
        keywords: String(data.keywords ?? "").trim(),
        improvements: String(data.improvements ?? "").trim()
      };
      setResult(nextResult);
      setActiveOutput(outputType === "Cover Letter" ? "coverLetter" : "resume");
      writeAiUsage(usage.count + 1);
      setUsageCount(usage.count + 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to generate right now.");
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
    setExtracting(false);
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

  return (
    <div>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(340px,0.9fr)]">
        <div className="grid gap-5">
          <div>
            <p className="mb-2 text-sm font-bold text-slate-700">Upload your resume (PDF, Word, or TXT)</p>
            <FileUploadDropzone label="Upload your resume" accept=".pdf,.docx,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain" onFiles={loadResume} />
            <FileInfo file={resumeFile} />
            {extracting ? <p className="mt-3 rounded-2xl bg-slate-50 p-4 text-sm font-bold text-slate-600">Extracting resume text...</p> : null}
          </div>
          {resumeText ? (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-black uppercase tracking-wide text-slate-500">Extracted preview</p>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-slate-700">{resumeText.slice(0, 500)}{resumeText.length > 500 ? "..." : ""}</p>
            </div>
          ) : null}
          <label className="text-sm font-bold text-slate-700">
            Or paste your resume
            <Textarea
              className="mt-2 min-h-72"
              value={resumeText}
              onChange={(event) => {
                setResumeText(event.target.value);
                setResult(null);
                setError("");
              }}
              placeholder="Paste your resume here. You can copy your resume from Word or PDF."
            />
          </label>
          <div className="flex flex-col gap-2 text-xs font-semibold text-slate-500 sm:flex-row sm:items-center sm:justify-between">
            <p>You can upload a PDF, Word, or TXT file above, or paste resume text manually and edit it before generating.</p>
            <p className="font-black text-slate-600">{resumeLength.toLocaleString()} characters</p>
          </div>
          {resumeLength > 0 && resumeLength < 250 ? (
            <p className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm font-bold leading-6 text-amber-800">
              Please provide more details in your resume for better results.
            </p>
          ) : null}
          <label className="text-sm font-bold text-slate-700">
            Job description
            <Textarea className="mt-2 min-h-56" value={jobDescription} onChange={(event) => setJobDescription(event.target.value)} placeholder="Paste job description here..." />
          </label>
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
            <Button onClick={generate} disabled={busy || extracting || !confirmed || !resumeText.trim() || !jobDescription.trim()}>
              {busy ? "Generating..." : "Generate"}
            </Button>
            <SecondaryButton onClick={reset}>Reset</SecondaryButton>
          </div>
          <p className="rounded-2xl border border-slate-200 bg-white p-4 text-sm font-bold leading-6 text-slate-600">
            This tool improves your resume using AI based on your input. Always review before using.
          </p>
          <p className="text-xs font-semibold text-slate-500">Daily free usage: {usageCount}/{AI_CLIENT_LIMIT} requests used in this browser.</p>
          {busy ? <p className="rounded-2xl bg-slate-50 p-4 text-sm font-bold text-slate-600">Analyzing your resume and generating tailored content...</p> : null}
          <ErrorMessage message={error} />
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="grid grid-cols-2 gap-2 rounded-2xl bg-slate-100 p-1 sm:grid-cols-4">
            {(Object.keys(outputLabels) as Array<keyof AiResumeOutput>).map((key) => (
              <button key={key} className={`rounded-xl px-3 py-3 text-xs font-black sm:text-sm ${activeOutput === key ? "bg-white text-brand-700 shadow-sm" : "text-slate-600"}`} onClick={() => setActiveOutput(key)}>
                {outputLabels[key]}
              </button>
            ))}
          </div>
          <div className="mt-4 min-h-[28rem] rounded-2xl border border-slate-200 bg-slate-50 p-4">
            {currentOutput ? (
              <pre className="whitespace-pre-wrap break-words text-sm leading-7 text-slate-800">{currentOutput}</pre>
            ) : (
              <div className="flex min-h-[24rem] items-center justify-center text-center">
                <div>
                  <p className="text-lg font-black text-slate-900">Your AI output will appear here</p>
                  <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">Upload or paste your resume, add a job description, and generate polished content that you can review, copy, or download.</p>
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
  const map: Record<string, React.ReactNode> = {
    "image-compressor": <ImageCompressor />,
    "png-to-jpg": <ImageConverter mode="png-to-jpg" />,
    "jpg-to-png": <ImageConverter mode="jpg-to-png" />,
    "webp-converter": <ImageConverter mode="webp" />,
    "image-resizer": <ImageResizer />,
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
    "url-encoder-decoder": <UrlEncoderDecoder />,
    "json-formatter": <JsonFormatter />,
    "password-generator": <PasswordGenerator />,
    "uuid-generator": <UuidGenerator />,
    "base64-encoder-decoder": <Base64EncoderDecoder />,
    "age-calculator": <AgeCalculator />,
    "unit-converter": <UnitConverter />,
    "percentage-calculator": <PercentageCalculator />,
    "loan-emi-calculator": <LoanEmiCalculator />,
    "time-zone-converter": <TimeZoneConverter />,
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
    "gpa-to-percentage-converter": <GpaToPercentageConverter />,
    "image-rotator": <AdvancedImageConverter mode="rotate" />,
    "image-converter": <AdvancedImageConverter mode="convert" />,
    "image-watermark": <AdvancedImageConverter mode="watermark" />,
    "image-metadata": <ImageMetadataTool />,
    "image-color-picker": <ImageColorPicker />,
    "image-dpi-checker": <ImageMetadataTool dpiOnly />,
    "image-grayscale": <AdvancedImageConverter mode="grayscale" />,
    "add-text-to-pdf": <AddTextToPdf />,
    "ai-resume-cover-letter": <AiResumeCoverLetterGenerator />
  };

  return <div>{map[slug] ?? <p className="text-sm text-slate-600">Tool coming soon.</p>}</div>;
}
