import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col items-center gap-8">
      <div className="relative w-full aspect-square max-w-md rounded-2xl overflow-hidden shadow-2xl shadow-rose-500/10">
        <Image
          src="/ssf-main-poster.png"
          alt="Spectrum × Starwars 연합공연 포스터"
          fill
          className="object-cover"
          priority
        />
      </div>

      <div className="text-center space-y-3">
        <h1 className="text-3xl font-bold tracking-tight">
          Spectrum × Starwars
        </h1>
        <p className="text-lg text-zinc-400">연합 밴드 공연</p>
        <div className="flex flex-col items-center gap-1 text-zinc-300">
          <p className="text-xl font-semibold">2026. 04. 18 (토) 17:00</p>
          <p className="text-zinc-400">남문 로데오 아트홀</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-md">
        <a
          href="/lineup"
          className="block text-center py-3 px-4 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-rose-500/50 hover:bg-zinc-900/80 transition-all"
        >
          <span className="block text-lg font-semibold">라인업</span>
          <span className="text-sm text-zinc-500">6팀 소개</span>
        </a>
        <a
          href="/vote"
          className="block text-center py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 transition-all"
        >
          <span className="block text-lg font-semibold">투표</span>
          <span className="text-sm text-rose-200">실시간 투표</span>
        </a>
        <a
          href="/naming"
          className="block text-center py-3 px-4 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-rose-500/50 hover:bg-zinc-900/80 transition-all"
        >
          <span className="block text-lg font-semibold">이름공모</span>
          <span className="text-sm text-zinc-500">공연 이름 짓기</span>
        </a>
      </div>
    </div>
  );
}
