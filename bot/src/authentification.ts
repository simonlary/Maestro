import { ExpressContext } from "apollo-server-express";
import { AuthChecker } from "type-graphql";

export interface Context {
  token?: string;
}

export const authChecker: AuthChecker<Context> = ({ context }) => {
  return context?.token === process.env.DASHBOARD_TOKEN;
};

export const createContext = async ({ req }: ExpressContext): Promise<Context> => {
  return { token: req.headers.authorization };
};

export const createWsContext = async (wsContext: { connectionParams?: { authorization?: string } }) => {
  return { token: wsContext.connectionParams?.authorization };
};
