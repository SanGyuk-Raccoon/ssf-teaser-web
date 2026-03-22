import type { Metadata } from "next";
import "./globals.css";
import ParallaxBg from "@/components/ParallaxBg";

export const metadata: Metadata = {
  metadataBase: new URL("https://ssf-teaser-web.vercel.app"),
  title: "SSF - Spectrum/Starwars Festival",
  description: "2026.04.18 남문 로데오 아트홀 | Spectrum/Starwars Festival",
  openGraph: {
    title: "SSF - Spectrum/Starwars Festival",
    description: "2026.04.18 16:00 남문 로데오 아트홀",
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
        {/* SVG filter for wobbly hand-drawn edges */}
        <svg style={{ position: "absolute", width: 0, height: 0 }} aria-hidden="true">
          <defs>
            <filter id="wobbly">
              <feTurbulence type="turbulence" baseFrequency="0.02" numOctaves="4" seed="2" result="noise" />
              <feDisplacementMap in="SourceGraphic" in2="noise" scale="6" xChannelSelector="R" yChannelSelector="G" />
            </filter>
            <filter id="wobbly2">
              <feTurbulence type="turbulence" baseFrequency="0.025" numOctaves="3" seed="7" result="noise" />
              <feDisplacementMap in="SourceGraphic" in2="noise" scale="4" xChannelSelector="G" yChannelSelector="R" />
            </filter>
          </defs>
        </svg>
        <ParallaxBg />
        <main>{children}</main>
      </body>
    </html>
  );
}
