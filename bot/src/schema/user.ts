import { Snowflake } from "discord.js";
import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class User {
  @Field()
  id!: Snowflake;

  @Field()
  username!: string;

  @Field()
  icon!: string;

  @Field()
  isAdmin!: boolean;
}
