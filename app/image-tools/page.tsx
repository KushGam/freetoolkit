import type { Metadata } from "next";
import { CategoryPage } from "@/components/category-page";

export const metadata: Metadata = {
  title: "Free Image Tools",
  description: "Compress, resize, and convert images online for free with browser-based image tools.",
  alternates: { canonical: "https://www.freetoolkitapp.com/image-tools" },
  openGraph: { title: "Free Image Tools | FreeToolKit", description: "Free tools for image compression, resizing, PNG, JPG, and WebP conversion." }
};

export default function ImageToolsPage() {
  return <CategoryPage category="Image Tools" intro="Compress images, resize photos, and convert between PNG, JPG, and WebP using free browser-based tools." />;
}
