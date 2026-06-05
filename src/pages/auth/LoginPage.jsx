import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import OnboardingLayout from "../../components/common/OnboardingLayout";
import RouteLoadingScreen from "../../components/common/RouteLoadingScreen";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";

function authErrorMessage(err) {
  const code = err?.code || "";
  if (code === "auth/invalid-credential" || code === "auth/wrong-password") {
    return "Incorrect email or password.";
  }
  if (code === "auth/too-many-requests") {
    return "Too many attempts. Please try again later.";
  }
  return err.message || "Something went wrong. Please try again.";
}

export default function LoginPage() {
  useDocumentTitle("Welcome");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const { user, profile, loading, registerUser, signInUser } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return <RouteLoadingScreen />;
  }

  if (user && profile) {
    return <Navigate to="/home" replace />;
  }

  if (user && !profile) {
    return <Navigate to="/onboarding/personal-info" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    const emailInput = email.trim().toLowerCase();

    if (!emailInput.includes("@") || !emailInput.includes(".")) {
      setError("Please enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const { profile: existingProfile } = await signInUser(emailInput, password);
      navigate(existingProfile ? "/home" : "/onboarding/personal-info");
    } catch (err) {
      if (err.code === "auth/user-not-found") {
        try {
          await registerUser(emailInput, password);
          navigate("/onboarding/personal-info");
        } catch (regErr) {
          setError(authErrorMessage(regErr));
        }
      } else {
        setError(authErrorMessage(err));
      }
    } finally {
      setSubmitting(false);
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
          Welcome <span aria-hidden="true">👋</span>
        </h2>
        <p className="text-slate-300 text-sm mb-5">
          Enter your email to continue. New accounts start onboarding automatically.
        </p>

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
                placeholder="you@uci.edu"
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
            disabled={submitting}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold py-3.5 rounded-xl transition-colors text-sm shadow-lg shadow-blue-600/20"
          >
            {submitting ? "Continuing..." : "Continue →"}
          </button>
        </form>
      </div>
    </OnboardingLayout>
  );
}
