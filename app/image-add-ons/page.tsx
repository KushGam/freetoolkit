import type { Metadata } from "next";
import { CategoryPage } from "@/components/category-page";

export const metadata: Metadata = {
  title: "Image Add-ons Online Free | FreeToolKit",
  description: "Use free image add-on tools to crop images and convert images to Base64 in your browser with no signup required."
};

export default function ImageAddOnsPage() {
  return (
    <CategoryPage
      category="Image Add-ons"
      intro="Free image add-on tools for browser-based image preparation. Crop photos, create simple aspect-ratio outputs, and convert images to Base64 data URLs with no signup."
    />
  );
}
