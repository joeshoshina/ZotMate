import { useNavigate } from "react-router-dom";

function ScoreBadge({ score }) {
  const color =
    score >= 80
      ? "text-green-300 bg-green-400/10 border-green-500/40"
      : score >= 60
        ? "text-blue-200 bg-blue-400/10 border-blue-500/40"
        : "text-slate-200 bg-slate-400/10 border-slate-500/40";
  return (
    <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${color}`}>
      {score}% match
    </span>
  );
}

export default function MatchCard({ match, compact = false }) {
  const navigate = useNavigate();

  if (compact) {
    return (
      <button
        type="button"
        onClick={() => navigate(`/matches/${match.id}`)}
        aria-label={`Open chat with ${match.name}, ${match.score}% match`}
        className="w-full flex items-center gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-4 hover:border-slate-700 transition-colors text-left"
      >
        <div
          className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center shrink-0"
          role="img"
          aria-label={`${match.name} avatar`}
        >
          <span className="text-white font-bold text-sm" aria-hidden="true">{match.initials}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <p className="text-white font-semibold text-sm truncate">{match.name}</p>
            <ScoreBadge score={match.score} />
          </div>
          <p className="text-slate-300 text-xs mt-0.5">
            {match.year} · {match.major}
          </p>
          <p className="text-slate-400 text-xs mt-1 truncate">{match.bio}</p>
        </div>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="w-4 h-4 text-slate-400 shrink-0"
          aria-hidden="true"
          focusable="false"
        >
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>
    );
  }

  return (
    <article className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden" aria-label={`Match with ${match.name}`}>
      <div className="p-5 pb-4">
        <div className="flex items-start gap-4">
          <div
            className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shrink-0 shadow-lg"
            role="img"
            aria-label={`${match.name} avatar`}
          >
            <span className="text-white font-bold text-xl" aria-hidden="true">{match.initials}</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-white font-bold text-lg leading-tight">{match.name}</h3>
              <ScoreBadge score={match.score} />
            </div>
            <p className="text-slate-300 text-sm mt-0.5">
              {match.year} · {match.major}
            </p>
            <p className="text-slate-200 text-sm mt-2 leading-relaxed">{match.bio}</p>
          </div>
        </div>
      </div>

      {match.classes?.length > 0 && (
        <div className="px-5 pb-4">
          <p className="text-slate-300 text-xs uppercase tracking-wide font-medium mb-2">Shared Classes</p>
          <div className="flex flex-wrap gap-1.5">
            {match.classes.map((c) => (
              <span
                key={c}
                className="text-xs font-mono font-semibold bg-blue-900/30 border border-blue-800/50 text-blue-200 px-2.5 py-1 rounded-lg"
              >
                {c}
              </span>
            ))}
          </div>
        </div>
      )}

      {match.interests?.length > 0 && (
        <div className="px-5 pb-4">
          <p className="text-slate-300 text-xs uppercase tracking-wide font-medium mb-2">Interests</p>
          <div className="flex flex-wrap gap-1.5">
            {match.interests.map((i) => (
              <span
                key={i}
                className="text-xs bg-slate-800 border border-slate-700 text-slate-200 px-2.5 py-1 rounded-full"
              >
                {i}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="px-5 pb-5">
        <button
          type="button"
          onClick={() => navigate(`/matches/${match.id}`)}
          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-xl transition-colors text-sm"
        >
          Send Message →
        </button>
      </div>
    </article>
  );
}
