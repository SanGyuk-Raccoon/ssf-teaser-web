import { teams, TIERS } from "@/lib/data";
import HeroZoom from "@/components/HeroZoom";
import VoteSection from "@/components/VoteSection";
import NamingSection from "@/components/NamingSection";
import DirectionsSection from "@/components/DirectionsSection";
import GuestbookSection from "@/components/GuestbookSection";
import TeamImage from "@/components/TeamImage";

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
        <HeroZoom />
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
              fontWeight: 700,
              color: "var(--ink)",
              lineHeight: 1.5,
            }}
          >
            <span style={{ fontSize: "clamp(4rem, 14vw, 7rem)", lineHeight: 0.5, display: "block", fontFamily: "Georgia, serif" }}>{"\u201C"}</span>
            <br />
            S펙트럼과<br />
            S타워즈가<br />
            Fㅔ스티벌을<br />
            연다면 그것도<br />
            SSF가 아닐까?<br />
            <br />
            <span style={{ fontSize: "clamp(4rem, 14vw, 7rem)", lineHeight: 0.5, display: "block", fontFamily: "Georgia, serif" }}>{"\u201D"}</span>
          </p>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "clamp(0.9rem, 3vw, 1.3rem)",
              color: "var(--ink-soft)",
              lineHeight: 1.8,
              marginTop: "32px",
              textAlign: "center",
            }}
          >
            삼성전자 DS부문 밴드 동호회 Spectrum이 주최하고, DX부문 밴드 동호회 Starwars가 함께하는 연합공연 SSF입니다. (Samsung Sound Festival 아님!) 삼성전자 밴드 동호회끼리 소통하고 화합하는 자리를 만들기 위해 양 쪽 운영진이 뭉쳤습니다. 즐거운 시간 보내시길 바랍니다!
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
                        <TeamImage src={team.imageUrl} alt={team.name} />
                        <div style={{ width: "100%", textAlign: isStarwars ? "left" : "right" }}>
                          {(() => {
                            const parts = team.name.split(" | ");
                            const tag = parts.length > 1 ? parts[0] : null;
                            const displayName = parts.length > 1 ? parts[1] : parts[0];
                            return (
                              <>
                                {tag && (
                                  <span
                                    style={{
                                      fontFamily: "var(--font-body)",
                                      fontSize: "0.8rem",
                                      fontWeight: 500,
                                      color: "var(--ink)",
                                      display: "block",
                                      marginBottom: "2px",
                                    }}
                                  >
                                    {tag}
                                  </span>
                                )}
                                <h4
                                  style={{
                                    fontFamily: "var(--font-body)",
                                    fontWeight: 700,
                                    fontSize: "2.0rem",
                                    color: "var(--ink)",
                                    margin: 0,
                                    marginBottom: "4px",
                                  }}
                                >
                                  {displayName}
                                </h4>
                              </>
                            );
                          })()}
                          <p
                            style={{
                              fontSize: "clamp(0.9rem, 3vw, 1.3rem)",
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


      {/* ── Vote ───────────────────────────────────────────────── */}
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
          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(1.8rem, 5vw, 2.5rem)",
                color: "var(--ink)",
              }}
            >
              투표
            </h2>
          </div>
          <VoteSection />
        </div>
      </section>

      {/* ── Naming ────────────────────────────────────────────────── */}
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
          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(1.8rem, 5vw, 2.5rem)",
                color: "var(--ink)",
              }}
            >
              공연 이름 공모
            </h2>
          </div>
          <NamingSection />
        </div>
      </section>

      {/* ── Guestbook ──────────────────────────────────────────────── */}
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
          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(1.8rem, 5vw, 2.5rem)",
                color: "var(--ink)",
              }}
            >
              기대평
            </h2>
          </div>
          <GuestbookSection />
        </div>
      </section>

      {/* ── Directions ──────────────────────────────────────────────── */}
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
          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(1.8rem, 5vw, 2.5rem)",
                color: "var(--ink)",
              }}
            >
              찾아오시는 길
            </h2>
          </div>
          <DirectionsSection />
        </div>
      </section>

    </div>
  );
}
