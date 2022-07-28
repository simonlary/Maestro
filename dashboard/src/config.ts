const ACCESS_TOKEN_KEY = "accessToken";
const isProduction = process.env.NODE_ENV === "production";
const BOT_URL = isProduction ? window.BOT_URL : process.env.REACT_APP_BOT_URL;
const CLIENT_ID = isProduction ? window.CLIENT_ID : process.env.REACT_APP_CLIENT_ID;

if (BOT_URL == null) {
  throw new Error("Configuration error : BOT_URL not defined");
}

if (CLIENT_ID == null) {
  throw new Error("Configuration error : CLIENT_ID not defined");
}

const HTTP_BOT_URL = BOT_URL;
const WS_BOT_URL = BOT_URL.replace("http", "ws");

const config = new (class {
  private _accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);

  public get httpBotUrl() {
    return HTTP_BOT_URL;
  }

  public get wsBotUrl() {
    return WS_BOT_URL;
  }

  public get clientId() {
    return CLIENT_ID;
  }

  public get accessToken() {
    return this._accessToken;
  }

  public setAccessToken(newAccessToken: string) {
    this._accessToken = newAccessToken;
    localStorage.setItem(ACCESS_TOKEN_KEY, newAccessToken);
  }

  public clearAccessToken() {
    this._accessToken = null;
    localStorage.removeItem(ACCESS_TOKEN_KEY);
  }
})();

export { config };
