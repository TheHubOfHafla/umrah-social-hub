
import { eventCategories } from "../constants";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { categoryFormSchema } from "../hooks/useFormSteps";

interface CategorySelectProps {
  form: UseFormReturn<z.infer<typeof categoryFormSchema>>;
  onSubmit: (values: z.infer<typeof categoryFormSchema>) => void;
}

const CategorySelect = ({ form, onSubmit }: CategorySelectProps) => {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem className="space-y-4">
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                {eventCategories.map((category) => (
                  <div key={category.id}>
                    <RadioGroupItem
                      value={category.id}
                      id={category.id}
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor={category.id}
                      className="flex items-center space-x-3 rounded-lg border-2 border-purple-100 p-4 cursor-pointer transition-all hover:bg-purple-50 peer-data-[state=checked]:border-purple-600 peer-data-[state=checked]:bg-purple-50"
                    >
                      <span className="text-2xl">{category.icon}</span>
                      <div className="font-medium">{category.name}</div>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-purple-600 to-purple-400 hover:from-purple-700 hover:to-purple-500 text-white transition-all duration-300 hover:scale-[1.02] font-medium"
        >
          Continue <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </form>
    </Form>
  );
};

export default CategorySelect;
