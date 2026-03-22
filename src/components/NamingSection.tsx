"use client";

import { useState, useEffect, useCallback } from "react";
import { getSupabase } from "@/lib/supabase";
import {
  hasLikedEntry,
  markLikedEntry,
  removeLikedEntry,
} from "@/lib/storage";
import type { NamingEntry } from "@/lib/types";
import DeleteModal from "./DeleteModal";

const RANK_COLORS = ["#e8352a", "#f47c20", "#f5c800"];

export default function NamingSection() {
  const [entries, setEntries] = useState<NamingEntry[]>([]);
  const [title, setTitle] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(true);

  const fetchEntries = useCallback(async () => {
    const supabase = getSupabase();
    const [entriesRes, statusRes] = await Promise.all([
      supabase
        .from("naming_entries")
        .select("id, title, likes, created_at")
        .order("likes", { ascending: false }),
      supabase
        .from("vote_status")
        .select("is_open")
        .eq("tier", "naming")
        .single(),
    ]);
    if (entriesRes.error) {
      console.error("Failed to fetch naming entries:", entriesRes.error.message);
    } else {
      setEntries(entriesRes.data ?? []);
    }
    if (statusRes.data) {
      setIsOpen(statusRes.data.is_open);
    }
  }, []);

  useEffect(() => {
    fetchEntries();
    const interval = setInterval(fetchEntries, 5000);
    return () => clearInterval(interval);
  }, [fetchEntries]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !password.trim() || submitting) return;
    setSubmitting(true);
    try {
      const supabase = getSupabase();
      const { error } = await supabase
        .from("naming_entries")
        .insert({ title: title.trim(), password: password.trim() });
      if (!error) {
        setTitle("");
        setPassword("");
        await fetchEntries();
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleLike = async (entryId: number) => {
    const liked = hasLikedEntry(String(entryId));
    const supabase = getSupabase();
    const entry = entries.find((e) => e.id === entryId);
    if (!entry) return;

    if (liked) {
      // 추천 취소
      removeLikedEntry(String(entryId));
      await supabase
        .from("naming_entries")
        .update({ likes: Math.max(0, entry.likes - 1) })
        .eq("id", entryId);
    } else {
      // 추천
      markLikedEntry(String(entryId));
      await supabase
        .from("naming_entries")
        .update({ likes: entry.likes + 1 })
        .eq("id", entryId);
    }
    await fetchEntries();
  };

  const handleDeleteConfirm = async (pw: string) => {
    if (!deleteTarget) return;
    setDeletingId(deleteTarget);
    setDeleteError(null);
    try {
      const res = await fetch("/api/naming", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entryId: deleteTarget, password: pw }),
      });
      if (res.ok) {
        setDeleteTarget(null);
        await fetchEntries();
      } else {
        const err = await res.json();
        setDeleteError(err.error || "삭제에 실패했습니다.");
      }
    } finally {
      setDeletingId(null);
    }
  };

  const isDisabled = !title.trim() || !password.trim() || submitting;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>

      {isOpen ? (
        <>
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

          {/* Submit form */}
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
                        onClick={() => handleLike(entry.id)}
                        className={`like-btn${liked ? " like-btn-liked" : ""}`}
                      >
                        ♥ {entry.likes}
                      </button>
                      <button
                        onClick={() => { setDeleteTarget(entry.id); setDeleteError(null); }}
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
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </>
      ) : (
        <div
          style={{
            padding: "16px",
            background: "rgba(0,0,0,0.03)",
            borderRadius: "12px",
            textAlign: "center",
            fontFamily: "var(--font-body)",
            fontSize: "clamp(0.85rem, 2.5vw, 1rem)",
            color: "var(--ink-muted)",
          }}
        >
          현장 참석 관객들을 위한 이벤트입니다. 많은 관심 부탁드립니다
        </div>
      )}

      <DeleteModal
        open={deleteTarget !== null}
        onConfirm={handleDeleteConfirm}
        onClose={() => { setDeleteTarget(null); setDeleteError(null); }}
        error={deleteError}
      />
    </div>
  );
}
