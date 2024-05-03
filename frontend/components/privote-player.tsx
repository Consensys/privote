"use client";

import React from "react";

import { Button } from "@/components/ui/button";

import {
  useWriteContract,
  useReadContract,
  useWaitForTransactionReceipt,
} from "wagmi";

import { generateProof, verifyProof } from "@/app/actions/zkp";
import { config } from "@/config";
import { encryptVote } from "@/app/actions/vote";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import ChoiceCard from "./choice-card";
import { encryptData, generateEcdhKeyPair } from "@/app/actions/ecdh";
import { Chip } from "./ui/chip";

interface Props {
  privote: Privote;
  results: any;
}

export default function PrivotePlayer({ privote, results }: Props) {
  const [selectedChoice, setselectedChoice] = React.useState<number | null>(
    null
  );
  console.log("===", results, privote);

  const { title, choices } = privote;

  const { data: hash, isPending, writeContract } = useWriteContract();
  const {
    data,
    isLoading: isConfirming,
    isSuccess: isConfirmed,
  } = useWaitForTransactionReceipt({
    hash,
  });

  const { contract } = config;

  const handleAnswer = async () => {
    if (selectedChoice === null) return;
    const { publicKey, encryptedVote } = await encryptVote(
      selectedChoice.toString()
    );

    writeContract({
      abi: contract.abi,
      address: contract.address,
      functionName: "submitVote",
      args: [BigInt(privote.id), publicKey, encryptedVote],
    });
  };

  return (
    <div className="flex flex-col  gap-2 w-full items-center">
      <section className="my-8 mt-16">
        <div className="flex gap-2 items-center">
          <p className="mx-auto mt-3 font-semibold text-center max-w-xl text-3xl  text-opacity-70 text-gray-300">
            {privote.title}
          </p>
          {privote.isClosed ? (
            <Chip variant="danger">Closed</Chip>
          ) : (
            <Chip variant="success">Open</Chip>
          )}
        </div>
        <p className="mx-auto mt-3 font-semibold text-center max-w-xl text-xl text-gray-300">
          {privote.description}
        </p>
      </section>

      <Card className="border-opacity-10 w-full sm:max-w-[425px] md:max-w-[600px]">
        <CardContent className="flex h-[450px] w-full items-center justify-center p-6">
          <div className="flex flex-col flex-1 p-8 gap-4">
            {privote.isClosed && results?.length > 0
              ? results
                  .sort((a, b) => b.votes - a.votes)
                  .map((result, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-4 rounded-md border p-4"
                    >
                      <div className="flex-1 flex items-center justify-between space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {privote.choices[result.choice]}
                        </p>
                        <Chip variant={index === 0 ? "success" : "warning"}>
                          {result.votes} vote
                          {parseInt(result.votes) > 1 ? "s" : ""}
                        </Chip>
                      </div>
                    </div>
                  ))
              : privote.choices.map((choice, index) => (
                  <button
                    key={index}
                    className="w-full"
                    onClick={() => setselectedChoice(index)}
                  >
                    <ChoiceCard
                      name={choice}
                      isSelected={index === selectedChoice}
                    />
                  </button>
                ))}
          </div>
        </CardContent>
        {selectedChoice != null ? (
          <div className="m-2">
            <Button
              disabled={isConfirming || isPending}
              className="w-full text-2xl"
              onClick={handleAnswer}
            >
              Vote
            </Button>
          </div>
        ) : null}
      </Card>
    </div>
  );
}
