import type { Metadata } from "next";

/** Standard index directives for pages we want in Google Search. */
export const indexRobots: NonNullable<Metadata["robots"]> = {
  index: true,
  follow: true,
  googleBot: {
    index: true,
    follow: true,
    "max-video-preview": -1,
    "max-image-preview": "large",
    "max-snippet": -1
  }
};

/** Pages that should stay out of the index (404, gaming blog posts, etc.). */
export const noindexRobots: NonNullable<Metadata["robots"]> = {
  index: false,
  follow: true
};
