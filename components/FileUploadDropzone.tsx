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
      className="group min-w-0 overflow-hidden rounded-2xl border-2 border-dashed border-white/[0.08] bg-gradient-to-b from-surface-section to-surface-card p-5 text-center shadow-inner transition hover:border-indigo-400/30 hover:bg-white/[0.03] sm:p-7"
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
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/[0.08] bg-surface-elevated text-xs font-black text-indigo-400 shadow-sm transition group-hover:border-indigo-400/30">
        FILE
      </div>
      <p className="mt-4 break-words text-base font-black text-ink-primary [overflow-wrap:anywhere]">{label}</p>
      <p className="mx-auto mt-1 max-w-md break-words text-sm leading-6 text-ink-muted [overflow-wrap:anywhere]">Drag and drop files here, or choose files from your device. Your file stays in the browser where supported.</p>
      <SecondaryButton className="mt-4" type="button" onClick={() => inputRef.current?.click()}>
        Choose file{multiple ? "s" : ""}
      </SecondaryButton>
    </div>
  );
}
