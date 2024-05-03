import React from "react";
import Vote from "@/components/Vote";
import { notFound } from "next/navigation";
import { getBallotById } from "@/app/actions/ballot";
import TreeViewer from "@/components/tree-viewer";

export const revalidate = 0;

interface Props {
  params: {
    id: string;
  };
}
export default async function Page({ params: { id } }: Props) {

  return (
    <div className="flex flex-col gap-4 w-full">
       <TreeViewer ballotId={id} />
    </div>
  );
}
