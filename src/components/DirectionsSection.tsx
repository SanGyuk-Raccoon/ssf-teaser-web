"use client";

const ADDRESS = "경기 수원시 팔달구 행궁로 88 지하1층";
const VENUE = "남문 로데오 아트홀";
const ENCODED_QUERY = encodeURIComponent(`${ADDRESS} ${VENUE}`);

const MAP_EMBED_URL = `https://map.naver.com/p/entry/place/327546150?c=15.00,0,0,0,dh`;
const NAVER_MAP_URL = "https://naver.me/xIeXk5bY";
const KAKAO_MAP_URL = "https://place.map.kakao.com/327546150";

export default function DirectionsSection() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Venue info */}
      <div
        style={{
          background: "var(--cream-mid)",
          borderRadius: "16px",
          padding: "28px 24px",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
        }}
      >
        <p style={{ fontFamily: "var(--font-display)", fontSize: "1.3rem", fontWeight: 700, color: "var(--ink)", margin: 0 }}>
          {VENUE}
        </p>
        <p style={{ fontFamily: "var(--font-body)", fontSize: "0.9rem", color: "var(--ink-soft)", margin: 0, lineHeight: 1.6 }}>
          {ADDRESS}
        </p>
      </div>

      {/* Map app buttons */}
      <div style={{ display: "flex", gap: "10px" }}>
        <a
          href={NAVER_MAP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-open"
          style={{
            flex: 1,
            padding: "14px",
            fontSize: "0.95rem",
            borderRadius: "14px",
            background: "#03C75A",
            color: "#fff",
            textAlign: "center",
            textDecoration: "none",
            fontFamily: "var(--font-body)",
            fontWeight: 700,
          }}
        >
          네이버 지도
        </a>
        <a
          href={KAKAO_MAP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-open"
          style={{
            flex: 1,
            padding: "14px",
            fontSize: "0.95rem",
            borderRadius: "14px",
            background: "#FEE500",
            color: "#191919",
            textAlign: "center",
            textDecoration: "none",
            fontFamily: "var(--font-body)",
            fontWeight: 700,
          }}
        >
          카카오맵
        </a>
      </div>
    </div>
  );
}
