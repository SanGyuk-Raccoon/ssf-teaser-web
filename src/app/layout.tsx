import type { Metadata } from "next";
import "./globals.css";
import ParallaxBg from "@/components/ParallaxBg";

export const metadata: Metadata = {
  metadataBase: new URL("https://ssf.example.com"),
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
      <body
        style={{ fontFamily: "var(--font-body)" }}
        className="min-h-screen antialiased"
      >
        <ParallaxBg />
        <main>{children}</main>
      </body>
    </html>
  );
}
