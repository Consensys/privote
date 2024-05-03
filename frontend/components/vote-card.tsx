import React from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface CardProps {
  name: string;
  description: string;
  to: string;
}

const VoteCard: React.FC<CardProps> = ({ name, description, to }) => {
  return (
    <Link
      className="flex flex-col cursor-pointer overflow-hidden gap-6 bg-primary text-primary-foreground min-h-[118px] px-8 py-6 items-center justify-center md:max-w-md rounded-xl  hover:shadow-lg hover:scale-105 duration-150"
      href={to}
    >
      <h3 className="block text-xl leading-8 font-bold tracking-tight md:text-3xl">
        {name}
      </h3>
      {description && (
        <h5 className="block text-secondary text-sm md:text-lg">
          {description}
        </h5>
      )}
    </Link>
  );
};

export default VoteCard;
