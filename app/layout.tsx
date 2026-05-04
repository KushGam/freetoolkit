import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://freetoolkit.com"),
  title: {
    default: "FreeToolKit — Free Online Image, PDF & Student Tools",
    template: "%s | FreeToolKit"
  },
  description: "Use free online tools to compress images, convert images, edit PDFs, calculate GPA, count words, and study with a Pomodoro timer. No signup required.",
  openGraph: {
    title: "FreeToolKit — Free Online Image, PDF & Student Tools",
    description: "Free browser-based tools for images, PDFs, and students. No signup required.",
    url: "https://freetoolkit.com",
    siteName: "FreeToolKit",
    type: "website"
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
