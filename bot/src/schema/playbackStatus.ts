import { Field, Int, ObjectType } from "type-graphql";

@ObjectType()
export class PlaybackStatus {
  @Field()
  isPlaying!: boolean;

  @Field(() => Int)
  currentTime!: number;
}
