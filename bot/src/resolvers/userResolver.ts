import { Authorized, Ctx, Query, Resolver } from "type-graphql";
import { Context } from "../authentification.js";
import { UserData } from "../discord.js";
import { User } from "../schema/user.js";

@Resolver(User)
export class UserResolver {
  @Authorized()
  @Query(() => User)
  async user(@Ctx() context: Context): Promise<User> {
    if (context.user == null) {
      throw new Error("User is not connected.");
    }
    return {
      id: context.user.id,
      username: context.user.username,
      icon: this.calculateAvatarUrl(context.user),
      isAdmin: context.config.adminUsers.includes(context.user.id),
    };
  }

  private calculateAvatarUrl(userData: UserData): string {
    if (userData.avatar == null) {
      return `https://cdn.discordapp.com/embed/avatars/${+userData.discriminator % 5}.png`;
    }
    return `https://cdn.discordapp.com/avatars/${userData.id}/${userData.avatar}.png`;
  }
}
