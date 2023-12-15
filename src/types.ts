import { ethers } from "ethers";

export interface Subscription {
  address: string;
  abi: ethers.ContractInterface;
  earliestBlock: number;
}

export type ChainDefaults = {
  rpcUrl: string;
  id: number;
  seedSubscriptions: Subscription[];
};

export interface LoggingTask {
  chainId: number;
  rpcUrl: string;
  subscriptions: Subscription[];
  startBlock: number;
  endBlock: number | "last" | "ongoing";
}

export interface Config {
  buildTag: string | null;
  logLevel: "trace" | "debug" | "info" | "warn" | "error";
  loggingTasks: LoggingTask[];
  deploymentEnvironment:
    | null
    | "local"
    | "development"
    | "staging"
    | "production";
  resume: boolean;
}
