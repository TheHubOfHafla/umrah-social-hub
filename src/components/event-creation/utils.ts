
import { toast } from "@/hooks/use-toast";

export const eventCategories = [
  { id: "islamic-talk", name: "Islamic Talk", icon: "🕌" },
  { id: "charity-fundraiser", name: "Charity Fundraiser", icon: "🤲" },
  { id: "umrah-trip", name: "Umrah Trip", icon: "✈️" },
  { id: "business-networking", name: "Business Networking", icon: "💼" },
  { id: "workshop", name: "Workshop", icon: "🔧" },
  { id: "other", name: "Other", icon: "📝" },
];

export const getSelectedCategoryInfo = (selectedCategory: string) => {
  return eventCategories.find(cat => cat.id === selectedCategory);
};

export const handleGeneratedEventData = (eventData: any, selectedCategory: string, eventDetails: string) => {
  const suggestedDate = eventData.suggestedDate 
    ? new Date(eventData.suggestedDate) 
    : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  
  return {
    title: eventData.title || `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Event`,
    description: eventData.description || eventDetails,
    location: {
      name: eventData.location?.name || "To be determined",
      address: eventData.location?.address || "Address pending",
      city: eventData.location?.city || "City",
      country: eventData.location?.country || "Country",
    },
    date: {
      start: suggestedDate,
      end: new Date(suggestedDate.getTime() + 2 * 60 * 60 * 1000),
    },
    category: selectedCategory,
    capacity: eventData.capacity || 50,
    isFree: eventData.isFree !== undefined ? eventData.isFree : true,
    price: eventData.suggestedPrice || 0,
  };
};

export const validateBannerBeforeLaunch = (bannerPreview: string | null) => {
  if (!bannerPreview) {
    toast({
      title: "Banner Required",
      description: "Please upload a banner image before launching your event.",
      variant: "destructive",
    });
    return false;
  }
  return true;
};
