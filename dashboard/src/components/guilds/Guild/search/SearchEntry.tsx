import { BsPlusLg } from "react-icons/bs";

function formatDuration(duration: number) {
  const hours = Math.floor(duration / 3600);
  const minutes = Math.floor((duration % 3600) / 60);
  const seconds = duration % 60;

  const hoursString = hours === 0 ? "" : hours.toString().padStart(2, "0") + ":";
  const minutesString = minutes.toString().padStart(2, "0") + ":";
  const secondsString = seconds.toString().padStart(2, "0");
  return `${hoursString}${minutesString}${secondsString}`;
}

export function SearchEntry() {
  return (
    <div className="flex justify-between items-center p-2 hover:bg-gray-2">
      <div className="flex flex-1 truncate px-3 items-center gap-3">
        <div className="rounded overflow-hidden w-10 h-10 bg-white">
          {/* <img src={song.thumbnail} alt="Song thumbnail" className="w-full h-full object-cover" /> */}
        </div>
        <span className="flex-1 truncate font-semibold">Title</span>
      </div>
      <span className="w-32 px-3 font-mono text-right">{formatDuration(300)}</span>
      <button className="text-green rounded-full bg-gray-2 w-8 h-8 flex justify-center items-center user-select-none hover:bg-green hover:text-white text-xl">
        <BsPlusLg className="text-sm" />
      </button>
    </div>
  );
}
