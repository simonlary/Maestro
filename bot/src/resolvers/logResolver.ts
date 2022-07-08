import { Arg, Authorized, Int, Query, Resolver } from "type-graphql";
import { logger } from "../logger.js";
import { Log } from "../schema/log.js";

export function createLogResolver() {
  @Resolver(Log)
  class LogResolver {
    @Authorized()
    @Query(() => [Log])
    async logs(@Arg("limit", () => Int, { defaultValue: 10 }) limit: number) {
      return logger.logs.slice(0, limit);
    }
  }

  return LogResolver;
}
