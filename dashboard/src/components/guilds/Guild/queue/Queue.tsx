import { Song } from "../../../../apollo/generated";
import { SongEntry } from "./SongEntry";

export function Queue({ currentSong, queue }: { currentSong?: Song; queue: Song[] }) {
  return (
    <div className="bg-gray-3 rounded-tr-md h-full">
      <div className="flex flex-col h-full">
        <div className="flex font-semibold py-2">
          <span className="flex-none w-11 px-1 text-right">#</span>
          <span className="flex-1 px-3 truncate">TITLE</span>
          <span className="flex-none w-26 px-3 text-right">DURATION</span>
        </div>

        <div className="relative h-full shadow-inner-bottom">
          <div className="overflow-auto absolute inset-0">
            {currentSong && <SongEntry song={currentSong} isPlaying />}

            {queue.map((s, i) => (
              <SongEntry key={s.url} song={s} index={i + 1} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
