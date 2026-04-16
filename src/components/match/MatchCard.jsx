import { useNavigate } from "react-router-dom";

function ScoreBadge({ score }) {
  const color = score >= 80 ? "text-green-400 bg-green-400/10 border-green-500/30"
    : score >= 60 ? "text-blue-400 bg-blue-400/10 border-blue-500/30"
    : "text-slate-400 bg-slate-400/10 border-slate-500/30";
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
      <button onClick={() => navigate(`/matches/${match.id}`)}
        className="w-full flex items-center gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-4 hover:border-slate-700 transition-colors text-left">
        <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
          <span className="text-white font-bold text-sm">{match.initials}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <p className="text-white font-semibold text-sm truncate">{match.name}</p>
            <ScoreBadge score={match.score} />
          </div>
          <p className="text-slate-400 text-xs mt-0.5">{match.year} · {match.major}</p>
          <p className="text-slate-500 text-xs mt-1 truncate">{match.bio}</p>
        </div>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-slate-600 shrink-0">
          <path d="M9 18l6-6-6-6"/>
        </svg>
      </button>
    );
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="p-5 pb-4">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shrink-0 shadow-lg">
            <span className="text-white font-bold text-xl">{match.initials}</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-white font-bold text-lg leading-tight">{match.name}</h3>
              <ScoreBadge score={match.score} />
            </div>
            <p className="text-slate-400 text-sm mt-0.5">{match.year} · {match.major}</p>
            <p className="text-slate-300 text-sm mt-2 leading-relaxed">{match.bio}</p>
          </div>
        </div>
      </div>

      {/* Shared classes */}
      {match.classes?.length > 0 && (
        <div className="px-5 pb-4">
          <p className="text-slate-500 text-xs uppercase tracking-wide font-medium mb-2">Shared Classes</p>
          <div className="flex flex-wrap gap-1.5">
            {match.classes.map(c => (
              <span key={c} className="text-xs font-mono font-semibold bg-blue-900/30 border border-blue-800/40 text-blue-300 px-2.5 py-1 rounded-lg">{c}</span>
            ))}
          </div>
        </div>
      )}

      {/* Interests */}
      {match.interests?.length > 0 && (
        <div className="px-5 pb-4">
          <p className="text-slate-500 text-xs uppercase tracking-wide font-medium mb-2">Interests</p>
          <div className="flex flex-wrap gap-1.5">
            {match.interests.map(i => (
              <span key={i} className="text-xs bg-slate-800 border border-slate-700 text-slate-300 px-2.5 py-1 rounded-full">{i}</span>
            ))}
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="px-5 pb-5">
        <button onClick={() => navigate(`/matches/${match.id}`)}
          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-xl transition-colors text-sm">
          Send Message →
        </button>
      </div>
    </div>
  );
}
