import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useOnboardingStore } from "../../store/useOnboardingStore";
import ProgressBar from "../../components/common/ProgressBar";
import OnboardingLayout from "../../components/common/OnboardingLayout";
import GenderSelect from "../../components/onboarding/GenderSelect";

export default function IdentityPage() {
  const navigate = useNavigate();
  const { iAm, lookingFor, setField } = useOnboardingStore();
  const [error, setError] = useState("");

  const handleNext = () => {
    if (!iAm) { setError("Please select who you are"); return; }
    if (!lookingFor) { setError("Please select who you're looking for"); return; }
    navigate("/onboarding/interests");
  };

  return (
    <OnboardingLayout>
      <button onClick={() => navigate("/onboarding/classes")} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-4 text-sm">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
        Back
      </button>
      <ProgressBar current={4} total={5} />
      <div className="mt-6 mb-5">
        <h2 className="text-white font-bold text-xl">Identity</h2>
        <p className="text-slate-400 text-sm mt-1">Help us find the right matches for you</p>
      </div>
      <div className="space-y-6">
        <GenderSelect label="I am a..." value={iAm} onChange={v => { setField("iAm", v); setError(""); }} />
        <GenderSelect label="Looking for..." value={lookingFor} onChange={v => { setField("lookingFor", v); setError(""); }} />
        {error && <p className="text-red-400 text-xs">{error}</p>}
        <button onClick={handleNext}
          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3.5 rounded-xl transition-colors text-sm shadow-lg shadow-blue-600/20">
          Continue →
        </button>
      </div>
    </OnboardingLayout>
  );
}
