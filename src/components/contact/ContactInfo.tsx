
import { MapPin, Mail, Phone } from "lucide-react";

const ContactInfo = () => {
  return (
    <div>
      <h2 className="text-xl md:text-2xl font-semibold mb-5 md:mb-6">Get In Touch</h2>
      <p className="text-muted-foreground mb-6 md:mb-8 text-sm md:text-base">
        We'd love to hear from you! Please fill out the form and our team will get back to you as soon as possible.
      </p>
      
      <div className="space-y-5 md:space-y-6">
        <div className="flex items-start space-x-3">
          <MapPin className="h-5 w-5 text-primary mt-0.5" />
          <div>
            <h3 className="font-medium text-sm md:text-base">Our Location</h3>
            <p className="text-muted-foreground text-xs md:text-sm">123 Event Street, San Francisco, CA 94103</p>
          </div>
        </div>
        
        <div className="flex items-start space-x-3">
          <Mail className="h-5 w-5 text-primary mt-0.5" />
          <div>
            <h3 className="font-medium text-sm md:text-base">Email Us</h3>
            <p className="text-muted-foreground text-xs md:text-sm">support@eventhub.com</p>
          </div>
        </div>
        
        <div className="flex items-start space-x-3">
          <Phone className="h-5 w-5 text-primary mt-0.5" />
          <div>
            <h3 className="font-medium text-sm md:text-base">Call Us</h3>
            <p className="text-muted-foreground text-xs md:text-sm">(555) 123-4567</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactInfo;
