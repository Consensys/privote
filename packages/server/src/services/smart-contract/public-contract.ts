import {
  createPublicClient,
  createWalletClient,
  publicActions,
  getContract,
  http,
} from "viem";
import { hardhat } from "viem/chains";
import { config } from "../../config.ts";

const { address, abi } = config.contract;

export const client = createWalletClient({
  chain: hardhat,
  transport: http(),
}).extend(publicActions);

export const priviaPublicContract = getContract({
  address,
  client,
  abi,
});
