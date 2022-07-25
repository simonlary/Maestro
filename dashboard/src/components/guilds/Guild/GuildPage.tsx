import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { GuildUpdatedDocument, GuildUpdatedSubscription, useGuildLazyQuery } from "../../../apollo/generated";
import { Spinner } from "../../controls/Spinner";
import { ActiveGuildPage } from "./ActiveGuildPage";
import { NoGuildPage } from "./NoGuildPage";

export function GuildPage() {
  const { guildId } = useParams();
  const navigate = useNavigate();
  const [executeQuery, { data, error, loading, called, subscribeToMore }] = useGuildLazyQuery();

  useEffect(() => {
    if (guildId == null || guildId === "") {
      navigate("/guilds");
    } else {
      executeQuery({ variables: { guildId } });
    }
  }, [guildId]);

  useEffect(() => {
    if (error) {
      navigate("/guilds");
    }
  }, [error, navigate]);

  useEffect(() => {
    if (guildId == null) return;

    return subscribeToMore<GuildUpdatedSubscription>({
      document: GuildUpdatedDocument,
      variables: { guildId },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        return { guild: subscriptionData.data.guildUpdated };
      },
    });
  }, [called]);

  return (
    <div className="flex items-center justify-center h-full w-full bg-gray-3">
      {loading || data?.guild == null ? (
        <div className="flex items-center justify-center h-full">
          <Spinner className="w-20" />
        </div>
      ) : data.guild.playbackStatus == null ? (
        <NoGuildPage />
      ) : (
        <ActiveGuildPage guildId={data.guild.id} playbackStatus={data.guild.playbackStatus} />
      )}
    </div>
  );
}
