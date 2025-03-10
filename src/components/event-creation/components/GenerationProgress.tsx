
import { Bot } from "lucide-react";

interface GenerationProgressProps {
  progress: number;
  progressText: string;
}

const GenerationProgress = ({ progress, progressText }: GenerationProgressProps) => {
  return (
    <div className="flex flex-col items-center">
      <div className="relative h-40 w-40 mb-6">
        <div className="absolute inset-0 rounded-full bg-purple-100 animate-pulse"></div>
        <div className="absolute inset-6 rounded-full bg-purple-200 animate-pulse [animation-delay:200ms]"></div>
        <div className="absolute inset-12 rounded-full bg-purple-300 animate-pulse [animation-delay:400ms]"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <Bot className="h-12 w-12 text-purple-700 animate-bounce" />
        </div>
      </div>
      
      <div className="w-full max-w-md mb-8">
        <div className="relative pt-1">
          <div className="overflow-hidden h-4 text-xs flex rounded-full bg-purple-100">
            <div 
              style={{ width: `${progress}%` }} 
              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-purple-600 to-purple-400 transition-all duration-300 ease-out"
            ></div>
          </div>
        </div>
        <p className="text-center text-sm text-purple-700 mt-2">{progressText}</p>
      </div>
      
      <div className="text-center text-gray-600 text-sm max-w-sm">
        <p className="animate-pulse"><span className="font-medium">Please wait</span> while we analyze your inputs and generate your event details</p>
      </div>
      
      <div className="flex justify-center mt-4 space-x-1">
        <div className="h-2 w-2 rounded-full bg-purple-500 animate-bounce"></div>
        <div className="h-2 w-2 rounded-full bg-purple-500 animate-bounce [animation-delay:200ms]"></div>
        <div className="h-2 w-2 rounded-full bg-purple-500 animate-bounce [animation-delay:400ms]"></div>
      </div>
    </div>
  );
};

export default GenerationProgress;
