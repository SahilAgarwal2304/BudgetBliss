
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/SupabaseAuthContext";

const AuthProtectedRoute = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default AuthProtectedRoute;
