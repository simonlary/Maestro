import { Arg, Authorized, Int, Query, Resolver } from "type-graphql";
import { Log } from "../schema/log.js";
import { logger } from "../utils/logger.js";

@Resolver(Log)
export class LogResolver {
  @Authorized("ADMIN")
  @Query(() => [Log])
  async logs(@Arg("limit", () => Int, { defaultValue: 20 }) limit: number): Promise<Log[]> {
    return logger.logs.slice(0, limit);
  }
}
