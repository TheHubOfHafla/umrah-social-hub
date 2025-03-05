
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t py-12 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Umrah Social</h3>
            <p className="text-muted-foreground">
              Connecting the community through events and shared experiences.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-4 uppercase tracking-wider">Platform</h4>
            <ul className="space-y-2">
              <li><Link to="/events" className="text-muted-foreground hover:text-foreground">Browse Events</Link></li>
              <li><Link to="/organizers" className="text-muted-foreground hover:text-foreground">Organizers</Link></li>
              <li><Link to="/create-event" className="text-muted-foreground hover:text-foreground">Create Event</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-4 uppercase tracking-wider">Resources</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-muted-foreground hover:text-foreground">Help Center</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground">Guidelines</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground">Contact Us</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-4 uppercase tracking-wider">Legal</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-muted-foreground hover:text-foreground">Terms of Service</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground">Privacy Policy</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground">Cookie Policy</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t mt-12 pt-8 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Umrah Social. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
