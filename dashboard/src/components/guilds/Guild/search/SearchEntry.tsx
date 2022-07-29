import { BsPlusLg } from "react-icons/bs";
import { RiYoutubeFill } from "react-icons/ri";
import { Song, useQueueSongMutation } from "../../../../apollo/generated";
import { formatDuration } from "../../../../utils";

export function SearchEntry({ song, guildId }: { song: Song; guildId: string }) {
  const [queueSongMutation] = useQueueSongMutation();

  function queueSong() {
    queueSongMutation({
      variables: {
        guildId,
        songUrl: song.url,
      },
    });
  }

  return (
    <div className="flex justify-between items-center p-2 hover:bg-gray-2 animate-fadein select-none">
      {/* Title / Thumbnail */}
      <div className="flex flex-1 truncate px-3 items-center gap-3">
        <div className="rounded overflow-hidden w-10 h-10 bg-white hidden md:block">
          <img src={song.thumbnail} alt="Song thumbnail" className="w-full h-full object-cover" />
        </div>
        <span className="flex-1 truncate font-semibold" title={song.title}>
          {song.title}
        </span>
      </div>

      {/* Youtube Link */}
      <a className="items-center text-red hidden md:flex" href={song.url} target="_blank" rel="noopener noreferrer">
        <RiYoutubeFill className="cursor-pointer" />
      </a>

      {/* Duration */}
      <span className="w-24 px-3 font-mono text-right hidden sm:block">{formatDuration(song.duration)}</span>

      {/* Add Button */}
      <button
        className="text-green rounded-full bg-gray-2 w-8 h-8 flex justify-center items-center user-select-none hover:bg-green hover:text-white text-xl"
        onClick={queueSong}
      >
        <BsPlusLg className="text-sm" />
      </button>
    </div>
  );
}
