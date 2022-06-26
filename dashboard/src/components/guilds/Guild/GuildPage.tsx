import { useNavigate, useParams } from "react-router-dom";
import { Queue } from "./queue/Queue";
import { Search } from "./search/Search";
import { useGuildLazyQuery } from "../../../apollo/generated";
import { useEffect } from "react";
import { NoGuildPage } from "./NoGuildPage";

export function GuildPage() {
  const { guildId } = useParams();
  const navigate = useNavigate();
  const [executeQuery, { data, loading, error, called }] = useGuildLazyQuery();

  useEffect(() => {
    if (guildId == null || guildId === "") {
      navigate("/guilds");
      return;
    }

    executeQuery({ variables: { guildId } });
  }, [executeQuery, guildId, navigate]);

  useEffect(() => {
    if (error) {
      navigate("/guilds");
    }
  }, [error, navigate]);

  return loading || !called || error ? (
    <NoGuildPage />
  ) : (
    <div className="h-full flex flex-col">
      <div className="flex-1 flex h-full gap-1 overflow-hidden rounded-tl-md">
        <div className="flex-1 ">
          <Queue queue={data!.guild.queue} />
        </div>
        <div className="flex-1">
          <Search />
        </div>
      </div>
      <div className="h-16 bg-gray-2 border-t-2 border-gray-text">Player</div>
    </div>
  );
}
