import { Snowflake } from "discord.js";
import { Field, ObjectType } from "type-graphql";
import { Song } from "./song.js";

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

  @Field(() => [Song])
  queue!: Song[];
}
