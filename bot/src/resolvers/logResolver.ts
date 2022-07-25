import { Arg, Authorized, Int, Query, Resolver } from "type-graphql";
import { logger } from "../utils/logger.js";
import { Log } from "../schema/log.js";

@Resolver(Log)
export class LogResolver {
  @Authorized("ADMIN")
  @Query(() => [Log])
  async logs(@Arg("limit", () => Int, { defaultValue: 10 }) limit: number): Promise<Log[]> {
    return logger.logs.slice(0, limit);
  }
}
