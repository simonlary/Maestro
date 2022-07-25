import { RiBarChartFill, RiCloseCircleLine, RiYoutubeFill } from "react-icons/ri";
import { Song } from "../../../../apollo/generated";
import { formatDuration } from "../../../../utils";

interface FirstSongsProps {
  song: Song;
  onRemove: () => void;
  isPlaying: true;
}

interface OtherSongsProps {
  song: Song;
  onRemove: () => void;
  isPlaying?: false;
  index: number;
}

type SongEntryProps = OtherSongsProps | FirstSongsProps;

export function SongEntry(props: SongEntryProps) {
  return (
    <div
      className={`flex justify-between items-center py-2 hover:bg-gray-2 select-none group ${
        props.isPlaying && "text-green"
      }`}
    >
      {/* Index */}
      <span className="w-11 px-2 text-right font-mono">
        {props.isPlaying ? <RiBarChartFill className="inline" /> : props.index}
      </span>

      {/* Thumbnail / Title */}
      <div className="flex flex-1 px-3 items-center gap-3">
        <div className="rounded overflow-hidden w-10 h-10 hidden md:block">
          <img src={props.song.thumbnail} alt="Song thumbnail" className="w-full h-full object-cover" />
        </div>
        <span className="flex-1 line-clamp-2 font-semibold">{props.song.title}</span>
      </div>

      {/* Youtube Link */}
      <a
        className="items-center text-red hidden md:block"
        href={props.song.url}
        target="_blank"
        rel="noopener noreferrer"
      >
        <RiYoutubeFill className="cursor-pointer" />
      </a>

      {/* Duration */}
      <span className="w-24 px-3 font-mono text-right hidden sm:block">{formatDuration(props.song.duration)}</span>

      {/* Remove Button */}
      <span
        className="pr-2 text-right text-lg invisible hover:cursor-pointer group-hover:visible"
        onClick={() => props.onRemove()}
      >
        <RiCloseCircleLine />
      </span>
    </div>
  );
}
