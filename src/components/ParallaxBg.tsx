"use client";

import { useEffect, useRef } from "react";

interface FloatingItem {
  src: string;
  width: string;
  top: string;
  left: string;
  speed: number;
  speedX?: number;
  opacity: number;
  rotate?: number;
}

const floatingItems: FloatingItem[] = [
  { src: "/ssf-guitar.PNG", width: "clamp(350px, 95vw, 900px)", top: "15%", left: "2%", speed: -0.05, opacity: 1, rotate: -15 },
  { src: "/ssf-mic.PNG", width: "clamp(300px, 85vw, 700px)", top: "90%", left: "55%", speed: -0.2, opacity: 1, rotate: 10 },
];

export default function ParallaxBg() {
  const bg0Ref = useRef<HTMLDivElement>(null);
  const bg1Ref = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLImageElement | null)[]>([]);

  useEffect(() => {
    const bg0 = bg0Ref.current;
    const bg1 = bg1Ref.current;
    if (!bg0 || !bg1) return;

    const onScroll = () => {
      const y = window.scrollY;
      bg1.style.transform = `translate3d(0, ${y * -0.2}px, 0)`;
      bg0.style.transform = `translate3d(0, ${y * -0.08}px, 0)`;

      itemRefs.current.forEach((el, i) => {
        if (!el) return;
        const item = floatingItems[i];
        const ty = y * item.speed;
        const tx = y * (item.speedX || 0);
        const baseRotate = item.rotate || 0;
        el.style.transform = `translate3d(${tx}px, ${ty}px, 0) rotate(${baseRotate}deg)`;
      });
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
      {/* bg1: 별/행성 */}
      <div
        ref={bg1Ref}
        aria-hidden="true"
        style={{
          ...baseStyle,
          zIndex: -3,
          backgroundImage: "url('/ssf-bg1.png')",
          opacity: 0.5,
        }}
      />
      {/* bg0: 무지개 */}
      <div
        ref={bg0Ref}
        aria-hidden="true"
        style={{
          ...baseStyle,
          zIndex: -2,
          backgroundImage: "url('/ssf-bg0.png')",
          opacity: 0.45,
        }}
      />
      {/* Floating elements */}
      {floatingItems.map((item, i) => (
        <img
          key={item.src}
          ref={(el) => { itemRefs.current[i] = el; }}
          src={item.src}
          alt=""
          aria-hidden="true"
          style={{
            position: "fixed",
            top: item.top,
            left: item.left,
            width: item.width,
            height: "auto",
            zIndex: -1,
            opacity: item.opacity,
            transform: `rotate(${item.rotate || 0}deg)`,
            willChange: "transform",
            pointerEvents: "none",
          }}
        />
      ))}
      {/* Planet — floating */}
      <img
        src="/ssf-planet.PNG"
        alt=""
        aria-hidden="true"
        className="planet-float"
        style={{
          top: "35%",
          left: "75%",
          width: "clamp(150px, 35vw, 300px)",
          height: "auto",
        }}
      />
      <img
        src="/ssf-planet.PNG"
        alt=""
        aria-hidden="true"
        className="planet-float"
        style={{
          top: "70%",
          left: "5%",
          width: "clamp(150px, 35vw, 300px)",
          height: "auto",
          animationDelay: "-2s",
        }}
      />
      {/* Spaceships — continuous CSS animation */}
      <img
        src="/ssf-spaceship0.PNG"
        alt=""
        aria-hidden="true"
        className="spaceship-left"
        style={{
          top: "30%",
          width: "clamp(100px, 22vw, 200px)",
          height: "auto",
        }}
      />
      <img
        src="/ssf-spaceship1.PNG"
        alt=""
        aria-hidden="true"
        className="spaceship-right"
        style={{
          top: "60%",
          width: "clamp(100px, 20vw, 180px)",
          height: "auto",
        }}
      />
    </>
  );
}
