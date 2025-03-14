
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

const SocialLinks = () => {
  return (
    <div className="mt-6 md:mt-8">
      <h3 className="font-medium mb-3 md:mb-4 text-sm md:text-base">Follow Us</h3>
      <div className="flex space-x-3 md:space-x-4">
        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" 
           className="h-8 w-8 md:h-10 md:w-10 rounded-full bg-secondary flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
          <Facebook className="h-4 w-4 md:h-5 md:w-5" />
        </a>
        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" 
           className="h-8 w-8 md:h-10 md:w-10 rounded-full bg-secondary flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
          <Twitter className="h-4 w-4 md:h-5 md:w-5" />
        </a>
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" 
           className="h-8 w-8 md:h-10 md:w-10 rounded-full bg-secondary flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
          <Instagram className="h-4 w-4 md:h-5 md:w-5" />
        </a>
        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" 
           className="h-8 w-8 md:h-10 md:w-10 rounded-full bg-secondary flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
          <Linkedin className="h-4 w-4 md:h-5 md:w-5" />
        </a>
      </div>
    </div>
  );
};

export default SocialLinks;
