import { Navigate, Outlet } from "react-router-dom";
import { useUserQuery } from "../apollo/generated";
import { config } from "../config";
import { Spinner } from "./controls/Spinner";
import { NotAuthorized } from "./NotAuthorized";

interface ProtectedRouteProps {
  requiresAdmin?: boolean;
}

export function ProtectedRoute({ requiresAdmin = false }: ProtectedRouteProps) {
  const { data, loading } = useUserQuery();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Spinner className="w-20" />
      </div>
    );
  }

  if (data == null) {
    // Token is most likely expired and we need to log in again.
    config.clearAccessToken();
    return <Navigate to="/login" />;
  }

  if (requiresAdmin && !data.user.isAdmin) {
    return <NotAuthorized />;
  }

  return <Outlet />;
}
