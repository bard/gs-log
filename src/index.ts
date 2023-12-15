import os from "node:os";
import url from "node:url";
import { ethers } from "ethers";
import { pino } from "pino";
import { parseConfig } from "./config.js";
import { logChainEvents } from "./stream.js";
import { reconstructLoggingStateFromNdjsonEventStream } from "./util.js";
import { LoggingTask } from "./types.js";

import { CHAIN_DEFAULTS } from "./grants-stack/chain-defaults.js";
import { inferNewSubscriptionsFromEvent } from "./grants-stack/infer-subscriptions.js";

// ts-unused-exports:disable-next-line
export const run = async (): Promise<void> => {
  // https://github.com/gitcoinco/allo-indexer/issues/215#issuecomment-1711380810
  ethers.utils.Logger.setLogLevel(ethers.utils.Logger.levels.ERROR);

  // TODO catch and pretty-print errors
  const config = parseConfig({
    // eslint-disable-next-line no-process-env
    env: process.env,
    argv: process.argv,
    chainDefaults: CHAIN_DEFAULTS,
  });

  const logger = pino({
    level: config.logLevel,
    formatters: {
      level(level) {
        // represent severity as strings so that DataDog can recognize it
        return { level };
      },
    },
    base: {
      service: `gs-log-${config.deploymentEnvironment}`,
      pid: process.pid,
      hostname: os.hostname(),
    },
    transport: {
      target: "pino/file",
      options: { destination: "gs-log.log" },
    },
  });

  logger.info({
    msg: "starting",
    buildTag: config.buildTag,
    deploymentEnvironment: config.deploymentEnvironment,
    loggingTasks: config.loggingTasks.map(
      (c) =>
        `${c.chainId} (rpc: ${c.rpcUrl.slice(0, 25)}...${c.rpcUrl.slice(
          -5,
          -1,
        )})`,
    ),
  });

  let loggingTasks: LoggingTask[];
  if (config.loggingTasks.length > 0) {
    loggingTasks = config.loggingTasks;
    if (config.loggingTasks.length === 0) {
      throw new Error("No logging tasks specified");
    }
  } else if (config.resume) {
    loggingTasks = await reconstructLoggingStateFromNdjsonEventStream(
      process.stdin,
      inferNewSubscriptionsFromEvent,
      CHAIN_DEFAULTS,
    );
    if (loggingTasks.length === 0) {
      throw new Error("No logging tasks could be reconstructed from stdin");
    }
  } else {
    throw new Error("Invalid configuration");
  }

  logger.info({
    msg: "starting logging",
    loggingTasks: loggingTasks.map((t) => ({
      ...t,
      subscriptions: t.subscriptions.map(({ abi: _, ...rest }) => rest),
    })),
  });

  await Promise.all(
    loggingTasks.map(async (loggingTask) =>
      logChainEvents({
        inferNewSubscriptionsFromEvent,
        loggingTask,
        logger: logger.child({ chain: loggingTask.chainId }),
        ...config,
      }),
    ),
  );

  logger.info("logging finished");

  // Workaround for active handles preventing process to terminate
  // (to investigate: console.log(process._getActiveHandles()))
  process.exit(0);
};

if (import.meta.url === url.pathToFileURL(process.argv[1]).href) {
  await run();
}
