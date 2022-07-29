import { Arg, Authorized, Int, Query, Resolver } from "type-graphql";
import { logs } from "../utils/logger.js";
import { Logs } from "../schema/logs.js";

@Resolver(Logs)
export class LogsResolver {
  @Authorized("ADMIN")
  @Query(() => Logs)
  async logs(@Arg("limit", () => Int, { defaultValue: 20 }) limit: number): Promise<Logs> {
    return { logs: logs.slice(0, limit) };
  }
}
