import { spawn } from "child_process";
import { Authorized, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { Context } from "../authentication.js";
import { Settings } from "../schema/settings.js";

@Resolver(Settings)
export class SettingsResolver {
  private hasAlreadyRegisteredCommands = false;
  private isRestarting = false;

  @Authorized("ADMIN")
  @Mutation(() => Boolean)
  async registerCommands(@Ctx() context: Context): Promise<boolean> {
    await context.bot.registerCommands();
    this.hasAlreadyRegisteredCommands = true;
    return true;
  }

  @Authorized("ADMIN")
  @Mutation(() => Boolean)
  async restart(): Promise<boolean> {
    if (this.isRestarting) return false;
    this.isRestarting = true;

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

  @Authorized("ADMIN")
  @Query(() => Settings)
  async settings(): Promise<Settings> {
    return { hasAlreadyRegisteredCommands: this.hasAlreadyRegisteredCommands };
  }
}
