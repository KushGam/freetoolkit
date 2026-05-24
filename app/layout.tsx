import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ConsentLoader } from "@/components/ConsentLoader";
import { AdSlot } from "@/components/AdSlot";
import { DeferredAnalytics } from "@/components/DeferredAnalytics";
import { buildGlobalSchemaGraph } from "@/lib/schema";
import { siteUrl, siteName } from "@/lib/utils";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default: "freetoolkitapp — Free AI & Everyday Productivity Tools",
    template: `%s | ${siteName}`
  },

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
    canonical: siteUrl,
  },

  openGraph: {
    title: "freetoolkitapp — Free AI & Everyday Productivity Tools",

    description:
      "Free browser-based AI and productivity tools for PDFs, images, resumes, calculators, students, and developers.",

    url: siteUrl,

    siteName,

    type: "website",

    images: [
      {
        url: `${siteUrl}/og-image.png?v=2`,
        width: 1200,
        height: 630,
        alt: "freetoolkitapp — Free AI & Everyday Productivity Tools",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",

    title: "freetoolkitapp — Free AI & Everyday Productivity Tools",

    description:
      "Free browser-based tools for AI writing, PDFs, images, resumes, calculators, students, and developers.",

    images: [`${siteUrl}/og-image.png?v=2`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1
    }
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const globalSchema = buildGlobalSchemaGraph();

  return (
    <html lang="en" className={`${inter.variable} dark`}>
      <body className="mesh-bg min-h-screen antialiased text-ink-primary">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(globalSchema) }} />
        <Header />
        {children}
        <Footer />
        <AdSlot />
        <DeferredAnalytics />
        <ConsentLoader />
      </body>
    </html>
  );
}
