import "dotenv/config";

export class Config {
  private readonly _token: string;
  private readonly _adminUsers: string[];
  private readonly _debugGuilds: string[];
  private readonly _dashboardUrl: string;

  public constructor() {
    const token = process.env.TOKEN;
    if (token == null) throw new Error("No token provided.");
    this._token = token;
    this._adminUsers = process.env.ADMIN_USERS?.split(",") ?? [];
    this._debugGuilds = process.env.DEBUG_GUILDS?.split(",") ?? [];
    this._dashboardUrl = process.env.DASHBOARD_URL ?? "";
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

  public get dashboardUrl(): string {
    return this._dashboardUrl;
  }
}
