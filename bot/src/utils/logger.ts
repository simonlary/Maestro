import pino from "pino";
import { Log } from "../schema/log";

const MAX_IN_MEMORY_LOGS_SIZE = 2000;
const LIMIT_LOGS_SIZE_DELAY_IN_MS = 1000;

let nextId = 0;

export const logs: Log[] = [];
setInterval(() => {
  if (logs.length > MAX_IN_MEMORY_LOGS_SIZE) {
    logs.length = MAX_IN_MEMORY_LOGS_SIZE;
  }
}, LIMIT_LOGS_SIZE_DELAY_IN_MS);

export default pino(
  {
    formatters: {
      level(label) {
        return { level: label };
      },
    },
  },
  pino.multistream([
    { stream: process.stdout },
    {
      stream: {
        write(message) {
          logs.unshift({
            id: nextId++,
            message,
          });
        },
      },
    },
  ])
);
