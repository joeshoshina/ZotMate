import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ProgressBar from "../../components/common/ProgressBar";
import OnboardingLayout from "../../components/common/OnboardingLayout";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import { useAuth } from "../../context/AuthContext";

import { auth, isFirebaseReady } from "../../firebase/config"; 
import { sendEmailVerification } from "firebase/auth";

export default function VerifyEmailPage() {
  useDocumentTitle("Verify email");
  const navigate = useNavigate();
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const { user } = useAuth();
  
  // Grab the currently logged-in user
  const currentUser = isFirebaseReady() && auth ? auth.currentUser : user;

  const handleSend = async () => {
    try {
      if (!currentUser) throw new Error("Authentication error: No user found.");

      if (!isFirebaseReady() || !auth) {
        setSent(true);
        setError("");
        return;
      }

      await sendEmailVerification(currentUser);
      
      setSent(true);
      setError("");
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to send email. Please try again.");
    }
  };

  const handleContinue = async () => {
    if (!currentUser) {
      setError("No user is currently logged in.");
      return;
    }

    setIsChecking(true);
    setError("");

    try {
      if (!isFirebaseReady() || !auth) {
        navigate("/onboarding/classes");
        return;
      }

      // 1. Force Firebase to fetch the newest data from the server
      await currentUser.reload();
      
      // 2. Check the real, updated verification status
      if (currentUser.emailVerified) {
        navigate("/onboarding/classes");
      } else {
        setError("Email not verified yet! Please click the link in your inbox, then click Continue.");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to check verification status. Please try again.");
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <OnboardingLayout>
      <button
        type="button"
        onClick={() => navigate("/onboarding/personal-info")}
        aria-label="Go back to personal info"
        className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors mb-4 text-sm"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
          <path d="M19 12H5M12 5l-7 7 7 7" />
        </svg>
        Back
      </button>
      <ProgressBar current={2} total={5} />
      
      <div className="mt-6 mb-5">
        <h1 className="text-white font-bold text-xl">Verify Email</h1>
        <p className="text-slate-300 text-sm mt-1">
          Confirm your identity to continue <span aria-hidden="true">🔒</span>
        </p>
      </div>

      <div className="space-y-4">
        <div className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-4">
          <p className="text-slate-400 text-xs font-medium mb-1 uppercase tracking-wide">Account Email</p>
          <p className="text-white font-medium">{currentUser?.email || "Loading..."}</p>
        </div>

        {error && <p role="alert" className="text-red-400 font-medium text-sm mt-1 bg-red-900/20 p-3 rounded-lg border border-red-900/50">{error}</p>}

        {sent && !error && (
          <div role="status" className="bg-green-900/30 border border-green-700/50 rounded-xl p-4">
            <p className="text-green-300 font-medium text-sm">
              <span aria-hidden="true">✓ </span>Verification email sent!
            </p>
            <p className="text-green-200/90 text-xs mt-1">Check your inbox to verify your account.</p>
          </div>
        )}

        <button
          type="button"
          onClick={handleSend}
          className="w-full bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-medium py-3 rounded-xl transition-colors text-sm"
        >
          {sent ? "Resend Verification Email" : "Send Verification Email"}
        </button>

        <button
          type="button"
          onClick={handleContinue}
          disabled={isChecking}
          className="w-full text-white font-semibold py-3.5 rounded-xl transition-all duration-200 text-sm shadow-lg disabled:opacity-40 hover:brightness-110 flex justify-center items-center gap-2"
          style={{ backgroundColor: "#F2930D", shadowColor: "rgba(242, 147, 13, 0.2)" }}
        >
          {isChecking ? "Checking Status..." : "I've Verified My Email →"}
        </button>
      </div>
    </OnboardingLayout>
  );
}
