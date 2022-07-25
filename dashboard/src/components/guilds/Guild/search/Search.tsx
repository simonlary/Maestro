import { BiSearchAlt2 } from "react-icons/bi";
import { SearchEntry } from "./SearchEntry";
import { FormEvent, useRef, useState } from "react";
import { useSearchSongsLazyQuery } from "../../../../apollo/generated";
import { Spinner } from "../../../controls/Spinner";

export function Search({ guildId }: { guildId: string }) {
  const [query, setQuery] = useState("");
  const [getSongs, { data: songsQuery, loading }] = useSearchSongsLazyQuery();
  const searchRef = useRef<HTMLInputElement>(null);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (query !== "") {
      getSongs({ variables: { query } });
      searchRef.current?.blur();
    }
  }

  return (
    <div className="h-full bg-gray-3">
      <div className="flex flex-col h-full">
        <div className="px-4 py-2">
          <form className="flex w-full h-11 bg-gray-2 rounded items-center overflow-hidden" onSubmit={submit}>
            <input
              className="px-2 outline-none min-w-0 bg-gray-2 h-8 rounded flex-grow text-lg"
              placeholder="Search"
              value={query}
              onChange={(e) => setQuery(e.currentTarget.value)}
              onFocus={(e) => e.currentTarget.select()}
              ref={searchRef}
            />
            <button type="submit">
              <BiSearchAlt2 className="h-10 w-10 bg-gray-2 px-2 outline-none rounded" />
            </button>
          </form>
        </div>

        <div className="flex flex-col flex-1 relative overflow-y-scroll pb-4">
          {loading ? (
            <div className="m-auto">
              <Spinner className="text-3xl" />
            </div>
          ) : (
            songsQuery != null &&
            songsQuery.searchSongs.length > 0 &&
            songsQuery.searchSongs.map((song) => <SearchEntry key={song.id} song={song} guildId={guildId} />)
          )}
        </div>
      </div>
    </div>
  );
}
