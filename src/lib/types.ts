export interface Team {
  id: string;
  club: "Starwars" | "Spectrum";
  tier: "Rookie" | "YB" | "OB";
  name: string;
  description: string;
  imageUrl: string;
  order: number;
}

export interface Vote {
  category: "Rookie" | "YB" | "OB";
  teamId: string;
}

export interface NamingEntry {
  id: number;
  title: string;
  likes: number;
  created_at: string;
}

export interface AdminNamingEntry extends NamingEntry {
  password: string;
}

export interface VoteResult {
  total: number;
  count: number;
  avg: number;
}

export interface VoteData {
  results: Record<string, VoteResult>;
  totalVoters: number;
  status: Record<string, boolean>;
}

export interface VoteStatus {
  Rookie: boolean;
  YB: boolean;
  OB: boolean;
}
