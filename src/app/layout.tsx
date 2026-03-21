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
      <body className="bg-zinc-950 text-white min-h-screen antialiased">
        <nav className="sticky top-0 z-50 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800">
          <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
            <a href="/" className="font-bold text-lg tracking-tight">
              SSF
            </a>
            <div className="flex gap-1 text-sm">
              <a href="/vote" className="px-3 py-2 rounded-lg hover:text-rose-400 hover:bg-zinc-900 transition-colors active:bg-zinc-800">
                투표
              </a>
              <a href="/naming" className="px-3 py-2 rounded-lg hover:text-rose-400 hover:bg-zinc-900 transition-colors active:bg-zinc-800">
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
