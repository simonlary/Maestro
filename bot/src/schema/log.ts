import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class Log {
  @Field()
  id!: number;

  @Field()
  message!: string;
}
