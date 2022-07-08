import { BiSearchAlt2 } from "react-icons/bi";
import { SearchEntry } from "./SearchEntry";
import { FormEvent, useState } from "react";
import { useSearchSongsLazyQuery } from "../../../../apollo/generated";

export function Search() {
  const [query, setQuery] = useState("");
  const [getSongs, { data: songsQuery, loading }] = useSearchSongsLazyQuery();

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (query !== "") getSongs({ variables: { query } });
  }

  return (
    <div className="h-full bg-gray-3 rounded-tl-md">
      <div className="flex flex-col">
        <div className="px-4 py-2">
          <form className="flex w-full h-11 bg-gray-2 rounded items-center" onSubmit={submit}>
            <input
              className=" px-2 outline-none bg-gray-2 h-8 rounded flex-grow text-lg"
              placeholder="Search"
              value={query}
              onChange={(e) => setQuery(e.currentTarget.value)}
            />
            <button type="submit">
              <BiSearchAlt2 className="h-10 w-10 bg-gray-2 px-2 outline-none rounded" />
            </button>
          </form>
        </div>

        <div className="flex flex-col">
          {!loading &&
            songsQuery != null &&
            songsQuery.searchSongs.length > 0 &&
            songsQuery.searchSongs.map(song => <SearchEntry key={song.id} song={song} />)}
        </div>
      </div>
    </div>
  );
}
