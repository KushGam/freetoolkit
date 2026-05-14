import { NextResponse } from "next/server";

/**
 * Placeholder ads.txt for AdSense readiness.
 * Replace the placeholder line with your publisher ID from Google AdSense when approved.
 */
export function GET() {
  const body =
    "# Google AdSense — add your authorized seller line here after approval.\n" +
    "# Example: google.com, pub-0000000000000000, DIRECT, f08c47fec0942fa0\n" +
    "# Documentation: https://support.google.com/adsense/answer/7532444\n";

  return new NextResponse(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600"
    }
  });
}
