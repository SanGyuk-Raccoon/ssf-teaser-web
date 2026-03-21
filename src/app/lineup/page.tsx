import Image from "next/image";
import { teams, TIERS } from "@/lib/data";

export default function LineupPage() {
  return (
    <div className="space-y-10">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold">라인업</h1>
        <p className="text-zinc-400 text-sm">공연 순서대로 소개합니다</p>
      </div>

      {TIERS.map((tier) => {
        const tierTeams = teams
          .filter((t) => t.tier === tier)
          .sort((a, b) => a.order - b.order);

        return (
          <section key={tier} className="space-y-4">
            <h2 className="text-xl font-bold text-rose-400 border-b border-zinc-800 pb-2">
              {tier}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {tierTeams.map((team) => (
                <div
                  key={team.id}
                  className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden"
                >
                  <div className="relative aspect-square">
                    <Image
                      src={team.imageUrl}
                      alt={team.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4 space-y-1">
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
                      <span className="text-xs text-zinc-500">{team.tier}</span>
                    </div>
                    <h3 className="font-semibold">{team.name}</h3>
                    <p className="text-sm text-zinc-400">{team.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
