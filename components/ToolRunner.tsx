"use client";

/* eslint-disable @next/next/no-img-element */
import { useEffect, useMemo, useState } from "react";
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
  const [text, setText] = useState("https://freetoolkit.com");
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

const timeZones = [
  ["Australia/Sydney", "Sydney"],
  ["Europe/London", "London"],
  ["America/New_York", "New York"],
  ["America/Los_Angeles", "Los Angeles"],
  ["Asia/Tokyo", "Tokyo"],
  ["Asia/Dubai", "Dubai"],
  ["Asia/Kathmandu", "Kathmandu"],
  ["Asia/Kolkata", "Delhi"]
];

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

  async function load(files: File[]) {
    const next = files[0] ?? null;
    setFile(next);
    setOutput(null);
    setError("");
    if (preview) URL.revokeObjectURL(preview);
    if (!next) return;
    const image = await fileToImage(next);
    const start = Math.min(image.naturalWidth, image.naturalHeight);
    setNatural({ width: image.naturalWidth, height: image.naturalHeight });
    setCrop({ x: 0, y: 0, width: start, height: start });
    setPreview(URL.createObjectURL(next));
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
    setCrop(merged);
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
          <div className="mt-5 grid gap-2 sm:grid-cols-4">{[["free", "Free"], ["1:1", "1:1"], ["16:9", "16:9"], ["4:3", "4:3"]].map(([value, label]) => <button key={value} className={`rounded-2xl border px-4 py-3 text-sm font-black ${ratio === value ? "border-brand-200 bg-brand-50 text-brand-700" : "border-slate-200 bg-white text-slate-700"}`} onClick={() => setRatio(value)}>{label}</button>)}</div>
          <p className="mt-4 text-sm font-bold text-slate-600">Image size: {natural.width} × {natural.height}px</p>
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
    "image-to-base64": <ImageToBase64 />
  };

  return <div>{map[slug] ?? <p className="text-sm text-slate-600">Tool coming soon.</p>}</div>;
}
