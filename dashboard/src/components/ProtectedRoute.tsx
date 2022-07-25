import { Navigate, Outlet } from "react-router-dom";
import { useUserQuery } from "../apollo/generated";
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
    return <Navigate to="/login" />;
  }

  if (requiresAdmin && !data.user.isAdmin) {
    return <NotAuthorized />;
  }

  return <Outlet />;
}
