
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

export const useEventBanner = () => {
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  
  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setBannerPreview(imageUrl);
      
      toast({
        title: "Banner Uploaded",
        description: "Your event banner has been uploaded successfully.",
      });
    }
  };

  const selectSampleBanner = (imageUrl: string) => {
    setBannerPreview(imageUrl);
    
    toast({
      title: "Banner Selected",
      description: "Sample banner has been selected for your event.",
    });
  };
  
  return {
    bannerPreview,
    setBannerPreview,
    handleBannerUpload,
    selectSampleBanner
  };
};
