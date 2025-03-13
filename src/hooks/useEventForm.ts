
import { useState } from "react";
import { EventCategory } from "@/types";
import { useToast } from "@/hooks/use-toast";

export interface FormData {
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  city: string;
  country: string;
  category: EventCategory;
  price: number;
  capacity: number;
  isFree: boolean;
}

export type CreateEventStep = "form" | "preview" | "success";

export const useEventForm = () => {
  const [step, setStep] = useState<CreateEventStep>("form");
  const [isLoading, setIsLoading] = useState(false);
  const [eventId, setEventId] = useState<string>();
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    city: "",
    country: "",
    category: "other",
    price: 0,
    capacity: 100,
    isFree: true,
  });
  
  const { toast } = useToast();

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // If price is set above 0, set isFree to false
    if (field === 'price' && Number(value) > 0) {
      setFormData(prev => ({
        ...prev,
        isFree: false
      }));
    } else if (field === 'price' && Number(value) === 0) {
      setFormData(prev => ({
        ...prev,
        isFree: true
      }));
    }
  };

  const handleToggleFree = () => {
    setFormData(prev => {
      const newIsFree = !prev.isFree;
      return {
        ...prev,
        isFree: newIsFree,
        price: newIsFree ? 0 : prev.price
      };
    });
  };

  const validateForm = (): boolean => {
    const requiredFields = ['title', 'description', 'date', 'time', 'location', 'city', 'country', 'category'];
    
    for (const field of requiredFields) {
      if (!formData[field as keyof FormData]) {
        toast({
          title: "Missing Information",
          description: `Please fill in the ${field.replace(/([A-Z])/g, ' $1').toLowerCase()} field.`,
          variant: "destructive"
        });
        return false;
      }
    }
    
    if (!formData.isFree && formData.price <= 0) {
      toast({
        title: "Invalid Price",
        description: "Please set a price greater than 0 for paid events.",
        variant: "destructive"
      });
      return false;
    }
    
    return true;
  };

  const formatPreviewData = () => {
    // Format date and time for preview
    const dateObj = new Date(`${formData.date}T${formData.time}`);
    const endDateObj = new Date(dateObj.getTime() + 2 * 60 * 60 * 1000); // Default 2 hours duration
    
    return {
      title: formData.title,
      description: formData.description,
      date: {
        start: dateObj,
        end: endDateObj
      },
      location: {
        name: formData.location,
        city: formData.city,
        country: formData.country
      },
      category: formData.category,
      capacity: formData.capacity,
      isFree: formData.isFree,
      price: formData.price,
      image: undefined
    };
  };

  return {
    step,
    setStep,
    isLoading,
    setIsLoading,
    eventId,
    setEventId,
    formData,
    setFormData,
    handleInputChange,
    handleToggleFree,
    validateForm,
    formatPreviewData,
    toast
  };
};
