'use server';

import { MerkleTree } from "merkletreejs";
import SHA256 from "crypto-js/sha256";
import { JSONFilePreset } from "lowdb/node";

interface Vote {
  id: string;
  optionId: string;
}

 const optionsLeaves: Vote[] = [
  {
    id: "1",
    name: "web3.js",
    votes: 0,
  },
  {
    id: "2",
    name: "ethers.js",
    votes: 0,
  },
  {
    id: "3",
    name: "hardhat",
    votes: 0,
  },
  {
    id: "4",
    name: "truffle",
    votes: 0,
  },
];

const votes = [
  {
    id: "1",
    title: "Which web3 library do you prefer for Ethereum development?",
    options: optionsLeaves,
  },
];

export const getDb = async () => {
  return await JSONFilePreset("db.json", votes);
};

export const getVotes = async () => {
  const db = await getDb();
  return db.data;
}

const optionsTree = new MerkleTree(
  optionsLeaves.map((data) => SHA256(data.name + data.votes).toString()),
  SHA256
);

export const createNewTree = async (voterId: string, option: string) => {
  const optionLeaf = optionsLeaves.find((o) => o.name === option);

  if (!optionLeaf) {
    throw new Error("Invalid option");
  }

  const optionHash = SHA256(
    optionLeaf.name + (optionLeaf.votes + 1)
  ).toString();

  //replace the option with the new vote count
  const newOptionsLeaves = optionsLeaves.map((data) => {
    if (data.name === option) {
      return optionHash;
    }
    return SHA256(data.name + data.votes).toString();
  });

  const newVotesTree = new MerkleTree(newOptionsLeaves, SHA256);

  return { newVotesTree, optionHash };
};
