import AppLayout from "../../components/common/AppLayout";
import MatchCard from "../../components/match/MatchCard";
import WeeklyMatchLockedCard from "../../components/match/WeeklyMatchLockedCard";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import { useMatchReveal } from "../../hooks/useMatchReveal";
import { useAuth } from "../../context/AuthContext";
import { useUserMatches } from "../../hooks/useUserMatches";
import RouteLoadingScreen from "../../components/common/RouteLoadingScreen";

export default function MatchesPage() {
  useDocumentTitle("Matches");
  const { user, profile } = useAuth();
  const [revealed, reveal] = useMatchReveal();
  const { matches, loading, error } = useUserMatches(user?.uid, profile);

  if (loading) {
    return (
      <AppLayout>
        <RouteLoadingScreen />
      </AppLayout>
    );
  }

  const featuredMatch = matches[0];

  return (
    <AppLayout>
      <div className="pt-8 pb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-white">Your Matches</h1>
        <p className="text-slate-300 text-sm mt-1">
          {matches.length} connection{matches.length !== 1 ? "s" : ""} this quarter
        </p>
        {error && (
          <p role="alert" className="text-red-300 text-sm mt-2">
            Could not load matches: {error}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {matches.map((match) =>
          match.id === featuredMatch?.id && !revealed ? (
            <WeeklyMatchLockedCard key={match.id} onReveal={reveal} className="md:col-span-2" />
          ) : (
            <MatchCard key={match.id} match={match} />
          )
        )}
      </div>

      {matches.length === 0 && (
        <div className="text-center py-20">
          <div className="text-5xl mb-4" aria-hidden="true">🐜</div>
          <p className="text-white font-semibold">No matches yet</p>
          <p className="text-slate-300 text-sm mt-2">Your first match drops next Monday!</p>
          {user && (
            <p className="text-slate-500 text-xs mt-4 font-mono break-all px-4">
              Signed in as {user.email}
              <br />
              UID: {user.uid}
              <br />
              This UID must match userAId or userBId in matches/demo-match
            </p>
          )}
        </div>
      )}
    </AppLayout>
  );
}
