import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import OnboardingRoute from "./OnboardingRoute";
import LoginPage from "../pages/auth/LoginPage";
import VerifySMSPage from "../pages/auth/VerifySMSPage";
import PersonalInfoPage from "../pages/onboarding/PersonalInfoPage";
import VerifyEmailPage from "../pages/onboarding/VerifyEmailPage";
import ClassSchedulePage from "../pages/onboarding/ClassSchedulePage";
import IdentityPage from "../pages/onboarding/IdentityPage";
import InterestsPage from "../pages/onboarding/InterestsPage";
import HomePage from "../pages/app/HomePage";
import MatchesPage from "../pages/app/MatchesPage";
import ChatPage from "../pages/app/ChatPage";
import SettingsPage from "../pages/app/SettingsPage";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/verify-sms" element={<VerifySMSPage />} />

        <Route element={<OnboardingRoute />}>
          <Route
            path="/onboarding/personal-info"
            element={<PersonalInfoPage />}
          />
          <Route
            path="/onboarding/verify-email"
            element={<VerifyEmailPage />}
          />
          <Route path="/onboarding/classes" element={<ClassSchedulePage />} />
          <Route path="/onboarding/identity" element={<IdentityPage />} />
          <Route path="/onboarding/interests" element={<InterestsPage />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path="/home" element={<HomePage />} />
          <Route path="/matches" element={<MatchesPage />} />
          <Route path="/matches/:id" element={<ChatPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}
