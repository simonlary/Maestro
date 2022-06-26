import React from "react";
import { Outlet } from "react-router-dom";
import { AppBar } from "./AppBar";

export function App() {
  return (
    <div className="flex flex-col h-full">
      <AppBar />
      <div className="flex-1 relative overflow-auto h-full bg-gray-2">
        <Outlet />
      </div>
    </div>
  );
}
