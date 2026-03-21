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

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>

      {/* Page heading */}
      <div style={{ textAlign: "center" }}>
        <h1 className="section-heading">공연 이름 공모</h1>
        <p style={{ color: "var(--ink-muted)", fontSize: "0.875rem", marginTop: "8px", lineHeight: 1.6 }}>
          이 연합공연의 이름을 지어주세요!<br />
          가장 많은 추천을 받은 이름에 선물을 드립니다.
        </p>
      </div>

      {/* Submit form / submitted state */}
      {!submitted ? (
        <form
          onSubmit={handleSubmit}
          className="sketch-card-cream"
          style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "12px" }}
        >
          <p
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1rem",
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
            className="sketch-input"
          />
          <input
            type="text"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            placeholder="등록자 이름"
            maxLength={20}
            className="sketch-input"
          />
          <button
            type="submit"
            disabled={!title.trim() || !authorName.trim() || submitting}
            className="btn-sketch"
            style={{
              width: "100%",
              padding: "13px",
              fontSize: "1rem",
              background:
                !title.trim() || !authorName.trim() || submitting
                  ? "var(--cream-dark)"
                  : "var(--ink)",
              color:
                !title.trim() || !authorName.trim() || submitting
                  ? "var(--ink-muted)"
                  : "var(--cream)",
              boxShadow:
                !title.trim() || !authorName.trim() || submitting
                  ? "none"
                  : "var(--sketch-shadow)",
              cursor:
                !title.trim() || !authorName.trim() || submitting
                  ? "not-allowed"
                  : "pointer",
            }}
          >
            {submitting ? "등록 중..." : "이름 등록하기"}
          </button>
        </form>
      ) : (
        <div
          className="sketch-card-cream"
          style={{
            padding: "20px",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <span style={{ fontSize: "1.8rem" }}>🎉</span>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontWeight: 600,
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
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {/* Section label */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "0.95rem",
              color: "var(--ink-muted)",
            }}
          >
            등록된 이름 ({entries.length}개)
          </span>
          <div
            style={{
              flex: 1,
              height: "2px",
              background: "var(--ink)",
              opacity: 0.15,
              borderRadius: "9999px",
            }}
          />
        </div>

        {entries.length === 0 ? (
          <div
            className="sketch-card-cream"
            style={{ padding: "40px 20px", textAlign: "center" }}
          >
            <p style={{ color: "var(--ink-muted)", fontFamily: "var(--font-body)", fontWeight: 500 }}>
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
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "12px 14px",
                  borderRadius: "12px",
                  border: isTop
                    ? "2.5px solid #f5c800"
                    : "2.5px solid var(--ink)",
                  background: isTop ? "#fffbe6" : "#fff",
                  boxShadow: isTop
                    ? "3px 3px 0 #f5c800"
                    : "3px 3px 0 var(--ink)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "12px", minWidth: 0 }}>
                  {/* Rank number */}
                  <span
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "1.2rem",
                      width: "24px",
                      textAlign: "center",
                      flexShrink: 0,
                      color: rankColor || "var(--ink-muted)",
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
                  className="btn-sketch"
                  style={{
                    flexShrink: 0,
                    padding: "6px 14px",
                    fontSize: "0.875rem",
                    gap: "5px",
                    background: liked ? "#fff0ee" : "var(--cream)",
                    color: liked ? "var(--rainbow-red)" : "var(--ink-soft)",
                    borderColor: liked ? "var(--rainbow-red)" : "var(--ink)",
                    boxShadow: liked ? "2px 2px 0 var(--rainbow-red)" : "var(--sketch-shadow)",
                    cursor: liked ? "default" : "pointer",
                    marginLeft: "10px",
                  }}
                >
                  ♥ {entry.likes}
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
