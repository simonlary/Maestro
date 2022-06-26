declare namespace NodeJS {
  interface ProcessEnv {
    TOKEN: string | undefined;
    DEBUG_GUILDS: string | undefined;
    APOLLO_SERVER_PORT: string | undefined;
  }
}
