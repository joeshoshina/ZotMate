import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import OnboardingLayout from "../../components/common/OnboardingLayout";
import { lookupCountry } from "../../data/countryCodes";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";

export default function LoginPage() {
  useDocumentTitle("Sign in");
  const [dialCode, setDialCode] = useState("1");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { signInWithPhone } = useAuth();
  const navigate = useNavigate();

  const iso = lookupCountry(dialCode);
  const isUS = dialCode === "1";

  const formatPhone = (val) => {
    const d = val.replace(/\D/g, "");
    if (!isUS) return d.slice(0, 15);
    if (d.length <= 3) return d;
    if (d.length <= 6) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
    return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6, 10)}`;
  };

  const handleDialCodeChange = (e) => {
    const cleaned = e.target.value.replace(/\D/g, "").slice(0, 3);
    setDialCode(cleaned);
    setError("");
  };

  const handleSubmit = async (e) => {
    if (e?.preventDefault) e.preventDefault();
    if (loading) return;
    if (!iso) {
      setError("Enter a valid country code");
      return;
    }
    const digits = phone.replace(/\D/g, "");
    const validUS = isUS && digits.length === 10;
    const validIntl = !isUS && digits.length >= 7 && digits.length <= 15;
    if (!validUS && !validIntl) {
      setError(isUS ? "Please enter a valid 10-digit phone number" : "Please enter a valid phone number");
      return;
    }
    setLoading(true);
    try {
      const fullNumber = `+${dialCode}${digits}`;
      const result = await signInWithPhone(fullNumber);
      navigate("/verify-sms", {
        state: { verificationId: result.verificationId, phone: fullNumber },
      });
    } catch {
      setError("Failed to send code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <OnboardingLayout>
      <div className="flex flex-col items-center mb-8 md:hidden">
        <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center mb-3 shadow-lg shadow-blue-600/30">
          <span className="text-white text-2xl font-black">Z</span>
        </div>
        <h1 className="text-2xl font-bold text-white">ZotMate</h1>
        <p className="text-slate-300 text-sm mt-0.5">UCI's student matching app</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <h2 className="text-white font-bold text-xl mb-1">
          Welcome <span aria-hidden="true">👋</span>
        </h2>
        <p className="text-slate-300 text-sm mb-5">Enter your phone number to get started</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="phone-number" className="block text-slate-400 text-xs font-medium mb-1.5 uppercase tracking-wide">
              Phone Number
            </label>
            <div className="flex items-center bg-slate-800 border border-slate-700 rounded-xl overflow-hidden focus-within:border-blue-500 transition-colors">
              <div className="flex items-center gap-1.5 px-4 py-3.5 border-r border-slate-700">
                <span
                  className={`text-sm font-semibold tabular-nums ${iso ? "text-white" : "text-slate-400"}`}
                  aria-live="polite"
                  aria-label={iso ? `Country ${iso}` : "Unknown country code"}
                >
                  {iso || "—"}
                </span>
                <span className="text-slate-300 text-sm font-medium ml-1">+</span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={dialCode}
                  onChange={handleDialCodeChange}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSubmit(e);
                  }}
                  aria-label="Country dial code"
                  maxLength={3}
                  style={{ width: `${Math.max(1, dialCode.length || 1) + 0.5}ch` }}
                  className="bg-transparent text-slate-200 text-sm font-medium outline-none placeholder-slate-400"
                  placeholder="1"
                />
              </div>
              <input
                id="phone-number"
                type="tel"
                value={phone}
                onChange={(e) => {
                  setPhone(formatPhone(e.target.value));
                  setError("");
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSubmit(e);
                }}
                enterKeyHint="send"
                autoComplete="tel-national"
                aria-invalid={error ? "true" : undefined}
                aria-describedby={error ? "phone-number-error" : undefined}
                placeholder={isUS ? "(949) 555-0100" : "Phone number"}
                className="flex-1 bg-transparent px-4 py-3.5 text-white placeholder-slate-400 text-sm outline-none"
                maxLength={isUS ? 14 : 16}
              />
            </div>
            {error && (
              <p id="phone-number-error" role="alert" className="text-red-300 text-xs mt-2">
                {error}
              </p>
            )}
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold py-3.5 rounded-xl transition-colors text-sm shadow-lg shadow-blue-600/20"
          >
            {loading ? "Sending..." : "Send Verification Code →"}
          </button>
        </form>
      </div>

      <div className="mt-4 bg-blue-950/40 border border-blue-900/50 rounded-xl p-3 text-center">
        <p className="text-blue-200 text-xs">
          <span aria-hidden="true">🎓 </span>Demo: Enter any number, then use OTP{" "}
          <span className="font-mono font-bold">123456</span>
        </p>
      </div>
    </OnboardingLayout>
  );
}
