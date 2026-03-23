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
      {/* Embedded map */}
      <div
        style={{
          borderRadius: "16px",
          overflow: "hidden",
          border: "1.5px solid rgba(0,0,0,0.08)",
          aspectRatio: "4 / 3",
        }}
      >
        <iframe
          src={MAP_EMBED_URL}
          width="100%"
          height="100%"
          style={{ border: 0, display: "block" }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="지도"
        />
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
