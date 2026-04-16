import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import OnboardingLayout from "../../components/common/OnboardingLayout";

export default function LoginPage() {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { signInWithPhone } = useAuth();
  const navigate = useNavigate();

  const formatPhone = (val) => {
    const d = val.replace(/\D/g, "");
    if (d.length <= 3) return d;
    if (d.length <= 6) return `(${d.slice(0,3)}) ${d.slice(3)}`;
    return `(${d.slice(0,3)}) ${d.slice(3,6)}-${d.slice(6,10)}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const digits = phone.replace(/\D/g, "");
    if (digits.length !== 10) { setError("Please enter a valid 10-digit phone number"); return; }
    setLoading(true);
    try {
      const result = await signInWithPhone(`+1${digits}`);
      navigate("/verify-sms", { state: { verificationId: result.verificationId, phone: `+1${digits}` } });
    } catch { setError("Failed to send code. Please try again."); }
    finally { setLoading(false); }
  };

  return (
    <OnboardingLayout>
      {/* Mobile logo (hidden on desktop since sidebar has it) */}
      <div className="flex flex-col items-center mb-8 md:hidden">
        <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center mb-3 shadow-lg shadow-blue-600/30">
          <span className="text-white text-2xl font-black">Z</span>
        </div>
        <h1 className="text-2xl font-bold text-white">ZotMate</h1>
        <p className="text-slate-400 text-sm mt-0.5">UCI's student matching app</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <h2 className="text-white font-bold text-xl mb-1">Welcome 👋</h2>
        <p className="text-slate-400 text-sm mb-5">Enter your phone number to get started</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-slate-400 text-xs font-medium mb-1.5 uppercase tracking-wide">Phone Number</label>
            <div className="flex items-center bg-slate-800 border border-slate-700 rounded-xl overflow-hidden focus-within:border-blue-500 transition-colors">
              <div className="flex items-center gap-2 px-4 py-3.5 border-r border-slate-700">
                <span className="text-base">🇺🇸</span>
                <span className="text-slate-300 text-sm font-medium">+1</span>
              </div>
              <input type="tel" value={phone} onChange={e => { setPhone(formatPhone(e.target.value)); setError(""); }}
                placeholder="(949) 555-0100"
                className="flex-1 bg-transparent px-4 py-3.5 text-white placeholder-slate-500 text-sm outline-none"
                maxLength={14} autoFocus />
            </div>
            {error && <p className="text-red-400 text-xs mt-2">{error}</p>}
          </div>
          <button type="submit" disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold py-3.5 rounded-xl transition-colors text-sm shadow-lg shadow-blue-600/20">
            {loading ? "Sending..." : "Send Verification Code →"}
          </button>
        </form>
      </div>

      <div className="mt-4 bg-blue-950/40 border border-blue-900/50 rounded-xl p-3 text-center">
        <p className="text-blue-300 text-xs">🎓 Demo: Enter any number, then use OTP <span className="font-mono font-bold">123456</span></p>
      </div>
    </OnboardingLayout>
  );
}
