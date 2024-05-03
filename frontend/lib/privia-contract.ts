import { createWalletClient, createPublicClient, getContract, publicActions, http } from "viem";
import { hardhat } from "viem/chains";
import { config } from "@/config";

const { address, abi } = config.contract;

const client = createPublicClient({
  chain: hardhat,
  transport: http(),
});

export const priviaPublicContract = getContract({
  address,
  client,
  abi,
});
