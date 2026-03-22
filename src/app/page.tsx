import Image from "next/image";
import { teams, TIERS } from "@/lib/data";


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

      {/* ── Catchphrase ────────────────────────────────────────── */}
      <section
        style={{
          padding: "60px 24px 80px",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          className="glass-panel"
          style={{
            padding: "48px 36px",
            maxWidth: "600px",
            width: "100%",
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1.5rem, 5vw, 2.4rem)",
              color: "var(--ink)",
              lineHeight: 1.5,
            }}
          >
            Spectrum과 Starwars가<br />
            함께한다면<br />
            그것도 SSF가 아닐까?
          </p>
        </div>
      </section>

      {/* ── Lineup ──────────────────────────────────────────────── */}
      <section
        style={{
          padding: "0 24px 100px",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          className="glass-panel"
          style={{ maxWidth: "600px", width: "100%", padding: "48px 32px" }}
        >

          {/* Section header */}
          <div style={{ textAlign: "center", marginBottom: "40px" }}>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(1.8rem, 5vw, 2.5rem)",
                color: "var(--ink)",
              }}
            >
              라인업
            </h2>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
            {TIERS.map((tier) => {
              const tierTeams = teams
                .filter((t) => t.tier === tier)
                .sort((a, b) => a.order - b.order);

              return (
                <div key={tier}>
                  {/* Team list */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
                    {tierTeams.map((team) => {
                      const isStarwars = team.club === "Starwars";
                      return (
                      <div
                        key={team.id}
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: isStarwars ? "flex-start" : "flex-end",
                          gap: "12px",
                          width: "80%",
                          alignSelf: isStarwars ? "flex-start" : "flex-end",
                        }}
                      >
                        <div
                          style={{
                            position: "relative",
                            width: "100%",
                            aspectRatio: "1 / 1",
                            borderRadius: "16px",
                            overflow: "hidden",
                            border: "1.5px solid rgba(0,0,0,0.08)",
                          }}
                        >
                          <Image
                            src={team.imageUrl}
                            alt={team.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div style={{ width: "100%", textAlign: isStarwars ? "left" : "right" }}>
                          <h4
                            style={{
                              fontFamily: "var(--font-body)",
                              fontWeight: 700,
                              fontSize: "1.3rem",
                              color: "var(--ink)",
                              margin: 0,
                              marginBottom: "4px",
                            }}
                          >
                            {team.name}
                          </h4>
                          <p
                            style={{
                              fontSize: "1rem",
                              color: "var(--ink-muted)",
                              margin: 0,
                              lineHeight: 1.6,
                            }}
                          >
                            {team.description}
                          </p>
                        </div>
                      </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>


    </div>
  );
}
