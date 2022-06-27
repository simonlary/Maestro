import { RiPauseFill, RiPlayFill, RiSkipBackFill, RiSkipForwardFill } from "react-icons/ri";
import {
  PlaybackStatus,
  Song,
  usePauseMutation,
  useResumeMutation,
  useSkipMutation,
} from "../../../../apollo/generated";

interface PlayerProps {
  song?: Song;
  playbackStatus?: PlaybackStatus;
  guildId: string;
}

export function Player({ song, playbackStatus, guildId }: PlayerProps) {
  const isPlaying = playbackStatus?.isPlaying || false;

  const [resume] = useResumeMutation({ variables: { guildId } });
  const [pause] = usePauseMutation({ variables: { guildId } });
  const [skip] = useSkipMutation({ variables: { guildId } });

  return (
    <div className="flex justify-between">
      <div className="flex w-96 items-center gap-4 ">
        <div className="w-20 h-20 flex-shrink-0 bg-blue">
          <img src={song?.thumbnail} alt="" className="h-full object-cover" />
        </div>
        <div className="line-clamp-2">{song?.title}</div>
      </div>
      <div className="flex items-center justify-center gap-4 text-2xl flex-grow">
        <RiSkipBackFill className="invisible" />
        {isPlaying ? (
          <RiPauseFill className="text-5xl cursor-pointer" onClick={() => pause()} />
        ) : (
          <RiPlayFill className="text-5xl cursor-pointer" onClick={() => resume()} />
        )}
        <RiSkipForwardFill className="cursor-pointer" onClick={() => skip()} />
      </div>
      <div className="w-96"></div>
    </div>
  );
}
