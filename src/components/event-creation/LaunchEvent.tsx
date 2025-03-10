
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  CalendarIcon, Clock, MapPin, Users, 
  Send, Camera, Upload, Sparkles, 
  Loader2, CheckCircle
} from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { EventCategory } from "@/types";

interface EventData {
  title: string;
  description: string;
  date: {
    start: Date;
    end: Date;
  };
  location: {
    name: string;
    address?: string;
    city: string;
    country: string;
  };
  category: string;
  capacity: number;
  isFree: boolean;
  price: number;
  image?: string;
}

interface LaunchEventProps {
  eventData: EventData;
  onSave: (updatedData: EventData) => void;
  onBack: () => void;
  onLaunch: () => void;
  isProcessing?: boolean;
}

export default function LaunchEvent({ 
  eventData, 
  onSave, 
  onBack, 
  onLaunch, 
  isProcessing = false 
}: LaunchEventProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({...eventData});
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [bannerPreview, setBannerPreview] = useState<string | null>(eventData.image || null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleToggleEdit = () => {
    setIsEditing(!isEditing);
    if (!isEditing) {
      setEditData({...eventData});
    }
  };

  const handleSaveEdits = () => {
    onSave(editData);
    setIsEditing(false);
    toast({
      title: "Changes Saved",
      description: "Your event details have been updated."
    });
  };

  const handleInputChange = (field: string, value: any) => {
    setEditData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleLocationChange = (field: string, value: string) => {
    setEditData(prev => ({
      ...prev,
      location: {
        ...prev.location,
        [field]: value
      }
    }));
  };

  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setBannerPreview(imageUrl);
      setEditData(prev => ({
        ...prev,
        image: imageUrl
      }));
      
      toast({
        title: "Banner Uploaded",
        description: "Your event banner has been uploaded successfully."
      });
    }
  };

  const selectSampleBanner = (imageUrl: string) => {
    setBannerPreview(imageUrl);
    setEditData(prev => ({
      ...prev,
      image: imageUrl
    }));
    
    toast({
      title: "Banner Selected",
      description: "Sample banner has been selected for your event."
    });
  };

  const handleLaunch = () => {
    if (!bannerPreview) {
      toast({
        title: "Banner Required",
        description: "Please upload a banner image before launching your event.",
        variant: "destructive"
      });
      return;
    }
    
    setShowConfirmation(true);
  };

  const confirmLaunch = () => {
    onLaunch();
    setShowConfirmation(false);
  };

  // Get category display name
  const getCategoryDisplayName = (categoryId: string): string => {
    const categoryMap: Record<string, string> = {
      "islamic-talk": "Islamic Talk",
      "charity-fundraiser": "Charity Fundraiser", 
      "umrah-trip": "Umrah Trip",
      "business-networking": "Business Networking",
      "workshop": "Workshop",
      "other": "Other"
    };
    
    return categoryMap[categoryId] || categoryId.charAt(0).toUpperCase() + categoryId.slice(1).replace(/-/g, ' ');
  };

  return (
    <Card className="border-purple-200 shadow-lg transition-all duration-300 hover:shadow-xl animate-fade-in">
      <CardHeader className="bg-purple-50 border-b border-purple-100">
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-full bg-purple-200 flex items-center justify-center">
            <CheckCircle className="h-5 w-5 text-purple-700" />
          </div>
          <div>
            <CardTitle className="text-xl text-purple-900">Your Event is Ready!</CardTitle>
            <CardDescription>Review and launch your event, or make additional edits</CardDescription>
          </div>
        </div>
      </CardHeader>
      
      {isEditing ? (
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="title" className="text-base font-medium">Event Title</Label>
              <Input
                id="title"
                className="mt-1"
                value={editData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="description" className="text-base font-medium">Description</Label>
              <Textarea
                id="description"
                className="mt-1 min-h-[100px]"
                value={editData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="location" className="text-base font-medium">Location</Label>
                <Input
                  id="location"
                  className="mt-1"
                  value={editData.location.name}
                  onChange={(e) => handleLocationChange('name', e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="city" className="text-base font-medium">City</Label>
                <Input
                  id="city"
                  className="mt-1"
                  value={editData.location.city}
                  onChange={(e) => handleLocationChange('city', e.target.value)}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="country" className="text-base font-medium">Country</Label>
                <Input
                  id="country"
                  className="mt-1"
                  value={editData.location.country}
                  onChange={(e) => handleLocationChange('country', e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="capacity" className="text-base font-medium">Capacity</Label>
                <Input
                  id="capacity"
                  type="number"
                  className="mt-1"
                  value={editData.capacity}
                  onChange={(e) => handleInputChange('capacity', Number(e.target.value))}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="price" className="text-base font-medium">Price ($)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                className="mt-1"
                value={editData.price}
                onChange={(e) => handleInputChange('price', Number(e.target.value))}
              />
            </div>
            
            <div className="pt-4 mt-4 border-t border-gray-200">
              <Label className="text-base font-medium block mb-2">Banner Image</Label>
              
              {bannerPreview ? (
                <div className="mb-3 relative rounded-lg overflow-hidden border border-purple-200">
                  <img 
                    src={bannerPreview} 
                    alt="Event banner preview" 
                    className="w-full h-[200px] object-cover"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity duration-200">
                    <Button 
                      type="button"
                      className="bg-purple-600 hover:bg-purple-700 text-white"
                      onClick={() => document.getElementById('event-banner-edit')?.click()}
                    >
                      <Camera className="mr-2 h-4 w-4" /> Change Image
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="border-2 border-dashed border-purple-200 rounded-lg p-6 text-center hover:bg-purple-50 transition-colors cursor-pointer mb-3"
                  onClick={() => document.getElementById('event-banner-edit')?.click()}
                >
                  <Upload className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                  <p className="text-sm text-gray-600">Click to upload your event banner</p>
                  <p className="text-xs text-gray-500 mt-1">Recommended size: 1200 x 630 pixels</p>
                </div>
              )}
              
              <input 
                type="file" 
                className="hidden" 
                id="event-banner-edit"
                accept="image/*"
                onChange={handleBannerUpload}
              />
              
              {!bannerPreview && (
                <div>
                  <p className="text-sm font-medium mb-2">Or choose a sample banner:</p>
                  <div className="grid grid-cols-3 gap-2">
                    <img 
                      src="/lovable-uploads/2b781a41-72aa-4b72-9785-fe84e014bdd7.png" 
                      alt="Sample banner 1" 
                      className="h-20 w-full object-cover rounded-md cursor-pointer border-2 hover:border-purple-500 transition-all"
                      onClick={() => selectSampleBanner("/lovable-uploads/2b781a41-72aa-4b72-9785-fe84e014bdd7.png")}
                    />
                    <img 
                      src="https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7" 
                      alt="Sample banner 2" 
                      className="h-20 w-full object-cover rounded-md cursor-pointer border-2 hover:border-purple-500 transition-all"
                      onClick={() => selectSampleBanner("https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7")}
                    />
                    <img 
                      src="https://images.unsplash.com/photo-1519389950473-47ba0277781c" 
                      alt="Sample banner 3" 
                      className="h-20 w-full object-cover rounded-md cursor-pointer border-2 hover:border-purple-500 transition-all"
                      onClick={() => selectSampleBanner("https://images.unsplash.com/photo-1519389950473-47ba0277781c")}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex justify-between pt-6">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleToggleEdit}
            >
              Cancel
            </Button>
            <Button 
              type="button"
              onClick={handleSaveEdits}
              className="bg-gradient-to-r from-purple-600 to-purple-400 hover:from-purple-700 hover:to-purple-500 text-white"
            >
              Save Changes
            </Button>
          </div>
        </CardContent>
      ) : (
        <CardContent className="pt-6">
          <div className="space-y-6">
            <div className="rounded-lg border border-purple-100 p-4 bg-white">
              <h3 className="font-bold text-xl mb-2">{eventData.title}</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Description</h4>
                  <p className="mt-1">{eventData.description}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Location</h4>
                    <p className="mt-1">{eventData.location.name}, {eventData.location.city}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Date & Time</h4>
                    <p className="mt-1">{eventData.date.start.toLocaleDateString()}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Category</h4>
                    <p className="mt-1">{getCategoryDisplayName(eventData.category)}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Capacity</h4>
                    <p className="mt-1">{eventData.capacity} attendees</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Pricing</h4>
                    <p className="mt-1">
                      {eventData.isFree ? "Free" : `$${eventData.price}`}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="pt-4 border-t border-gray-200">
              <h3 className="font-medium text-lg mb-3">Event Banner</h3>
              
              {bannerPreview ? (
                <div className="mb-3 relative rounded-lg overflow-hidden border border-purple-200">
                  <img 
                    src={bannerPreview} 
                    alt="Event banner preview" 
                    className="w-full h-[200px] object-cover"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity duration-200">
                    <Button 
                      type="button"
                      className="bg-purple-600 hover:bg-purple-700 text-white"
                      onClick={() => document.getElementById('event-banner-review')?.click()}
                    >
                      <Camera className="mr-2 h-4 w-4" /> Change Image
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="border-2 border-dashed border-purple-200 rounded-lg p-6 text-center hover:bg-purple-50 transition-colors cursor-pointer mb-3"
                  onClick={() => document.getElementById('event-banner-review')?.click()}
                >
                  <Upload className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                  <p className="text-sm text-gray-600">Upload your event banner <span className="text-red-500 font-bold">*</span></p>
                  <p className="text-xs text-gray-500 mt-1">Events with images get more attendees!</p>
                  <Button 
                    type="button"
                    variant="outline" 
                    className="mt-3 text-purple-600 border-purple-200 hover:bg-purple-50"
                  >
                    <Camera className="mr-2 h-4 w-4" /> Upload Image
                  </Button>
                </div>
              )}
              
              <input 
                type="file" 
                className="hidden" 
                id="event-banner-review"
                accept="image/*"
                onChange={handleBannerUpload}
              />
              
              {!bannerPreview && (
                <div>
                  <p className="text-sm font-medium mb-2">Or choose a sample banner:</p>
                  <div className="grid grid-cols-3 gap-2">
                    <img 
                      src="/lovable-uploads/2b781a41-72aa-4b72-9785-fe84e014bdd7.png" 
                      alt="Sample banner 1" 
                      className="h-20 w-full object-cover rounded-md cursor-pointer border-2 hover:border-purple-500 transition-all"
                      onClick={() => selectSampleBanner("/lovable-uploads/2b781a41-72aa-4b72-9785-fe84e014bdd7.png")}
                    />
                    <img 
                      src="https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7" 
                      alt="Sample banner 2" 
                      className="h-20 w-full object-cover rounded-md cursor-pointer border-2 hover:border-purple-500 transition-all"
                      onClick={() => selectSampleBanner("https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7")}
                    />
                    <img 
                      src="https://images.unsplash.com/photo-1519389950473-47ba0277781c" 
                      alt="Sample banner 3" 
                      className="h-20 w-full object-cover rounded-md cursor-pointer border-2 hover:border-purple-500 transition-all"
                      onClick={() => selectSampleBanner("https://images.unsplash.com/photo-1519389950473-47ba0277781c")}
                    />
                  </div>
                </div>
              )}
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start">
                <Sparkles className="text-blue-500 mr-3 mt-0.5 h-5 w-5 flex-shrink-0" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium">AI Insights:</p>
                  <p className="mt-1">
                    Your event looks great! Events with detailed descriptions and high-quality images 
                    tend to attract more attendees. You're ready to launch!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      )}
      
      <CardFooter className="flex flex-col sm:flex-row justify-between gap-4 pt-2 border-t border-purple-100 bg-purple-50">
        <div className="flex gap-2 w-full sm:w-auto">
          <Button 
            variant="outline" 
            onClick={onBack}
            className="border-purple-200 text-purple-700 hover:bg-purple-50 flex-1 sm:flex-initial"
          >
            Back
          </Button>
          <Button 
            onClick={handleToggleEdit}
            variant="default"
            className="bg-purple-600 hover:bg-purple-700 text-white flex-1 sm:flex-initial"
          >
            {isEditing ? "Cancel Editing" : "Edit Details"}
          </Button>
        </div>
        <Button 
          onClick={handleLaunch}
          className="bg-gradient-to-r from-purple-600 to-purple-400 hover:from-purple-700 hover:to-purple-500 text-white transition-all duration-300 hover:scale-[1.02] font-medium w-full sm:w-auto"
          disabled={!bannerPreview || isProcessing}
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
            </>
          ) : (
            <>
              Launch Event <Send className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </CardFooter>

      <AlertDialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Launch this event?</AlertDialogTitle>
            <AlertDialogDescription>
              This will publish your event and make it visible to all users. Are you sure you want to continue?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowConfirmation(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmLaunch} 
              className="bg-gradient-to-r from-purple-600 to-purple-400"
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                </>
              ) : (
                <>Launch Event</>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
