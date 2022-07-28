import { Field, Int, ObjectType } from "type-graphql";
import { Song } from "./song.js";

@ObjectType()
export class PlaybackStatus {
  @Field()
  isPlaying!: boolean;

  @Field(() => Int)
  currentTime!: number;

  @Field()
  currentlyPlaying!: Song;

  @Field(() => [Song])
  queue!: Song[];
}
