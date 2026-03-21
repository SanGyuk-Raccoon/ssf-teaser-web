"use client";

import { useState, useEffect, useCallback } from "react";
import { teams, TIERS } from "@/lib/data";
import { hasVoted, markVoted, getVotedTeam } from "@/lib/storage";

interface VoteData {
  votes: Record<string, number>;
  status: Record<string, boolean>;
}

export default function VotePage() {
  const [data, setData] = useState<VoteData | null>(null);
  const [activeTier, setActiveTier] = useState<string>(TIERS[0]);
  const [voting, setVoting] = useState(false);

  const fetchData = useCallback(async () => {
    const res = await fetch("/api/vote");
    setData(await res.json());
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const handleVote = async (teamId: string) => {
    if (hasVoted(activeTier) || voting) return;
    setVoting(true);
    try {
      const res = await fetch("/api/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teamId }),
      });
      if (res.ok) {
        markVoted(activeTier, teamId);
        await fetchData();
      }
    } finally {
      setVoting(false);
    }
  };

  if (!data) {
    return <div className="text-center text-zinc-500 py-20">로딩 중...</div>;
  }

  const tierTeams = teams.filter((t) => t.tier === activeTier).sort((a, b) => a.order - b.order);
  const isOpen = data.status[activeTier] ?? false;
  const voted = hasVoted(activeTier);
  const votedTeamId = getVotedTeam(activeTier);

  const totalVotes = tierTeams.reduce((sum, t) => sum + (data.votes[t.id] || 0), 0);

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold">투표</h1>
        <p className="text-zinc-400 text-sm">카테고리별 최고의 팀에 투표하세요</p>
      </div>

      {/* Tier tabs */}
      <div className="flex gap-2 justify-center">
        {TIERS.map((tier) => (
          <button
            key={tier}
            onClick={() => setActiveTier(tier)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTier === tier
                ? "bg-rose-600 text-white"
                : "bg-zinc-900 text-zinc-400 hover:text-white"
            }`}
          >
            {tier}
          </button>
        ))}
      </div>

      {/* Status badge */}
      <div className="text-center">
        {isOpen ? (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-sm">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            투표 진행 중
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-800 text-zinc-500 text-sm">
            <span className="w-2 h-2 rounded-full bg-zinc-500" />
            투표 준비 중
          </span>
        )}
      </div>

      {/* Team cards */}
      <div className="space-y-3">
        {tierTeams.map((team) => {
          const count = data.votes[team.id] || 0;
          const pct = totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0;
          const isVotedTeam = votedTeamId === team.id;

          return (
            <button
              key={team.id}
              onClick={() => handleVote(team.id)}
              disabled={!isOpen || voted || voting}
              className={`w-full text-left p-4 rounded-xl border transition-all ${
                isVotedTeam
                  ? "border-rose-500 bg-rose-500/10"
                  : "border-zinc-800 bg-zinc-900 hover:border-zinc-700"
              } ${!isOpen || voted ? "cursor-default" : "cursor-pointer"}`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      team.club === "Starwars"
                        ? "bg-blue-500/20 text-blue-400"
                        : "bg-purple-500/20 text-purple-400"
                    }`}
                  >
                    {team.club}
                  </span>
                  <span className="font-semibold">{team.name}</span>
                  {isVotedTeam && (
                    <span className="text-xs text-rose-400">✓ 투표완료</span>
                  )}
                </div>
                {(voted || !isOpen) && (
                  <span className="text-sm text-zinc-400">
                    {count}표 ({pct}%)
                  </span>
                )}
              </div>
              {(voted || !isOpen) && totalVotes > 0 && (
                <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isVotedTeam ? "bg-rose-500" : "bg-zinc-600"
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {totalVotes > 0 && (
        <p className="text-center text-xs text-zinc-600">
          총 {totalVotes}표 · 5초마다 자동 갱신
        </p>
      )}
    </div>
  );
}
