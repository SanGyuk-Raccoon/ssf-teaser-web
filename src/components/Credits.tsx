"use client";

import { useEffect, useRef } from "react";

interface CreditGroup {
  role: string;
  names: string[];
}

const credits: CreditGroup[] = [
  { role: "총괄 기획", names: ["김도윤"] },
  { role: "무대 연출", names: ["이서준", "박하은"] },
  { role: "음향", names: ["정민재"] },
  { role: "홍보", names: ["최수아", "한지호"] },
  { role: "디자인", names: ["오예린"] },
  { role: "섭외", names: ["윤태민"] },
  { role: "회계", names: ["송지원"] },
  { role: "촬영", names: ["임준혁"] },
];

export default function Credits() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const items = container.querySelectorAll<HTMLElement>(".credit-item");

    const update = () => {
      const viewportCenter = window.innerHeight / 2;

      items.forEach((item) => {
        const rect = item.getBoundingClientRect();
        const itemCenter = rect.top + rect.height / 2;
        const distance = Math.abs(viewportCenter - itemCenter);
        const maxDistance = window.innerHeight * 0.5;

        // 0 = center, 1 = edge
        const ratio = Math.min(distance / maxDistance, 1);

        const scale = 1 - ratio * 0.4; // 1.0 → 0.6
        const opacity = 1 - ratio * 0.7; // 1.0 → 0.3

        item.style.transform = `scale(${scale})`;
        item.style.opacity = `${opacity}`;
      });
    };

    window.addEventListener("scroll", update, { passive: true });
    update();

    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <section
      style={{
        padding: "80px 24px 160px",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        className="glass-panel"
        style={{
          maxWidth: "600px",
          width: "100%",
          padding: "48px 32px",
          overflow: "hidden",
        }}
      >
      <div
        style={{
          textAlign: "center",
          marginBottom: "80px",
        }}
      >
        <h2 className="section-heading">CREDITS</h2>
        <p
          style={{
            color: "var(--ink-muted)",
            fontSize: "0.9rem",
            marginTop: "12px",
            fontWeight: 500,
          }}
        >
          이 공연을 만든 사람들
        </p>
      </div>

      <div
        ref={containerRef}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "48px",
          maxWidth: "600px",
          margin: "0 auto",
        }}
      >
        {credits.map((group) => (
          <div
            key={group.role}
            className="credit-item"
            style={{
              textAlign: "center",
              transition: "transform 0.15s ease-out, opacity 0.15s ease-out",
              willChange: "transform, opacity",
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.75rem",
                fontWeight: 700,
                color: "var(--ink-muted)",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                marginBottom: "8px",
              }}
            >
              {group.role}
            </p>
            {group.names.map((name) => (
              <p
                key={name}
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "1.6rem",
                  color: "var(--ink)",
                  lineHeight: 1.4,
                }}
              >
                {name}
              </p>
            ))}
          </div>
        ))}

        {/* Final SSF mark */}
        <div
          className="credit-item"
          style={{
            marginTop: "40px",
            textAlign: "center",
            transition: "transform 0.15s ease-out, opacity 0.15s ease-out",
            willChange: "transform, opacity",
          }}
        >
          <p
            className="font-display rainbow-text"
            style={{ fontSize: "2.5rem", lineHeight: 1 }}
          >
            SSF
          </p>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.7rem",
              color: "var(--ink-muted)",
              letterSpacing: "0.1em",
              marginTop: "8px",
            }}
          >
            Spectrum / Starwars Festival 2026
          </p>
        </div>
      </div>
      </div>
    </section>
  );
}
