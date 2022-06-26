import { Song } from "../../../../apollo/generated";

function formatDuration(duration: number) {
  const hours = Math.floor(duration / 3600);
  const minutes = Math.floor((duration % 3600) / 60);
  const seconds = duration % 60;

  const hoursString = hours === 0 ? "" : hours.toString().padStart(2, "0") + ":";
  const minutesString = minutes.toString().padStart(2, "0") + ":";
  const secondsString = seconds.toString().padStart(2, "0");
  return `${hoursString}${minutesString}${secondsString}`;
}

export function SongEntry({ song, index }: { song: Song; index: number }) {
  return (
    <div className='flex justify-between items-center py-2 hover:bg-gray-2'>
      <span className="w-11 px-1 text-right font-mono">{index}</span>
      <div className="flex flex-1 px-3 items-center gap-3">
        <div className="rounded overflow-hidden w-10 h-10">
          <img src={song.thumbnail} alt="Song thumbnail" className="w-full h-full object-cover" />
        </div>
        <span className="flex-1 line-clamp-2 font-semibold">{song.title}</span>
      </div>
      <span className="px-3 font-mono text-right">{formatDuration(song.duration)}</span>
    </div>
  );
}
