import { permanentRedirect } from "next/navigation";

/** Legacy URL; canonical and sitemap use `/ai-resume-cover-letter`. */
export default function AiResumeCoverLetterLegacyRedirect() {
  permanentRedirect("/ai-resume-cover-letter");
}
