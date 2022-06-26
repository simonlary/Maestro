import { useParams } from "react-router-dom";

export function Guild() {
  const { guildId } = useParams();

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1">Guild: {guildId}</div>
      <div className="h-16 bg-gray-1">Player</div>
    </div>
  );
}
