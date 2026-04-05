"use client";

import { useState, useEffect, useCallback } from "react";

let showToastGlobal: (message: string) => void = () => {};

export function useToast() {
  return showToastGlobal;
}

export default function Toast() {
  const [message, setMessage] = useState("");
  const [visible, setVisible] = useState(false);

  const show = useCallback((msg: string) => {
    setMessage(msg);
    setVisible(true);
  }, []);

  useEffect(() => {
    showToastGlobal = show;
  }, [show]);

  useEffect(() => {
    if (!visible) return;
    const timer = setTimeout(() => setVisible(false), 2500);
    return () => clearTimeout(timer);
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: "32px",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 9999,
        background: "var(--ink)",
        color: "var(--cream)",
        fontFamily: "var(--font-body)",
        fontSize: "clamp(0.85rem, 2.5vw, 1rem)",
        padding: "14px 28px",
        borderRadius: "16px",
        boxShadow: "var(--soft-shadow-lg)",
        textAlign: "center",
        maxWidth: "calc(100vw - 48px)",
        animation: "toast-in 0.25s ease",
      }}
    >
      {message}
      <style>{`
        @keyframes toast-in {
          from { opacity: 0; transform: translateX(-50%) translateY(12px); }
          to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>
    </div>
  );
}
