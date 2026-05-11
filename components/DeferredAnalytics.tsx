"use client";

import { useEffect } from "react";

const GA_SRC = "https://www.googletagmanager.com/gtag/js?id=G-LT7YSXB2PP";
const GA_SCRIPT_ID = "freetoolkit-ga-script";
const GA_BOOT_ID = "freetoolkit-ga-boot";

function injectAnalytics() {
  if (typeof window === "undefined") return;
  if (document.getElementById(GA_SCRIPT_ID)) return;

  const script = document.createElement("script");
  script.id = GA_SCRIPT_ID;
  script.async = true;
  script.src = GA_SRC;
  document.head.appendChild(script);

  const boot = document.createElement("script");
  boot.id = GA_BOOT_ID;
  boot.text = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-LT7YSXB2PP');
  `;
  document.head.appendChild(boot);
}

export function DeferredAnalytics() {
  useEffect(() => {
    let timeoutId = window.setTimeout(injectAnalytics, 10000);
    const onFirstInteraction = () => {
      window.clearTimeout(timeoutId);
      injectAnalytics();
      window.removeEventListener("pointerdown", onFirstInteraction);
      window.removeEventListener("keydown", onFirstInteraction);
      window.removeEventListener("scroll", onFirstInteraction);
    };

    window.addEventListener("pointerdown", onFirstInteraction, { once: true, passive: true });
    window.addEventListener("keydown", onFirstInteraction, { once: true });
    window.addEventListener("scroll", onFirstInteraction, { once: true, passive: true });

    return () => {
      window.clearTimeout(timeoutId);
      window.removeEventListener("pointerdown", onFirstInteraction);
      window.removeEventListener("keydown", onFirstInteraction);
      window.removeEventListener("scroll", onFirstInteraction);
    };
  }, []);

  return null;
}
