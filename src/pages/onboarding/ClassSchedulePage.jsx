import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useOnboardingStore } from "../../store/useOnboardingStore";
import ProgressBar from "../../components/common/ProgressBar";
import OnboardingLayout from "../../components/common/OnboardingLayout";
import ClassSearch from "../../components/onboarding/ClassSearch";

export default function ClassSchedulePage() {
  const navigate = useNavigate();
  const { classes, addClass, removeClass } = useOnboardingStore();
  const [error, setError] = useState("");

  const handleAdd = (c) => {
    if (classes.length >= 8) { setError("Max 8 classes"); return; }
    addClass(c); setError("");
  };

  return (
    <OnboardingLayout>
      <button onClick={() => navigate("/onboarding/verify-email")} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-4 text-sm">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
        Back
      </button>
      <ProgressBar current={3} total={5} />
      <div className="mt-6 mb-5">
        <h2 className="text-white font-bold text-xl">Your Classes</h2>
        <p className="text-slate-400 text-sm mt-1">Add your current courses to find classmates</p>
      </div>
      <div className="space-y-4">
        <ClassSearch selected={classes} onAdd={handleAdd} onRemove={removeClass} />
        {error && <p className="text-red-400 text-xs">{error}</p>}
        {classes.length === 0 ? (
          <div className="border border-dashed border-slate-700 rounded-xl p-8 text-center">
            <div className="text-3xl mb-2">📚</div>
            <p className="text-slate-500 text-sm">Search above to add your courses</p>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-slate-500 text-xs uppercase tracking-wide font-medium">{classes.length} class{classes.length !== 1 ? "es" : ""} added</p>
            {classes.map(c => (
              <div key={c.id} className="flex items-center justify-between bg-slate-800/60 border border-slate-700/50 rounded-xl px-4 py-3">
                <div>
                  <span className="text-blue-400 text-xs font-mono font-bold">{c.code}</span>
                  <p className="text-white text-sm mt-0.5">{c.title}</p>
                </div>
                <button onClick={() => removeClass(c)} className="text-slate-500 hover:text-red-400 transition-colors ml-3">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path d="M18 6L6 18M6 6l12 12"/></svg>
                </button>
              </div>
            ))}
          </div>
        )}
        <button onClick={() => { if (classes.length === 0) { setError("Add at least one class"); return; } navigate("/onboarding/identity"); }}
          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3.5 rounded-xl transition-colors text-sm shadow-lg shadow-blue-600/20">
          Continue →
        </button>
      </div>
    </OnboardingLayout>
  );
}
