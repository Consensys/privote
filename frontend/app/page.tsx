import React from "react";
import Hero from "@/components/hero";
import VoteCard from "@/components/vote-card";
import { getAllPrivotes } from "./actions/privia";

export const revalidate = 0;

export default async function Page() {
  const privotes = await getAllPrivotes(); 

  return (
    <div className="flex flex-col gap-4 w-full">
      <Hero />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
        {privotes?.map(({ id, title, description }) => {
          return (
            <VoteCard
              key={id}
              to={`vote/${id}`}
              name={title}
              description={description}
            />
          );
        })}
      </div>
    </div>
  );
}
