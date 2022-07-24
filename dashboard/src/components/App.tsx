import { Navigate, Route, Routes } from "react-router-dom";
import { useUserQuery } from "../apollo/generated";
import { AppBar } from "./AppBar";
import { GuildPage } from "./guilds/Guild/GuildPage";
import { NoGuildPage } from "./guilds/Guild/NoGuildPage";
import { Guilds } from "./guilds/Guilds";
import { Login } from "./login/Login";
import { Logs } from "./logs/Logs";
import { Settings } from "./settings/Settings";

export function App() {
  const { data } = useUserQuery();

  return (
    <div className="flex flex-col h-full">
      {data?.user.isAdmin && <AppBar />}
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
