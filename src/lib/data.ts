import { Team } from "./types";

export const teams: Team[] = [
  {
    id: "sw-freshman",
    club: "Starwars",
    tier: "신입",
    name: "Starwars 신입",
    description: "Starwars 신입 팀입니다. 곧 소개가 업데이트됩니다.",
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
    tier: "신입",
    name: "Spectrum 신입",
    description: "Spectrum 신입 팀입니다. 곧 소개가 업데이트됩니다.",
    imageUrl: "/placeholder-team.svg",
    order: 4,
  },
  {
    id: "sp-yb",
    club: "Spectrum",
    tier: "YB",
    name: "Spectrum YB",
    description: "Spectrum YB 팀입니다. 곧 소개가 업데이트됩니다.",
    imageUrl: "/placeholder-team.svg",
    order: 5,
  },
  {
    id: "sp-ob",
    club: "Spectrum",
    tier: "OB",
    name: "Spectrum OB",
    description: "Spectrum OB 팀입니다. 곧 소개가 업데이트됩니다.",
    imageUrl: "/placeholder-team.svg",
    order: 6,
  },
];

export const TIERS = ["신입", "YB", "OB"] as const;
