import AppLayout from "../../components/common/AppLayout";
import CountdownTimer from "../../components/match/CountdownTimer";
import MatchCard from "../../components/match/MatchCard";
import WeeklyMatchLockedCard from "../../components/match/WeeklyMatchLockedCard";
import { useAuth } from "../../context/AuthContext";
import { MOCK_MATCHES } from "../../data/mockData";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import { useMatchReveal } from "../../hooks/useMatchReveal";

export default function HomePage() {
  useDocumentTitle("Home");
  const { profile } = useAuth();
  const [revealed, reveal] = useMatchReveal();
  const latestMatch = MOCK_MATCHES[0];

  return (
    <AppLayout>
      <div className="pt-8 pb-6">
        <p className="text-slate-300 text-sm">Welcome back,</p>
        <h1 className="text-2xl md:text-3xl font-bold text-white mt-0.5">
          {profile?.firstName || "Anteater"} <span aria-hidden="true">👋</span>
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <div className="space-y-4">
          {!revealed ? (
            <WeeklyMatchLockedCard onReveal={reveal} />
          ) : (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-white font-semibold">This Week's Match</span>
                <span className="bg-green-600/20 border border-green-500/40 text-green-200 text-xs font-semibold px-2.5 py-1 rounded-full">
                  Revealed
                </span>
              </div>
              <MatchCard match={latestMatch} />
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <h2 className="text-white font-semibold mb-1">Next Match In</h2>
            <p className="text-slate-300 text-xs mb-4">New matches drop every Monday at midnight</p>
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
                <p className="text-slate-300 text-xs mt-0.5">{label}</p>
              </div>
            ))}
          </div>

          <div className="hidden md:block bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <h3 className="text-white font-semibold text-sm mb-3">How Matching Works</h3>
            <div className="space-y-2.5">
              {[
                { pct: "50%", label: "Shared Classes", color: "bg-blue-500" },
                { pct: "30%", label: "Common Interests", color: "bg-blue-400" },
                { pct: "20%", label: "Identity Compatibility", color: "bg-blue-300" },
              ].map(({ pct, label, color }) => (
                <div key={label} className="flex items-center gap-3">
                  <span className="text-xs font-mono font-bold text-slate-200 w-9 shrink-0">{pct}</span>
                  <div className="flex-1 bg-slate-800 rounded-full h-2" aria-hidden="true">
                    <div className={`${color} h-2 rounded-full`} style={{ width: pct }} />
                  </div>
                  <span className="text-slate-300 text-xs">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
