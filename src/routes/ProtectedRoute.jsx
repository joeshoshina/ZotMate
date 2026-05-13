import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import RouteLoadingScreen from "../components/common/RouteLoadingScreen";

export default function ProtectedRoute() {
  const { user, profile, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <RouteLoadingScreen />;
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (!profile) {
    return <Navigate to="/onboarding/personal-info" replace />;
  }

  return <Outlet />;
}
