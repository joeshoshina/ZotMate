export default function WeeklyMatchLockedCard({ onReveal, className = "" }) {
  return (
    <div
      className={`bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden ${className}`.trim()}
    >
      <div className="p-5 border-b border-slate-800 flex items-center justify-between">
        <div>
          <h2 className="text-white font-semibold">This Week's Match</h2>
          <p className="text-slate-300 text-sm mt-0.5">Your new match is ready!</p>
        </div>
        <span className="bg-blue-600/20 border border-blue-500/40 text-blue-200 text-xs font-semibold px-2.5 py-1 rounded-full">
          New
        </span>
      </div>
      <div className="p-6 flex flex-col items-center gap-5">
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center">
            <span className="text-4xl" aria-hidden="true">
              🎭
            </span>
          </div>
          <div
            className="absolute -bottom-1 -right-1 w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center border-2 border-slate-900"
            aria-hidden="true"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 text-white">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
            </svg>
          </div>
        </div>
        <div className="text-center">
          <p className="text-white font-semibold">Someone new matched with you!</p>
          <p className="text-slate-300 text-sm mt-1">Based on your classes and interests</p>
        </div>
        <button
          type="button"
          onClick={onReveal}
          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3.5 rounded-xl transition-all text-sm shadow-lg shadow-blue-600/25 active:scale-95"
        >
          <span aria-hidden="true">✨ </span>Reveal Your Match
        </button>
      </div>
    </div>
  );
}
