import { permanentRedirect } from "next/navigation";

export default function EverydayRedirectPage() {
  permanentRedirect("/calculators");
}
