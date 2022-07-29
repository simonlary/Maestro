import { Arg, Authorized, Int, Query, Resolver } from "type-graphql";
import { logs } from "../utils/logger.js";
import { Log } from "../schema/log.js";

@Resolver(Log)
export class LogResolver {
  @Authorized("ADMIN")
  @Query(() => [Log])
  async logs(@Arg("limit", () => Int, { defaultValue: 20 }) limit: number): Promise<Log[]> {
    return logs.slice(0, limit);
  }
}
