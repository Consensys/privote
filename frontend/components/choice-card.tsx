import React from "react";
import { cn } from "@/lib/utils";

interface ChoiceCardProps {
  name: string;
  isSelected?: boolean;
  to?: string;
  votes?: number;
}

const ChoiceCard: React.FC<ChoiceCardProps> = ({ name, isSelected }) => {
  return (
    <div
      className={cn(
        "flex cursor-pointer w-full overflow-hidden gap-6 min-h-[52px] px-8 py-6 border-2 border-gray-600 rounded-xl  hover:shadow-lg  duration-150",
        isSelected && " border-white border-[2px] bg-slate-400 "
      )}
    >
      <h3
        className={cn(
          "text-gray-200 block text-xl leading-8 font-bold tracking-tight md:text-3xl",
          isSelected ? "text-white" : "text-gray-200"
        )}
      >
        {name}
      </h3>
    </div>
  );
};

export default ChoiceCard;
