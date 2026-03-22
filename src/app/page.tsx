import Image from "next/image";
import { teams, TIERS } from "@/lib/data";
import Credits from "@/components/Credits";

export default function Home() {
  return (
    <div>

      {/* ── Hero ──────────────────────────────────────────────────── */}
      <section
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "100px 24px 80px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* SSF Logo */}
          <Image
            src="/ssf-main.PNG"
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

          {/* Date + Time */}
          <Image
            src="/ssf-time.PNG"
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
      </section>

      {/* ── Lineup ──────────────────────────────────────────────── */}
      <section
        style={{
          padding: "80px 24px 100px",
        }}
      >
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>

          {/* Section header */}
          <div style={{ textAlign: "center", marginBottom: "60px" }}>
            <h2 className="section-heading">라인업</h2>
            <p
              style={{
                color: "var(--ink-muted)",
                fontSize: "0.9rem",
                marginTop: "10px",
                fontWeight: 500,
              }}
            >
              공연 순서대로 소개합니다
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "56px" }}>
            {TIERS.map((tier) => {
              const tierTeams = teams
                .filter((t) => t.tier === tier)
                .sort((a, b) => a.order - b.order);

              return (
                <div key={tier}>
                  {/* Tier heading */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "16px",
                      marginBottom: "24px",
                    }}
                  >
                    <span className="tier-tag">{tier}</span>
                    <div
                      style={{
                        flex: 1,
                        height: "1px",
                        background: "var(--ink)",
                        opacity: 0.1,
                      }}
                    />
                  </div>

                  {/* Team grid — 2 col mobile, 3 col md, 4 col lg */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
                      gap: "20px",
                    }}
                  >
                    {tierTeams.map((team) => (
                      <div
                        key={team.id}
                        className="open-card"
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
                        <div
                          style={{
                            padding: "14px 16px 16px",
                            display: "flex",
                            flexDirection: "column",
                            gap: "6px",
                          }}
                        >
                          <span
                            className={
                              team.club === "Starwars" ? "badge-starwars" : "badge-spectrum"
                            }
                            style={{ alignSelf: "flex-start" }}
                          >
                            {team.club}
                          </span>
                          <h4
                            style={{
                              fontFamily: "var(--font-body)",
                              fontWeight: 700,
                              fontSize: "0.9rem",
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
                              lineHeight: 1.5,
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
        </div>
      </section>

      {/* ── Credits ─────────────────────────────────────────────── */}
      <Credits />

    </div>
  );
}
