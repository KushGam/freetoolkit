import bundleAnalyzer from "@next/bundle-analyzer";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true"
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compress: true,
  poweredByHeader: false,
  swcMinify: true,
  async redirects() {
    return [
      {
        source: "/",
        has: [{ type: "host", value: "freetoolkitapp.com" }],
        destination: "https://www.freetoolkitapp.com",
        permanent: true
      },
      {
        source: "/:path+",
        has: [{ type: "host", value: "freetoolkitapp.com" }],
        destination: "https://www.freetoolkitapp.com/:path+",
        permanent: true
      },
      { source: "/everyday", destination: "/calculators", permanent: true },
      { source: "/gaming-tools", destination: "/", permanent: true },
      { source: "/social-media-tools", destination: "/", permanent: true },
      { source: "/student", destination: "/ai-tools", permanent: true },
      { source: "/student-tools", destination: "/ai-tools", permanent: true },
      { source: "/student-tools/ai-resume-cover-letter", destination: "/ai-resume-cover-letter", permanent: true },
      { source: "/text-tools", destination: "/ai-tools", permanent: true },
      { source: "/security-tools", destination: "/developer", permanent: true },
      { source: "/shift-hours-calculator", destination: "/", permanent: true },
      { source: "/privacy", destination: "/privacy-policy", permanent: true },
      { source: "/pdf-tools", destination: "/pdf-image", permanent: true },
      { source: "/image-tools", destination: "/pdf-image", permanent: true },
      { source: "/developer-tools", destination: "/developer", permanent: true },
      { source: "/calculator-tools", destination: "/calculators", permanent: true },
      { source: "/ai-essay-writer", destination: "/grammar-fixer", permanent: true },
      { source: "/ai-interview-answer-generator", destination: "/ai-resume-cover-letter", permanent: true },
      { source: "/content-rewriter", destination: "/paraphrasing-tool", permanent: true }
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-DNS-Prefetch-Control", value: "on" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" }
        ]
      },
      {
        source: "/ads.txt",
        headers: [
          { key: "Content-Type", value: "text/plain; charset=utf-8" },
          { key: "Cache-Control", value: "public, max-age=86400" }
        ]
      },
      {
        source: "/all-tools",
        headers: [{ key: "X-Robots-Tag", value: "index, follow" }]
      },
      {
        source: "/:path*\\.(ico|png|jpg|jpeg|gif|webp|svg|js|css|woff|woff2)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" }
        ]
      }
    ];
  }
};

export default withBundleAnalyzer(nextConfig);
