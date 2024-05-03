"use server";

import { MerkleTree } from "merkletreejs";
import SHA256 from "crypto-js/sha256";
import { JSONFile,  JSONFilePreset } from "lowdb/node";
import { Low } from "lowdb/lib";



const defaultData: Vote[] = [
  {
    "id": "1",
    "title": "Which web3 library do you prefer for Ethereum development?",
    "options": [
      {
        "id": "1",
        "name": "web3.js",
        "votes": 1
      },
      {
        "id": "2",
        "name": "ethers.js",
        "votes": 3
      },
      {
        "id": "3",
        "name": "hardhat",
        "votes": 2
      },
      {
        "id": "4",
        "name": "truffle",
        "votes": 0
      }
    ],
    "voters": [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null
    ]
  }
]

export const getDb = async () => {
  
  return await JSONFilePreset("db.json", defaultData);
}

export const getData = async () => {
  const db =  await getDb();
  return db.data;
};


export const createNewTree = async (voterId: string, option: string) => {

  const data = await getData();

  if(!data) {
    throw new Error("Data not found");
  }

  const optionsLeaves = data[0].options;

  const optionLeaf = optionsLeaves.find((o) => o.name === option);

  if (!optionLeaf) {
    return;
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

export const createNewVoter = async (address: string) => {
  const newLeaf = { address, isVoted: false };

  const data = await getData();

  if(!data) {
      return;
  }


  const newVotersLeaves = [...data[0].voters];

  console.log("newVotersLeaves", newVotersLeaves);
  for (let i = 0; i < newVotersLeaves.length; i++) {
    if (!newVotersLeaves[i]) {
      newVotersLeaves[i] = newLeaf;
      break;
    }
  }

  const voterHash = SHA256(address + false).toString();

  const hashedLeaves = newVotersLeaves.map((leaf) =>
    leaf
      ? SHA256(leaf.address + leaf.isVoted).toString()
      : SHA256("").toString()
  );

  const newTree = new MerkleTree(hashedLeaves, SHA256);

  return { newTree, voterHash };
};
