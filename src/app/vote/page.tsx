"use client";

import { useState, useEffect, useCallback } from "react";
import { teams, TIERS } from "@/lib/data";
import { hasVoted, markVoted, getVotedTeam } from "@/lib/storage";

interface VoteData {
  votes: Record<string, number>;
  status: Record<string, boolean>;
}

export default function VotePage() {
  const [data, setData] = useState<VoteData | null>(null);
  const [activeTier, setActiveTier] = useState<string>(TIERS[0]);
  const [voting, setVoting] = useState(false);

  const fetchData = useCallback(async () => {
    const res = await fetch("/api/vote");
    setData(await res.json());
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const handleVote = async (teamId: string) => {
    if (hasVoted(activeTier) || voting) return;
    setVoting(true);
    try {
      const res = await fetch("/api/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teamId }),
      });
      if (res.ok) {
        markVoted(activeTier, teamId);
        await fetchData();
      }
    } finally {
      setVoting(false);
    }
  };

  if (!data) {
    return (
      <div
        style={{
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--ink-muted)",
          fontFamily: "var(--font-display)",
          fontSize: "1.3rem",
        }}
      >
        로딩 중...
      </div>
    );
  }

  const tierTeams = teams.filter((t) => t.tier === activeTier).sort((a, b) => a.order - b.order);
  const isOpen = data.status[activeTier] ?? false;
  const voted = hasVoted(activeTier);
  const votedTeamId = getVotedTeam(activeTier);
  const totalVotes = tierTeams.reduce((sum, t) => sum + (data.votes[t.id] || 0), 0);

  return (
    <div>

      {/* ── Page hero band ───────────────────────────────────────── */}
      <section
        style={{
          background: "var(--band-dark)",
          padding: "64px 24px 72px",
          textAlign: "center",
        }}
      >
        <h1
          className="font-display"
          style={{
            fontSize: "clamp(2.8rem, 10vw, 5rem)",
            lineHeight: 0.95,
            color: "#fff",
            marginBottom: "12px",
          }}
        >
          투표
        </h1>
        <p
          style={{
            color: "rgba(255,255,255,0.45)",
            fontSize: "0.95rem",
            fontWeight: 500,
            fontFamily: "var(--font-body)",
          }}
        >
          카테고리별 최고의 팀에 투표하세요
        </p>
      </section>

      {/* Rainbow stripe */}
      <div className="rainbow-bar" style={{ height: "4px", borderRadius: 0 }} />

      {/* ── Content band ─────────────────────────────────────────── */}
      <section
        style={{
          background: "var(--band-a)",
          padding: "56px 24px 80px",
        }}
      >
        <div
          style={{
            maxWidth: "680px",
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            gap: "36px",
          }}
        >

          {/* Tier tabs */}
          <div
            style={{
              display: "flex",
              gap: "8px",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            {TIERS.map((tier) => (
              <button
                key={tier}
                onClick={() => setActiveTier(tier)}
                className={`tab-pill${activeTier === tier ? " tab-pill-active" : ""}`}
              >
                {tier}
              </button>
            ))}
          </div>

          {/* Status badge */}
          <div style={{ textAlign: "center" }}>
            {isOpen ? (
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "8px 20px",
                  background: "#f0fdf4",
                  borderRadius: "100px",
                  color: "#15803d",
                  fontWeight: 700,
                  fontSize: "0.85rem",
                  fontFamily: "var(--font-body)",
                  boxShadow: "0 1px 8px rgba(34,197,94,0.15)",
                }}
              >
                <span className="pulse-dot" />
                투표 진행 중
              </span>
            ) : (
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "8px 20px",
                  background: "var(--cream-mid)",
                  borderRadius: "100px",
                  color: "var(--ink-muted)",
                  fontWeight: 700,
                  fontSize: "0.85rem",
                  fontFamily: "var(--font-body)",
                }}
              >
                <span
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    background: "var(--ink-muted)",
                    opacity: 0.5,
                    display: "inline-block",
                    flexShrink: 0,
                  }}
                />
                투표 준비 중
              </span>
            )}
          </div>

          {/* Team rows */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {tierTeams.map((team) => {
              const count = data.votes[team.id] || 0;
              const pct = totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0;
              const isVotedTeam = votedTeamId === team.id;
              const canVote = isOpen && !voted && !voting;

              return (
                <button
                  key={team.id}
                  onClick={() => handleVote(team.id)}
                  disabled={!canVote}
                  className={`vote-row${isVotedTeam ? " vote-row-voted" : ""}`}
                >
                  {/* Row header */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: (voted || !isOpen) && totalVotes > 0 ? "12px" : "0",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        flexWrap: "wrap",
                      }}
                    >
                      <span
                        className={team.club === "Starwars" ? "badge-starwars" : "badge-spectrum"}
                      >
                        {team.club}
                      </span>
                      <span
                        style={{
                          fontWeight: 700,
                          fontSize: "1rem",
                          color: "var(--ink)",
                        }}
                      >
                        {team.name}
                      </span>
                      {isVotedTeam && (
                        <span
                          style={{
                            fontSize: "0.72rem",
                            fontWeight: 700,
                            color: "var(--rainbow-orange)",
                            background: "#fff4ec",
                            borderRadius: "6px",
                            padding: "2px 8px",
                            fontFamily: "var(--font-body)",
                          }}
                        >
                          ✓ 투표완료
                        </span>
                      )}
                    </div>
                    {(voted || !isOpen) && (
                      <span
                        style={{
                          fontSize: "0.85rem",
                          color: "var(--ink-muted)",
                          fontWeight: 600,
                          whiteSpace: "nowrap",
                          marginLeft: "12px",
                          fontFamily: "var(--font-body)",
                        }}
                      >
                        {count}표 ({pct}%)
                      </span>
                    )}
                  </div>

                  {/* Progress bar */}
                  {(voted || !isOpen) && totalVotes > 0 && (
                    <div className="progress-track">
                      <div
                        className={`progress-fill ${isVotedTeam ? "progress-fill-voted" : "progress-fill-default"}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {totalVotes > 0 && (
            <p
              style={{
                textAlign: "center",
                fontSize: "0.78rem",
                color: "var(--ink-muted)",
                fontFamily: "var(--font-body)",
              }}
            >
              총 {totalVotes}표 · 5초마다 자동 갱신
            </p>
          )}
        </div>
      </section>

    </div>
  );
}
