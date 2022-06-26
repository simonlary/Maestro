import { Mutation, Resolver } from "type-graphql";
import { Bot } from "../bot.js";
import { Settings } from "../schema/settings.js";

export function createSettingsResolver(bot: Bot) {
  @Resolver(Settings)
  class SettingsResolver {
    @Mutation(() => Boolean)
    async registerCommands() {
      await bot.registerCommands();
      return true;
    }
  }

  return SettingsResolver;
}
