import { Navigate } from "react-router-dom";
import { config } from "../../config";
import { Button } from "../controls/Button";

export function Login() {
  function login() {
    const redirectUrl = encodeURIComponent(`${window.location.origin}/login_callback`);
    window.location.assign(
      `https://discordapp.com/api/oauth2/authorize?client_id=${config.clientId}&response_type=token&scope=identify%20guilds&redirect_uri=${redirectUrl}`
    );
  }

  return config.accessToken == null ? (
    <div className="flex items-center justify-center h-full">
      <Button text="Login with Discord" onClick={login} />
    </div>
  ) : (
    <Navigate to="/guilds" />
  );
}
