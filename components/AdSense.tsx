"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT || "ca-pub-7576421865674261";
const ADSENSE_SRC = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`;
const SCRIPT_ID = "freetoolkit-adsbygoogle";

let scriptPromise: Promise<void> | null = null;

function loadAdSense() {
  if (typeof window === "undefined") return Promise.resolve();

  const existing = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
  if (!scriptPromise) {
    scriptPromise = new Promise<void>((resolve, reject) => {
      const script = existing ?? document.createElement("script");
      script.id = SCRIPT_ID;
      script.async = true;
      script.crossOrigin = "anonymous";
      script.src = ADSENSE_SRC;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("Unable to load Google AdSense."));

      if (!existing) document.head.appendChild(script);
    });
  }

  return scriptPromise.then(() => {
    window.adsbygoogle = window.adsbygoogle || [];
    window.adsbygoogle.push({});
  });
}

export function AdSense({
  adSlot,
  adFormat = "auto",
  priority = false
}: {
  adSlot: string;
  adFormat?: string;
  priority?: boolean;
}) {
  const loadedRef = useRef(false);

  useEffect(() => {
    const load = () => {
      if (!adSlot || loadedRef.current) return;
      loadedRef.current = true;
      loadAdSense().catch((error) => {
        loadedRef.current = false;
        console.error("AdSense failed to load", error);
      });
    };

    if (priority) {
      load();
      return;
    }

    if (typeof window.requestIdleCallback === "function") {
      const id = window.requestIdleCallback(load, { timeout: 4000 });
      return () => window.cancelIdleCallback(id);
    }

    const id = window.setTimeout(load, 3000);
    return () => window.clearTimeout(id);
  }, [adSlot, priority]);

  return (
    <ins
      className="adsbygoogle block"
      data-ad-client={ADSENSE_CLIENT}
      data-ad-slot={adSlot}
      data-ad-format={adFormat}
      data-full-width-responsive="true"
    />
  );
}
