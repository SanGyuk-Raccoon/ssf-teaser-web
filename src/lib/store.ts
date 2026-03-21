import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const VOTES_FILE = path.join(DATA_DIR, "votes.json");
const NAMING_FILE = path.join(DATA_DIR, "naming.json");
const STATUS_FILE = path.join(DATA_DIR, "vote-status.json");

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

// --- Vote Status (admin opens/closes voting per category) ---

export interface VoteStatusData {
  "신입": boolean;
  YB: boolean;
  OB: boolean;
}

export function getVoteStatus(): VoteStatusData {
  ensureDataDir();
  if (!fs.existsSync(STATUS_FILE)) {
    return { "신입": false, YB: false, OB: false };
  }
  return JSON.parse(fs.readFileSync(STATUS_FILE, "utf-8"));
}

export function setVoteStatus(status: VoteStatusData): void {
  ensureDataDir();
  fs.writeFileSync(STATUS_FILE, JSON.stringify(status, null, 2));
}

// --- Votes ---

export interface VotesData {
  [teamId: string]: number;
}

export function getVotes(): VotesData {
  ensureDataDir();
  if (!fs.existsSync(VOTES_FILE)) return {};
  return JSON.parse(fs.readFileSync(VOTES_FILE, "utf-8"));
}

export function addVote(teamId: string): VotesData {
  const votes = getVotes();
  votes[teamId] = (votes[teamId] || 0) + 1;
  fs.writeFileSync(VOTES_FILE, JSON.stringify(votes, null, 2));
  return votes;
}

// --- Naming ---

export interface NamingEntryData {
  id: string;
  title: string;
  authorName: string;
  likes: number;
  createdAt: string;
}

export function getNamingEntries(): NamingEntryData[] {
  ensureDataDir();
  if (!fs.existsSync(NAMING_FILE)) return [];
  return JSON.parse(fs.readFileSync(NAMING_FILE, "utf-8"));
}

function saveNamingEntries(entries: NamingEntryData[]): void {
  ensureDataDir();
  fs.writeFileSync(NAMING_FILE, JSON.stringify(entries, null, 2));
}

export function addNamingEntry(title: string, authorName: string): NamingEntryData {
  const entries = getNamingEntries();
  const entry: NamingEntryData = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    title,
    authorName,
    likes: 0,
    createdAt: new Date().toISOString(),
  };
  entries.push(entry);
  saveNamingEntries(entries);
  return entry;
}

export function likeNamingEntry(entryId: string): NamingEntryData | null {
  const entries = getNamingEntries();
  const entry = entries.find((e) => e.id === entryId);
  if (!entry) return null;
  entry.likes += 1;
  saveNamingEntries(entries);
  return entry;
}
