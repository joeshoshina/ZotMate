import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import RouteLoadingScreen from "../components/common/RouteLoadingScreen";

export default function RootRedirect() {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return <RouteLoadingScreen />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!profile) {
    return <Navigate to="/onboarding/personal-info" replace />;
  }

  return <Navigate to="/home" replace />;
}
