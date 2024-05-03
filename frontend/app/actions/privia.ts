"use server";

import { priviaPublicContract } from "@/lib/privia-contract";
import crypto from "crypto";

const privateKey =
  "b34b15916cbdd444ca7ada07f0aa13f0c56a1aaf35e4463a2e59bda821abea24";

// export const createPrivia = async (
//   input: CreatePriviaInput,
//   numOfVoters: number,
//   account: `0x${string}`
// ) => {
//   const { title, description, options, voters } = input;

//   const ecdh = crypto.createECDH("secp256k1");
//   const publicKey = ecdh.generateKeys("hex");
//   const privateKey = ecdh.getPrivateKey("hex");

//   const tx = await priviaContract.write.create(
//     [
//       title,
//       description,
//       [
//         {
//           title: "Question 1",
//           choices: ["answer 1", "answer 2"],
//           correctChoice: 1n,
//         },
//       ],
//       publicKey,
//     ],
//     { account }
//   );
// };

export const getAllPrivotes = async () => {
  return (await priviaPublicContract.read.getPrivotes()) as unknown as Privote[];
};

export const getPrivoteById = async (id: number) => {

  

  return (await priviaPublicContract.read.getPrivote([BigInt(id)]) as unknown as Privote);
};

export const getResultsByPrivote = async (id: string) => {
  return await priviaPublicContract.read.getResultsByPrivote([BigInt(id)]);
};

export const getVotesByPrivote = async (id: string) => {
  return await priviaPublicContract.read.getVotesByPrivote([BigInt(id)]);
};
