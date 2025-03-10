
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Camera, Upload } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

interface EventEditorProps {
  form: UseFormReturn<any>;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  bannerPreview: string | null;
  handleBannerUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  selectSampleBanner: (imageUrl: string) => void;
}

const EventEditor = ({ 
  form, 
  onSubmit, 
  onCancel, 
  bannerPreview, 
  handleBannerUpload, 
  selectSampleBanner 
}: EventEditorProps) => {
  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="title" className="text-base font-medium">Event Title</Label>
          <Input
            id="title"
            className="mt-1"
            {...form.register("title")}
          />
        </div>
        
        <div>
          <Label htmlFor="description" className="text-base font-medium">Description</Label>
          <Textarea
            id="description"
            className="mt-1 min-h-[100px]"
            {...form.register("description")}
          />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="location" className="text-base font-medium">Location</Label>
            <Input
              id="location"
              className="mt-1"
              {...form.register("location")}
            />
          </div>
          
          <div>
            <Label htmlFor="city" className="text-base font-medium">City</Label>
            <Input
              id="city"
              className="mt-1"
              {...form.register("city")}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="date" className="text-base font-medium">Date</Label>
            <Input
              id="date"
              className="mt-1"
              {...form.register("date")}
            />
          </div>
          
          <div>
            <Label htmlFor="capacity" className="text-base font-medium">Capacity</Label>
            <Input
              id="capacity"
              type="number"
              className="mt-1"
              {...form.register("capacity")}
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
            {...form.register("price")}
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
      </div>
      
      <div className="flex justify-between pt-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button 
          type="submit"
          className="bg-gradient-to-r from-purple-600 to-purple-400 hover:from-purple-700 hover:to-purple-500 text-white"
        >
          Save Changes
        </Button>
      </div>
    </form>
  );
};

export default EventEditor;
