import type { Metadata } from "next";
import Script from "next/script";
import { Inter } from "next/font/google";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ConsentLoader } from "@/components/ConsentLoader";
import { AdSlot } from "@/components/AdSlot";
import { siteUrl } from "@/lib/utils";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default: "FreeToolKit — Free AI & Everyday Productivity Tools",
    template: "%s | FreeToolKit"
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
    title: "FreeToolKit — Free AI & Everyday Productivity Tools",

    description:
      "Free browser-based AI and productivity tools for PDFs, images, resumes, calculators, students, and developers.",

    url: siteUrl,

    siteName: "FreeToolKit",

    type: "website",

    images: [
      {
        url: `${siteUrl}/og-image.png?v=2`,
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
  const globalSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: "FreeToolKit",
        url: siteUrl,
        logo: `${siteUrl}/og-image.png?v=2`
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        name: "FreeToolKit",
        url: siteUrl,
        publisher: { "@id": `${siteUrl}/#organization` },
        potentialAction: {
          "@type": "SearchAction",
          target: `${siteUrl}/all-tools?q={search_term_string}`,
          "query-input": "required name=search_term_string"
        }
      }
    ]
  };

  return (
    <html lang="en" className={inter.variable}>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(globalSchema) }} />
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
        <AdSlot />
        <ConsentLoader />
      </body>
    </html>
  );
}
