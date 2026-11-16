/** Site-wide configuration from env, used for SEO, feeds and UI. */

export const SITE_URL = (
  process.env.SITE_URL || "http://localhost:3000"
).replace(/\/$/, "");

export const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || "Markdown Blog";

export const SITE_DESCRIPTION =
  "A fast, minimalist blog powered by plain Markdown files. No database required.";
