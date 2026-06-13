export type BlogCategory =
  | "PDF Guides"
  | "Image Guides"
  | "Student Guides"
  | "Productivity Guides"
  | "Text Guides"
  | "Security Guides"
  | "Gaming Guides"
  | "Calculator Guides"
  | "Developer Guides"
  | "SEO Guides";

export type BlogSection = {
  heading: string;
  paragraphs: string[];
};

export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  category: BlogCategory;
  publishedAt: string;
  readingTime: string;
  relatedTools: string[];
  keywords: string[];
  content: BlogSection[];
};

export type BlogFaq = {
  question: string;
  answer: string;
};
