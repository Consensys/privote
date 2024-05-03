import React from "react";
import { UseFormReturn, useFieldArray } from "react-hook-form";
import { z } from "zod";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { formSchema } from "./schema";

interface Step2Props {
  form: UseFormReturn<z.infer<typeof formSchema>>;
}

const Step2: React.FC<Step2Props> = ({ form }) => {
  const { fields: choices } = useFieldArray({
    control: form.control,
    name: "choices",
  });

  return (
    <div className="space-y-4">
      {choices.map((choice, index) => (
        <FormField
          key={index}
          control={form.control}
          name={`choices.${index}.value`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Choice {index + 1}</FormLabel>
              <FormControl>
                <Input placeholder="Add a choice here" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      ))}
      <Separator className="my-4" />
    </div>
  );
};

export default Step2;
