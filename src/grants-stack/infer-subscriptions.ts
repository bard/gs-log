import { InferSubscriptionFromEvent } from "../types.js";
import * as abis from "./abis/index.js";

export const inferNewSubscriptionsFromEvent: InferSubscriptionFromEvent = (
  event,
) => {
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
