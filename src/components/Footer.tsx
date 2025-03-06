
import { Link, useNavigate } from "react-router-dom";
import { Facebook, Twitter, Instagram, Linkedin, Github } from "lucide-react";

const Footer = () => {
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    // First navigate to the path
    navigate(path);
    // Then scroll to top
    window.scrollTo(0, 0);
  };

  return (
    <footer className="border-t py-12 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">EventHub</h3>
            <p className="text-muted-foreground text-pretty text-sm max-w-xs">
              Connecting the community through events and shared experiences.
            </p>
            <div className="flex space-x-3 mt-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <Facebook size={18} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter size={18} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram size={18} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <Linkedin size={18} />
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <Github size={18} />
              </a>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-4 uppercase tracking-wider">Platform</h4>
            <ul className="space-y-2.5">
              <li><button onClick={() => handleNavigation("/events")} className="text-muted-foreground hover:text-foreground transition-colors text-sm text-left">Browse Events</button></li>
              <li><button onClick={() => handleNavigation("/organizers")} className="text-muted-foreground hover:text-foreground transition-colors text-sm text-left">Organizers</button></li>
              <li><button onClick={() => handleNavigation("/events/create")} className="text-muted-foreground hover:text-foreground transition-colors text-sm text-left">Create Event</button></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-4 uppercase tracking-wider">Resources</h4>
            <ul className="space-y-2.5">
              <li><button onClick={() => handleNavigation("/help")} className="text-muted-foreground hover:text-foreground transition-colors text-sm text-left">Help Center</button></li>
              <li><button onClick={() => handleNavigation("/about")} className="text-muted-foreground hover:text-foreground transition-colors text-sm text-left">About Us</button></li>
              <li><button onClick={() => handleNavigation("/contact")} className="text-muted-foreground hover:text-foreground transition-colors text-sm text-left">Contact Us</button></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-4 uppercase tracking-wider">Legal</h4>
            <ul className="space-y-2.5">
              <li><button onClick={() => handleNavigation("/legal")} className="text-muted-foreground hover:text-foreground transition-colors text-sm text-left">Legal Information</button></li>
              <li><button onClick={() => handleNavigation("/legal?tab=privacy")} className="text-muted-foreground hover:text-foreground transition-colors text-sm text-left">Privacy Policy</button></li>
              <li><button onClick={() => handleNavigation("/legal?tab=cookies")} className="text-muted-foreground hover:text-foreground transition-colors text-sm text-left">Cookie Policy</button></li>
            </ul>
          </div>
        </div>
        <div className="border-t mt-12 pt-8 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} EventHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
