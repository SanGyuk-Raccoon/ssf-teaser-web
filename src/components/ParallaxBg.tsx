"use client";

import { useEffect, useRef } from "react";

export default function ParallaxBg() {
  const bg0Ref = useRef<HTMLDivElement>(null);
  const bg1Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bg0 = bg0Ref.current;
    const bg1 = bg1Ref.current;
    if (!bg0 || !bg1) return;

    const onScroll = () => {
      const y = window.scrollY;
      bg1.style.transform = `translate3d(0, ${y * -0.2}px, 0)`;  // 후경: 좀 더 빠르게
      bg0.style.transform = `translate3d(0, ${y * -0.08}px, 0)`; // 전경: 느리게
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const baseStyle: React.CSSProperties = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "140vh",
    backgroundSize: "cover",
    backgroundPosition: "center top",
    backgroundRepeat: "no-repeat",
    willChange: "transform",
  };

  return (
    <>
      {/* bg1: 별/행성 — 뒤, 느리게 */}
      <div
        ref={bg1Ref}
        aria-hidden="true"
        style={{
          ...baseStyle,
          zIndex: -2,
          backgroundImage: "url('/ssf-bg1.png')",
          opacity: 0.5,
        }}
      />
      {/* bg0: 무지개 — 앞, 조금 더 빠르게 */}
      <div
        ref={bg0Ref}
        aria-hidden="true"
        style={{
          ...baseStyle,
          zIndex: -1,
          backgroundImage: "url('/ssf-bg0.png')",
          opacity: 0.45,
        }}
      />
    </>
  );
}
