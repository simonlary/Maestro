interface Log {
  id: number;
  timestamp: string;
  level: "info" | "warning" | "error";
  message: string;
}

const MAX_IN_MEMORY_LOGS_SIZE = 2000;
const LIMIT_LOGS_SIZE_DELAY_IN_MS = 1000;

class Logger {
  private readonly _logs: Log[] = [];
  private _nextId = 0;

  public constructor() {
    setInterval(() => this.limitLogsSize(), LIMIT_LOGS_SIZE_DELAY_IN_MS);
  }

  public debug(message: string) {
    console.log(message);
  }

  public info(message: string) {
    console.log(message);
    this.log(message, "info");
  }

  public warn(message: string) {
    console.warn(message);
    this.log(message, "warning");
  }

  public error(message: string) {
    console.error(message);
    this.log(message, "error");
  }

  public get logs() {
    return this._logs;
  }

  private log(message: string, level: "info" | "warning" | "error") {
    this._logs.unshift({
      id: this._nextId++,
      timestamp: Date.now().toString(),
      level: level,
      message,
    });
  }

  private limitLogsSize() {
    if (this._logs.length > MAX_IN_MEMORY_LOGS_SIZE) {
      this._logs.length = MAX_IN_MEMORY_LOGS_SIZE;
    }
  }
}

export const logger = new Logger();
