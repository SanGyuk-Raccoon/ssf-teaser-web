import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Spectrum × Starwars 연합공연",
  description: "2026.04.18 남문 로데오 아트홀 | Spectrum × Starwars 연합 밴드 공연",
  openGraph: {
    title: "Spectrum × Starwars 연합공연",
    description: "2026.04.18 17:00 남문 로데오 아트홀",
    images: ["/ssf-main-poster.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="bg-zinc-950 text-white min-h-screen antialiased">
        <nav className="sticky top-0 z-50 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800">
          <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
            <a href="/" className="font-bold text-lg tracking-tight">
              S×S
            </a>
            <div className="flex gap-4 text-sm">
              <a href="/lineup" className="hover:text-rose-400 transition-colors">
                라인업
              </a>
              <a href="/vote" className="hover:text-rose-400 transition-colors">
                투표
              </a>
              <a href="/naming" className="hover:text-rose-400 transition-colors">
                이름공모
              </a>
            </div>
          </div>
        </nav>
        <main className="max-w-2xl mx-auto px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
