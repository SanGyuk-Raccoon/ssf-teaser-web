"use client";

import { useState, useEffect, useCallback } from "react";
import {
  hasLikedEntry,
  markLikedEntry,
  hasSubmittedNaming,
  markNamingSubmitted,
} from "@/lib/storage";

interface Entry {
  id: string;
  title: string;
  authorName: string;
  likes: number;
  createdAt: string;
}

export default function NamingPage() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [title, setTitle] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const fetchEntries = useCallback(async () => {
    const res = await fetch("/api/naming");
    setEntries(await res.json());
  }, []);

  useEffect(() => {
    fetchEntries();
    setSubmitted(hasSubmittedNaming());
    const interval = setInterval(fetchEntries, 5000);
    return () => clearInterval(interval);
  }, [fetchEntries]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !authorName.trim() || submitting || submitted) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/naming", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim(), authorName: authorName.trim() }),
      });
      if (res.ok) {
        markNamingSubmitted();
        setSubmitted(true);
        setTitle("");
        setAuthorName("");
        await fetchEntries();
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleLike = async (entryId: string) => {
    if (hasLikedEntry(entryId)) return;
    markLikedEntry(entryId);
    await fetch("/api/naming/like", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ entryId }),
    });
    await fetchEntries();
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold">공연 이름 공모</h1>
        <p className="text-zinc-400 text-sm">
          이 연합공연의 이름을 지어주세요! 가장 많은 추천을 받은 이름에 선물을 드립니다.
        </p>
      </div>

      {/* Submit form */}
      {!submitted ? (
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="공연 이름 (최대 30자)"
            maxLength={30}
            className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-rose-500 transition-colors"
          />
          <input
            type="text"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            placeholder="등록자 이름"
            maxLength={20}
            className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-rose-500 transition-colors"
          />
          <button
            type="submit"
            disabled={!title.trim() || !authorName.trim() || submitting}
            className="w-full py-3 bg-rose-600 hover:bg-rose-500 disabled:bg-zinc-800 disabled:text-zinc-600 rounded-xl font-medium transition-all"
          >
            {submitting ? "등록 중..." : "이름 등록하기"}
          </button>
        </form>
      ) : (
        <div className="text-center py-4 px-4 bg-zinc-900 rounded-xl border border-zinc-800">
          <p className="text-zinc-400">이름을 등록해주셨습니다! 아래 목록에서 마음에 드는 이름을 추천해주세요.</p>
        </div>
      )}

      {/* Entries list */}
      <div className="space-y-2">
        <h2 className="text-sm font-medium text-zinc-500">
          등록된 이름 ({entries.length}개)
        </h2>
        {entries.length === 0 ? (
          <p className="text-center text-zinc-600 py-8">
            아직 등록된 이름이 없습니다. 첫 번째로 등록해보세요!
          </p>
        ) : (
          entries.map((entry, i) => {
            const liked = hasLikedEntry(entry.id);
            return (
              <div
                key={entry.id}
                className={`flex items-center justify-between p-4 rounded-xl border ${
                  i === 0 && entry.likes > 0
                    ? "border-amber-500/50 bg-amber-500/5"
                    : "border-zinc-800 bg-zinc-900"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className={`text-lg font-bold w-6 text-center shrink-0 ${
                      i === 0 && entry.likes > 0 ? "text-amber-400" : "text-zinc-600"
                    }`}
                  >
                    {i + 1}
                  </span>
                  <div className="min-w-0">
                    <p className="font-medium truncate">{entry.title}</p>
                    <p className="text-xs text-zinc-500">{entry.authorName}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleLike(entry.id)}
                  disabled={liked}
                  className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-all ${
                    liked
                      ? "bg-rose-500/20 text-rose-400 cursor-default"
                      : "bg-zinc-800 text-zinc-400 hover:bg-rose-500/20 hover:text-rose-400"
                  }`}
                >
                  ♥ {entry.likes}
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
