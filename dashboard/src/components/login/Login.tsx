import { Navigate, useSearchParams } from "react-router-dom";
import { config } from "../../config";
import { Button } from "../controls/Button";

export function Login() {
  const [searchParams] = useSearchParams();

  function login() {
    const redirectUrl = encodeURIComponent(`${window.location.origin}/login_callback`);
    window.location.assign(
      `https://discordapp.com/api/oauth2/authorize?client_id=${config.clientId}&response_type=token&scope=identify%20guilds&redirect_uri=${redirectUrl}`
    );
  }

  return config.accessToken == null ? (
    <div className="flex items-center justify-center h-full">
      <div className="text-center mb-16">
        <Button size="lg" onClick={login}>
          Login with Discord
        </Button>
        <div className={`text-red my-2 ${searchParams.get("error") == null && "invisible"}`}>
          Login failed. Please try again.
        </div>
      </div>
    </div>
  ) : (
    <Navigate to="/guilds" />
  );
}
