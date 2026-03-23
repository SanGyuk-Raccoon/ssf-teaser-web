import { Team } from "./types";

export const teams: Team[] = [
  {
    id: "sw-freshman",
    club: "Starwars",
    tier: "Rookie",
    name: "Starwars Rookie",
    description: "Starwars Rookie 팀입니다. 곧 소개가 업데이트됩니다.",
    imageUrl: "/placeholder-team.svg",
    order: 1,
  },
  {
    id: "sw-yb",
    club: "Starwars",
    tier: "YB",
    name: "Starwars YB",
    description: "Starwars YB 팀입니다. 곧 소개가 업데이트됩니다.",
    imageUrl: "/placeholder-team.svg",
    order: 2,
  },
  {
    id: "sw-ob",
    club: "Starwars",
    tier: "OB",
    name: "Starwars OB",
    description: "Starwars OB 팀입니다. 곧 소개가 업데이트됩니다.",
    imageUrl: "/placeholder-team.svg",
    order: 3,
  },
  {
    id: "sp-freshman",
    club: "Spectrum",
    tier: "Rookie",
    name: "호록호록",
    description: "Spectrum Rookie 팀입니다. 곧 소개가 업데이트됩니다.",
    imageUrl: "/placeholder-team.svg",
    order: 4,
  },
  {
    id: "sp-yb",
    club: "Spectrum",
    tier: "YB",
    name: "블루록",
    description: "Spectrum YB 팀입니다. 곧 소개가 업데이트됩니다.",
    imageUrl: "/placeholder-team.svg",
    order: 5,
  },
  {
    id: "sp-ob",
    club: "Spectrum",
    tier: "OB",
    name: "Spectrum OB | unevens",
    description: "2018년부터 함께하고 있는 unevens입니다. 이름처럼 even하지 않은 음악을 추구합니다. 희노애락을 한데 뒤섞어 들려드리겠습니다.",
    imageUrl: "/unevens.jpg",
    order: 6,
  },
];

export const TIERS = ["Rookie", "YB", "OB"] as const;
