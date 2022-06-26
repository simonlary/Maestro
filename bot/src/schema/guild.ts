import { Snowflake } from "discord.js";
import { Field, ObjectType } from "type-graphql";
// import { Song } from "./song";

@ObjectType()
export class Guild {
  @Field()
  guildId!: Snowflake;

  @Field()
  name!: string;

  @Field()
  icon!: string;

  // @Field(() => [Song])
  // queue: Song[];
}
