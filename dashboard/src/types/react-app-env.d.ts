/// <reference types="react-scripts" />

declare module "*.mp3" {
  const src: string;
  export default src;
}

declare namespace NodeJS {
  interface ProcessEnv {
    readonly REACT_APP_BOT_URL?: string;
    readonly REACT_APP_CLIENT_ID?: string;
  }
}
