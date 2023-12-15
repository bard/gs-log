import { ethers } from "ethers";

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

export interface LoggingTask {
  chainId: number;
  rpcUrl: string;
  subscriptions: Subscription[];
  startBlock: number;
  endBlock: number | "last" | "ongoing";
}

export type ChainDefaults = {
  rpcUrl: string;
  id: number;
  seedSubscriptions: Subscription[];
};

export type InferSubscriptionFromEvent = (event: {
  address: string;
  blockNumber: number;
  data: {
    type: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [prop: string]: any;
  };
}) => Subscription[];

interface Subscription {
  address: string;
  abi: ethers.ContractInterface;
  earliestBlock: number;
}
