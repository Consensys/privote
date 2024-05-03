import { Description } from "@radix-ui/react-toast";
import { enc } from "crypto-js";
import { z } from "zod";
import { config } from "@/config";

const {
  privia: { numOfChoices, numOfQuestionsPerPrivia },
} = config;

export const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  choices: z.array(
    z.object({ value: z.string().min(1, "Choice is required") })
  ),
});
