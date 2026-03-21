export interface Team {
  id: string;
  club: "Starwars" | "Spectrum";
  tier: "신입" | "YB" | "OB";
  name: string;
  description: string;
  imageUrl: string;
  order: number;
}

export interface Vote {
  category: "신입" | "YB" | "OB";
  teamId: string;
}

export interface NamingEntry {
  id: string;
  title: string;
  authorName: string;
  likes: number;
  createdAt: string;
}

export interface VoteStatus {
  신입: boolean;
  YB: boolean;
  OB: boolean;
}
