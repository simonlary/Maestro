import "dotenv/config";

export class Config {
  private readonly _token: string;
  private readonly _adminUsers: string[];
  private readonly _debugGuilds: string[];

  public constructor() {
    const token = process.env.TOKEN;
    if (token == null) throw new Error("No token provided.");
    this._token = token;
    this._adminUsers = process.env.ADMIN_USERS?.split(",") ?? [];
    this._debugGuilds = process.env.DEBUG_GUILDS?.split(",") ?? [];
  }

  public get token(): string {
    return this._token;
  }

  public get adminUsers(): string[] {
    return this._adminUsers;
  }

  public get debugGuilds(): string[] {
    return this._debugGuilds;
  }
}
