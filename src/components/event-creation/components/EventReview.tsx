
import { Button } from "@/components/ui/button";
import { Camera, Edit, FileImage, Upload, Bot, RefreshCw, Send, Loader2 } from "lucide-react";
import { getSelectedCategoryInfo } from "../utils";

interface EventReviewProps {
  generatedEvent: any;
  bannerPreview: string | null;
  handleBannerUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  selectSampleBanner: (imageUrl: string) => void;
  handleToggleEditMode: () => void;
  handleReset: () => void;
  handleShowLaunchConfirmation: () => void;
  isSaving: boolean;
  selectedCategory: string;
}

const EventReview = ({
  generatedEvent,
  bannerPreview,
  handleBannerUpload,
  selectSampleBanner,
  handleToggleEditMode,
  handleReset,
  handleShowLaunchConfirmation,
  isSaving,
  selectedCategory
}: EventReviewProps) => {
  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-purple-100 p-4 bg-white">
        <h3 className="font-bold text-xl mb-2">{generatedEvent.title}</h3>
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-gray-500">Description</h4>
            <p className="mt-1">{generatedEvent.description}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500">Location</h4>
              <p className="mt-1">{generatedEvent.location.name}, {generatedEvent.location.city}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-500">Date & Time</h4>
              <p className="mt-1">{generatedEvent.date.start.toLocaleDateString()}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-500">Category</h4>
              <p className="mt-1">{getSelectedCategoryInfo(selectedCategory)?.name}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-500">Capacity</h4>
              <p className="mt-1">{generatedEvent.capacity} attendees</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-500">Pricing</h4>
              <p className="mt-1">
                {generatedEvent.isFree ? "Free" : `$${generatedEvent.price}`}
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
              <FileImage className="mr-2 h-4 w-4" /> Upload Image
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
                src="https://images.unsplash.com/photo-1605810230434-7631ac76ec81" 
                alt="Sample banner 1" 
                className="h-20 w-full object-cover rounded-md cursor-pointer border-2 hover:border-purple-500 transition-all"
                onClick={() => selectSampleBanner("https://images.unsplash.com/photo-1605810230434-7631ac76ec81")}
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
          <Bot className="text-blue-500 mr-3 mt-0.5 h-5 w-5 flex-shrink-0" />
          <div className="text-sm text-blue-800">
            <p className="font-medium">AI Notes:</p>
            <p className="mt-1">
              I've generated basic event details based on your inputs. You can edit these details directly using the "Edit Details" button below.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventReview;
