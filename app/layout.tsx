import type { Metadata } from "next";
import Script from "next/script";
import { Inter } from "next/font/google";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ConsentLoader } from "@/components/ConsentLoader";
import { AdSlot } from "@/components/AdSlot";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.freetoolkitapp.com"),

  title: "FreeToolKit — Free AI & Everyday Productivity Tools",

  description:
    "Use free AI and everyday productivity tools for PDFs, images, resumes, writing, calculators, student work, and developer utilities. Fast, browser-based, and no signup required.",

  keywords: [
    "free AI tools",
    "online tools",
    "PDF tools",
    "image tools",
    "resume tools",
    "AI productivity tools",
    "student tools",
    "developer tools",
    "browser-based tools",
    "free utilities",
  ],

  alternates: {
    canonical: "https://www.freetoolkitapp.com",
  },

  openGraph: {
    title: "FreeToolKit — Free AI & Everyday Productivity Tools",

    description:
      "Free browser-based AI and productivity tools for PDFs, images, resumes, calculators, students, and developers.",

    url: "https://www.freetoolkitapp.com",

    siteName: "FreeToolKit",

    type: "website",

    images: [
      {
        url: "https://www.freetoolkitapp.com/og-image.png?v=2",
        width: 1200,
        height: 630,
        alt: "FreeToolKit — Free AI & Everyday Productivity Tools",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",

    title: "FreeToolKit — Free AI & Everyday Productivity Tools",

    description:
      "Free browser-based tools for AI writing, PDFs, images, resumes, calculators, students, and developers.",

    images: ["https://www.freetoolkitapp.com/og-image.png?v=2"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-LT7YSXB2PP"
          strategy="lazyOnload"
        />

        <Script id="google-analytics" strategy="lazyOnload">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-LT7YSXB2PP');
          `}
        </Script>

        <Header />
        {children}
        <Footer />
        <AdSlot priority />
        <ConsentLoader />
      </body>
    </html>
  );
}