"use client";

import { useRef } from "react";
import { SecondaryButton } from "@/components/ui";

export function FileUploadDropzone({
  label,
  accept,
  multiple,
  onFiles
}: {
  label: string;
  accept: string;
  multiple?: boolean;
  onFiles: (files: File[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div
      className="group min-w-0 overflow-hidden rounded-2xl border-2 border-dashed border-slate-200 bg-gradient-to-b from-slate-50 to-white p-5 text-center shadow-inner transition hover:border-brand-300 hover:bg-brand-50/40 sm:p-7"
      onDragOver={(event) => event.preventDefault()}
      onDrop={(event) => {
        event.preventDefault();
        onFiles(Array.from(event.dataTransfer.files));
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        className="hidden"
        onChange={(event) => onFiles(Array.from(event.target.files ?? []))}
      />
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-xs font-black text-brand-700 shadow-sm ring-1 ring-slate-200 transition group-hover:ring-brand-200">
        FILE
      </div>
      <p className="mt-4 break-words text-base font-black text-slate-900 [overflow-wrap:anywhere]">{label}</p>
      <p className="mx-auto mt-1 max-w-md break-words text-sm leading-6 text-slate-500 [overflow-wrap:anywhere]">Drag and drop files here, or choose files from your device. Your file stays in the browser where supported.</p>
      <SecondaryButton className="mt-4" type="button" onClick={() => inputRef.current?.click()}>
        Choose file{multiple ? "s" : ""}
      </SecondaryButton>
    </div>
  );
}
