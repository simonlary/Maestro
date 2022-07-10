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
      <div className="flex flex-1 truncate px-3 items-center gap-3">
        <div className="rounded overflow-hidden w-10 h-10 bg-white">
          <img src={song.thumbnail} alt="Song thumbnail" className="w-full h-full object-cover" />
        </div>
        <span className="flex-1 truncate font-semibold">{song.title}</span>
      </div>
      <a className="flex items-center text-red" href={song.url} target="_blank" rel="noopener noreferrer">
        <RiYoutubeFill className="cursor-pointer" />
      </a>
      <span className="w-24 px-3 font-mono text-right">{formatDuration(song.duration)}</span>
      <button
        className="text-green rounded-full bg-gray-2 w-8 h-8 flex justify-center items-center user-select-none hover:bg-green hover:text-white text-xl"
        onClick={queueSong}
      >
        <BsPlusLg className="text-sm" />
      </button>
    </div>
  );
}
