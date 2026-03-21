// localStorage-based lightweight duplicate prevention

const STORAGE_PREFIX = "ssf-teaser-";

export function hasVoted(category: string): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(`${STORAGE_PREFIX}vote-${category}`) !== null;
}

export function markVoted(category: string, teamId: string): void {
  localStorage.setItem(`${STORAGE_PREFIX}vote-${category}`, teamId);
}

export function getVotedTeam(category: string): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(`${STORAGE_PREFIX}vote-${category}`);
}

export function hasLikedEntry(entryId: string): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(`${STORAGE_PREFIX}like-${entryId}`) !== null;
}

export function markLikedEntry(entryId: string): void {
  localStorage.setItem(`${STORAGE_PREFIX}like-${entryId}`, "1");
}

export function hasSubmittedNaming(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(`${STORAGE_PREFIX}naming-submitted`) !== null;
}

export function markNamingSubmitted(): void {
  localStorage.setItem(`${STORAGE_PREFIX}naming-submitted`, "1");
}
