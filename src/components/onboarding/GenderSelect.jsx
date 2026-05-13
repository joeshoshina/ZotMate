import { useId } from "react";

const OPTIONS = ["Man", "Woman", "Non-binary", "Trans man", "Trans woman", "Prefer not to say"];

export default function GenderSelect({ label, value, onChange }) {
  const labelId = useId();
  return (
    <div>
      <p id={labelId} className="text-slate-300 text-sm mb-3">
        {label}
      </p>
      <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-labelledby={labelId}>
        {OPTIONS.map((opt) => {
          const selected = value === opt;
          return (
            <button
              key={opt}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onChange(opt)}
              className={`py-2.5 px-4 rounded-xl text-sm font-medium border transition-all
                ${
                  selected
                    ? "bg-blue-600 border-blue-500 text-white"
                    : "bg-slate-800 border-slate-700 text-slate-200 hover:border-slate-500"
                }`}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}
