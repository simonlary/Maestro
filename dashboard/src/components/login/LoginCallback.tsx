import { Navigate, useLocation } from "react-router-dom";
import { config } from "../../config";

export function LoginCallback() {
  const { hash } = useLocation();

  const params = new URLSearchParams(hash.slice(1));
  const accessToken = params.get("access_token");
  if (accessToken != null) {
    config.setAccessToken(accessToken);
  }

  return config.accessToken == null ? <Navigate to="/login?error" /> : <Navigate to="/guilds" />;
}
