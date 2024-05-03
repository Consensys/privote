"use server";

import {
  CompilationArtifacts,
  Proof,
  ZoKratesProvider,
  initialize,
} from "zokrates-js";
import { readFile } from "fs/promises";

const serializeArtifacts = (artifacts: CompilationArtifacts): string => {
  const serializedArtifacts = {
    ...artifacts,
    program: Array.from(artifacts.program),
    snarkjs: artifacts.snarkjs
      ? { program: Array.from(artifacts.snarkjs.program) }
      : undefined,
  };

  return JSON.stringify(serializedArtifacts);
};

const deserializeArtifacts = (
  serializedArtifacts: string
): CompilationArtifacts => {
  const parsedArtifacts = JSON.parse(serializedArtifacts);

  return {
    ...parsedArtifacts,
    program: new Uint8Array(parsedArtifacts.program),
    snarkjs: parsedArtifacts.snarkjs
      ? { program: new Uint8Array(parsedArtifacts.snarkjs.program) }
      : undefined,
  };
};

export const setupZk = async () => {
  initialize().then((provider: ZoKratesProvider) => {
    const zokCode = `
       def main(u32[4] correctAnswers, u32[4] answers ) -> u32 {
       u32 mut score = 0;
       for u32 i in 0..4 {
           score = correctAnswers[i] == answers[i] ? score + 1 : score;
       }
       return score;
       }
  
    `;

    const artifacts = provider.compile(zokCode);
    const keyPair = provider.setup(artifacts.program);
  //  saveArtifacts(serializeArtifacts(artifacts));
  });
};

interface ComputeWitnessArgs {
  root: string;
  choice: string;
  voteCount: string;
  directionSelector: string[];
  path: string[];
}

export const generateProof = async () => {
  const program = (await readFile("zk-privia/out")).toString("hex");
  const abi = (await readFile("zk/abi.json")).toString();
  const provingKey = (await readFile("zk-privia/proving.key")).toString("hex");

  const provider = await initialize();

  const { witness, output} = provider.computeWitness(
    Uint8Array.from(Buffer.from(program, "hex")),
    [...["1", "2", "3", "4"].flat(), ...["5", "2", "8", "1"].flat()]
  );

  const proof = provider.generateProof(
    Uint8Array.from(Buffer.from(program, "hex")),
    witness,
    Uint8Array.from(Buffer.from(provingKey, "hex"))
  );

  console.log(" OUTPUt", output)
  return proof;
};

export const verifyProof = async (proof: Proof) => {
  console.log("verifying........", proof);
  const verificationKey = JSON.parse(
    (await readFile("zk-privia/verification.key")).toString()
  );

  const provider = await initialize();

   return provider.verify(verificationKey, proof);
 
};

// export const generateVoterProof = async ({
//   root,
//   choice,
//   directionSelector,
//   path,
// }: ComputeWitnessArgs) => {
//   const program = (await readFile("zk-voter/voter")).toString("hex");
//   const abi = (await readFile("zk-voter/abi.json")).toString();
//   const provingKey = (await readFile("zk-voter/proving.key")).toString("hex");

//   const zokrates = await getZokrates();

//   const output = zokrates.computeWitness(
//     Uint8Array.from(Buffer.from(program, "hex")),
//     [
//       ...formatHash(root).flat(),
//       ...formatHash(choice).flat(),
//       ...directionSelector.flat(),
//       ...path.map((p) => formatHash(p)).flat(),
//     ]
//   );

//   const zokratesProof = zokrates.generateProof(
//     Uint8Array.from(Buffer.from(program, "hex")),
//     output.witness,
//     Uint8Array.from(Buffer.from(provingKey, "hex"))
//   );
//   return zokratesProof;
// };

// export const verifyVoterProof = async (proof: Proof) => {
//   console.log("verifying........", proof);
//   const verificationKey = JSON.parse(
//     (await readFile("zk-voter/verification.key")).toString()
//   );
//   const zokrates = await getZokrates();

//   return zokrates.verify(verificationKey, proof);
// };
