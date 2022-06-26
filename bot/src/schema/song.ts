import { Field, Int, ObjectType } from "type-graphql";

@ObjectType()
export class Song {
  @Field()
  title!: string;

  @Field()
  url!: string;

  @Field()
  thumbnail!: string;

  @Field(() => Int)
  duration!: number;
}
