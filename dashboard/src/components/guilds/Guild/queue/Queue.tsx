import { Song, useRemoveQueuedSongMutation, useSkipMutation } from "../../../../apollo/generated";
import { SongEntry } from "./SongEntry";

export function Queue({ currentSong, queue, guildId }: { currentSong: Song; queue: Song[]; guildId: string }) {
  const [removeQueuedSong] = useRemoveQueuedSongMutation();
  const [skip] = useSkipMutation({ variables: { guildId } });

  function removeSong(song: Song) {
    removeQueuedSong({
      variables: {
        guildId,
        songId: song.id,
      },
    });
  }

  return (
    <div className="bg-gray-3 h-full">
      <div className="flex flex-col h-full">
        <div className="flex font-semibold py-2">
          <span className="flex-none w-11 px-1 text-right">#</span>
          <span className="flex-1 px-3 truncate">TITLE</span>
          <span className="flex-none w-26 px-3 text-right hidden sm:block">DURATION</span>
        </div>

        <div className="relative h-full">
          <div className="overflow-auto absolute inset-0">
            {currentSong && <SongEntry song={currentSong} onRemove={() => skip()} isPlaying />}

            {queue.map((s, i) => (
              <SongEntry key={s.id} song={s} onRemove={() => removeSong(s)} index={i + 1} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
