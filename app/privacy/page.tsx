import { redirect } from "next/navigation";

/** Legacy URL — canonical policy lives at /privacy-policy */
export default function PrivacyRedirectPage() {
  redirect("/privacy-policy");
}
