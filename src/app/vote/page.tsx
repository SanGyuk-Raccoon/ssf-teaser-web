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
      <div style={{ textAlign: "center", padding: "80px 0", color: "var(--ink-muted)", fontFamily: "var(--font-display)", fontSize: "1.3rem" }}>
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
    <div style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>

      {/* Page heading */}
      <div style={{ textAlign: "center" }}>
        <h1 className="section-heading">투표</h1>
        <p style={{ color: "var(--ink-muted)", fontSize: "0.875rem", marginTop: "6px" }}>
          카테고리별 최고의 팀에 투표하세요
        </p>
      </div>

      {/* Tier tabs */}
      <div style={{ display: "flex", gap: "8px", justifyContent: "center", flexWrap: "wrap" }}>
        {TIERS.map((tier) => (
          <button
            key={tier}
            onClick={() => setActiveTier(tier)}
            className="btn-sketch"
            style={{
              padding: "8px 18px",
              fontSize: "0.875rem",
              background: activeTier === tier ? "var(--ink)" : "var(--cream)",
              color: activeTier === tier ? "var(--cream)" : "var(--ink)",
              boxShadow: activeTier === tier ? "none" : "var(--sketch-shadow)",
              transform: activeTier === tier ? "translate(2px, 2px)" : "none",
            }}
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
              padding: "6px 16px",
              background: "#dcfce7",
              border: "2px solid #16a34a",
              borderRadius: "9999px",
              color: "#15803d",
              fontWeight: 700,
              fontSize: "0.85rem",
              fontFamily: "var(--font-body)",
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
              padding: "6px 16px",
              background: "var(--cream-dark)",
              border: "2px solid var(--ink-muted)",
              borderRadius: "9999px",
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
                display: "inline-block",
              }}
            />
            투표 준비 중
          </span>
        )}
      </div>

      {/* Team cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
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
              style={{
                width: "100%",
                textAlign: "left",
                padding: "14px 16px",
                borderRadius: "12px",
                border: isVotedTeam ? "2.5px solid var(--rainbow-red)" : "2.5px solid var(--ink)",
                background: isVotedTeam ? "#fff8f0" : "#fff",
                boxShadow: isVotedTeam ? "4px 4px 0 var(--rainbow-red)" : "3px 3px 0 var(--ink)",
                cursor: canVote ? "pointer" : "default",
                transition: "box-shadow 0.12s ease, transform 0.12s ease",
                fontFamily: "var(--font-body)",
              }}
            >
              {/* Card header */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: (voted || !isOpen) && totalVotes > 0 ? "10px" : "0",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                  <span className={team.club === "Starwars" ? "badge-starwars" : "badge-spectrum"}>
                    {team.club}
                  </span>
                  <span style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--ink)" }}>
                    {team.name}
                  </span>
                  {isVotedTeam && (
                    <span
                      style={{
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        color: "var(--rainbow-red)",
                        background: "#fff0ee",
                        border: "1.5px solid var(--rainbow-red)",
                        borderRadius: "6px",
                        padding: "1px 7px",
                      }}
                    >
                      ✓ 투표완료
                    </span>
                  )}
                </div>
                {(voted || !isOpen) && (
                  <span style={{ fontSize: "0.875rem", color: "var(--ink-muted)", fontWeight: 600, whiteSpace: "nowrap", marginLeft: "8px" }}>
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
            fontSize: "0.75rem",
            color: "var(--ink-muted)",
            fontFamily: "var(--font-body)",
          }}
        >
          총 {totalVotes}표 · 5초마다 자동 갱신
        </p>
      )}
    </div>
  );
}
