"use server";

import { priviaPublicContract } from "@/lib/privia-contract";


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
