import { publicClient } from "./public-client.ts";
import { config } from "../../config.ts";
import { decryptData } from "../crypto.ts";
import { WatchContractEventReturnType } from "viem";
import { generateProof } from "../zkp/zokrates.ts";
import {
  packPoint,
  unpackPoint,
  mulPointEscalar,
  Point,
  addPoint,
} from "@zk-kit/baby-jubjub";
import { walletClient } from "./wallet-client.ts";
import { Proof } from "zokrates-js";

const { contract, privateKey, publicKey } = config;

export const contractListner = () => {
  let unwatch: WatchContractEventReturnType | undefined;

  const subscribe = () => {
    unwatch = publicClient.watchContractEvent({
      address: contract.address,
      abi: contract.abi,
      eventName: "ResultsPublished",
      onLogs: async (logs): Promise<void> => {
        // console.log("new Answeer", logs);

        console.log("logs", logs);

        console.log(logs[0].args.results);

        // const encryptedAnswer = logs[0].args.answers;
        // const playerPublicKey = logs[0].args.playerPublicKey;
        // if (!encryptedAnswer || !playerPublicKey) {
        //   return;
        // }

        // const encryptedData = await decryptData(
        //   encryptedAnswer,
        //   BigInt(privateKey),
        //   BigInt(playerPublicKey)
        // );

        // const unpacked = unpackPoint(BigInt(publicKey));

        // if (!unpacked) {
        //   throw new Error("Invalid key");
        // }

        // const proof = await generateProof(privateKey, [unpacked[0].toString(), unpacked[1].toString()] as string[]);

        // priviaPublicContract.write.publishResults()
        // console.log("----", proof)
        // console.log("Encrypted Data from listner", encryptedData);
      },
    });
  };

  const unsubscribe = () => {
    if (unwatch) {
      unwatch();
    }
  };

  return {
    subscribe,
    unsubscribe,
  };
};

export const getPrivote = async (id: number) => {
  const privote = await publicClient.readContract({
    address: contract.address,
    abi: contract.abi,
    functionName: "getPrivote",
    args: [BigInt(id)],
  });
  const isClosed = await publicClient.readContract({
    address: contract.address,
    abi: contract.abi,
    functionName: "isClosed",
    args: [BigInt(id)],
  });

  return {
    ...privote,
    id: privote.id.toString(),
    isClosed,
  };
};

export const callPublishResults = async (
  proofData: any[],
  id: number,
  result: any[]
) => {
  walletClient.writeContract({
    address: contract.address,
    abi: contract.abi,
    functionName: "publishResults",
    //@ts-ignore
    args: [...proofData, id, result],
    account: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
  });
};

export const getResultsfromContract = async (id: number) => {
  return await publicClient.readContract({
    address: contract.address,
    abi: contract.abi,
    functionName: "getResultsByPrivote",
    args: [BigInt(id)],
  });
};
