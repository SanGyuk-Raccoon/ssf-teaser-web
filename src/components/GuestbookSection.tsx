"use client";

import { useState, useEffect, useCallback } from "react";
import { getSupabase } from "@/lib/supabase";
import DeleteModal from "./DeleteModal";

interface GuestbookEntry {
  id: number;
  nickname: string;
  message: string;
  created_at: string;
}

export default function GuestbookSection() {
  const [entries, setEntries] = useState<GuestbookEntry[]>([]);
  const [nickname, setNickname] = useState("");
  const [message, setMessage] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const fetchEntries = useCallback(async () => {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("guestbook")
      .select("id, nickname, message, created_at")
      .order("created_at", { ascending: false });
    if (error) {
      console.error("Failed to fetch guestbook:", error.message);
    } else {
      setEntries(data ?? []);
    }
  }, []);

  useEffect(() => {
    fetchEntries();
    const interval = setInterval(fetchEntries, 5000);
    return () => clearInterval(interval);
  }, [fetchEntries]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nickname.trim() || !message.trim() || !password.trim() || submitting) return;
    setSubmitting(true);
    try {
      const supabase = getSupabase();
      const { error } = await supabase
        .from("guestbook")
        .insert({
          nickname: nickname.trim(),
          message: message.trim(),
          password: password.trim(),
        });
      if (!error) {
        setNickname("");
        setMessage("");
        setPassword("");
        await fetchEntries();
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteConfirm = async (pw: string) => {
    if (!deleteTarget) return;
    setDeletingId(deleteTarget);
    setDeleteError(null);
    try {
      const res = await fetch("/api/guestbook", {
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

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    const hh = String(d.getHours()).padStart(2, "0");
    const mi = String(d.getMinutes()).padStart(2, "0");
    return `${mm}.${dd} ${hh}:${mi}`;
  };

  const isDisabled = !nickname.trim() || !message.trim() || !password.trim() || submitting;

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
        공연에 대한 기대, 응원, 소감을 자유롭게 남겨주세요!
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
          기대평 작성하기
        </p>
        <input
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          placeholder="닉네임 (최대 20자)"
          maxLength={20}
          className="open-input"
        />
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="메시지를 입력하세요 (최대 100자)"
          maxLength={100}
          className="open-input"
          rows={3}
          style={{ resize: "none" }}
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
          {submitting ? "등록 중..." : "남기기"}
        </button>
      </form>

      {/* Entries list */}
      <div style={{ position: "relative" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "12px", maxHeight: "480px", overflowY: "auto" }}>
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
            기대평 ({entries.length}개)
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
              아직 작성된 기대평이 없습니다.<br />첫 번째로 남겨보세요!
            </p>
          </div>
        ) : (
          entries.map((entry) => (
            <div
              key={entry.id}
              style={{
                background: "var(--cream-mid)",
                borderRadius: "16px",
                padding: "20px",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-body)",
                    fontWeight: 700,
                    fontSize: "0.95rem",
                    color: "var(--ink)",
                  }}
                >
                  {entry.nickname}
                </span>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "0.75rem",
                      color: "var(--ink-muted)",
                    }}
                  >
                    {formatDate(entry.created_at)}
                  </span>
                  <button
                    onClick={() => { setDeleteTarget(entry.id); setDeleteError(null); }}
                    disabled={deletingId === entry.id}
                    className="btn-open"
                    style={{
                      padding: "4px 8px",
                      fontSize: "0.7rem",
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
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.9rem",
                  color: "var(--ink-soft)",
                  margin: 0,
                  lineHeight: 1.7,
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                }}
              >
                {entry.message}
              </p>
            </div>
          ))
        )}
      </div>
      {entries.length > 3 && (
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "60px",
            background: "linear-gradient(transparent, var(--cream))",
            pointerEvents: "none",
            borderRadius: "0 0 20px 20px",
          }}
        />
      )}
      </div>

      <DeleteModal
        open={deleteTarget !== null}
        onConfirm={handleDeleteConfirm}
        onClose={() => { setDeleteTarget(null); setDeleteError(null); }}
        error={deleteError}
      />
    </div>
  );
}
