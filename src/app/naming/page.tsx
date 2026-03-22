"use client";

import { useState, useEffect, useCallback } from "react";
import {
  hasLikedEntry,
  markLikedEntry,
  hasSubmittedNaming,
  markNamingSubmitted,
} from "@/lib/storage";

interface Entry {
  id: string;
  title: string;
  authorName: string;
  likes: number;
  createdAt: string;
}

const RANK_COLORS = ["#e8352a", "#f47c20", "#f5c800"];

export default function NamingPage() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [title, setTitle] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const fetchEntries = useCallback(async () => {
    const res = await fetch("/api/naming");
    setEntries(await res.json());
  }, []);

  useEffect(() => {
    fetchEntries();
    setSubmitted(hasSubmittedNaming());
    const interval = setInterval(fetchEntries, 5000);
    return () => clearInterval(interval);
  }, [fetchEntries]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !authorName.trim() || submitting || submitted) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/naming", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim(), authorName: authorName.trim() }),
      });
      if (res.ok) {
        markNamingSubmitted();
        setSubmitted(true);
        setTitle("");
        setAuthorName("");
        await fetchEntries();
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleLike = async (entryId: string) => {
    if (hasLikedEntry(entryId)) return;
    markLikedEntry(entryId);
    await fetch("/api/naming/like", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ entryId }),
    });
    await fetchEntries();
  };

  const isDisabled = !title.trim() || !authorName.trim() || submitting;

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
            fontSize: "clamp(2.2rem, 8vw, 4.5rem)",
            lineHeight: 0.95,
            color: "#fff",
            marginBottom: "16px",
          }}
        >
          공연 이름 공모
        </h1>
        <p
          style={{
            color: "rgba(255,255,255,0.45)",
            fontSize: "0.95rem",
            fontWeight: 500,
            fontFamily: "var(--font-body)",
            lineHeight: 1.7,
          }}
        >
          이 연합공연의 이름을 지어주세요!<br />
          가장 많은 추천을 받은 이름에 선물을 드립니다.
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
            maxWidth: "640px",
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            gap: "40px",
          }}
        >

          {/* Submit form / submitted state */}
          {!submitted ? (
            <form
              onSubmit={handleSubmit}
              style={{
                background: "var(--cream-mid)",
                borderRadius: "24px",
                padding: "32px 28px",
                display: "flex",
                flexDirection: "column",
                gap: "14px",
              }}
            >
              <p
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "1.15rem",
                  color: "var(--ink-soft)",
                  marginBottom: "4px",
                }}
              >
                이름 제안하기
              </p>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="공연 이름 (최대 30자)"
                maxLength={30}
                className="open-input"
              />
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="등록자 이름"
                maxLength={20}
                className="open-input"
              />
              <button
                type="submit"
                disabled={isDisabled}
                className="btn-open"
                style={{
                  width: "100%",
                  padding: "15px",
                  fontSize: "1rem",
                  borderRadius: "14px",
                  background: isDisabled ? "var(--cream-dark)" : "var(--ink)",
                  color: isDisabled ? "var(--ink-muted)" : "var(--cream)",
                  cursor: isDisabled ? "not-allowed" : "pointer",
                  opacity: isDisabled ? 0.7 : 1,
                }}
              >
                {submitting ? "등록 중..." : "이름 등록하기"}
              </button>
            </form>
          ) : (
            <div
              style={{
                background: "var(--cream-mid)",
                borderRadius: "24px",
                padding: "40px 28px",
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <span style={{ fontSize: "2.2rem" }}>🎉</span>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontWeight: 700,
                  fontSize: "1.05rem",
                  color: "var(--ink)",
                }}
              >
                이름을 등록해주셨습니다!
              </p>
              <p style={{ fontSize: "0.875rem", color: "var(--ink-muted)" }}>
                아래 목록에서 마음에 드는 이름을 추천해주세요.
              </p>
            </div>
          )}

          {/* Entries list */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {/* Section label */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginBottom: "4px",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "1rem",
                  color: "var(--ink-muted)",
                }}
              >
                등록된 이름 ({entries.length}개)
              </span>
              <div
                style={{
                  flex: 1,
                  height: "1px",
                  background: "var(--ink)",
                  opacity: 0.1,
                }}
              />
            </div>

            {entries.length === 0 ? (
              <div
                style={{
                  background: "var(--cream-mid)",
                  borderRadius: "20px",
                  padding: "48px 24px",
                  textAlign: "center",
                }}
              >
                <p
                  style={{
                    color: "var(--ink-muted)",
                    fontFamily: "var(--font-body)",
                    fontWeight: 500,
                    lineHeight: 1.7,
                  }}
                >
                  아직 등록된 이름이 없습니다.<br />첫 번째로 등록해보세요!
                </p>
              </div>
            ) : (
              entries.map((entry, i) => {
                const liked = hasLikedEntry(entry.id);
                const isTop = i === 0 && entry.likes > 0;
                const rankColor = i < 3 && entry.likes > 0 ? RANK_COLORS[i] : undefined;

                return (
                  <div
                    key={entry.id}
                    className={`entry-row${isTop ? " entry-row-top" : ""}`}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "14px",
                        minWidth: 0,
                      }}
                    >
                      {/* Rank number */}
                      <span
                        style={{
                          fontFamily: "var(--font-display)",
                          fontSize: "1.3rem",
                          width: "26px",
                          textAlign: "center",
                          flexShrink: 0,
                          color: rankColor || "var(--ink-muted)",
                          opacity: rankColor ? 1 : 0.4,
                        }}
                      >
                        {i + 1}
                      </span>
                      <div style={{ minWidth: 0 }}>
                        <p
                          style={{
                            fontWeight: 700,
                            fontSize: "0.95rem",
                            color: "var(--ink)",
                            margin: 0,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
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
                            fontFamily: "var(--font-body)",
                            marginTop: "2px",
                          }}
                        >
                          {entry.authorName}
                        </p>
                      </div>
                    </div>

                    {/* Like button */}
                    <button
                      onClick={() => handleLike(entry.id)}
                      disabled={liked}
                      className={`like-btn${liked ? " like-btn-liked" : ""}`}
                    >
                      ♥ {entry.likes}
                    </button>
                  </div>
                );
              })
            )}
          </div>

        </div>
      </section>

    </div>
  );
}
