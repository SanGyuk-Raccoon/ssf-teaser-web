"use client";

import { useState } from "react";
import Image from "next/image";
import ImageModal from "./ImageModal";

interface TeamImageProps {
  src: string;
  alt: string;
}

export default function TeamImage({ src, alt }: TeamImageProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div
        onClick={() => setOpen(true)}
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: "1 / 1",
          borderRadius: "16px",
          overflow: "hidden",
          border: "1.5px solid rgba(0,0,0,0.08)",
          cursor: "zoom-in",
        }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 600px) 80vw, 480px"
          className="object-cover"
        />
      </div>
      {open && (
        <ImageModal src={src} alt={alt} onClose={() => setOpen(false)} />
      )}
    </>
  );
}
