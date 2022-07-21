import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class Settings {
  @Field()
  hasAlreadyRegisteredCommands!: boolean;
}
