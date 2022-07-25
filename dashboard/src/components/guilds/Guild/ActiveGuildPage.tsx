import { Queue } from "./queue/Queue";
import { Search } from "./search/Search";
import { useEffect, useState } from "react";
import { Player } from "./playback/Player";
import { PlaybackStatus } from "../../../apollo/generated";

interface ActiveGuildPageProps {
  guildId: string;
  playbackStatus: PlaybackStatus;
}

export function ActiveGuildPage({ guildId, playbackStatus }: ActiveGuildPageProps) {
  const [currentSongTime, setCurrentSongTime] = useState(0);

  useEffect(() => {
    setCurrentSongTime(playbackStatus.currentTime);
    if (playbackStatus.isPlaying) {
      const startSongTime = playbackStatus.currentTime;
      const startTimestamp = Date.now();
      const interval = setInterval(() => setCurrentSongTime(startSongTime + (Date.now() - startTimestamp) / 1000), 500);
      return () => {
        clearInterval(interval);
      };
    }
  }, [playbackStatus]);

  return (
    <div className="w-full h-full flex flex-col bg-gray-2">
      <div className="flex-1 relative h-full overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-1/2 pr-0.5">
          <Queue currentSong={playbackStatus.currentlyPlaying} queue={playbackStatus.queue} guildId={guildId} />
        </div>
        <div className="absolute right-0 top-0 bottom-0 w-1/2 pl-0.5">
          <Search guildId={guildId} />
        </div>
      </div>

      <div className="h-24 bg-gray-2">
        <Player
          song={playbackStatus.currentlyPlaying}
          playbackStatus={playbackStatus}
          guildId={guildId}
          currentSongTime={currentSongTime}
        />
      </div>
    </div>
  );
}
