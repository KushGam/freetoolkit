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

function loadAdsenseScript() {
  if (typeof window === "undefined") return Promise.resolve();

  const existing = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
  if (existing?.dataset.loaded === "true") return Promise.resolve();
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise<void>((resolve, reject) => {
    const script = existing ?? document.createElement("script");
    script.id = SCRIPT_ID;
    script.async = true;
    script.crossOrigin = "anonymous";
    script.src = ADSENSE_SRC;
    script.onload = () => {
      script.dataset.loaded = "true";
      resolve();
    };
    script.onerror = () => reject(new Error("Unable to load Google AdSense."));

    if (!existing) document.head.appendChild(script);
  });

  return scriptPromise;
}

function runWhenIdle(callback: () => void) {
  if (typeof window === "undefined") return () => {};

  if ("requestIdleCallback" in window && window.requestIdleCallback) {
    const id = window.requestIdleCallback(callback, { timeout: 2000 });
    return () => window.cancelIdleCallback?.(id);
  }

  const id = window.setTimeout(callback, 2000);
  return () => window.clearTimeout(id);
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
  const adRef = useRef<HTMLModElement | null>(null);
  const loadedRef = useRef(false);

  useEffect(() => {
    if (!adSlot || loadedRef.current) return;

    let cleanup = () => {};
    let observer: IntersectionObserver | null = null;
    let cancelled = false;

    const load = () => {
      if (cancelled || loadedRef.current) return;
      loadedRef.current = true;
      loadAdsenseScript()
        .then(() => {
          if (cancelled) return;
          window.adsbygoogle = window.adsbygoogle || [];
          window.adsbygoogle.push({});
        })
        .catch((error) => {
          loadedRef.current = false;
          console.error("AdSense failed to load", error);
        });
    };

    if (priority) {
      load();
    } else if ("IntersectionObserver" in window && adRef.current) {
      observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting)) {
            observer?.disconnect();
            cleanup = runWhenIdle(load);
          }
        },
        { rootMargin: "600px 0px" }
      );
      observer.observe(adRef.current);
    } else {
      cleanup = runWhenIdle(load);
    }

    return () => {
      cancelled = true;
      observer?.disconnect();
      cleanup();
    };
  }, [adSlot, priority]);

  return (
    <ins
      ref={adRef}
      className="adsbygoogle block"
      data-ad-client={ADSENSE_CLIENT}
      data-ad-slot={adSlot}
      data-ad-format={adFormat}
      data-full-width-responsive="true"
    />
  );
}
