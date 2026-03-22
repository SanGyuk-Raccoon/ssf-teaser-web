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
  신입: boolean;
  YB: boolean;
  OB: boolean;
}
