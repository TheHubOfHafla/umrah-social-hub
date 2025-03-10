
import { cn } from "@/lib/utils";
import { CheckCircle, Loader2 } from "lucide-react";
import { CreationStage } from "../hooks/useFormSteps";

interface ProgressStepsProps {
  stage: CreationStage;
}

const ProgressSteps = ({ stage }: ProgressStepsProps) => {
  return (
    <div className="w-full mb-8">
      <div className="flex justify-between items-center">
        <div className={cn(
          "flex flex-col items-center",
          (stage === "select-category" || stage === "add-details" || stage === "generating" || stage === "review" || stage === "edit-details" || stage === "complete") 
            ? "text-purple-700" : "text-gray-400"
        )}>
          <div className={cn(
            "h-10 w-10 rounded-full flex items-center justify-center mb-2 transition-all duration-300",
            (stage === "select-category" || stage === "add-details" || stage === "generating" || stage === "review" || stage === "edit-details" || stage === "complete") 
              ? "bg-purple-100 text-purple-700 border-2 border-purple-700"
              : "bg-gray-100 text-gray-400 border-2 border-gray-200"
          )}>
            {stage === "select-category" ? "1" : <CheckCircle className="h-5 w-5" />}
          </div>
          <span className="text-xs sm:text-sm font-medium">Category</span>
        </div>
        
        <div className="flex-1 h-0.5 mx-2 bg-gray-200">
          <div className={cn(
            "h-full bg-purple-500 transition-all duration-500",
            stage === "select-category" ? "w-0" : "w-full"
          )} />
        </div>
        
        <div className={cn(
          "flex flex-col items-center",
          (stage === "add-details" || stage === "generating" || stage === "review" || stage === "edit-details" || stage === "complete") 
            ? "text-purple-700" : "text-gray-400"
        )}>
          <div className={cn(
            "h-10 w-10 rounded-full flex items-center justify-center mb-2 transition-all duration-300",
            (stage === "add-details" || stage === "generating" || stage === "review" || stage === "edit-details" || stage === "complete") 
              ? "bg-purple-100 text-purple-700 border-2 border-purple-700"
              : "bg-gray-100 text-gray-400 border-2 border-gray-200"
          )}>
            {stage === "add-details" ? "2" : (stage === "select-category" ? "2" : <CheckCircle className="h-5 w-5" />)}
          </div>
          <span className="text-xs sm:text-sm font-medium">Details</span>
        </div>
        
        <div className="flex-1 h-0.5 mx-2 bg-gray-200">
          <div className={cn(
            "h-full bg-purple-500 transition-all duration-500",
            stage === "select-category" || stage === "add-details" ? "w-0" : "w-full"
          )} />
        </div>
        
        <div className={cn(
          "flex flex-col items-center",
          (stage === "generating" || stage === "review" || stage === "edit-details" || stage === "complete") 
            ? "text-purple-700" : "text-gray-400"
        )}>
          <div className={cn(
            "h-10 w-10 rounded-full flex items-center justify-center mb-2 transition-all duration-300",
            (stage === "generating" || stage === "review" || stage === "edit-details" || stage === "complete") 
              ? "bg-purple-100 text-purple-700 border-2 border-purple-700"
              : "bg-gray-100 text-gray-400 border-2 border-gray-200"
          )}>
            {stage === "generating" ? <Loader2 className="h-5 w-5 animate-spin" /> : 
              (stage === "review" || stage === "edit-details" || stage === "complete" ? <CheckCircle className="h-5 w-5" /> : "3")}
          </div>
          <span className="text-xs sm:text-sm font-medium">Generate</span>
        </div>
        
        <div className="flex-1 h-0.5 mx-2 bg-gray-200">
          <div className={cn(
            "h-full bg-purple-500 transition-all duration-500",
            stage === "select-category" || stage === "add-details" || stage === "generating" ? "w-0" : "w-full"
          )} />
        </div>
        
        <div className={cn(
          "flex flex-col items-center",
          (stage === "review" || stage === "edit-details" || stage === "complete") 
            ? "text-purple-700" : "text-gray-400"
        )}>
          <div className={cn(
            "h-10 w-10 rounded-full flex items-center justify-center mb-2 transition-all duration-300",
            (stage === "review" || stage === "edit-details" || stage === "complete") 
              ? "bg-purple-100 text-purple-700 border-2 border-purple-700"
              : "bg-gray-100 text-gray-400 border-2 border-gray-200"
          )}>
            {stage === "complete" ? <CheckCircle className="h-5 w-5" /> : "4"}
          </div>
          <span className="text-xs sm:text-sm font-medium">Launch</span>
        </div>
      </div>
    </div>
  );
};

export default ProgressSteps;
