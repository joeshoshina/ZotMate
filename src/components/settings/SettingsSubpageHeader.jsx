import { useNavigate } from "react-router-dom";

export default function SettingsSubpageHeader({ title, subtitle }) {
  const navigate = useNavigate();

  return (
    <div className="pt-8 pb-6">
      <button
        type="button"
        onClick={() => navigate("/settings")}
        aria-label="Back to profile"
        className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors text-sm mb-4"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="w-4 h-4 shrink-0"
          aria-hidden="true"
          focusable="false"
        >
          <path d="M19 12H5M12 5l-7 7 7 7" />
        </svg>
        Back to Profile
      </button>
      <h1 className="text-2xl md:text-3xl font-bold text-white">{title}</h1>
      {subtitle && <p className="text-slate-300 text-sm mt-1">{subtitle}</p>}
    </div>
  );
}
