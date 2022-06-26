import { BiSearchAlt2 } from "react-icons/bi";
import { SearchEntry } from "./SearchEntry";
export function Search() {
  return (
    <div className="h-full bg-gray-3 rounded-tl-md">
      <div className="flex flex-col">

        <div className="px-4 py-2">
          <div className="flex w-full h-11 bg-gray-2 rounded items-center">
            <input className=" px-2 outline-none bg-gray-2 h-8 rounded flex-grow text-lg" placeholder="Search"></input>
            <BiSearchAlt2 className="h-10 w-10 bg-gray-2 px-2 outline-none rounded" />
          </div>
        </div>

        <div className="flex flex-col">
          <SearchEntry />
          <SearchEntry />
          <SearchEntry />
          <SearchEntry />
          <SearchEntry />
          <SearchEntry />
          <SearchEntry />
          <SearchEntry />
        </div>
      </div>
    </div>
  );
}
