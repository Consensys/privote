//@ts-nocheck
import crypto from "crypto";
import { priviaPublicContract } from "./smart-contract/public-contract.ts";
import { encryptData, generateKeyPair, decryptData } from "./crypto.ts";
import { config } from "../config.ts";
import { generateProof } from "./zkp/zokrates.ts";
import { unpackPoint } from "@zk-kit/baby-jubjub";
import { callPublishResults, getResultsfromContract } from "./smart-contract/contract.ts";

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

export const getAllPrivote = async () => {
  return await priviaPublicContract.read.getAllPrivote();
};

export const getPrivoteById = async (id: number) => {
  return await priviaPublicContract.read.getPrivia([BigInt(id)]);
};

export const getVotesByPrivia = async (id: number) => {
  return await priviaPublicContract.read.getVotesByPrivote([BigInt(id)]);
};

export const encryptVote = async (vote: string) => {
  const { publicKey: trustedPartypublicKey } = config;
  const { privateKey, publicKey } = generateKeyPair();
  const encryptedVote = await encryptData(
    vote,
    privateKey,
    publicKey,
    BigInt(trustedPartypublicKey)
  );

  return {
    encryptedVote,
    publicKey: publicKey.toString(),
  };
};

export const decryptVote = (encryptedVote: string, voterPublicKey: string) => {
  const { privateKey } = config;
  const decryptedVote = decryptData(
    encryptedVote,
    BigInt(privateKey),
    BigInt(voterPublicKey)
  );

  return decryptedVote;
};

const calculateResult = (votes: string[]) => {
  const voteCounts: Record<string, number> = {};

  for (const vote of votes) {
    if (voteCounts[vote]) {
      voteCounts[vote]++;
    } else {
      voteCounts[vote] = 1;
    }
  }

  const results = [];
  for (const choice in voteCounts) {
    results.push({ choice, votes: voteCounts[choice] });
  }

  return results;
};

export const publishResults = async (id: number) => {
  const votes = await getVotesByPrivia(id);

  const decryptedVotes = votes.map((vote) => {
    const { encryptedVote, voter } = vote;
    return decryptVote(encryptedVote, voter);
  });

  const results = calculateResult(decryptedVotes);

  console.log(decryptedVotes, results);
  const { contract, privateKey, publicKey } = config;
  const unpacked = unpackPoint(BigInt(publicKey));

  if (!unpacked) {
    throw new Error("Invalid key");
  }

  const proof = await generateProof(privateKey, [
    unpacked[0].toString(),
    unpacked[1].toString(),
  ] as string[]);

   callPublishResults(proof, BigInt(id), results)
};

export const getResults = async (id: number) => {
  return await getResultsfromContract(id);
}
// export const calculateResult = async (
//   answers: Answers,
//   correctAnswers: number[]
// ) => {
//   const coordinatorPrivateKey = process.env.COORDINATOR_PRIVATE_KEY;

//   if (!coordinatorPrivateKey) {
//     throw new Error("No coordinator private key provided");
//   }

//   const trustedEcdh = crypto.createECDH("secp256k1");
//   trustedEcdh.setPrivateKey(coordinatorPrivateKey, "hex");

//   const result: Result[] = [];

//   answers.forEach(({ player, encryptedAnswer }) => {
//     const trustedSharedSecret = trustedEcdh.computeSecret(player, "hex");

//     const decrpted = crypto.createDecipheriv(
//       "aes-256-ctr",
//       trustedSharedSecret,
//       Buffer.alloc(16, 0)
//     );

//     let decrypted = decrpted.update(encryptedAnswer, "hex", "utf8");

//     decrypted += decrpted.final("utf8");

//     const playerAnswers: number[] = JSON.parse(decrypted);

//     let score = 0n;

//     playerAnswers.forEach((answer, index) => {
//       if (answer === correctAnswers[index]) {
//         score++;
//       }
//     });

//     result.push({ player, score });
//   });

//   return result;
// };
