"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

export default function HeroZoom() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onScroll = () => {
      const y = window.scrollY;
      const maxScroll = window.innerHeight * 0.8;
      const ratio = Math.min(y / maxScroll, 1); // 0 → 1

      const scale = 1 + ratio * 1.5;       // 1x → 2.5x
      const opacity = 1 - ratio;            // 1 → 0

      el.style.transform = `scale(${scale})`;
      el.style.opacity = `${opacity}`;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      ref={ref}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        willChange: "transform, opacity",
      }}
    >
      <Image
        src="/line.webp"
        alt="SSF line"
        width={500}
        height={100}
        style={{
          width: "clamp(300px, 85vw, 600px)",
          height: "auto",
          marginBottom: "16px",
        }}
      />
      <Image
        src="/ssf-main.webp"
        alt="Spectrum Starwars Festival"
        width={500}
        height={280}
        priority
        style={{
          width: "clamp(300px, 85vw, 600px)",
          height: "auto",
          marginBottom: "32px",
        }}
      />
      <Image
        src="/ssf-time.webp"
        alt="2026 APRIL 04/18 16:00"
        width={300}
        height={120}
        style={{
          width: "clamp(160px, 40vw, 280px)",
          height: "auto",
          marginBottom: "12px",
        }}
      />
    </div>
  );
}
