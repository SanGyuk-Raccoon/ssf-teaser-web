"use client";

import { useState, useEffect, useCallback } from "react";
import { TIERS } from "@/lib/data";

const STORAGE_PREFIX = "ssf-teaser-";

function hasVotedTier(tier: string): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(`${STORAGE_PREFIX}vote-${tier}`) !== null;
}

function markVotedTier(tier: string): void {
  localStorage.setItem(`${STORAGE_PREFIX}vote-${tier}`, "1");
}

interface VoteStatus {
  status: Record<string, boolean>;
}

export default function VoteSection() {
  const [status, setStatus] = useState<Record<string, boolean>>({});
  const [scores, setScores] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState<Record<string, boolean>>({});
  const [submitting, setSubmitting] = useState<string | null>(null);

  const fetchStatus = useCallback(async () => {
    const res = await fetch("/api/vote");
    const data: VoteStatus = await res.json();
    setStatus(data.status);
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
      const tierScores: Record<string, number> = {};
      for (const t of TIERS) {
        tierScores[t] = t === tier ? scores[tier] : 0;
      }
      // Send only this tier's score
      await fetch("/api/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier, score: scores[tier] }),
      });
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
                {tier}조
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
                <div style={{ display: "flex", gap: "8px" }}>
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      onClick={() => handleScore(tier, s)}
                      style={{
                        flex: 1,
                        height: "48px",
                        borderRadius: "12px",
                        border: score === s ? "2.5px solid var(--ink)" : "1.5px solid rgba(0,0,0,0.1)",
                        background: score === s ? "var(--ink)" : "rgba(255,255,255,0.5)",
                        color: score === s ? "#fff" : "var(--ink)",
                        fontSize: "1.2rem",
                        fontFamily: "var(--font-display)",
                        fontWeight: 700,
                        cursor: "pointer",
                        transition: "all 0.15s ease",
                      }}
                    >
                      {s}
                    </button>
                  ))}
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
