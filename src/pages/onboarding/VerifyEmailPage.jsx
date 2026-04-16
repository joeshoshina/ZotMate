import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useOnboardingStore } from "../../store/useOnboardingStore";
import ProgressBar from "../../components/common/ProgressBar";
import OnboardingLayout from "../../components/common/OnboardingLayout";

export default function VerifyEmailPage() {
  const navigate = useNavigate();
  const { schoolEmail, setField } = useOnboardingStore();
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSend = () => {
    if (!schoolEmail.trim().toLowerCase().endsWith("@uci.edu")) {
      setError("Must be a @uci.edu email address"); return;
    }
    setSent(true); setError("");
  };

  return (
    <OnboardingLayout>
      <button onClick={() => navigate("/onboarding/personal-info")} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-4 text-sm">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
        Back
      </button>
      <ProgressBar current={2} total={5} />
      <div className="mt-6 mb-5">
        <h2 className="text-white font-bold text-xl">Verify UCI Email</h2>
        <p className="text-slate-400 text-sm mt-1">Confirm you're a real Anteater 🐜</p>
      </div>
      <div className="space-y-4">
        <div>
          <label className="block text-slate-400 text-xs font-medium mb-1.5 uppercase tracking-wide">UCI Email</label>
          <input type="email" value={schoolEmail}
            onChange={e => { setField("schoolEmail", e.target.value); setError(""); setSent(false); }}
            placeholder="panteater@uci.edu"
            className={`w-full bg-slate-800 border rounded-xl px-4 py-3 text-white text-sm outline-none transition-colors placeholder-slate-500 ${error ? "border-red-500" : "border-slate-700 focus:border-blue-500"}`} />
          {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
        </div>
        {sent && (
          <div className="bg-green-900/30 border border-green-700/50 rounded-xl p-4">
            <p className="text-green-400 font-medium text-sm">✓ Verification email sent!</p>
            <p className="text-green-300/80 text-xs mt-1">Check your inbox. For demo, click Continue below.</p>
          </div>
        )}
        <button onClick={handleSend}
          className="w-full bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-medium py-3 rounded-xl transition-colors text-sm">
          {sent ? "Resend Email" : "Send Verification Email"}
        </button>
        <button onClick={() => navigate("/onboarding/classes")} disabled={!sent}
          className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white font-semibold py-3.5 rounded-xl transition-colors text-sm shadow-lg shadow-blue-600/20">
          Continue →
        </button>
      </div>
    </OnboardingLayout>
  );
}
