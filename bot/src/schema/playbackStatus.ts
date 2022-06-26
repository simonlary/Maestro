import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class PlaybackStatus {
  @Field()
  isPlaying!: boolean;
}
