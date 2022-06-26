import { ReactNode } from "react";

export function SettingsCard({ children }: { children: ReactNode }) {
  return <div className="rounded-lg w-full py-8 px-16 bg-gray-3 shadow-md">{children}</div>;
}
