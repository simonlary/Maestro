import "dotenv/config";

export class Config {
  private readonly _token: string;
  private readonly _debugGuilds: string[];
  private readonly _apolloServerPort: number;

  public constructor() {
    const token = process.env.TOKEN;
    if (token == null) throw new Error("No token provided");
    this._token = token;
    this._debugGuilds = process.env.DEBUG_GUILDS?.split(",") ?? [];
    this._apolloServerPort = parseInt(process.env.APOLLO_SERVER_PORT ?? "", 10) || 3001;
  }

  public get token(): string {
    return this._token;
  }

  public get debugGuilds(): string[] {
    return this._debugGuilds;
  }

  public get apolloServerPort(): number {
    return this._apolloServerPort;
  }
}
