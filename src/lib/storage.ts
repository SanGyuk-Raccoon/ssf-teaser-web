// localStorage-based lightweight duplicate prevention

const STORAGE_PREFIX = "ssf-teaser-";

export function hasVotedAll(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(`${STORAGE_PREFIX}vote-submitted`) !== null;
}

export function markVotedAll(): void {
  localStorage.setItem(`${STORAGE_PREFIX}vote-submitted`, "1");
}

export function hasLikedEntry(entryId: string): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(`${STORAGE_PREFIX}like-${entryId}`) !== null;
}

export function markLikedEntry(entryId: string): void {
  localStorage.setItem(`${STORAGE_PREFIX}like-${entryId}`, "1");
}

export function removeLikedEntry(entryId: string): void {
  localStorage.removeItem(`${STORAGE_PREFIX}like-${entryId}`);
}

export function hasSubmittedNaming(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(`${STORAGE_PREFIX}naming-submitted`) !== null;
}

export function markNamingSubmitted(): void {
  localStorage.setItem(`${STORAGE_PREFIX}naming-submitted`, "1");
}
