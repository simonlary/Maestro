import { RiBarChartFill } from "react-icons/ri";
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

interface FirstSongsProps {
  song: Song;
  isPlaying: true;
}

interface OtherSongsProps {
  song: Song;
  isPlaying?: false;
  index: number;
}

type SongEntryProps = OtherSongsProps | FirstSongsProps;

export function SongEntry(props: SongEntryProps) {
  return (
    <div className={`flex justify-between items-center py-2 hover:bg-gray-2 ${props.isPlaying && "text-green"}`}>
      <span className="w-11 px-2 text-right font-mono">
        {props.isPlaying ? <RiBarChartFill className="inline" /> : props.index}
      </span>
      <div className="flex flex-1 px-3 items-center gap-3">
        <div className="rounded overflow-hidden w-10 h-10">
          <img src={props.song.thumbnail} alt="Song thumbnail" className="w-full h-full object-cover" />
        </div>
        <span className="flex-1 line-clamp-2 font-semibold">{props.song.title}</span>
      </div>
      <span className="px-3 font-mono text-right">{formatDuration(props.song.duration)}</span>
    </div>
  );
}
