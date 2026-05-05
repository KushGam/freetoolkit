import type { Metadata } from "next";
import { CategoryPage } from "@/components/category-page";

export const metadata: Metadata = {
  title: "Developer Tools Online Free | FreeToolKit",
  description: "Use free developer tools for JSON formatting, URL encoding, UUID generation, Base64 conversion, and QR codes with no signup.",
  alternates: { canonical: "https://www.freetoolkitapp.com/developer-tools" }
};

export default function DeveloperToolsPage() {
  return (
    <CategoryPage
      category="Developer Tools"
      intro="Free browser-based developer tools for formatting JSON, encoding and decoding URLs, generating UUIDs, converting Base64 text, and creating QR codes without login or paid APIs."
    />
  );
}
