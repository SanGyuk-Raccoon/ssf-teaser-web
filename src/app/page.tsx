import Image from "next/image";
import { teams, TIERS } from "@/lib/data";

export default function Home() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "3.5rem" }}>

      {/* ── Hero ──────────────────────────────────────────────── */}
      <section style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2rem", width: "100%" }}>

        {/* Poster with sketch frame */}
        <div
          style={{
            position: "relative",
            width: "100%",
            maxWidth: "420px",
            aspectRatio: "1 / 1",
            borderRadius: "18px",
            overflow: "hidden",
            border: "3px solid var(--ink)",
            boxShadow: "7px 7px 0 var(--ink)",
          }}
        >
          <Image
            src="/ssf-main-poster.png"
            alt="SSF - Spectrum/Starwars Festival 포스터"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Event info */}
        <div style={{ textAlign: "center" }}>
          <h1
            className="font-display rainbow-text"
            style={{ fontSize: "clamp(2.8rem, 10vw, 4rem)", lineHeight: 1, marginBottom: "6px" }}
          >
            SSF
          </h1>
          <p
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.05rem",
              color: "var(--ink-soft)",
              letterSpacing: "0.06em",
              marginBottom: "14px",
            }}
          >
            Spectrum / Starwars Festival
          </p>

          {/* Date + venue tag */}
          <div
            className="sketch-card-cream"
            style={{
              display: "inline-flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "4px",
              padding: "12px 28px",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.5rem",
                letterSpacing: "0.03em",
                color: "var(--ink)",
              }}
            >
              2026. 04. 18 (토) 17:00
            </span>
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontWeight: 600,
                fontSize: "0.9rem",
                color: "var(--ink-muted)",
              }}
            >
              남문 로데오 아트홀
            </span>
          </div>
        </div>

        {/* CTA buttons */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "12px",
            width: "100%",
            maxWidth: "420px",
          }}
        >
          <a
            href="/vote"
            className="btn-sketch btn-rainbow"
            style={{ padding: "14px 12px", flexDirection: "column", gap: "2px", textDecoration: "none" }}
          >
            <span style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem" }}>투표</span>
            <span style={{ fontSize: "0.75rem", fontWeight: 500, opacity: 0.9 }}>실시간 투표</span>
          </a>
          <a
            href="/naming"
            className="btn-sketch btn-outline"
            style={{ padding: "14px 12px", flexDirection: "column", gap: "2px", textDecoration: "none" }}
          >
            <span style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem" }}>이름공모</span>
            <span style={{ fontSize: "0.75rem", fontWeight: 500, color: "var(--ink-muted)" }}>공연 이름 짓기</span>
          </a>
        </div>
      </section>

      {/* ── Rainbow divider ───────────────────────────────────── */}
      <div className="rainbow-bar" style={{ width: "100%", maxWidth: "420px" }} />

      {/* ── Lineup ────────────────────────────────────────────── */}
      <section style={{ width: "100%" }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h2 className="section-heading">라인업</h2>
          <p style={{ color: "var(--ink-muted)", fontSize: "0.875rem", marginTop: "6px" }}>
            공연 순서대로 소개합니다
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
          {TIERS.map((tier) => {
            const tierTeams = teams
              .filter((t) => t.tier === tier)
              .sort((a, b) => a.order - b.order);

            return (
              <div key={tier}>
                {/* Tier heading */}
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px" }}>
                  <span className="tier-tag">{tier}</span>
                  <div style={{ flex: 1, height: "2px", background: "var(--ink)", opacity: 0.15, borderRadius: "9999px" }} />
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, 1fr)",
                    gap: "12px",
                  }}
                >
                  {tierTeams.map((team) => (
                    <div
                      key={team.id}
                      className="sketch-card"
                      style={{ overflow: "hidden" }}
                    >
                      <div style={{ position: "relative", aspectRatio: "1 / 1" }}>
                        <Image
                          src={team.imageUrl}
                          alt={team.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div style={{ padding: "10px 12px", display: "flex", flexDirection: "column", gap: "4px" }}>
                        <span className={team.club === "Starwars" ? "badge-starwars" : "badge-spectrum"}>
                          {team.club}
                        </span>
                        <h4
                          style={{
                            fontFamily: "var(--font-body)",
                            fontWeight: 700,
                            fontSize: "0.875rem",
                            color: "var(--ink)",
                            margin: 0,
                          }}
                        >
                          {team.name}
                        </h4>
                        <p
                          style={{
                            fontSize: "0.75rem",
                            color: "var(--ink-muted)",
                            margin: 0,
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {team.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
