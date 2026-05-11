"use client";

import { useEffect } from "react";

const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT || "ca-pub-7576421865674261";
const FUNDING_CHOICES_ID = "freetoolkit-fundingchoices";
const FUNDING_CHOICES_SRC = `https://fundingchoicesmessages.google.com/i/${ADSENSE_CLIENT.replace("ca-", "")}?ers=1`;

function loadFundingChoices() {
  if (typeof document === "undefined" || document.getElementById(FUNDING_CHOICES_ID)) return;

  const script = document.createElement("script");
  script.id = FUNDING_CHOICES_ID;
  script.async = true;
  script.src = FUNDING_CHOICES_SRC;
  script.crossOrigin = "anonymous";
  document.head.appendChild(script);
}

function onLcp(callback: () => void) {
  if (typeof window === "undefined") return () => {};

  let timeoutId = window.setTimeout(callback, 12000);

  if (!("PerformanceObserver" in window)) {
    return () => window.clearTimeout(timeoutId);
  }

  try {
    const observer = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      if (entries.length === 0) return;
      window.clearTimeout(timeoutId);
      window.setTimeout(callback, 4000);
      observer.disconnect();
    });

    observer.observe({ type: "largest-contentful-paint", buffered: true });
    return () => {
      window.clearTimeout(timeoutId);
      observer.disconnect();
    };
  } catch {
    return () => window.clearTimeout(timeoutId);
  }
}

export function ConsentLoader() {
  useEffect(() => onLcp(loadFundingChoices), []);
  return null;
}
