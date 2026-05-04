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
    "word-counter": <WordCounter />
  };

  return <div>{map[slug] ?? <p className="text-sm text-slate-600">Tool coming soon.</p>}</div>;
}
