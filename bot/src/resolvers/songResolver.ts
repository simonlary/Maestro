import playdl from "play-dl";
import { Arg, Authorized, Query, Resolver } from "type-graphql";
import { Song } from "../schema/song.js";
import crypto from "crypto";

export function createSongResolver() {
  @Resolver(Song)
  class SongResolver {
    @Authorized()
    @Query(() => [Song])
    async searchSongs(@Arg("query") query: string): Promise<Song[]> {
      const searchResult = await playdl.search(query);
      return searchResult.map((result) => ({
        id: crypto.randomUUID(),
        title: result.title ?? result.url,
        url: result.url,
        thumbnail: result.thumbnails[0].url,
        duration: result.durationInSec,
      }));
    }
  }

  return SongResolver;
}
