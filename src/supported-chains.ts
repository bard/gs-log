import * as abis from "./abis/index.js";
import { ChainDefaults } from "./types.js";

const CHAIN_DEFAULTS: Record<number, ChainDefaults> = {
  1: {
    id: 1,
    rpcUrl: "https://mainnet.infura.io/v3/",
    seedSubscriptions: [
      {
        address: "0x03506eD3f57892C85DB20C36846e9c808aFe9ef4",
        abi: abis.v2.ProjectRegistry,
        earliestBlock: 0,
      },
      {
        address: "0x9Cb7f434aD3250d1656854A9eC7A71EceC6eE1EF",
        abi: abis.v2.RoundFactory,
        earliestBlock: 16994474,
      },
      {
        address: "0x4a850F463D1C4842937c5Bc9540dBc803D744c9F",
        abi: abis.v2.QuadraticFundingVotingStrategyFactory,
        earliestBlock: 16994526,
      },
    ],
  },
  10: {
    id: 10,
    rpcUrl: "https://mainnet.optimism.io",
    seedSubscriptions: [
      {
        address: "0x8e1bD5Da87C14dd8e08F7ecc2aBf9D1d558ea174",
        abi: abis.v2.ProjectRegistry,
        earliestBlock: 0,
      },
      {
        address: "0x04E753cFB8c8D1D7f776f7d7A033740961b6AEC2",
        abi: abis.v2.RoundFactory,
        earliestBlock: 87169287,
      },
      {
        address: "0x838C5e10dcc1e54d62761d994722367BA167AC22",
        abi: abis.v2.QuadraticFundingVotingStrategyFactory,
        earliestBlock: 87168143,
      },
    ],
  },
  250: {
    id: 250,
    rpcUrl: "https://rpcapi.fantom.network",
    seedSubscriptions: [
      {
        address: "0x8e1bD5Da87C14dd8e08F7ecc2aBf9D1d558ea174",
        abi: abis.v2.ProjectRegistry,
        earliestBlock: 0,
      },
      {
        address: "0xfb08d1fD3a7c693677eB096E722ABf4Ae63B0B95",
        abi: abis.v2.RoundFactory,
        earliestBlock: 66509340,
      },
      {
        address: "0x534d2AAc03dCd0Cb3905B591BAf04C14A95426AB",
        abi: abis.v2.QuadraticFundingVotingStrategyFactory,
        earliestBlock: 66509340,
      },
    ],
  },
  58008: {
    id: 58008,
    rpcUrl: "https://sepolia.publicgoods.network",
    seedSubscriptions: [
      {
        address: "0x6294bed5B884Ae18bf737793Ef9415069Bf4bc11",
        abi: abis.v2.ProjectRegistry,
        earliestBlock: 0,
      },
      {
        address: "0x0479b9DA9f287539FEBd597350B1eBaEBF7479ac",
        abi: abis.v2.RoundFactory,
        earliestBlock: 0,
      },
      {
        address: "0xE8027a807Bb85e57da4B7A5ecE65b0aBDf231ce8",
        abi: abis.v2.QuadraticFundingVotingStrategyFactory,
        earliestBlock: 0,
      },
    ],
  },
  424: {
    id: 424,
    rpcUrl: "https://rpc.publicgoods.network",
    seedSubscriptions: [
      {
        address: "0xDF9BF58Aa1A1B73F0e214d79C652a7dd37a6074e",
        abi: abis.v2.ProjectRegistry,
        earliestBlock: 0,
      },
      {
        address: "0x8AdFcF226dfb2fA73788Ad711C958Ba251369cb3",
        abi: abis.v2.RoundFactory,
        earliestBlock: 0,
      },
      {
        address: "0x2AFA4bE0f2468347A2F086c2167630fb1E58b725",
        abi: abis.v2.QuadraticFundingVotingStrategyFactory,
        earliestBlock: 0,
      },
    ],
  },
  42161: {
    id: 42161,
    rpcUrl: "https://arb-mainnet.g.alchemy.com/v2/",
    seedSubscriptions: [
      {
        address: "0x73AB205af1476Dc22104A6B8b3d4c273B58C6E27",
        abi: abis.v2.ProjectRegistry,
        earliestBlock: 0,
      },
      {
        address: "0xF2a07728107B04266015E67b1468cA0a536956C8",
        abi: abis.v2.RoundFactory,
        earliestBlock: 0,
      },
      {
        address: "0xC3A195EEa198e74D67671732E1B8F8A23781D735",
        abi: abis.v2.QuadraticFundingVotingStrategyFactory,
        earliestBlock: 0,
      },
    ],
  },
  421613: {
    id: 421613,
    rpcUrl: "https://arb-goerli.g.alchemy.com/v2/",
    seedSubscriptions: [
      {
        address: "0x0CD135777dEaB6D0Bb150bDB0592aC9Baa4d0871",
        abi: abis.v2.ProjectRegistry,
        earliestBlock: 0,
      },
      {
        address: "0xdf25423c9ec15347197Aa5D3a41c2ebE27587D59",
        abi: abis.v2.RoundFactory,
        earliestBlock: 0,
      },
      {
        address: "0x0BFA0AAF5f2D81f859e85C8E82A3fc5b624fc6E8",
        abi: abis.v2.QuadraticFundingVotingStrategyFactory,
        earliestBlock: 0,
      },
    ],
  },
  80001: {
    id: 80001,
    rpcUrl: "https://rpc-mumbai.maticvigil.com/",
    seedSubscriptions: [
      {
        address: "0x545B282A50EaeA01A619914d44105437036CbB36",
        abi: abis.v2.ProjectRegistry,
        earliestBlock: 0,
      },
      {
        address: "0xE1c5812e9831bc1d5BDcF50AAEc1a47C4508F3fA",
        abi: abis.v2.RoundFactory,
        earliestBlock: 0,
      },
      {
        address: "0xF7c101A95Ea4cBD5DA0Ab9827D7B2C9857440143",
        abi: abis.v2.QuadraticFundingVotingStrategyFactory,
        earliestBlock: 0,
      },
    ],
  },
  137: {
    id: 137,
    rpcUrl: "https://polygon-rpc.com",
    seedSubscriptions: [
      {
        address: "0x5C5E2D94b107C7691B08E43169fDe76EAAB6D48b",
        abi: abis.v2.ProjectRegistry,
        earliestBlock: 0,
      },
      {
        address: "0x5ab68dCdcA37A1C2b09c5218e28eB0d9cc3FEb03",
        abi: abis.v2.RoundFactory,
        earliestBlock: 0,
      },
      {
        address: "0xc1a26b0789C3E93b07713e90596Cad8d0442C826",
        abi: abis.v2.QuadraticFundingVotingStrategyFactory,
        earliestBlock: 0,
      },
    ],
  },
  43114: {
    id: 43114,
    rpcUrl: "https://avalanche-c-chain.publicnode.com",
    seedSubscriptions: [
      {
        address: "0xDF9BF58Aa1A1B73F0e214d79C652a7dd37a6074e",
        abi: abis.v2.ProjectRegistry,
        earliestBlock: 0,
      },
      {
        address: "0x8eC471f30cA797FD52F9D37A47Be2517a7BD6912",
        abi: abis.v2.RoundFactory,
        earliestBlock: 0,
      },
      {
        address: "0x2AFA4bE0f2468347A2F086c2167630fb1E58b725",
        abi: abis.v2.QuadraticFundingVotingStrategyFactory,
        earliestBlock: 0,
      },
    ],
  },
  43113: {
    id: 43113,
    rpcUrl: "https://avalanche-fuji-c-chain.publicnode.com",
    seedSubscriptions: [
      {
        address: "0xDF9BF58Aa1A1B73F0e214d79C652a7dd37a6074e",
        abi: abis.v2.ProjectRegistry,
        earliestBlock: 0,
      },
      {
        address: "0x8eC471f30cA797FD52F9D37A47Be2517a7BD6912",
        abi: abis.v2.RoundFactory,
        earliestBlock: 0,
      },
      {
        address: "0x2AFA4bE0f2468347A2F086c2167630fb1E58b725",
        abi: abis.v2.QuadraticFundingVotingStrategyFactory,
        earliestBlock: 0,
      },
    ],
  },
};

export const getChainDefaults = (chainId: number): ChainDefaults => {
  const chainDefaults = CHAIN_DEFAULTS[chainId];
  if (chainDefaults === undefined) {
    throw new Error(`Chain ${chainId} is not supported.`);
  }
  return chainDefaults;
};
