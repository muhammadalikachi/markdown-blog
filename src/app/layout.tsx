import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import ThemeToggle from "@/components/ThemeToggle";
import { SITE_NAME, SITE_DESCRIPTION } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.SITE_URL || "http://localhost:3000"),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
  },
};

// Inline script: apply saved theme before first paint (no flash of wrong theme).
const themeScript = `
(function() {
  try {
    var t = localStorage.getItem('theme');
    if (t === 'dark' || (!t && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    }
  } catch (e) {}
})();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <header className="site-header">
          <div className="container">
            <Link href="/" className="site-title">
              {SITE_NAME}
            </Link>
            <div className="header-actions">
              <Link href="/admin" className="admin-link">
                Admin
              </Link>
              <ThemeToggle />
            </div>
          </div>
        </header>
        <main className="container">{children}</main>
        <footer className="site-footer">
          <div className="container">
            Powered by{" "}
            <Link href="/admin">Markdown Blog</Link> ·{" "}
            <Link href="/rss.xml">RSS</Link> ·{" "}
            <Link href="/sitemap.xml">Sitemap</Link>
          </div>
        </footer>
      </body>
    </html>
  );
}
