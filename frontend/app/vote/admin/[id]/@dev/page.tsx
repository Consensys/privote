import React from "react";
import TreeViewer from "@/components/tree-viewer";


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
