"use client";

import { useState, useEffect, useCallback } from "react";
import { TIERS } from "@/lib/data";
import { getSupabase } from "@/lib/supabase";
import type { VoteData, AdminNamingEntry } from "@/lib/types";

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [data, setData] = useState<VoteData | null>(null);
  const [updating, setUpdating] = useState(false);
  const [namingEntries, setNamingEntries] = useState<AdminNamingEntry[]>([]);

  const fetchData = useCallback(async () => {
    const supabase = getSupabase();
    const [votesRes, statusRes] = await Promise.all([
      supabase.from("votes").select("tier, score"),
      supabase.from("vote_status").select("tier, is_open"),
    ]);
    const results: Record<string, { total: number; count: number; avg: number }> = {};
    let maxVoters = 0;
    for (const tier of TIERS) {
      const scores = (votesRes.data ?? []).filter((v) => v.tier === tier).map((v) => v.score);
      const total = scores.reduce((s, v) => s + v, 0);
      const count = scores.length;
      results[tier] = { total, count, avg: count > 0 ? Math.round((total / count) * 10) / 10 : 0 };
      if (count > maxVoters) maxVoters = count;
    }
    const status: Record<string, boolean> = {};
    for (const row of statusRes.data ?? []) {
      status[row.tier] = row.is_open;
    }
    setData({ results, totalVoters: maxVoters, status });
  }, []);

  const fetchNaming = useCallback(async () => {
    const res = await fetch("/api/naming/admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) setNamingEntries(await res.json());
  }, [password]);

  useEffect(() => {
    if (authenticated) {
      fetchData();
      fetchNaming();
      const interval = setInterval(() => { fetchData(); fetchNaming(); }, 3000);
      return () => clearInterval(interval);
    }
  }, [authenticated, fetchData, fetchNaming]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password) setAuthenticated(true);
  };

  const deleteNaming = async (entryId: number) => {
    if (!confirm("이 항목을 삭제하시겠습니까?")) return;
    const res = await fetch("/api/naming/admin", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password, entryId }),
    });
    if (res.ok) await fetchNaming();
    else alert("삭제 실패");
  };

  const resetLocalVotes = () => {
    if (!confirm("이 브라우저의 투표 기록을 초기화하시겠습니까?")) return;
    Object.keys(localStorage)
      .filter((k) => k.startsWith("ssf-teaser-vote-"))
      .forEach((k) => localStorage.removeItem(k));
    alert("브라우저 투표 기록이 초기화되었습니다. 새로고침 후 다시 투표할 수 있습니다.");
  };

  const resetDbVotes = async () => {
    if (!confirm("DB의 모든 투표 데이터를 삭제하고 라운드를 갱신하시겠습니까?\n모든 기기에서 다시 투표할 수 있게 됩니다.\n이 작업은 되돌릴 수 없습니다.")) return;
    const res = await fetch("/api/vote/reset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      // 관리자 본인의 localStorage도 초기화
      Object.keys(localStorage)
        .filter((k) => k.startsWith("ssf-teaser-vote-"))
        .forEach((k) => localStorage.removeItem(k));
      await fetchData();
      alert("투표 데이터가 초기화되었습니다. 모든 기기에서 다시 투표할 수 있습니다.");
    } else {
      alert("초기화 실패");
    }
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
            {[...TIERS, "naming" as const].map((tier) => {
              const isOpen = data.status[tier] ?? false;
              const label = tier === "naming" ? "이름 공모" : tier;
              const isNaming = tier === "naming";
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
                    ...(isNaming ? { borderTop: "1px solid var(--cream-dark)", marginTop: "4px" } : {}),
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
                      {label}
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
                    {isOpen ? (isNaming ? "공모 닫기" : "투표 닫기") : (isNaming ? "공모 열기" : "투표 열기")}
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        {/* Naming entries */}
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
            이름 공모 ({namingEntries.length}개)
          </h2>
          {namingEntries.length === 0 ? (
            <p style={{ color: "var(--ink-muted)", fontSize: "0.9rem", margin: 0 }}>
              등록된 항목이 없습니다.
            </p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {namingEntries.map((entry) => (
                <div
                  key={entry.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "12px 16px",
                    borderRadius: "14px",
                    background: "var(--cream-mid)",
                    gap: "12px",
                  }}
                >
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <p
                      style={{
                        fontWeight: 700,
                        fontSize: "0.95rem",
                        color: "var(--ink)",
                        margin: 0,
                        fontFamily: "var(--font-body)",
                      }}
                    >
                      {entry.title}
                    </p>
                    <p
                      style={{
                        fontSize: "0.75rem",
                        color: "var(--ink-muted)",
                        margin: 0,
                        marginTop: "2px",
                        fontFamily: "var(--font-body)",
                      }}
                    >
                      비밀번호: {entry.password} &middot; 추천 {entry.likes}개
                    </p>
                  </div>
                  <button
                    onClick={() => deleteNaming(entry.id)}
                    className="btn-open"
                    style={{
                      padding: "6px 14px",
                      fontSize: "0.8rem",
                      borderRadius: "10px",
                      background: "#fee2e2",
                      color: "#dc2626",
                      flexShrink: 0,
                    }}
                  >
                    삭제
                  </button>
                </div>
              ))}
            </div>
          )}
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
                    {tier}
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

        {/* Reset controls */}
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
            초기화
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <button
              onClick={resetLocalVotes}
              className="btn-open"
              style={{
                width: "100%",
                padding: "14px",
                fontSize: "0.9rem",
                borderRadius: "14px",
                background: "var(--cream-mid)",
                color: "var(--ink)",
                fontFamily: "var(--font-body)",
              }}
            >
              내 브라우저 투표 기록 초기화
            </button>
            <p style={{ fontSize: "0.75rem", color: "var(--ink-muted)", margin: 0, paddingLeft: "4px" }}>
              이 기기에서 다시 투표할 수 있게 됩니다. DB 데이터는 유지됩니다.
            </p>
            <button
              onClick={resetDbVotes}
              className="btn-open"
              style={{
                width: "100%",
                padding: "14px",
                fontSize: "0.9rem",
                borderRadius: "14px",
                background: "#fee2e2",
                color: "#dc2626",
                fontFamily: "var(--font-body)",
                fontWeight: 700,
              }}
            >
              전체 초기화 (모든 기기 재투표 허용)
            </button>
            <p style={{ fontSize: "0.75rem", color: "#dc2626", margin: 0, paddingLeft: "4px" }}>
              DB 투표 데이터 삭제 + 라운드 갱신으로 모든 기기에서 다시 투표할 수 있습니다. 되돌릴 수 없습니다.
            </p>
          </div>
        </section>

      </div>
    </div>
  );
}
