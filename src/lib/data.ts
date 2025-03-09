
import { EventCategory } from '@/types';

export const categories = [
  { label: "Charity", value: "charity" as EventCategory },
  { label: "Community", value: "community" as EventCategory },
  { label: "Education", value: "education" as EventCategory },
  { label: "Mosque", value: "mosque" as EventCategory },
  { label: "Travel", value: "travel" as EventCategory },
  { label: "Umrah", value: "umrah" as EventCategory },
  { label: "Lecture", value: "lecture" as EventCategory },
  { label: "Workshop", value: "workshop" as EventCategory },
  { label: "Social", value: "social" as EventCategory },
  { label: "Other", value: "other" as EventCategory },
];

// Fallback event generator in case the AI service fails
export const generateBasicEvent = (category: string, details: string) => {
  const categoryName = category.charAt(0).toUpperCase() + category.slice(1).replace(/-/g, ' ');
  
  return {
    title: `${categoryName} Event - ${new Date().toLocaleDateString()}`,
    description: details || "Join us for this special event.",
    location: {
      name: "To be determined",
      address: "Address pending",
      city: "City",
      country: "Country",
    },
    date: {
      start: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
      end: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000), // 2 hours after start
    },
    category: category as EventCategory,
    capacity: 50,
    isFree: category === "charity-fundraiser" ? false : true,
    price: category === "charity-fundraiser" ? 25 : 0,
  };
};
