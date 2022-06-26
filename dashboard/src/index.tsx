import React from "react";
import ReactDOM from "react-dom/client";
import { ApolloProvider } from "@apollo/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { createApolloClient } from "./apollo/apollo";
import { App } from "./components/App";
import { Guild } from "./components/guilds/Guild/Guild";
import { Guilds } from "./components/guilds/Guilds";
import { Settings } from "./components/settings/Settings";
import "./index.css";

const client = createApolloClient();
const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />}>
            <Route path="/guilds" element={<Guilds />}>
              <Route path=":guildId" element={<Guild />} />
            </Route>
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ApolloProvider>
  </React.StrictMode>
);
