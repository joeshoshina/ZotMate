const OPTIONS = ["Man", "Woman", "Non-binary", "Trans man", "Trans woman", "Prefer not to say"];

export default function GenderSelect({ label, value, onChange }) {
  return (
    <div>
      <p className="text-slate-400 text-sm mb-3">{label}</p>
      <div className="grid grid-cols-2 gap-2">
        {OPTIONS.map(opt => (
          <button key={opt} type="button" onClick={() => onChange(opt)}
            className={`py-2.5 px-4 rounded-xl text-sm font-medium border transition-all
              ${value === opt
                ? "bg-blue-600 border-blue-500 text-white"
                : "bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-500"
              }`}>
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}
