import { useState } from "react";
import AppLayout from "../../components/common/AppLayout";
import CountdownTimer from "../../components/match/CountdownTimer";
import MatchCard from "../../components/match/MatchCard";
import { useAuth } from "../../context/AuthContext";
import { MOCK_MATCHES } from "../../data/mockData";

export default function HomePage() {
  const { profile } = useAuth();
  const [revealed, setRevealed] = useState(false);
  const latestMatch = MOCK_MATCHES[0];

  return (
    <AppLayout>
      {/* Header */}
      <div className="pt-8 pb-6">
        <p className="text-slate-400 text-sm">Welcome back,</p>
        <h1 className="text-2xl md:text-3xl font-bold text-white mt-0.5">
          {profile?.firstName || "Anteater"} 👋
        </h1>
      </div>

      {/* Desktop: two-column grid. Mobile: single column */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {/* LEFT column: match reveal */}
        <div className="space-y-4">
          {!revealed ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
              <div className="p-5 border-b border-slate-800 flex items-center justify-between">
                <div>
                  <h2 className="text-white font-semibold">This Week's Match</h2>
                  <p className="text-slate-400 text-sm mt-0.5">Your new match is ready!</p>
                </div>
                <span className="bg-blue-600/20 border border-blue-500/30 text-blue-300 text-xs font-semibold px-2.5 py-1 rounded-full">New</span>
              </div>
              <div className="p-6 flex flex-col items-center gap-5">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center">
                    <span className="text-4xl">🎭</span>
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center border-2 border-slate-900">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 text-white"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/></svg>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-white font-semibold">Someone new matched with you!</p>
                  <p className="text-slate-400 text-sm mt-1">Based on your classes and interests</p>
                </div>
                <button onClick={() => setRevealed(true)}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3.5 rounded-xl transition-all text-sm shadow-lg shadow-blue-600/25 active:scale-95">
                  ✨ Reveal Your Match
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-white font-semibold">This Week's Match</span>
                <span className="bg-green-600/20 border border-green-500/30 text-green-300 text-xs font-semibold px-2.5 py-1 rounded-full">Revealed</span>
              </div>
              <MatchCard match={latestMatch} />
            </div>
          )}
        </div>

        {/* RIGHT column: countdown + stats */}
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <h2 className="text-white font-semibold mb-1">Next Match In</h2>
            <p className="text-slate-400 text-xs mb-4">New matches drop every Monday at midnight</p>
            <CountdownTimer />
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Matches", value: MOCK_MATCHES.length },
              { label: "Classes", value: profile?.classes?.length || 3 },
              { label: "Interests", value: profile?.interests?.length || 5 },
            ].map(({ label, value }) => (
              <div key={label} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-center">
                <p className="text-white font-bold text-2xl">{value}</p>
                <p className="text-slate-500 text-xs mt-0.5">{label}</p>
              </div>
            ))}
          </div>

          {/* How matching works - desktop bonus card */}
          <div className="hidden md:block bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <h3 className="text-white font-semibold text-sm mb-3">How Matching Works</h3>
            <div className="space-y-2.5">
              {[
                { pct: "50%", label: "Shared Classes", color: "bg-blue-500" },
                { pct: "30%", label: "Common Interests", color: "bg-blue-400" },
                { pct: "20%", label: "Identity Compatibility", color: "bg-blue-300" },
              ].map(({ pct, label, color }) => (
                <div key={label} className="flex items-center gap-3">
                  <span className="text-xs font-mono font-bold text-slate-400 w-8 shrink-0">{pct}</span>
                  <div className="flex-1 bg-slate-800 rounded-full h-2">
                    <div className={`${color} h-2 rounded-full`} style={{ width: pct }} />
                  </div>
                  <span className="text-slate-400 text-xs">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
