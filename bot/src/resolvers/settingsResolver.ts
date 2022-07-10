import { Authorized, Mutation, Query, Resolver } from "type-graphql";
import { Bot } from "../bot.js";
import { logger } from "../logger.js";
import { Settings } from "../schema/settings.js";
import { spawn } from "child_process";

export function createSettingsResolver(bot: Bot) {
  @Resolver(Settings)
  class SettingsResolver {
    private hasAlreadyRegisteredCommands = false;
    private isRestarting = false;

    @Authorized()
    @Mutation(() => Boolean)
    async registerCommands(): Promise<boolean> {
      await bot.registerCommands();
      this.hasAlreadyRegisteredCommands = true;
      return true;
    }

    @Authorized()
    @Mutation(() => Boolean)
    async restart(): Promise<boolean> {
      if (this.isRestarting) return false;
      this.isRestarting = true;

      logger.warn("Manual restart requested");
      setTimeout(function () {
        process.on("exit", function () {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          spawn(process.argv.shift()!, process.argv, {
            cwd: process.cwd(),
            detached: true,
            stdio: "inherit",
          });
        });
        process.exit();
      }, 5000);
      return true;
    }

    @Authorized()
    @Query(() => Settings)
    async settings(): Promise<Settings> {
      return { hasAlreadyRegisteredCommands: this.hasAlreadyRegisteredCommands };
    }
  }

  return SettingsResolver;
}
