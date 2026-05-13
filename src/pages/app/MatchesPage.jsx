import AppLayout from "../../components/common/AppLayout";
import MatchCard from "../../components/match/MatchCard";
import WeeklyMatchLockedCard from "../../components/match/WeeklyMatchLockedCard";
import { MOCK_MATCHES, WEEKLY_FEATURED_MATCH_ID } from "../../data/mockData";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import { useMatchReveal } from "../../hooks/useMatchReveal";

export default function MatchesPage() {
  useDocumentTitle("Matches");
  const [revealed, reveal] = useMatchReveal();

  return (
    <AppLayout>
      <div className="pt-8 pb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-white">Your Matches</h1>
        <p className="text-slate-300 text-sm mt-1">
          {MOCK_MATCHES.length} connections this quarter
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {MOCK_MATCHES.map((match) =>
          match.id === WEEKLY_FEATURED_MATCH_ID && !revealed ? (
            <WeeklyMatchLockedCard key={match.id} onReveal={reveal} className="md:col-span-2" />
          ) : (
            <MatchCard key={match.id} match={match} />
          )
        )}
      </div>

      {MOCK_MATCHES.length === 0 && (
        <div className="text-center py-20">
          <div className="text-5xl mb-4" aria-hidden="true">🐜</div>
          <p className="text-white font-semibold">No matches yet</p>
          <p className="text-slate-300 text-sm mt-2">Your first match drops next Monday!</p>
        </div>
      )}
    </AppLayout>
  );
}
