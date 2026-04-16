import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useOnboardingStore } from "../../store/useOnboardingStore";
import { useAuth } from "../../context/AuthContext";
import ProgressBar from "../../components/common/ProgressBar";
import OnboardingLayout from "../../components/common/OnboardingLayout";
import InterestBubble from "../../components/onboarding/InterestBubble";
import { INTERESTS } from "../../data/mockData";

export default function InterestsPage() {
  const navigate = useNavigate();
  const { interests, toggleInterest } = useOnboardingStore();
  const { completeOnboarding, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFinish = async () => {
    if (interests.length < 3) { setError("Pick at least 3 interests"); return; }
    setLoading(true);
    const s = useOnboardingStore.getState();
    completeOnboarding({ uid: user?.uid, firstName: s.firstName, lastName: s.lastName, schoolEmail: s.schoolEmail, schoolYear: s.schoolYear, major: s.major, dob: s.dob, classes: s.classes, iAm: s.iAm, lookingFor: s.lookingFor, interests: s.interests });
    await new Promise(r => setTimeout(r, 600));
    navigate("/home");
  };

  return (
    <OnboardingLayout>
      <button onClick={() => navigate("/onboarding/identity")} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-4 text-sm">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
        Back
      </button>
      <ProgressBar current={5} total={5} />
      <div className="mt-6 mb-5">
        <h2 className="text-white font-bold text-xl">Your Interests</h2>
        <p className="text-slate-400 text-sm mt-1">Pick at least 3 - the more the better</p>
      </div>
      <div className="flex flex-wrap gap-2 mb-4">
        {INTERESTS.map(i => (
          <InterestBubble key={i} label={i} selected={interests.includes(i)} onToggle={toggleInterest} />
        ))}
      </div>
      {error && <p className="text-red-400 text-xs mb-2">{error}</p>}
      <p className="text-slate-500 text-xs text-center mb-3">
        {interests.length} selected{interests.length >= 3 ? " ✓" : ` - pick ${3 - interests.length} more`}
      </p>
      <button onClick={handleFinish} disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold py-3.5 rounded-xl transition-colors text-sm shadow-lg shadow-blue-600/20">
        {loading ? "Setting up your profile..." : "Finish Setup 🎉"}
      </button>
    </OnboardingLayout>
  );
}
