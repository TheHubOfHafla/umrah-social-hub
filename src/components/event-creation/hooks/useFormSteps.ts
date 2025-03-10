
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export type CreationStage = 
  | "select-category" 
  | "add-details" 
  | "generating" 
  | "review" 
  | "edit-details" 
  | "complete";

export const categoryFormSchema = z.object({
  category: z.string().min(1, { message: "Please select an event category" }),
});

export const detailsFormSchema = z.object({
  details: z.string()
    .min(20, { 
      message: "Please provide at least 20 characters about your event" 
    })
    .refine((val) => {
      const wordCount = val.trim().split(/\s+/).length;
      return wordCount >= 75;
    }, {
      message: "Please provide at least 75 words about your event for better AI generation"
    }),
});

export const getWordCount = (text: string): number => {
  return text.trim().split(/\s+/).filter(word => word.length > 0).length;
};

export const useFormSteps = (initialCategory: string, initialDetails: string) => {
  const [stage, setStage] = useState<CreationStage>("select-category");
  const [selectedCategory, setSelectedCategory] = useState(initialCategory || "");
  const [eventDetails, setEventDetails] = useState(initialDetails || "");
  const [showLaunchConfirmation, setShowLaunchConfirmation] = useState(false);
  
  const categoryForm = useForm<z.infer<typeof categoryFormSchema>>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      category: initialCategory || "",
    },
  });

  const detailsForm = useForm<z.infer<typeof detailsFormSchema>>({
    resolver: zodResolver(detailsFormSchema),
    defaultValues: {
      details: initialDetails || "",
    },
  });

  const editForm = useForm({
    defaultValues: {
      title: "",
      description: "",
      location: "",
      city: "",
      country: "",
      date: "",
      capacity: "",
      price: 0,
    }
  });
  
  return {
    stage,
    setStage,
    selectedCategory,
    setSelectedCategory,
    eventDetails,
    setEventDetails,
    showLaunchConfirmation, 
    setShowLaunchConfirmation,
    categoryForm,
    detailsForm,
    editForm
  };
};
