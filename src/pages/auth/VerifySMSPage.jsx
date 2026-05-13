import { useState, useRef, useEffect, useId } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import OnboardingLayout from "../../components/common/OnboardingLayout";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";

export default function VerifySMSPage() {
  useDocumentTitle("Verify");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resent, setResent] = useState(false);
  const inputs = useRef([]);
  const legendId = useId();
  const errorId = useId();
  const { verifyOTP } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { verificationId, phone } = location.state || {};

  useEffect(() => {
    if (!verificationId) navigate("/login");
  }, [verificationId, navigate]);

  useEffect(() => {
    inputs.current[0]?.focus();
  }, []);

  const submitOtp = async (code) => {
    setLoading(true);
    try {
      await verifyOTP(verificationId, code);
      navigate("/onboarding/personal-info");
    } catch {
      setError("Incorrect code. Try again.");
      setOtp(["", "", "", "", "", ""]);
      inputs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (i, val) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp];
    next[i] = val;
    setOtp(next);
    setError("");
    if (val && i < 5) inputs.current[i + 1]?.focus();
    if (next.every((d) => d)) submitOtp(next.join(""));
  };

  const handleKeyDown = (i, e) => {
    if (e.key === "Backspace" && !otp[i] && i > 0) inputs.current[i - 1]?.focus();
    if (e.key === "ArrowLeft" && i > 0) inputs.current[i - 1]?.focus();
    if (e.key === "ArrowRight" && i < 5) inputs.current[i + 1]?.focus();
    if (e.key === "Enter") {
      e.preventDefault();
      const code = otp.join("");
      if (code.length === 6 && !loading) submitOtp(code);
    }
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted.split(""));
      submitOtp(pasted);
    }
  };

  return (
    <OnboardingLayout>
      <button
        type="button"
        onClick={() => navigate("/login")}
        aria-label="Go back to sign in"
        className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors mb-6 text-sm"
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

      <div className="text-center mb-6">
        <div
          className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-600/30"
          aria-hidden="true"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="w-7 h-7">
            <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 012 1.18 2 2 0 014 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14z" />
          </svg>
        </div>
        <h1 id={legendId} className="text-white font-bold text-xl">
          Verify your number
        </h1>
        <p className="text-slate-300 text-sm mt-1">
          Code sent to <span className="text-white font-medium">{phone}</span>
        </p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          const code = otp.join("");
          if (code.length === 6 && !loading) submitOtp(code);
        }}
        className="bg-slate-900 border border-slate-800 rounded-2xl p-6"
        aria-labelledby={legendId}
        aria-describedby={error ? errorId : undefined}
      >
        <p className="sr-only">Enter the 6-digit code we texted you.</p>
        <div className="flex gap-2 justify-center mb-4" onPaste={handlePaste}>
          {otp.map((d, i) => (
            <input
              key={i}
              ref={(el) => (inputs.current[i] = el)}
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={1}
              value={d}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              aria-label={`Digit ${i + 1} of 6`}
              aria-invalid={error ? "true" : undefined}
              enterKeyHint="done"
              className={`w-12 h-14 text-center text-xl font-bold rounded-xl border bg-slate-800 text-white outline-none transition-all
                ${d ? "border-blue-500" : error ? "border-red-500" : "border-slate-700 focus:border-blue-500"}`}
            />
          ))}
        </div>
        {error && (
          <p id={errorId} role="alert" className="text-red-300 text-xs text-center mb-3">
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={loading || otp.some((d) => !d)}
          className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold py-3.5 rounded-xl transition-colors text-sm"
        >
          {loading ? "Verifying..." : "Verify →"}
        </button>
        <button
          type="button"
          onClick={() => setResent(true)}
          className="w-full text-slate-300 hover:text-white text-sm py-2 mt-2 transition-colors"
        >
          {resent ? "✓ Code resent!" : "Didn't get a code? Resend"}
        </button>
      </form>
      <div className="mt-4 bg-blue-950/40 border border-blue-900/50 rounded-xl p-3 text-center">
        <p className="text-blue-200 text-xs">
          Demo OTP: <span className="font-mono font-bold">123456</span>
        </p>
      </div>
    </OnboardingLayout>
  );
}
