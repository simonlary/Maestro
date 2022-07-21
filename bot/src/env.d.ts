declare namespace NodeJS {
  interface ProcessEnv {
    readonly TOKEN?: string;
    readonly DEBUG_GUILDS?: string;
    readonly APOLLO_SERVER_PORT?: string;
    readonly DASHBOARD_TOKEN?: string;
  }
}
