import { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { AppBar } from "./AppBar";
import { GuildPage } from "./guilds/Guild/GuildPage";
import { NoGuildPage } from "./guilds/Guild/NoGuildPage";
import { Guilds } from "./guilds/Guilds";
import { Login } from "./login/Login";
import { Logs } from "./logs/Logs";
import { Settings } from "./settings/Settings";

interface UserData {
  id: string;
  username: string;
  avatar: string;
  discriminator: string;
  public_flags?: number;
  flags?: number;
  banner?: string | null;
  accent_color?: number | null;
  locale?: string;
  mfa_enabled?: boolean;
}

async function getUserData(accessToken: string) {
  const response = await fetch("https://discordapp.com/api/v9/users/@me", {
    method: "get",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error("Error getting user data.");
  }

  const data = (await response.json()) as UserData;

  return data;
}

export function App() {

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken != null) {
      getUserData(accessToken).then(console.log)
    }
  }, []);

  return (
    <div className="flex flex-col h-full">
      <AppBar />
      <div className="flex-1 relative overflow-auto h-full bg-gray-2">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/guilds" element={<Guilds />}>
            <Route index element={<NoGuildPage />} />
            <Route path=":guildId" element={<GuildPage />} />
          </Route>
          <Route path="settings" element={<Settings />} />
          <Route path="logs" element={<Logs />} />
          <Route path="/" element={<Navigate to="/guilds" />} />
        </Routes>
      </div>
    </div>
  );
}
