import os from "node:os";
import path from "node:path";
import { Logger } from "pino";
import {
  RetryProvider,
  createIndexer as createEventListener,
  JsonStorage,
  Indexer,
  Event,
} from "chainsauce";
import { InspectablePromise, ethersEventArgsToSerializable } from "./util.js";
import { Config, InferSubscriptionFromEvent, LoggingTask } from "./types.js";

// Consider a chain "caught up" when within these many blocks of the target block
const MINIMUM_BLOCKS_LEFT_BEFORE_STARTING = 500;

export const logChainEvents = async ({
  loggingTask,
  logger,
  inferNewSubscriptionsFromEvent,
}: Omit<Config, "loggingTasks"> & {
  loggingTask: LoggingTask;
  logger: Logger;
  inferNewSubscriptionsFromEvent: InferSubscriptionFromEvent;
}): Promise<void> => {
  const { chainId } = loggingTask;

  // TODO replace with in-memory implementation
  const chainsauceStorage = new JsonStorage(
    path.join(os.tmpdir(), `gs-log-tmp-${Date.now()}`, chainId.toString()),
  );

  const provider = new RetryProvider({
    url: loggingTask.rpcUrl,
    timeout: 5 * 60 * 1000,
  });

  const catchupSentinel = new InspectablePromise();

  const onEvent = async (
    indexer: Indexer<JsonStorage>,
    rawEvent: Event,
  ): Promise<void> => {
    const { name, blockNumber, logIndex, args, ...meta } = rawEvent;

    const event = {
      chainId,
      blockNumber,
      logIndex,
      data: { type: name, ...ethersEventArgsToSerializable(args) },
      ...meta,
    };

    const newSubscriptions = inferNewSubscriptionsFromEvent(event);

    process.stdout.write(JSON.stringify(event) + "\n");

    for (const sub of newSubscriptions) {
      indexer.subscribe(sub.address, sub.abi, rawEvent.blockNumber);
    }
  };

  const onProgress = ({
    currentBlock,
    lastBlock,
    pendingEventsCount,
  }: {
    currentBlock: number;
    lastBlock: number;
    pendingEventsCount: number;
  }): void => {
    if (
      lastBlock - currentBlock < MINIMUM_BLOCKS_LEFT_BEFORE_STARTING &&
      !catchupSentinel.isDone()
    ) {
      logger.info({
        msg: "caught up with blockchain events",
        lastBlock,
        currentBlock,
        pendingEventsCount,
      });

      if (loggingTask.endBlock !== "ongoing") {
        catchupSentinel.declareDone();
      }
    }
  };

  const eventListener = await createEventListener(
    provider,
    chainsauceStorage,
    onEvent,
    {
      toBlock:
        loggingTask.endBlock === "ongoing" || loggingTask.endBlock === "last"
          ? "latest"
          : loggingTask.endBlock,
      logger: logger,
      eventCacheDirectory: null,
      requireExplicitStart: true,
      onProgress,
    },
  );

  for (const subscription of loggingTask.subscriptions) {
    eventListener.subscribe(
      subscription.address,
      subscription.abi,
      loggingTask.startBlock,
    );
  }

  logger.info("catching up");

  eventListener.start();

  // This will never return (and it shouldn't) if config.endBlock === 'ongoing'
  await catchupSentinel.untilDone();

  eventListener.stop();
};
