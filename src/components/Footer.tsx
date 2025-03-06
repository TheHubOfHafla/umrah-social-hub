
import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Linkedin, Github } from "lucide-react";

const Footer = () => {
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
              <li><Link to="/events" className="text-muted-foreground hover:text-foreground transition-colors text-sm">Browse Events</Link></li>
              <li><Link to="/organizers" className="text-muted-foreground hover:text-foreground transition-colors text-sm">Organizers</Link></li>
              <li><Link to="/events/create" className="text-muted-foreground hover:text-foreground transition-colors text-sm">Create Event</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-4 uppercase tracking-wider">Resources</h4>
            <ul className="space-y-2.5">
              <li><Link to="/help" className="text-muted-foreground hover:text-foreground transition-colors text-sm">Help Center</Link></li>
              <li><Link to="/about" className="text-muted-foreground hover:text-foreground transition-colors text-sm">About Us</Link></li>
              <li><Link to="/contact" className="text-muted-foreground hover:text-foreground transition-colors text-sm">Contact Us</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-4 uppercase tracking-wider">Legal</h4>
            <ul className="space-y-2.5">
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">Terms of Service</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">Privacy Policy</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">Cookie Policy</a></li>
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
