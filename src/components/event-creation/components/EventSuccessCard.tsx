
import { CheckCircle } from "lucide-react";

const EventSuccessCard = () => {
  return (
    <div className="pt-8 pb-8 text-center">
      <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
        <CheckCircle className="h-10 w-10 text-green-600" />
      </div>
      <h3 className="text-lg font-medium mb-2">Congratulations!</h3>
      <p className="text-gray-600 max-w-md mx-auto">
        Your event has been successfully created and published. You will be redirected to your events dashboard shortly.
      </p>
    </div>
  );
};

export default EventSuccessCard;
