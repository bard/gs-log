import yargs from "yargs/yargs";
import { z } from "zod";
import { ChainDefaults, Config, LoggingTask } from "./types.js";
import { parseLoggingTaskSpec } from "./util.js";

export const parseConfig = ({
  env,
  argv,
  chainDefaults,
}: {
  env: Record<string, string | undefined>;
  argv: string[];
  chainDefaults: ChainDefaults[];
}): Config => {
  const cliArgs = yargs(argv.slice(2))
    .options({
      chains: {
        type: "string",
        description:
          "Comma-separated chain ranges, example: '1:origin..last,10:0..1000'. Specify 'ongoing' as end block for continuous listening.",
      },
      resume: {
        type: "boolean",
        description:
          "Resume a previous logging session. Read logging state a previously saved log.",
      },
    })
    .strict(true)
    .conflicts("chains", "resume")
    .exitProcess(false)
    .parseSync();

  const buildTag = z
    .union([z.string(), z.null()])
    .default(null)
    .parse(env.BUILD_TAG);

  const deploymentEnvironment = z
    .union([
      z.literal(null),
      z.literal("local"),
      z.literal("development"),
      z.literal("staging"),
      z.literal("production"),
    ])
    .default(null)
    .parse(env.DEPLOYMENT_ENVIRONMENT);

  const logLevel = z
    .union([
      z.literal("trace"),
      z.literal("debug"),
      z.literal("info"),
      z.literal("warn"),
      z.literal("error"),
    ])
    .default("info")
    .parse(env.LOG_LEVEL);

  const resume = cliArgs.resume ?? false;

  const loggingTasks: LoggingTask[] = resume
    ? []
    : z
        .string()
        .parse(cliArgs.chains ?? env.CHAINS)
        .split(",")
        .map((spec) => {
          const { chainId, startBlock, endBlock } = parseLoggingTaskSpec(spec);

          const defaults = chainDefaults.find((c) => c.id === chainId);
          if (defaults === undefined) {
            throw new Error(`Chain ${chainId} not configured.`);
          }

          const { rpcUrl, seedSubscriptions } = defaults;

          return {
            chainId,
            startBlock,
            endBlock,
            rpcUrl: z
              .string()
              .url()
              .default(rpcUrl)
              .parse(env[`CHAIN_${chainId}_RPC_URL`]),
            subscriptions: seedSubscriptions.map((s) => ({
              ...s,
              earliestBlock:
                s.earliestBlock === undefined
                  ? startBlock
                  : Math.max(s.earliestBlock, startBlock),
            })),
          };
        });

  return {
    buildTag,
    loggingTasks,
    logLevel,
    deploymentEnvironment,
    resume,
  };
};
