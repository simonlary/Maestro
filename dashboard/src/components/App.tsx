import { Navigate, Route, Routes } from "react-router-dom";
import { AppBar } from "./AppBar";
import { GuildPage } from "./guilds/Guild/GuildPage";
import { NoGuildPage } from "./guilds/Guild/NoGuildPage";
import { Guilds } from "./guilds/Guilds";
import { Login } from "./login/Login";
import { LoginCallback } from "./login/LoginCallback";
import { Logs } from "./logs/Logs";
import { NotFound } from "./NotFound";
import { ProtectedRoute } from "./ProtectedRoute";
import { Settings } from "./settings/Settings";

export function App() {
  return (
    <Routes>
      <Route path="login" element={<Login />} />
      <Route path="login_callback" element={<LoginCallback />} />
      <Route path="/" element={<AppBar />}>
        <Route element={<ProtectedRoute />}>
          <Route path="guilds" element={<Guilds />}>
            <Route index element={<NoGuildPage />} />
            <Route path=":guildId" element={<GuildPage />} />
          </Route>
        </Route>
        <Route element={<ProtectedRoute requiresAdmin={true} />}>
          <Route path="settings" element={<Settings />} />
          <Route path="logs" element={<Logs />} />
        </Route>
        <Route index element={<Navigate to="/guilds" />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
