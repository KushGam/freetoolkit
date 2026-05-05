import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ConsentLoader } from "@/components/ConsentLoader";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap"
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap"
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.freetoolkitapp.com"),
  title: "FreeToolKit — Free Online Image, PDF, Text & Student Tools",
  description: "Use free online tools to compress images, convert files, edit PDFs, calculate GPA, clean text, and more. Fast, browser-based, no signup required.",
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
        url: "https://www.freetoolkitapp.com/og-image.png?v=2",
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
    images: ["https://www.freetoolkitapp.com/og-image.png?v=2"]
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body>
        <Header />
        {children}
        <Footer />
        <ConsentLoader />
      </body>
    </html>
  );
}
