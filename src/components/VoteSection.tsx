"use client";

import { useState, useEffect, useCallback } from "react";
import { TIERS } from "@/lib/data";
import { getSupabase } from "@/lib/supabase";
import { hasVotedTier, markVotedTier } from "@/lib/storage";

const TIER_CRITERIA: Record<string, string> = {
  "Rookie": "신입의 에너지를 보여줬나요?",
  "YB": "동호회를 대표하는 실력이었나요?",
  "OB": "경험과 관록이 느껴졌나요?",
};

const SCORE_GUIDES: Record<string, { 1: string; 3: string; 5: string }> = {
  "Rookie": { 1: "에너지가 조금 아쉬웠어요", 3: "신입다운 패기가 느껴졌어요", 5: "내 첫 무대가 떠오를 만큼 뜨거웠어요!" },
  "YB": { 1: "실력 발휘가 아쉬웠어요", 3: "안정적인 합주력이 느껴졌어요", 5: "동호회의 간판, 완벽한 무대였어요!" },
  "OB": { 1: "관록이 잘 드러나지 않았어요", 3: "경험에서 우러나는 여유가 있었어요", 5: "나도 저렇게 되고 싶다! 감동이었어요!" },
};

export default function VoteSection() {
  const [status, setStatus] = useState<Record<string, boolean>>({});
  const [scores, setScores] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState<Record<string, boolean>>({});
  const [submitting, setSubmitting] = useState<string | null>(null);
  const [round, setRound] = useState("1");

  const fetchStatus = useCallback(async () => {
    const supabase = getSupabase();
    const [statusRes, roundRes] = await Promise.all([
      supabase.from("vote_status").select("tier, is_open"),
      supabase.from("config").select("value").eq("key", "vote_round").single(),
    ]);
    if (statusRes.error) {
      console.error("Failed to fetch vote status:", statusRes.error.message);
      return;
    }
    const s: Record<string, boolean> = {};
    for (const row of statusRes.data ?? []) {
      s[row.tier] = row.is_open;
    }
    setStatus(s);

    const currentRound = roundRes.data?.value ?? "1";
    setRound(currentRound);

    const saved: Record<string, boolean> = {};
    for (const tier of TIERS) {
      saved[tier] = hasVotedTier(tier, currentRound);
    }
    setSubmitted(saved);
  }, []);

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 10000);
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
      markVotedTier(tier, round);
      setSubmitted((prev) => ({ ...prev, [tier]: true }));
    } finally {
      setSubmitting(null);
    }
  };

  const allClosed = TIERS.length > 0
    && Object.keys(status).length > 0
    && TIERS.every((tier) => !status[tier]);

  if (allClosed) return null;

  return (
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
                {/* Criteria */}
                {TIER_CRITERIA[tier] && (
                  <p style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "clamp(1rem, 3vw, 1.2rem)",
                    color: "var(--ink-soft)",
                    textAlign: "center",
                    margin: "0 0 4px",
                  }}>
                    {TIER_CRITERIA[tier]}
                  </p>
                )}
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
                  {/* Guide text - show on score select */}
                  {SCORE_GUIDES[tier] && score > 0 && (() => {
                    const nearest = score <= 2 ? 1 : score <= 4 ? 3 : 5;
                    return (
                      <div style={{
                        textAlign: "center",
                        padding: "8px 0 0",
                        marginTop: "2px",
                      }}>
                        <span style={{
                          fontSize: "clamp(0.8rem, 2.2vw, 0.95rem)",
                          fontFamily: "var(--font-body)",
                          color: "var(--ink-soft)",
                          fontWeight: 500,
                          lineHeight: 1.4,
                        }}>
                          {SCORE_GUIDES[tier][nearest as 1 | 3 | 5]}
                        </span>
                      </div>
                    );
                  })()}
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
      </div>
    </section>
  );
}
