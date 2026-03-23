"use client";

import { useState, useEffect } from "react";

const PRELOAD_IMAGES = [
  "/line.webp",
  "/ssf-main.webp",
  "/ssf-time.webp",
  "/ssf-bg0.webp",
  "/ssf-bg1.webp",
  "/ssf-bg2.webp",
  "/ssf-planet.webp",
  "/ssf-guitar.webp",
  "/ssf-mic.webp",
  "/ssf-spaceship0.webp",
  "/ssf-spaceship1.webp",
];

export default function ImagePreloader({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let loaded = 0;
    const total = PRELOAD_IMAGES.length;

    const onLoad = () => {
      loaded++;
      if (loaded >= total) setReady(true);
    };

    PRELOAD_IMAGES.forEach((src) => {
      const img = new Image();
      img.onload = onLoad;
      img.onerror = onLoad; // don't block on error
      img.src = src;
    });

    // Fallback: show page after 5s regardless
    const timeout = setTimeout(() => setReady(true), 5000);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <>
      {/* Loading screen */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--cream)",
          transition: "opacity 0.6s ease",
          opacity: ready ? 0 : 1,
          pointerEvents: ready ? "none" : "all",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(1.2rem, 4vw, 2rem)",
            color: "var(--ink)",
            animation: "pulse 1.5s ease-in-out infinite",
          }}
        >
          Loading...
        </p>
      </div>
      {children}
    </>
  );
}
