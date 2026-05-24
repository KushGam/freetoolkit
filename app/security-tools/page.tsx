import { permanentRedirect } from "next/navigation";

export default function SecurityToolsRedirectPage() {
  permanentRedirect("/developer");
}
