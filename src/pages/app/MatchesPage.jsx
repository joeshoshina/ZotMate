import AppLayout from "../../components/common/AppLayout";
import MatchCard from "../../components/match/MatchCard";
import { MOCK_MATCHES } from "../../data/mockData";

export default function MatchesPage() {
  return (
    <AppLayout>
      <div className="pt-8 pb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-white">Your Matches</h1>
        <p className="text-slate-400 text-sm mt-1">{MOCK_MATCHES.length} connections this quarter</p>
      </div>

      {/* Desktop: 2-col grid for match cards. Mobile: single column */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {MOCK_MATCHES.map((match) => (
          <MatchCard key={match.id} match={match} />
        ))}
      </div>

      {MOCK_MATCHES.length === 0 && (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">🐜</div>
          <p className="text-white font-semibold">No matches yet</p>
          <p className="text-slate-400 text-sm mt-2">Your first match drops next Monday!</p>
        </div>
      )}
    </AppLayout>
  );
}
