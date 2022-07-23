import { Snowflake } from "discord.js";
import { Field, ObjectType } from "type-graphql";
import { PlaybackStatus } from "./playbackStatus.js";

@ObjectType()
export class Guild {
  @Field()
  id!: Snowflake;

  @Field()
  name!: string;

  @Field({ nullable: true })
  icon?: string;

  @Field({ nullable: true })
  playbackStatus?: PlaybackStatus;
}
