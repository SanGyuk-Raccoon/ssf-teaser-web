"use client";

import { useState, useEffect, useCallback } from "react";
import { TIERS } from "@/lib/data";
import { getSupabase } from "@/lib/supabase";
import { hasVotedTier, markVotedTier } from "@/lib/storage";

const SCORE_GUIDES: Record<string, { 1: string; 3: string; 5: string }> = {
  "신입": { 1: "신입 가이드 1점", 3: "신입 가이드 3점", 5: "신입 가이드 5점" },
  "YB":  { 1: "YB 가이드 1점", 3: "YB 가이드 3점", 5: "YB 가이드 5점" },
  "OB":  { 1: "OB 가이드 1점", 3: "OB 가이드 3점", 5: "OB 가이드 5점" },
};

export default function VoteSection() {
  const [status, setStatus] = useState<Record<string, boolean>>({});
  const [scores, setScores] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState<Record<string, boolean>>({});
  const [submitting, setSubmitting] = useState<string | null>(null);

  const fetchStatus = useCallback(async () => {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("vote_status")
      .select("tier, is_open");
    if (error) {
      console.error("Failed to fetch vote status:", error.message);
      return;
    }
    const s: Record<string, boolean> = {};
    for (const row of data ?? []) {
      s[row.tier] = row.is_open;
    }
    setStatus(s);
  }, []);

  useEffect(() => {
    fetchStatus();
    const saved: Record<string, boolean> = {};
    for (const tier of TIERS) {
      saved[tier] = hasVotedTier(tier);
    }
    setSubmitted(saved);
    const interval = setInterval(fetchStatus, 5000);
    return () => clearInterval(interval);
  }, [fetchStatus]);

  const handleScore = (tier: string, score: number) => {
    if (submitted[tier]) return;
    setScores((prev) => ({ ...prev, [tier]: score }));
  };

  const handleSubmitTier = async (tier: string) => {
    if (submitting || submitted[tier] || !scores[tier]) return;
    setSubmitting(tier);
    try {
      const supabase = getSupabase();
      const { error } = await supabase.from("votes").insert({ tier, score: scores[tier] });
      if (error) {
        console.error("Failed to submit vote:", error.message);
        return;
      }
      markVotedTier(tier);
      setSubmitted((prev) => ({ ...prev, [tier]: true }));
    } finally {
      setSubmitting(null);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
      {TIERS.map((tier) => {
        const isOpen = status[tier] ?? false;
        const isSubmitted = submitted[tier] ?? false;
        const score = scores[tier] || 0;

        return (
          <div key={tier} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {/* Tier header + status */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(1.2rem, 4vw, 1.6rem)",
                color: "var(--ink)",
              }}>
                {tier}
              </span>
              {isOpen ? (
                <span style={{
                  display: "inline-flex", alignItems: "center", gap: "6px",
                  padding: "4px 14px", background: "rgba(34,197,94,0.15)", borderRadius: "100px",
                  color: "#15803d", fontWeight: 700, fontSize: "0.75rem", fontFamily: "var(--font-body)",
                }}>
                  <span className="pulse-dot" style={{ width: "6px", height: "6px" }} />
                  투표 중
                </span>
              ) : (
                <span style={{
                  padding: "4px 14px", background: "rgba(0,0,0,0.05)", borderRadius: "100px",
                  color: "var(--ink-muted)", fontWeight: 700, fontSize: "0.75rem", fontFamily: "var(--font-body)",
                }}>
                  준비 중
                </span>
              )}
            </div>

            {/* Score buttons or submitted state */}
            {isSubmitted ? (
              <div style={{
                padding: "16px",
                background: "rgba(0,0,0,0.03)",
                borderRadius: "12px",
                textAlign: "center",
                fontFamily: "var(--font-body)",
                fontSize: "clamp(0.85rem, 2.5vw, 1rem)",
                color: "var(--ink-muted)",
              }}>
                투표 완료
              </div>
            ) : isOpen ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {/* Discrete slider */}
                <div style={{ padding: "8px 0" }}>
                  <div style={{ position: "relative", height: "40px", display: "flex", alignItems: "center" }}>
                    {/* Track */}
                    <div style={{
                      position: "absolute",
                      left: "10%",
                      right: "10%",
                      height: "4px",
                      background: "var(--cream-dark)",
                      borderRadius: "2px",
                    }} />
                    {/* Filled track */}
                    {score > 0 && (
                      <div style={{
                        position: "absolute",
                        left: "10%",
                        width: `${((score - 1) / 4) * 80}%`,
                        height: "4px",
                        background: "var(--ink)",
                        borderRadius: "2px",
                        transition: "width 0.15s ease",
                      }} />
                    )}
                    {/* Dots */}
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        key={s}
                        onClick={() => handleScore(tier, s)}
                        style={{
                          position: "absolute",
                          left: `${10 + ((s - 1) / 4) * 80}%`,
                          transform: "translateX(-50%)",
                          width: score === s ? "32px" : "20px",
                          height: score === s ? "32px" : "20px",
                          borderRadius: "50%",
                          border: score === s ? "3px solid var(--ink)" : "2px solid var(--cream-dark)",
                          background: s <= score ? "var(--ink)" : "#fff",
                          cursor: "pointer",
                          transition: "all 0.15s ease",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          zIndex: score === s ? 2 : 1,
                          padding: 0,
                        }}
                      >
                        {score === s && (
                          <span style={{
                            color: "#fff",
                            fontSize: "0.75rem",
                            fontFamily: "var(--font-display)",
                            fontWeight: 700,
                          }}>
                            {s}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                  {/* Score labels */}
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "0 2%" }}>
                    {[1, 2, 3, 4, 5].map((s) => (
                      <span
                        key={s}
                        style={{
                          width: "20%",
                          textAlign: "center",
                          fontSize: "0.7rem",
                          fontFamily: "var(--font-display)",
                          color: score === s ? "var(--ink)" : "var(--ink-muted)",
                          fontWeight: score === s ? 700 : 400,
                          opacity: score === s ? 1 : 0.6,
                        }}
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                  {/* Guide text */}
                  {SCORE_GUIDES[tier] && (
                    <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 0 0", marginTop: "2px" }}>
                      {[1, 3, 5].map((s) => (
                        <span
                          key={s}
                          style={{
                            width: "33%",
                            textAlign: s === 1 ? "left" : s === 5 ? "right" : "center",
                            fontSize: "0.7rem",
                            fontFamily: "var(--font-body)",
                            color: "var(--ink-muted)",
                            lineHeight: 1.3,
                          }}
                        >
                          {SCORE_GUIDES[tier][s as 1 | 3 | 5]}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => handleSubmitTier(tier)}
                  disabled={!score || submitting === tier}
                  className="btn-open"
                  style={{
                    width: "100%",
                    padding: "14px",
                    fontSize: "clamp(0.85rem, 2.5vw, 1rem)",
                    borderRadius: "12px",
                    background: score ? "var(--ink)" : "rgba(0,0,0,0.1)",
                    color: score ? "#fff" : "var(--ink-muted)",
                    cursor: score ? "pointer" : "not-allowed",
                    fontFamily: "var(--font-body)",
                  }}
                >
                  {submitting === tier ? "제출 중..." : "제출"}
                </button>
              </div>
            ) : (
              <div style={{
                padding: "16px",
                background: "rgba(0,0,0,0.03)",
                borderRadius: "12px",
                textAlign: "center",
                fontFamily: "var(--font-body)",
                fontSize: "clamp(0.85rem, 2.5vw, 1rem)",
                color: "var(--ink-muted)",
              }}>
                아직 투표가 열리지 않았습니다
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
