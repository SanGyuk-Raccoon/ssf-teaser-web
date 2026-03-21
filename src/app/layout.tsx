import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SSF - Spectrum/Starwars Festival",
  description: "2026.04.18 남문 로데오 아트홀 | Spectrum/Starwars Festival",
  openGraph: {
    title: "SSF - Spectrum/Starwars Festival",
    description: "2026.04.18 17:00 남문 로데오 아트홀",
    images: ["/ssf-main-poster.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </head>
      <body style={{ fontFamily: "var(--font-body)" }} className="min-h-screen antialiased">
        {/* Rainbow top stripe */}
        <div className="rainbow-bar w-full" style={{ borderRadius: 0, height: "5px" }} />

        <nav
          className="sticky top-0 z-50"
          style={{
            background: "rgba(250,246,239,0.92)",
            backdropFilter: "blur(10px)",
            borderBottom: "2.5px solid var(--ink)",
          }}
        >
          <div
            className="max-w-2xl mx-auto px-4"
            style={{ paddingTop: "10px", paddingBottom: "10px", display: "flex", alignItems: "center", justifyContent: "space-between" }}
          >
            <a
              href="/"
              className="wiggle"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.6rem",
                letterSpacing: "0.05em",
                textDecoration: "none",
                lineHeight: 1,
              }}
            >
              <span className="rainbow-text">SSF</span>
            </a>

            <div style={{ display: "flex", gap: "6px" }}>
              <a href="/vote" className="nav-link" style={{ fontSize: "0.92rem" }}>
                투표
              </a>
              <a href="/naming" className="nav-link" style={{ fontSize: "0.92rem" }}>
                이름공모
              </a>
            </div>
          </div>
        </nav>

        <main className="max-w-2xl mx-auto px-4 py-8">{children}</main>

        {/* Rainbow bottom stripe */}
        <div className="rainbow-bar w-full" style={{ borderRadius: 0, height: "5px", marginTop: "40px" }} />
      </body>
    </html>
  );
}
