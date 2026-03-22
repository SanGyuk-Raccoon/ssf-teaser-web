"use client";

import { useEffect } from "react";
import Image from "next/image";

interface ImageModalProps {
  src: string;
  alt: string;
  onClose: () => void;
}

export default function ImageModal({ src, alt, onClose }: ImageModalProps) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

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
        background: "rgba(26,16,8,0.85)",
        backdropFilter: "blur(8px)",
        padding: "24px",
        cursor: "zoom-out",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "relative",
          maxWidth: "90vw",
          maxHeight: "85vh",
          width: "600px",
          aspectRatio: "1 / 1",
          borderRadius: "16px",
          overflow: "hidden",
          cursor: "default",
        }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 90vw, 600px"
          priority
        />
      </div>
      <button
        onClick={onClose}
        style={{
          position: "fixed",
          top: "20px",
          right: "20px",
          width: "40px",
          height: "40px",
          borderRadius: "50%",
          border: "none",
          background: "rgba(255,255,255,0.15)",
          color: "#fff",
          fontSize: "1.3rem",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        ✕
      </button>
    </div>
  );
}
