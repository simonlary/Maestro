import { useEffect, useRef, useState } from "react";
import { RiPauseFill, RiPlayFill, RiSkipBackFill, RiSkipForwardFill } from "react-icons/ri";
import {
  PlaybackStatus,
  Song,
  usePauseMutation,
  useResumeMutation,
  useSkipMutation,
} from "../../../../apollo/generated";
import { formatDuration } from "../../../../utils";
import empty from "./empty.mp3";

interface PlayerProps {
  song: Song;
  playbackStatus: PlaybackStatus;
  guildId: string;
  currentSongTime: number;
}

export function Player({ song, playbackStatus, guildId, currentSongTime }: PlayerProps) {
  const isPlaying = playbackStatus?.isPlaying || false;

  const [resume] = useResumeMutation({ variables: { guildId } });
  const [pause] = usePauseMutation({ variables: { guildId } });
  const [skip] = useSkipMutation({ variables: { guildId } });

  const [didSetAudioPlayer, setDidSetAudioPlayer] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current != null) {
      if (isPlaying) {
        audioRef.current
          .play()
          .then(() => setDidSetAudioPlayer(() => true))
          .catch(() => null);
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, audioRef.current]);

  useEffect(() => {
    if ("mediaSession" in navigator && didSetAudioPlayer) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: song.title,
        artwork: [{ src: song.thumbnail }],
      });

      navigator.mediaSession.setActionHandler("nexttrack", () => {
        skip();
      });

      navigator.mediaSession.setActionHandler("play", () => {
        resume();
      });

      navigator.mediaSession.setActionHandler("pause", () => {
        pause();
      });
    }
  }, [song, didSetAudioPlayer]);

  return (
    <div className="flex justify-between select-none">
      <div className="flex w-96 items-center gap-4 ">
        <div className="w-20 h-20 flex-shrink-0 bg-blue">
          <img src={song.thumbnail} alt="" className="h-full object-cover" />
        </div>
        <div className="line-clamp-2">{song.title}</div>
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
      <div className="w-96 flex items-center justify-center">
        {formatDuration(currentSongTime)}&nbsp;/&nbsp;{formatDuration(song.duration)}
      </div>
      <audio ref={audioRef} src={empty} loop autoPlay />
    </div>
  );
}
