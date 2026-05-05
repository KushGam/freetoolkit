import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.freetoolkitapp.com"),
  title: {
    default: "FreeToolKit — Free Online Tools",
    template: "%s | FreeToolKit"
  },
  description: "Free browser-based tools for images, PDFs, text, calculators, student tools, and developer utilities. No signup required.",
  alternates: {
    canonical: "https://www.freetoolkitapp.com"
  },
  openGraph: {
    title: "FreeToolKit — Free Online Tools",
    description: "Free browser-based tools for images, PDFs, text, calculators, student tools, and developer utilities.",
    url: "https://www.freetoolkitapp.com",
    siteName: "FreeToolKit",
    type: "website",
    images: [
      {
        url: "https://www.freetoolkitapp.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "FreeToolKit — Free Online Tools"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "FreeToolKit — Free Online Tools",
    description: "Free browser-based tools for images, PDFs, text, calculators, student tools, and developer utilities.",
    images: ["https://www.freetoolkitapp.com/og-image.png"]
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7576421865674261"
          crossOrigin="anonymous"
        ></script>
      </head>
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
