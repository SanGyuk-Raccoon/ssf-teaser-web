"use client";

import { useState, useEffect, useRef } from "react";

interface DeleteModalProps {
  open: boolean;
  onConfirm: (password: string) => void;
  onClose: () => void;
  error?: string | null;
}

export default function DeleteModal({ open, onConfirm, onClose, error }: DeleteModalProps) {
  const [pw, setPw] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setPw("");
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pw.trim()) onConfirm(pw.trim());
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(26,16,8,0.4)",
        backdropFilter: "blur(4px)",
        padding: "24px",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "var(--cream)",
          borderRadius: "24px",
          padding: "32px 28px",
          maxWidth: "340px",
          width: "100%",
          boxShadow: "var(--soft-shadow-lg)",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "1.3rem",
            color: "var(--ink)",
            margin: 0,
            textAlign: "center",
          }}
        >
          Delete
        </p>
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "0.9rem",
            color: "var(--ink-soft)",
            margin: 0,
            textAlign: "center",
            lineHeight: 1.6,
          }}
        >
          등록 시 입력한 비밀번호를 입력하세요.
        </p>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <input
            ref={inputRef}
            type="password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            placeholder="비밀번호"
            maxLength={20}
            className="open-input"
          />

          {error && (
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.8rem",
                color: "#dc2626",
                margin: 0,
                textAlign: "center",
              }}
            >
              {error}
            </p>
          )}

          <div style={{ display: "flex", gap: "10px" }}>
            <button
              type="button"
              onClick={onClose}
              className="btn-open"
              style={{
                flex: 1,
                padding: "12px",
                fontSize: "0.9rem",
                borderRadius: "14px",
                background: "var(--cream-mid)",
                color: "var(--ink-muted)",
                cursor: "pointer",
              }}
            >
              취소
            </button>
            <button
              type="submit"
              disabled={!pw.trim()}
              className="btn-open"
              style={{
                flex: 1,
                padding: "12px",
                fontSize: "0.9rem",
                borderRadius: "14px",
                background: pw.trim() ? "#dc2626" : "var(--cream-dark)",
                color: pw.trim() ? "#fff" : "var(--ink-muted)",
                cursor: pw.trim() ? "pointer" : "not-allowed",
              }}
            >
              삭제
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
