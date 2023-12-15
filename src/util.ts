import { z } from "zod";
import split2 from "split2";
import { CustomError } from "ts-custom-error";
import * as abis from "./abis/index.js";
import { LoggingTask, Subscription } from "./types.js";
import { getChainDefaults } from "./supported-chains.js";

export const inferNewSubscriptionsFromEvent = (event: {
  address: string;
  blockNumber: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any & { type: string };
}): Subscription[] => {
  switch (event.data.type) {
    case "RoundCreatedV1":
      return [
        {
          address: event.data.roundAddress,
          abi: abis.v1.RoundImplementation,
          earliestBlock: event.blockNumber,
        },
      ];
    case "RoundCreated": {
      return [
        {
          address: event.data.roundAddress,
          abi: abis.v2.RoundImplementation,
          earliestBlock: event.blockNumber,
        },
      ];
    }
    case "VotingContractCreatedV1":
      return [
        {
          address: event.data.votingContractAddress,
          abi: abis.v1.QuadraticFundingVotingStrategyImplementation,
          earliestBlock: event.blockNumber,
        },
      ];
    case "VotingContractCreated":
      return [
        {
          address: event.data.votingContractAddress,

          abi: abis.v2.QuadraticFundingVotingStrategyImplementation,
          earliestBlock: event.blockNumber,
        },
      ];

    case "PayoutContractCreated":
      return [
        {
          address: event.data.payoutContractAddress,
          abi: abis.v2.DirectPayoutStrategyImplementation,
          earliestBlock: event.blockNumber,
        },
      ];

    case "ApplicationInReviewUpdated":
      return [
        {
          address: event.address,
          abi: abis.v2.DirectPayoutStrategyImplementation,
          earliestBlock: event.blockNumber,
        },
      ];
    default:
      return [];
  }
};

export const reconstructLoggingStateFromNdjsonEventStream = (
  stream: NodeJS.ReadStream,
  // config for RPc urls
): Promise<LoggingTask[]> => {
  const loggingTasksByChain: Record<number, LoggingTask> = {};

  return new Promise<LoggingTask[]>((resolve, reject) => {
    stream
      .pipe(split2())
      .on("data", (line: string) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const event = z
          .object({
            chainId: z.number(),
            address: z.string(),
            blockNumber: z.number(),
            data: z.object({ type: z.string() }).passthrough(),
          })
          .parse(JSON.parse(line));

        if (loggingTasksByChain[event.chainId] === undefined) {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          const { rpcUrl: rpc, seedSubscriptions } = getChainDefaults(
            event.chainId,
          );
          loggingTasksByChain[event.chainId] = {
            chainId: event.chainId,
            startBlock: event.blockNumber + 1,
            subscriptions: seedSubscriptions,
            rpcUrl: rpc,
            endBlock: "ongoing",
          };
        }
        const loggingTask = loggingTasksByChain[event.chainId];

        loggingTask.startBlock = event.blockNumber + 1;
        loggingTask.subscriptions.push(
          ...inferNewSubscriptionsFromEvent(event),
        );
      })
      .on("end", () => {
        resolve(Object.values(loggingTasksByChain));
      })
      .on("error", (err) => {
        reject(err);
      });
  });
};

/**
 * Ethers events have args as arrays with named properties, e.g.:
 *
 *    ["foo", "bar", prop1: "foo", prop2: "bar"]
 *
 *  That throws off JSON serialization, so we convert that to a proper object, e.g.:
 *
 *    { prop1: "foo", prop2: "bar" }
 *
 */
export const ethersEventArgsToSerializable = <T>(obj: T): T => {
  if (Array.isArray(obj)) {
    if (Object.keys(obj).length !== obj.length) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const newObj: { [prop: string]: any } = {};
      // eslint-disable-next-line @typescript-eslint/no-for-in-array
      for (const name in obj) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        newObj[name] = ethersEventArgsToSerializable(obj[name]);
      }
      for (let i = 0; i < obj.length; i++) {
        delete newObj[i];
      }
      // TODO check for bignumber
      return newObj as T;
    } else {
      // @ts-expect-error hack
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return obj.map(ethersEventArgsToSerializable);
    }
  } else if (typeof obj === "object" && obj !== null) {
    if ("_isBigNumber" in obj) {
      // @ts-expect-error condition isn't enough for narrowing
      return obj.toHexString();
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const newObj: { [prop: string]: any } = {};
      for (const name in obj) {
        newObj[name] = ethersEventArgsToSerializable(obj[name]);
      }
      return newObj as T;
    }
  } else {
    return obj;
  }
};

/**
 * A utility class necessary because promise state is not inspectable, otherwise
 * plain promise could be used.
 *
 */
export class InspectablePromise {
  _promise: Promise<void>;
  _resolve: null | (() => void) = null;
  _isDone = false;

  constructor() {
    this._promise = new Promise((resolve) => {
      this._resolve = resolve;
    });
  }

  untilDone(): Promise<void> {
    return this._promise;
  }

  isDone(): boolean {
    return this._isDone;
  }

  declareDone(): void {
    if (this._resolve === null) {
      throw new Error("Promise has not had the time to initialize");
    }
    if (!this._isDone) {
      this._isDone = true;
      this._resolve();
    }
  }
}

/**
 * Parse a string spec definiting a logging task in the format:
 *
 *   <chain id>:<start block>..<end block>
 *
 * E.g.:
 *
 *   1:0..1000000
 *
 */
export const parseLoggingTaskSpec = (
  spec: string,
): Omit<LoggingTask, "subscriptions" | "rpcUrl"> => {
  const chainIdRangeMatch = spec.match(/^(\d+):(.*)$/);

  if (chainIdRangeMatch === null) {
    throw new LoggingTaskSpecParseError(spec);
  }

  const [, rawChainId, rawRange] = chainIdRangeMatch;

  const chainId = parseInt(rawChainId, 10);
  if (Number.isNaN(chainId)) {
    throw new LoggingTaskSpecParseError(spec);
  }

  const rangeMatch = rawRange.match(/^(\d+|origin)\.\.(\d+|last|ongoing)$/);
  if (rangeMatch === null) {
    throw new LoggingTaskSpecParseError(spec);
  }

  const [, rawStartBlock, rawEndBlock] = rangeMatch;

  let startBlock: LoggingTask["startBlock"];
  if (rawStartBlock === "origin") {
    startBlock = 0;
  } else {
    startBlock = parseInt(rawStartBlock, 10);
    if (Number.isNaN(startBlock)) {
      throw new LoggingTaskSpecParseError(spec);
    }
  }

  let endBlock: LoggingTask["endBlock"];
  if (rawEndBlock === "last" || rawEndBlock === "ongoing") {
    endBlock = rawEndBlock;
  } else {
    endBlock = parseInt(rawEndBlock, 10);
    if (Number.isNaN(endBlock)) {
      throw new LoggingTaskSpecParseError(spec);
    }
  }

  return { chainId, startBlock, endBlock };
};

export class LoggingTaskSpecParseError extends CustomError {
  public constructor(
    public spec: string,
    message?: string,
  ) {
    super(message);
  }
}
