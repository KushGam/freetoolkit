# FreeToolKit

FreeToolKit is a production-ready Next.js 14 App Router website for free, no-login, browser-based image, PDF, and student tools.

## Features

- 15 functional tools across image, PDF, and student categories
- Client-side image conversion, resizing, compression, and PDF operations where possible
- SEO-friendly metadata, FAQ schema, sitemap, and robots routes
- Reusable AdSlot placeholders without a fake AdSense publisher ID
- Privacy, terms, contact, and about pages
- Mobile-first Tailwind CSS design

## Setup

```bash
npm install
npm run dev
npm run build
npm run lint
```

## Vercel Deployment

Use the Next.js framework preset in Vercel. Leave the Output Directory setting empty/default; do not set it to `public`.

## AdSense

`components/AdSlot.tsx` renders labeled advertisement placeholders. Replace that component later with the official Google AdSense script and your real publisher ID.

## Notes

PDF tools use `pdf-lib` and are loaded dynamically in the browser when a PDF action runs. Browser PDF compression is intentionally described as lightweight optimization because scanned PDFs often require image downsampling to shrink substantially.
