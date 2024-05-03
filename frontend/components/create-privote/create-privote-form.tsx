"use client";
import { FC, useEffect, useState } from "react";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { RotateCw, Plus } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Form } from "@/components/ui/form";

import { formSchema } from "./schema";

import Step1 from "./step-1";
import Step2 from "./step-2";

import {
  useAccount,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { config } from "@/config";

const NUM_OF_STEPS = 2;

const CreatePrivoteForm = () => {
  const [step, setStep] = useState(1);
  const [open, setOpen] = useState(false);

  const { data: hash, isPending, writeContract } = useWriteContract();

  const {
    data,
    isLoading: isConfirming,
    isSuccess: isConfirmed,
  } = useWaitForTransactionReceipt({
    hash,
  });

  useEffect(() => {
    if (isConfirmed) {
      setOpen(false);
      router.refresh();
    }
  }, [isConfirmed, hash]);

  const { address } = useAccount();
  const { contract } = config;
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    // resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      choices: Array(config.privia.numOfChoices).fill({ value: "" }),
    },
    mode: "onChange",
  });

  // const validateStep = async () => {
  //   switch (step) {
  //     case 1:
  //       return await form.trigger([
  //         "title",
  //         "location",
  //         "description",
  //         "title",
  //       ]);
  //     case 2:
  //       return await form.trigger([
  //         "image",
  //         "amountOfTickets",
  //         "ticketPrice.currency",
  //         "ticketPrice.price",
  //       ]);
  //     case 3:
  //       return await form.trigger(["dateTime"]);
  //   }
  // };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { title, description, choices } = values;

    if (!address) {
      console.log("not connectd");
      return;
    }

    writeContract({
      abi: contract.abi,
      address: contract.address,
      functionName: "create",
      args: [title, description, choices.map((c) => c.value)],
    });
  }

  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        form.reset();
        setStep(1);
        setOpen((open) => !open);
      }}
    >
      <DialogTrigger asChild>
        <Button type="button">
          <span className="hidden md:block">Create privote</span>
          <span className="block md:hidden">Create</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] md:max-w-[600px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <DialogHeader>
              <DialogTitle>Create a new private ballot</DialogTitle>
              <DialogDescription>Basic Information</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 px-4 sm:h-[450px] overflow-y-auto ">
              {step === 1 && <Step1 form={form} />}
              {step === 2 && <Step2 form={form} />}
            </div>
            <DialogFooter>
              {step > 1 && (
                <Button
                  type="button"
                  className="flex-1"
                  variant="outline"
                  onClick={() => setStep((prev) => prev - 1)}
                >
                  Go back
                </Button>
              )}
              {step === NUM_OF_STEPS ? (
                <Button type="submit" className="flex-1" disabled={isPending}>
                  {isPending || isConfirming ? (
                    <RotateCw size={20} className="animate-spin" />
                  ) : (
                    <Plus size={20} />
                  )}
                  <span className="ml-1">Create new Privote</span>
                </Button>
              ) : (
                <Button
                  type="button"
                  className="flex-1"
                  onClick={async (e) => {
                    e.preventDefault();
                    // const isValid = await validateStep();
                    setStep((prev) => prev + 1);
                  }}
                >
                  Continue
                </Button>
              )}
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePrivoteForm;
