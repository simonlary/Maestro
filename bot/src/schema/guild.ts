import { Snowflake } from "discord.js";
import { Field, ObjectType } from "type-graphql";
import { Song } from "./song.js";
import { PlaybackStatus } from "./playbackStatus.js";

@ObjectType()
export class Guild {
  @Field()
  id!: Snowflake;

  @Field()
  name!: string;

  @Field()
  icon?: string;

  @Field()
  currentlyPlaying!: Song;

  @Field()
  playbackStatus!: PlaybackStatus;

  @Field(() => [Song])
  queue!: Song[];
}
