import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles: string[];
  requireAuth?: boolean;
}

export function RoleGuard({
  children,
  allowedRoles,
  requireAuth = true,
}: RoleGuardProps) {
  const { state } = useAuth();
  const location = useLocation();

  // If authentication is required but user is not authenticated
  if (requireAuth && !state.isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If user is authenticated but doesn't have required role
  if (
    state.isAuthenticated &&
    state.user &&
    !allowedRoles.includes(state.user.role)
  ) {
    // Redirect to appropriate dashboard based on user role
    const redirectPath =
      state.user.role === "doctor" ? "/doctor/dashboard" : "/patient/dashboard";
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
}
