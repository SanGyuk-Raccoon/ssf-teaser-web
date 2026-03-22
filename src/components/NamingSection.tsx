"use client";

import { useState, useEffect, useCallback } from "react";
import { getSupabase } from "@/lib/supabase";
import {
  hasLikedEntry,
  markLikedEntry,
  hasSubmittedNaming,
  markNamingSubmitted,
} from "@/lib/storage";

interface Entry {
  id: number;
  title: string;
  likes: number;
  created_at: string;
}

const RANK_COLORS = ["#e8352a", "#f47c20", "#f5c800"];

export default function NamingSection() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [title, setTitle] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchEntries = useCallback(async () => {
    const supabase = getSupabase();
    const { data } = await supabase
      .from("naming_entries")
      .select("id, title, likes, created_at")
      .order("likes", { ascending: false });
    setEntries(data ?? []);
  }, []);

  useEffect(() => {
    fetchEntries();
    setSubmitted(hasSubmittedNaming());
    const interval = setInterval(fetchEntries, 5000);
    return () => clearInterval(interval);
  }, [fetchEntries]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !password.trim() || submitting || submitted) return;
    setSubmitting(true);
    try {
      const supabase = getSupabase();
      const { error } = await supabase
        .from("naming_entries")
        .insert({ title: title.trim(), password: password.trim() });
      if (!error) {
        markNamingSubmitted();
        setSubmitted(true);
        setTitle("");
        setPassword("");
        await fetchEntries();
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleLike = async (entryId: number) => {
    if (hasLikedEntry(String(entryId))) return;
    markLikedEntry(String(entryId));
    const supabase = getSupabase();
    const entry = entries.find((e) => e.id === entryId);
    if (entry) {
      await supabase
        .from("naming_entries")
        .update({ likes: entry.likes + 1 })
        .eq("id", entryId);
      await fetchEntries();
    }
  };

  const handleDelete = async (entryId: number) => {
    const pw = prompt("삭제하려면 등록 시 입력한 비밀번호를 입력하세요.");
    if (!pw) return;
    setDeletingId(entryId);
    try {
      const res = await fetch("/api/naming", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entryId, password: pw }),
      });
      if (res.ok) {
        await fetchEntries();
      } else {
        const err = await res.json();
        alert(err.error || "삭제에 실패했습니다.");
      }
    } finally {
      setDeletingId(null);
    }
  };

  const isDisabled = !title.trim() || !password.trim() || submitting;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>

      <p
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "clamp(0.85rem, 2.5vw, 1rem)",
          color: "var(--ink-muted)",
          textAlign: "center",
          lineHeight: 1.7,
          margin: 0,
        }}
      >
        이 연합공연의 이름을 지어주세요!<br />
        가장 많은 추천을 받은 이름에 선물을 드립니다.
      </p>

      {/* Submit form / submitted state */}
      {!submitted ? (
        <form
          onSubmit={handleSubmit}
          style={{
            background: "var(--cream-mid)",
            borderRadius: "20px",
            padding: "28px 24px",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.05rem",
              color: "var(--ink-soft)",
              margin: 0,
              marginBottom: "2px",
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
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호 (삭제 시 필요)"
            maxLength={20}
            className="open-input"
          />
          <button
            type="submit"
            disabled={isDisabled}
            className="btn-open"
            style={{
              width: "100%",
              padding: "14px",
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
            borderRadius: "20px",
            padding: "36px 24px",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <span style={{ fontSize: "2rem" }}>🎉</span>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontWeight: 700,
              fontSize: "1rem",
              color: "var(--ink)",
              margin: 0,
            }}
          >
            이름을 등록해주셨습니다!
          </p>
          <p style={{ fontSize: "0.85rem", color: "var(--ink-muted)", margin: 0 }}>
            아래 목록에서 마음에 드는 이름을 추천해주세요.
          </p>
        </div>
      )}

      {/* Entries list */}
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
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
              padding: "40px 24px",
              textAlign: "center",
            }}
          >
            <p
              style={{
                color: "var(--ink-muted)",
                fontFamily: "var(--font-body)",
                fontWeight: 500,
                lineHeight: 1.7,
                margin: 0,
              }}
            >
              아직 등록된 이름이 없습니다.<br />첫 번째로 등록해보세요!
            </p>
          </div>
        ) : (
          entries.map((entry, i) => {
            const liked = hasLikedEntry(String(entry.id));
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
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
                  <button
                    onClick={() => handleDelete(entry.id)}
                    disabled={deletingId === entry.id}
                    className="btn-open"
                    style={{
                      padding: "6px 10px",
                      fontSize: "0.75rem",
                      borderRadius: "8px",
                      background: "transparent",
                      color: "var(--ink-muted)",
                      border: "1px solid var(--cream-dark)",
                      cursor: deletingId === entry.id ? "not-allowed" : "pointer",
                      opacity: deletingId === entry.id ? 0.5 : 1,
                    }}
                  >
                    삭제
                  </button>
                  <button
                    onClick={() => handleLike(entry.id)}
                    disabled={liked}
                    className={`like-btn${liked ? " like-btn-liked" : ""}`}
                  >
                    ♥ {entry.likes}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
