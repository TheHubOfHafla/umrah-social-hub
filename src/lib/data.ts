export const categories = [
  { label: "Conference", value: "conference" },
  { label: "Seminar", value: "seminar" },
  { label: "Workshop", value: "workshop" },
  { label: "Networking Event", value: "networking" },
  { label: "Trade Show", value: "trade-show" },
  { label: "Webinar", value: "webinar" },
  { label: "Concert", value: "concert" },
  { label: "Festival", value: "festival" },
  { label: "Party", value: "party" },
  { label: "Exhibition", value: "exhibition" },
  { label: "Charity Event", value: "charity" },
  { label: "Sports Event", value: "sports" },
  { label: "Other", value: "other" },
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
    category: category,
    capacity: 50,
    isFree: category === "charity-fundraiser" ? false : true,
    price: category === "charity-fundraiser" ? 25 : 0,
  };
};
