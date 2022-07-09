import { useNavigate, useParams } from "react-router-dom";
import { Queue } from "./queue/Queue";
import { Search } from "./search/Search";
import { GuildUpdatedDocument, GuildUpdatedSubscription, useGuildLazyQuery } from "../../../apollo/generated";
import { useEffect } from "react";
import { NoGuildPage } from "./NoGuildPage";
import { Player } from "./playback/Player";
import { Progress } from "./playback/Progress";

export function GuildPage() {
  const { guildId } = useParams();
  const navigate = useNavigate();
  const [executeQuery, { data, loading, error, called, subscribeToMore }] = useGuildLazyQuery();

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

  useEffect(() => {
    if (guildId == null) return;

    return subscribeToMore<GuildUpdatedSubscription>({
      document: GuildUpdatedDocument,
      variables: { guildId: guildId },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        return { guild: subscriptionData.data.guildUpdated };
      },
    });
  }, [called]);

  return loading || !called || error || data == null || guildId == null ? (
    <NoGuildPage />
  ) : (
    <div className="h-full flex flex-col">
      <div className="flex-1 relative h-full overflow-hidden rounded-tl-md">
        <div className="absolute left-0 top-0 bottom-0 w-1/2 pr-1">
          <Queue currentSong={data.guild.currentlyPlaying} queue={data.guild.queue} guildId={guildId} />
        </div>
        <div className="absolute right-0 top-0 bottom-0 w-1/2 pl-1">
          <Search guildId={guildId} />
        </div>
      </div>

      <Progress percentage={30} />

      <div className="h-20 bg-gray-2">
        <Player song={data.guild.currentlyPlaying} playbackStatus={data.guild.playbackStatus} guildId={guildId ?? ""} />
      </div>
    </div>
  );
}
