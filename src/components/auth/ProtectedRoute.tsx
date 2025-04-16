
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/SupabaseAuthContext";
import { ReactNode } from "react";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-budget-teal" />
        <span className="ml-2 text-lg">Loading...</span>
      </div>
    );
  }

  if (!user) {
    // Redirect to login page if not authenticated
    // Save the attempted location for redirecting after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
