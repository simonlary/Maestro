import { Link } from "react-router-dom";

export function AppBar() {
  return (
    <nav className="bg-gray-1 text-white">
      <div className="mx-auto px-8">
        <div className="relative flex items-center gap-4 h-10">
          <h1 className="font-bold text-gray-text pr-2">Maestro</h1>
          <Link to="/guilds">Guilds</Link>
          <Link to="/settings">Settings</Link>
        </div>
      </div>
    </nav>
  );
}
