import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import OnboardingLayout from "../../components/common/OnboardingLayout";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";

export default function LoginPage() {
  useDocumentTitle("Sign Up");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const { registerUser } = useAuth(); 
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    
    const emailInput = email.trim().toLowerCase();

    // Basic email check instead of strict UCI check
    if (!emailInput.includes("@") || !emailInput.includes(".")) {
      setError("Please enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    setError("");
    
    try {
      await registerUser(emailInput, password);
      navigate("/onboarding/personal-info"); 
    } catch (err) {
      setError(err.message || "Failed to create account. Please try again.");
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
        <p className="text-slate-300 text-sm mt-0.5">Student matching app</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <h2 className="text-white font-bold text-xl mb-1">
          Create Account <span aria-hidden="true">👋</span>
        </h2>
        <p className="text-slate-300 text-sm mb-5">Sign up with your email to get started</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-slate-400 text-xs font-medium mb-1.5 uppercase tracking-wide">
              Email
            </label>
            <div className="flex items-center bg-slate-800 border border-slate-700 rounded-xl overflow-hidden focus-within:border-blue-500 transition-colors">
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError(""); 
                }}
                placeholder="you@example.com"
                className="flex-1 bg-transparent px-4 py-3.5 text-white placeholder-slate-400 text-sm outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-slate-400 text-xs font-medium mb-1.5 uppercase tracking-wide">
              Password
            </label>
            <div className="flex items-center bg-slate-800 border border-slate-700 rounded-xl overflow-hidden focus-within:border-blue-500 transition-colors">
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                placeholder="Min 6 characters"
                className="flex-1 bg-transparent px-4 py-3.5 text-white placeholder-slate-400 text-sm outline-none"
                required
              />
            </div>
            {error && (
              <p role="alert" className="text-red-300 text-xs mt-2">
                {error}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold py-3.5 rounded-xl transition-colors text-sm shadow-lg shadow-blue-600/20"
          >
            {loading ? "Creating Account..." : "Sign Up →"}
          </button>
        </form>
      </div>
    </OnboardingLayout>
  );
}