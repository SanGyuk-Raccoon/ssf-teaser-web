"use client";

import { useState, useEffect, useCallback } from "react";
import { teams, TIERS } from "@/lib/data";

interface VoteData {
  votes: Record<string, number>;
  status: Record<string, boolean>;
}

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [data, setData] = useState<VoteData | null>(null);
  const [updating, setUpdating] = useState(false);

  const fetchData = useCallback(async () => {
    const res = await fetch("/api/vote");
    setData(await res.json());
  }, []);

  useEffect(() => {
    if (authenticated) {
      fetchData();
      const interval = setInterval(fetchData, 3000);
      return () => clearInterval(interval);
    }
  }, [authenticated, fetchData]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password) setAuthenticated(true);
  };

  const toggleVote = async (tier: string) => {
    if (!data || updating) return;
    setUpdating(true);
    try {
      const newStatus = { ...data.status, [tier]: !data.status[tier] };
      const res = await fetch("/api/vote/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, status: newStatus }),
      });
      if (res.ok) {
        await fetchData();
      } else {
        const err = await res.json();
        alert(err.error || "오류가 발생했습니다");
        if (res.status === 401) setAuthenticated(false);
      }
    } finally {
      setUpdating(false);
    }
  };

  /* ── Login screen ─────────────────────────────────────────── */
  if (!authenticated) {
    return (
      <div style={{ maxWidth: "360px", margin: "0 auto", paddingTop: "80px", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        <h1
          className="font-display"
          style={{ textAlign: "center", fontSize: "1.75rem", color: "var(--ink)" }}
        >
          관리자
        </h1>
        <form
          onSubmit={handleLogin}
          className="sketch-card"
          style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "12px" }}
        >
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호"
            className="sketch-input"
          />
          <button
            type="submit"
            className="btn-sketch"
            style={{
              width: "100%",
              padding: "13px",
              background: "var(--ink)",
              color: "var(--cream)",
              fontSize: "1rem",
            }}
          >
            로그인
          </button>
        </form>
      </div>
    );
  }

  /* ── Loading ──────────────────────────────────────────────── */
  if (!data) {
    return (
      <div style={{ textAlign: "center", padding: "80px 0", color: "var(--ink-muted)", fontFamily: "var(--font-display)", fontSize: "1.3rem" }}>
        로딩 중...
      </div>
    );
  }

  /* ── Admin panel ──────────────────────────────────────────── */
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      <h1
        className="font-display"
        style={{ textAlign: "center", fontSize: "1.75rem", color: "var(--ink)" }}
      >
        관리자 패널
      </h1>

      {/* Vote control */}
      <section
        className="sketch-card"
        style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "14px" }}
      >
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "1.1rem",
            color: "var(--ink)",
            margin: 0,
          }}
        >
          투표 개폐
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {TIERS.map((tier) => {
            const isOpen = data.status[tier] ?? false;
            return (
              <div
                key={tier}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "12px 14px",
                  borderRadius: "10px",
                  border: "2px solid var(--ink)",
                  background: "var(--cream)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ fontWeight: 700, fontFamily: "var(--font-body)", color: "var(--ink)" }}>
                    {tier}
                  </span>
                  <span
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      padding: "2px 10px",
                      borderRadius: "9999px",
                      background: isOpen ? "#dcfce7" : "var(--cream-dark)",
                      color: isOpen ? "#15803d" : "var(--ink-muted)",
                      border: `1.5px solid ${isOpen ? "#16a34a" : "var(--ink-muted)"}`,
                      fontFamily: "var(--font-body)",
                    }}
                  >
                    {isOpen ? "진행 중" : "닫힘"}
                  </span>
                </div>
                <button
                  onClick={() => toggleVote(tier)}
                  disabled={updating}
                  className="btn-sketch"
                  style={{
                    padding: "7px 16px",
                    fontSize: "0.85rem",
                    background: isOpen ? "#fee2e2" : "#dcfce7",
                    color: isOpen ? "#dc2626" : "#15803d",
                    borderColor: isOpen ? "#dc2626" : "#16a34a",
                    boxShadow: isOpen ? "3px 3px 0 #dc2626" : "3px 3px 0 #16a34a",
                  }}
                >
                  {isOpen ? "투표 닫기" : "투표 열기"}
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* Results */}
      <section
        className="sketch-card"
        style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "18px" }}
      >
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "1.1rem",
            color: "var(--ink)",
            margin: 0,
          }}
        >
          투표 현황
        </h2>

        {TIERS.map((tier) => {
          const tierTeams = teams.filter((t) => t.tier === tier).sort((a, b) => a.order - b.order);
          const total = tierTeams.reduce((s, t) => s + (data.votes[t.id] || 0), 0);
          return (
            <div key={tier} style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontWeight: 700,
                  fontSize: "0.875rem",
                  color: "var(--ink-soft)",
                  margin: 0,
                }}
              >
                {tier}{" "}
                <span style={{ fontWeight: 500, color: "var(--ink-muted)" }}>
                  (총 {total}표)
                </span>
              </p>
              {tierTeams.map((team) => {
                const count = data.votes[team.id] || 0;
                const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                return (
                  <div key={team.id} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span
                      style={{
                        fontSize: "0.8rem",
                        width: "90px",
                        flexShrink: 0,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        fontFamily: "var(--font-body)",
                        fontWeight: 600,
                        color: team.club === "Starwars" ? "var(--starwars-text)" : "var(--spectrum-text)",
                      }}
                    >
                      {team.name}
                    </span>
                    <div
                      style={{
                        flex: 1,
                        height: "14px",
                        background: "var(--cream-dark)",
                        border: "2px solid var(--ink)",
                        borderRadius: "9999px",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          height: "100%",
                          width: `${pct}%`,
                          borderRadius: "9999px",
                          background:
                            team.club === "Starwars"
                              ? "var(--starwars-text)"
                              : "var(--spectrum-text)",
                          transition: "width 0.5s ease",
                        }}
                      />
                    </div>
                    <span
                      style={{
                        fontSize: "0.8rem",
                        color: "var(--ink-muted)",
                        width: "72px",
                        textAlign: "right",
                        flexShrink: 0,
                        fontFamily: "var(--font-body)",
                        fontWeight: 600,
                      }}
                    >
                      {count}표 ({pct}%)
                    </span>
                  </div>
                );
              })}
            </div>
          );
        })}
      </section>
    </div>
  );
}
