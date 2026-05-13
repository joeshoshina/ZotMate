import { useId } from "react";

export default function ToggleRow({ id, label, description, checked, onChange, disabled }) {
  const labelId = useId();
  const descId = useId();

  return (
    <div className="flex items-start justify-between gap-4 py-4 first:pt-0 last:pb-0 border-b border-slate-800 last:border-0">
      <div className="min-w-0">
        <span id={labelId} className="text-white text-sm font-medium">
          {label}
        </span>
        {description && (
          <p id={descId} className="text-slate-300 text-xs mt-1 leading-relaxed">
            {description}
          </p>
        )}
      </div>
      <button
        type="button"
        id={id}
        role="switch"
        aria-labelledby={labelId}
        aria-describedby={description ? descId : undefined}
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={`relative shrink-0 w-11 h-6 rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 ${
          checked ? "bg-blue-600" : "bg-slate-700"
        } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
            checked ? "translate-x-5" : "translate-x-0"
          }`}
          aria-hidden="true"
        />
      </button>
    </div>
  );
}
