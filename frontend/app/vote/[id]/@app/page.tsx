import React from "react";
import { notFound } from "next/navigation";
import { getPrivoteById, getResultsByPrivote } from "@/app/actions/privia";
import PrivotePlayer from "@/components/privote-player";
import { getPrivote } from "@/app/actions/vote";

export const revalidate = 0;

interface Props {
  params: {
    id: string;
  };
}

export default async function Page({ params: { id } }: Props) {
  const privote = await getPrivote(id);

  if (!privote) {
    return notFound();
  }

  let results;

  if (privote.isClosed) {
    results = await getResultsByPrivote(id);
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      <PrivotePlayer privote={privote} results={results} />
    </div>
  );
}
