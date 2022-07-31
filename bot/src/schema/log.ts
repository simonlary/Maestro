import { GraphQLScalarType } from "graphql";
import { Field, Int, ObjectType } from "type-graphql";

export const LogLevel = new GraphQLScalarType({
  name: "LogLevel",
});

@ObjectType()
export class Log {
  @Field(() => Int)
  id!: number;

  @Field()
  timestamp!: string;

  @Field(() => LogLevel)
  level!: "info" | "warning" | "error";

  @Field()
  message!: string;
}
