"use client";

import { useState, useEffect, useCallback } from "react";
import { TIERS } from "@/lib/data";

interface VoteData {
  results: Record<string, { total: number; count: number; avg: number }>;
  totalVoters: number;
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
      <div
        style={{
          minHeight: "80vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px",
          background: "var(--band-a)",
        }}
      >
        <div style={{ width: "100%", maxWidth: "380px" }}>
          <h1
            className="font-display"
            style={{
              textAlign: "center",
              fontSize: "2rem",
              color: "var(--ink)",
              marginBottom: "28px",
            }}
          >
            관리자
          </h1>
          <form
            onSubmit={handleLogin}
            style={{
              background: "#fff",
              borderRadius: "24px",
              padding: "32px",
              boxShadow: "var(--soft-shadow-md)",
              display: "flex",
              flexDirection: "column",
              gap: "14px",
            }}
          >
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호"
              className="open-input"
            />
            <button
              type="submit"
              className="btn-open btn-solid"
              style={{
                width: "100%",
                padding: "15px",
                fontSize: "1rem",
                borderRadius: "14px",
              }}
            >
              로그인
            </button>
          </form>
        </div>
      </div>
    );
  }

  /* ── Loading ──────────────────────────────────────────────── */
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

  /* ── Admin panel ──────────────────────────────────────────── */
  return (
    <div style={{ background: "var(--band-a)", minHeight: "100vh" }}>

      {/* Page header */}
      <div
        style={{
          background: "var(--band-dark)",
          padding: "48px 24px 56px",
          textAlign: "center",
        }}
      >
        <h1
          className="font-display"
          style={{ fontSize: "2.5rem", color: "#fff" }}
        >
          관리자 패널
        </h1>
      </div>

      <div className="rainbow-bar" style={{ height: "4px", borderRadius: 0 }} />

      <div
        style={{
          maxWidth: "720px",
          margin: "0 auto",
          padding: "48px 24px 80px",
          display: "flex",
          flexDirection: "column",
          gap: "32px",
        }}
      >

        {/* Vote control */}
        <section
          style={{
            background: "#fff",
            borderRadius: "24px",
            padding: "28px 28px",
            boxShadow: "var(--soft-shadow)",
            display: "flex",
            flexDirection: "column",
            gap: "18px",
          }}
        >
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.2rem",
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
                    padding: "14px 18px",
                    borderRadius: "14px",
                    background: "var(--cream-mid)",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <span
                      style={{
                        fontWeight: 700,
                        fontFamily: "var(--font-body)",
                        color: "var(--ink)",
                      }}
                    >
                      {tier}
                    </span>
                    <span
                      style={{
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        padding: "3px 12px",
                        borderRadius: "9999px",
                        background: isOpen ? "#f0fdf4" : "var(--cream-dark)",
                        color: isOpen ? "#15803d" : "var(--ink-muted)",
                        fontFamily: "var(--font-body)",
                      }}
                    >
                      {isOpen ? "진행 중" : "닫힘"}
                    </span>
                  </div>
                  <button
                    onClick={() => toggleVote(tier)}
                    disabled={updating}
                    className="btn-open"
                    style={{
                      padding: "8px 20px",
                      fontSize: "0.85rem",
                      borderRadius: "100px",
                      background: isOpen ? "#fee2e2" : "#dcfce7",
                      color: isOpen ? "#dc2626" : "#15803d",
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
          style={{
            background: "#fff",
            borderRadius: "24px",
            padding: "28px 28px",
            boxShadow: "var(--soft-shadow)",
            display: "flex",
            flexDirection: "column",
            gap: "24px",
          }}
        >
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.2rem",
              color: "var(--ink)",
              margin: 0,
            }}
          >
            투표 현황
          </h2>

          {data.results && TIERS.map((tier) => {
            const result = data.results[tier] || { total: 0, count: 0, avg: 0 };
            return (
              <div key={tier} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <p
                    style={{
                      fontFamily: "var(--font-body)",
                      fontWeight: 700,
                      fontSize: "1rem",
                      color: "var(--ink-soft)",
                      margin: 0,
                    }}
                  >
                    {tier}조
                  </p>
                  <span style={{ fontSize: "0.85rem", color: "var(--ink-muted)", fontWeight: 600 }}>
                    평균 {result.avg}점 ({result.count}명)
                  </span>
                </div>
                <div
                  style={{
                    flex: 1,
                    height: "12px",
                    background: "var(--cream-dark)",
                    borderRadius: "9999px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${(result.avg / 5) * 100}%`,
                      borderRadius: "9999px",
                      background: "var(--rainbow-gradient)",
                      transition: "width 0.5s ease",
                    }}
                  />
                </div>
              </div>
            );
          })}
          {data.totalVoters !== undefined && (
            <p style={{ fontSize: "0.85rem", color: "var(--ink-muted)", margin: 0, textAlign: "center" }}>
              총 {data.totalVoters}명 참여
            </p>
          )}
        </section>

      </div>
    </div>
  );
}
