import Image from "next/image";
import { teams, TIERS } from "@/lib/data";

export default function Home() {
  return (
    <div className="flex flex-col items-center gap-12">
      {/* Hero: Poster + Info */}
      <section className="flex flex-col items-center gap-8 w-full">
        <div className="relative w-full aspect-square max-w-md rounded-2xl overflow-hidden shadow-2xl shadow-rose-500/10">
          <Image
            src="/ssf-main-poster.png"
            alt="SSF - Spectrum/Starwars Festival 포스터"
            fill
            className="object-cover"
            priority
          />
        </div>

        <div className="text-center space-y-3">
          <h1 className="text-3xl font-bold tracking-tight">SSF</h1>
          <p className="text-lg text-zinc-400">Spectrum/Starwars Festival</p>
          <div className="flex flex-col items-center gap-1 text-zinc-300">
            <p className="text-xl font-semibold">2026. 04. 18 (토) 17:00</p>
            <p className="text-zinc-400">남문 로데오 아트홀</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 w-full max-w-md">
          <a
            href="/vote"
            className="block text-center py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 active:bg-rose-700 transition-all"
          >
            <span className="block text-lg font-semibold">투표</span>
            <span className="text-sm text-rose-200">실시간 투표</span>
          </a>
          <a
            href="/naming"
            className="block text-center py-3 px-4 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-rose-500/50 hover:bg-zinc-900/80 active:bg-zinc-800 transition-all"
          >
            <span className="block text-lg font-semibold">이름공모</span>
            <span className="text-sm text-zinc-500">공연 이름 짓기</span>
          </a>
        </div>
      </section>

      {/* Lineup */}
      <section className="w-full space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold">라인업</h2>
          <p className="text-zinc-400 text-sm">공연 순서대로 소개합니다</p>
        </div>

        {TIERS.map((tier) => {
          const tierTeams = teams
            .filter((t) => t.tier === tier)
            .sort((a, b) => a.order - b.order);

          return (
            <div key={tier} className="space-y-4">
              <h3 className="text-xl font-bold text-rose-400 border-b border-zinc-800 pb-2">
                {tier}
              </h3>
              <div className="grid grid-cols-2 gap-3">
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
                    <div className="p-3 space-y-1">
                      <span
                        className={`inline-block text-xs px-2 py-0.5 rounded-full ${
                          team.club === "Starwars"
                            ? "bg-blue-500/20 text-blue-400"
                            : "bg-purple-500/20 text-purple-400"
                        }`}
                      >
                        {team.club}
                      </span>
                      <h4 className="font-semibold text-sm">{team.name}</h4>
                      <p className="text-xs text-zinc-400 line-clamp-2">{team.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
}
