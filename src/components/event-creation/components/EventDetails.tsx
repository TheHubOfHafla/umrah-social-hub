
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { AlertTriangle, Sparkles } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { detailsFormSchema, getWordCount } from "../hooks/useFormSteps";
import { getSelectedCategoryInfo } from "../utils";

interface EventDetailsProps {
  form: UseFormReturn<z.infer<typeof detailsFormSchema>>;
  onSubmit: (values: z.infer<typeof detailsFormSchema>) => void;
  onBack: () => void;
  selectedCategory: string;
  setEventDetails: (details: string) => void;
  eventDetails: string;
}

const EventDetails = ({ 
  form, 
  onSubmit, 
  onBack, 
  selectedCategory, 
  setEventDetails, 
  eventDetails 
}: EventDetailsProps) => {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="details"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-medium">Event Details</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={`Describe your ${getSelectedCategoryInfo(selectedCategory)?.name} in detail. Include information like the purpose, target audience, expected size, special features, etc.`}
                  className="min-h-[150px] resize-y text-base"
                  {...field}
                  onChange={(e) => {
                    field.onChange(e);
                    setEventDetails(e.target.value);
                  }}
                />
              </FormControl>
              <div className="flex justify-between mt-2 text-sm">
                <FormMessage />
                <div className={cn(
                  "text-right",
                  getWordCount(field.value) < 75 ? "text-amber-600" : "text-green-600"
                )}>
                  {getWordCount(field.value)} / 75 words
                </div>
              </div>
            </FormItem>
          )}
        />
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-start">
            <AlertTriangle className="text-amber-500 mr-3 mt-0.5 h-5 w-5 flex-shrink-0" />
            <div className="text-sm text-amber-800">
              <p className="font-medium">Helpful tips:</p>
              <ul className="mt-1 list-disc list-inside space-y-1">
                <li>Include the location and date if possible</li>
                <li>Mention any special requirements for attendees</li>
                <li>Describe what makes your event unique</li>
                <li>The more details you provide, the better the AI can help you</li>
                <li>Provide at least 75 words for optimal AI generation</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            className="border-purple-200 text-purple-700 hover:bg-purple-50"
          >
            Back
          </Button>
          <Button
            type="submit"
            className="bg-gradient-to-r from-purple-600 to-purple-400 hover:from-purple-700 hover:to-purple-500 text-white transition-all duration-300 hover:scale-[1.02] font-medium"
            disabled={getWordCount(eventDetails) < 75}
          >
            Generate Event <Sparkles className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default EventDetails;
