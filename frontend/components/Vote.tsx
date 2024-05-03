"use client";

import React, { useEffect } from "react";

import { Button } from "@/components/ui/button";

import {
  useAccount,
  useWriteContract,
  useSignMessage,
  useWatchContractEvent,
} from "wagmi";
import crypto from "crypto";

import { generateProof, verifyProof } from "@/app/actions/zkp";
import { config } from "@/config";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import ChoiceCard from "./choice-card";

interface Props {
  privia: Privia;
}

export default function Vote({ privia }: Props) {
  const [selectedOption, setselectedOption] = React.useState<number[]>([]);

  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

  const { address } = useAccount();

  const isOwner = address === privia.owner;

  console.log("-=---", isOwner)

  React.useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  const { writeContract } = useWriteContract();
  const { contract } = config;

  const verifyScore = async () => {
    const proof = await generateProof();
    const result = await verifyProof(proof);
    console.log("Result", result);
  };

 

  const isAdmin = false;

  const handleVote = async () => {
    const ecdh = crypto.createECDH("secp256k1");
    const publicKey = ecdh.generateKeys("hex");
    const sharedSecret = ecdh.computeSecret(privia.trustedPartyKey, "hex");

    const address = config.contract.address;

    if (!address) return;

    const cipher = crypto.createCipheriv(
      "aes-256-ctr",
      sharedSecret,
      Buffer.alloc(16, 0)
    );
    let encrypted = cipher.update(
      JSON.stringify(selectedOption),
      "utf8",
      "hex"
    );
    encrypted += cipher.final("hex");

    writeContract({
      abi: contract.abi,
      address,
      functionName: "answer",
      args: [BigInt(privia.id), publicKey, encrypted],
    });
  };

  // const handleRegister = async (priviaId: number, priviaPublicKey: string) => {
  //   // const message = "register";

  //   // const signature = await signMessageAsync({ account: address, message });

  //   // const isValid = await client.verifyMessage({
  //   //   address,
  //   //   message: "register",
  //   //   signature,
  //   // })

  //   const ecdh = crypto.createECDH("secp256k1");
  //   const publicKey = ecdh.generateKeys("hex");

  //   const sharedSecret = ecdh.computeSecret(priviaPublicKey, "hex");

  //   await updatePriviaVoters(priviaId, "0x111", sharedSecret);
  // };

  return (
    <div className="flex flex-col gap-4 w-full">
      <section className="my-12">
        <p className="mx-auto mt-3 font-semibold text-center max-w-xl text-3xl  text-opacity-70 text-gray-300">
          {privia.title}
        </p>
      </section>
      <Carousel setApi={setApi} className="w-full ">
        <CarouselContent>
          {privia.questions.map(({ title, choices }, index) => (
            <CarouselItem key={index}>
              <Card className="border-opacity-10">
                <CardHeader>
                  {" "}
                  <CardTitle>{title}</CardTitle>{" "}
                </CardHeader>
                <CardContent className="flex h-[450px] w-full items-center justify-center p-6">
                  <div className="flex flex-col flex-1 p-8 gap-4">
                    {choices.map((choice: string, index) => (
                      <button
                        key={choice}
                        className="w-full"

                        onClick={() => setselectedOption([index])}
                      >
                        <ChoiceCard
                          name={choice}
                          isSelected={index === selectedOption[0]}
                        />
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
      <div className="py-2 text-center text-sm text-muted-foreground">
        Slide {current} of {count}
      </div>

      <div className="flex self-end gap-4">
        <Button className="w-fit" onClick={() => handleVote()}>
          Vote
        </Button>
      </div>
    </div>
  );
}
