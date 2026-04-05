import { Team } from "./types";

export const teams: Team[] = [
  {
    id: "sw-freshman",
    club: "Starwars",
    tier: "Rookie",
    name: "Starwars Rookie | 밍숭맹숭",
    description: "이러나 저러나~ 밍숭 맹숭한 사람들의 모임\n싱숭생숭 봄 날씨에는 밍숭맹숭 밴드로 집합!",
    imageUrl: "/밍숭맹숭.webp",
    order: 1,
  },
  {
    id: "sw-yb",
    club: "Starwars",
    tier: "YB",
    name: "Starwars YB | BTSS",
    description: "\"Bus Tago Sipeun Saramdeul\"\n무임승차를 꿈꾸며 모였지만 합주만 시작하면 핸들 잡고 질주하는 반전 드라이버(엄살쟁이)들의 모임.\nBTSS의 여유로운 드라이빙에 함께 버스 타실 분?",
    imageUrl: "/btss.webp",
    order: 2,
  },
  {
    id: "sw-ob",
    club: "Starwars",
    tier: "OB",
    name: "Starwars OB | RN'G",
    description: "RN'G는 하드 록의 전설 건스 앤 로지스(Guns N' Roses)의 데뷔 앨범 'Appetite for Destruction'을 완벽히 재현하기 위해 결성된 카피 밴드입니다.\n특유의 열정과 스타워즈의 탄탄한 음악적 뿌리를 바탕으로 건스 앤 로지스 날 것 그대로의 사운드를 무대 위에서 가감 없이 선보입니다.",
    imageUrl: "/rn'g.webp",
    order: 3,
  },
  {
    id: "sp-freshman",
    club: "Spectrum",
    tier: "Rookie",
    name: "Spectrum Rookie | 호록호록",
    description: "저희는 호록호록!\n음악은 결코 호락호락하지 않는 호기로운 록을 보여드리겠습니다!",
    imageUrl: "/placeholder-team.svg",
    order: 4,
  },
  {
    id: "sp-yb",
    club: "Spectrum",
    tier: "YB",
    name: "Spectrum YB | 블루록",
    description: "하드락을 기반으로한\n비쥬얼훵크발라드메탈밴드.",
    imageUrl: "/블루록.webp",
    order: 5,
  },
  {
    id: "sp-ob",
    club: "Spectrum",
    tier: "OB",
    name: "Spectrum OB | unevens",
    description: "2018년부터 함께하고 있는 unevens입니다. 이름처럼 even하지 않은 음악을 추구합니다.\n희노애락을 한데 뒤섞어 들려드리겠습니다.",
    imageUrl: "/unevens.webp",
    order: 6,
  },
];

export const TIERS = ["Rookie", "YB", "OB"] as const;
