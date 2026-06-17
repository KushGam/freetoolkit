export type QrErrorCorrection = "L" | "M" | "Q" | "H";

export type QrRenderOptions = {
  width: number;
  margin?: number;
  errorCorrectionLevel?: QrErrorCorrection;
};

async function getQrApi() {
  const mod = await import("qrcode");
  const api = mod.default ?? mod;
  if (typeof api.toDataURL !== "function") {
    throw new Error("QR code library failed to load in this browser.");
  }
  return api;
}

export async function qrCodeToDataUrl(text: string, options: QrRenderOptions): Promise<string> {
  const api = await getQrApi();
  return api.toDataURL(text, {
    width: options.width,
    margin: options.margin ?? 2,
    errorCorrectionLevel: options.errorCorrectionLevel ?? "M"
  });
}

export async function qrCodeToCanvas(
  canvas: HTMLCanvasElement,
  text: string,
  options: QrRenderOptions
): Promise<void> {
  const api = await getQrApi();
  if (typeof api.toCanvas === "function") {
    await api.toCanvas(canvas, text, {
      width: options.width,
      margin: options.margin ?? 2,
      errorCorrectionLevel: options.errorCorrectionLevel ?? "M"
    });
    return;
  }
  const dataUrl = await api.toDataURL(text, {
    width: options.width,
    margin: options.margin ?? 2,
    errorCorrectionLevel: options.errorCorrectionLevel ?? "M"
  });
  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Unable to render QR preview."));
    img.src = dataUrl;
  });
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas is not supported in this browser.");
  canvas.width = options.width;
  canvas.height = options.width;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
}
