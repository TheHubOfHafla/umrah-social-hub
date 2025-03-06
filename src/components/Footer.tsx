
import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Linkedin, Github } from "lucide-react";
import { Container } from "./ui/container";

const Footer = () => {
  return (
    <footer className="border-t py-8 bg-secondary/30">
      <Container>
        <div className="flex flex-col items-center justify-center">
          <Link to="/" className="flex items-center gap-2 mb-4">
            <span className="font-heading text-xl tracking-tight text-primary font-bold">EventHub</span>
          </Link>
          
          <p className="text-muted-foreground text-sm text-center max-w-md mb-6">
            Connecting the community through events and shared experiences.
          </p>
          
          <div className="flex space-x-4 mb-6">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
              <Facebook size={20} />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
              <Twitter size={20} />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
              <Instagram size={20} />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
              <Linkedin size={20} />
            </a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
              <Github size={20} />
            </a>
          </div>
          
          <div className="text-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} EventHub. All rights reserved.</p>
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
