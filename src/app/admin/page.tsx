"use client";

import { useState, useEffect, useCallback } from "react";
import { teams, TIERS } from "@/lib/data";

interface VoteData {
  votes: Record<string, number>;
  status: Record<string, boolean>;
}

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [data, setData] = useState<VoteData | null>(null);
  const [updating, setUpdating] = useState(false);

  const fetchData = useCallback(async () => {
    const res = await fetch("/api/vote");
    setData(await res.json());
  }, []);

  useEffect(() => {
    if (authenticated) {
      fetchData();
      const interval = setInterval(fetchData, 3000);
      return () => clearInterval(interval);
    }
  }, [authenticated, fetchData]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password) setAuthenticated(true);
  };

  const toggleVote = async (tier: string) => {
    if (!data || updating) return;
    setUpdating(true);
    try {
      const newStatus = { ...data.status, [tier]: !data.status[tier] };
      const res = await fetch("/api/vote/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, status: newStatus }),
      });
      if (res.ok) {
        await fetchData();
      } else {
        const err = await res.json();
        alert(err.error || "오류가 발생했습니다");
        if (res.status === 401) setAuthenticated(false);
      }
    } finally {
      setUpdating(false);
    }
  };

  if (!authenticated) {
    return (
      <div className="max-w-sm mx-auto space-y-6 pt-20">
        <h1 className="text-2xl font-bold text-center">관리자</h1>
        <form onSubmit={handleLogin} className="space-y-3">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호"
            className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-rose-500"
          />
          <button
            type="submit"
            className="w-full py-3 bg-rose-600 hover:bg-rose-500 rounded-xl font-medium"
          >
            로그인
          </button>
        </form>
      </div>
    );
  }

  if (!data) {
    return <div className="text-center text-zinc-500 py-20">로딩 중...</div>;
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-center">관리자 패널</h1>

      {/* Vote control */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">투표 개폐</h2>
        <div className="grid gap-3">
          {TIERS.map((tier) => {
            const isOpen = data.status[tier] ?? false;
            return (
              <div
                key={tier}
                className="flex items-center justify-between p-4 bg-zinc-900 border border-zinc-800 rounded-xl"
              >
                <div className="flex items-center gap-3">
                  <span className="font-medium">{tier}</span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      isOpen
                        ? "bg-green-500/20 text-green-400"
                        : "bg-zinc-800 text-zinc-500"
                    }`}
                  >
                    {isOpen ? "진행 중" : "닫힘"}
                  </span>
                </div>
                <button
                  onClick={() => toggleVote(tier)}
                  disabled={updating}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    isOpen
                      ? "bg-red-600 hover:bg-red-500"
                      : "bg-green-600 hover:bg-green-500"
                  }`}
                >
                  {isOpen ? "투표 닫기" : "투표 열기"}
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* Results */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">투표 현황</h2>
        {TIERS.map((tier) => {
          const tierTeams = teams.filter((t) => t.tier === tier).sort((a, b) => a.order - b.order);
          const total = tierTeams.reduce((s, t) => s + (data.votes[t.id] || 0), 0);
          return (
            <div key={tier} className="space-y-2">
              <h3 className="text-sm text-zinc-400">
                {tier} (총 {total}표)
              </h3>
              {tierTeams.map((team) => {
                const count = data.votes[team.id] || 0;
                const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                return (
                  <div key={team.id} className="flex items-center gap-2">
                    <span className="text-sm w-20 sm:w-28 shrink-0 truncate">{team.club}</span>
                    <div className="flex-1 h-6 bg-zinc-800 rounded overflow-hidden">
                      <div
                        className={`h-full rounded transition-all ${
                          team.club === "Starwars" ? "bg-blue-500" : "bg-purple-500"
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-sm text-zinc-400 w-16 sm:w-20 text-right shrink-0">
                      {count}표 ({pct}%)
                    </span>
                  </div>
                );
              })}
            </div>
          );
        })}
      </section>
    </div>
  );
}
