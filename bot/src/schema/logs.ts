import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class Logs {
  @Field(() => [String])
  logs!: string[];
}
