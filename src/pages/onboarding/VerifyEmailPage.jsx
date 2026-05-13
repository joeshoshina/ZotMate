import { useId, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useOnboardingStore } from "../../store/useOnboardingStore";
import ProgressBar from "../../components/common/ProgressBar";
import OnboardingLayout from "../../components/common/OnboardingLayout";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";

export default function VerifyEmailPage() {
  useDocumentTitle("Verify email");
  const navigate = useNavigate();
  const { schoolEmail, setField } = useOnboardingStore();
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const inputId = useId();
  const errId = useId();

  const handleSend = (e) => {
    if (e?.preventDefault) e.preventDefault();
    if (!schoolEmail.trim().toLowerCase().endsWith("@uci.edu")) {
      setError("Must be a @uci.edu email address");
      return;
    }
    setSent(true);
    setError("");
  };

  const handleContinue = () => {
    if (!sent) {
      setError("Send the verification email first");
      return;
    }
    navigate("/onboarding/classes");
  };

  return (
    <OnboardingLayout>
      <button
        type="button"
        onClick={() => navigate("/onboarding/personal-info")}
        aria-label="Go back to personal info"
        className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors mb-4 text-sm"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="w-4 h-4"
          aria-hidden="true"
          focusable="false"
        >
          <path d="M19 12H5M12 5l-7 7 7 7" />
        </svg>
        Back
      </button>
      <ProgressBar current={2} total={5} />
      <div className="mt-6 mb-5">
        <h1 className="text-white font-bold text-xl">Verify UCI Email</h1>
        <p className="text-slate-300 text-sm mt-1">
          Confirm you're a real Anteater <span aria-hidden="true">🐜</span>
        </p>
      </div>
      <form onSubmit={handleSend} className="space-y-4" noValidate>
        <div>
          <label htmlFor={inputId} className="block text-slate-300 text-xs font-medium mb-1.5 uppercase tracking-wide">
            UCI Email
          </label>
          <input
            id={inputId}
            type="email"
            autoComplete="email"
            inputMode="email"
            value={schoolEmail}
            onChange={(e) => {
              setField("schoolEmail", e.target.value);
              setError("");
              setSent(false);
            }}
            placeholder="panteater@uci.edu"
            aria-invalid={error ? "true" : undefined}
            aria-describedby={error ? errId : undefined}
            className={`w-full bg-slate-800 border rounded-xl px-4 py-3 text-white text-sm outline-none transition-colors placeholder-slate-400 ${
              error ? "border-red-500" : "border-slate-700 focus:border-blue-500"
            }`}
          />
          {error && (
            <p id={errId} role="alert" className="text-red-300 text-xs mt-1">
              {error}
            </p>
          )}
        </div>
        {sent && (
          <div role="status" className="bg-green-900/30 border border-green-700/50 rounded-xl p-4">
            <p className="text-green-300 font-medium text-sm">
              <span aria-hidden="true">✓ </span>Verification email sent!
            </p>
            <p className="text-green-200/90 text-xs mt-1">Check your inbox. For demo, click Continue below.</p>
          </div>
        )}
        <button
          type="submit"
          className="w-full bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-medium py-3 rounded-xl transition-colors text-sm"
        >
          {sent ? "Resend Email" : "Send Verification Email"}
        </button>
        <button
          type="button"
          onClick={handleContinue}
          className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white font-semibold py-3.5 rounded-xl transition-colors text-sm shadow-lg shadow-blue-600/20"
        >
          Continue →
        </button>
      </form>
    </OnboardingLayout>
  );
}
