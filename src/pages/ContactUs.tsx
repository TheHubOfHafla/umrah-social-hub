
import { useState, useEffect } from "react";
import { Container } from "@/components/ui/container";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Facebook, Twitter, Instagram, Linkedin, Mail, MapPin, Phone, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "react-router-dom";

const ContactUs = () => {
  const { toast } = useToast();
  const location = useLocation();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would send this data to your backend
    console.log("Form submitted:", formData);
    
    // Show success message
    toast({
      title: "Message sent!",
      description: "We'll get back to you as soon as possible.",
    });
    
    setSubmitted(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: ""
      });
      setSubmitted(false);
    }, 3000);
  };

  return (
    <div className="pt-16 md:pt-20 pb-12 md:pb-16">
      <div className="bg-primary/10 py-8 md:py-12 mb-8 md:mb-10">
        <Container>
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-3 md:mb-4">Contact Us</h1>
          <p className="text-base md:text-lg text-center max-w-3xl mx-auto text-muted-foreground px-4">
            Have questions, suggestions, or need assistance? We're here to help!
          </p>
        </Container>
      </div>
      
      <Container className="max-w-5xl px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
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
          </div>
          
          <div>
            <Card>
              <CardContent className="pt-6">
                {submitted ? (
                  <div className="text-center py-8">
                    <CheckCircle className="h-10 w-10 md:h-12 md:w-12 text-green-500 mx-auto mb-4" />
                    <h3 className="text-lg md:text-xl font-medium mb-2">Message Sent!</h3>
                    <p className="text-muted-foreground text-sm">
                      Thank you for reaching out. We'll get back to you as soon as possible.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-sm">Your Name</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter your name"
                        required
                        className="text-sm"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm">Email Address</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email"
                        required
                        className="text-sm"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="subject" className="text-sm">Subject</Label>
                      <Input
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="Enter subject"
                        required
                        className="text-sm"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="message" className="text-sm">Message</Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Enter your message"
                        rows={4}
                        required
                        className="text-sm"
                      />
                    </div>
                    
                    <Button type="submit" className="w-full">
                      Send Message
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
        
        <div className="border-t pt-8 md:pt-10">
          <h2 className="text-xl md:text-2xl font-semibold text-center mb-6 md:mb-8">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
            <div className="space-y-2 p-4 bg-secondary/50 rounded-lg">
              <h3 className="font-medium text-sm md:text-base">What are your business hours?</h3>
              <p className="text-muted-foreground text-xs md:text-sm">Our support team is available Monday through Friday, 9am to 5pm PST.</p>
            </div>
            <div className="space-y-2 p-4 bg-secondary/50 rounded-lg">
              <h3 className="font-medium text-sm md:text-base">How quickly do you respond to inquiries?</h3>
              <p className="text-muted-foreground text-xs md:text-sm">We aim to respond to all inquiries within 24 hours during business days.</p>
            </div>
            <div className="space-y-2 p-4 bg-secondary/50 rounded-lg">
              <h3 className="font-medium text-sm md:text-base">Can I request a feature?</h3>
              <p className="text-muted-foreground text-xs md:text-sm">Absolutely! We love hearing ideas from our community. Submit your feature request through this form.</p>
            </div>
            <div className="space-y-2 p-4 bg-secondary/50 rounded-lg">
              <h3 className="font-medium text-sm md:text-base">Do you provide technical support?</h3>
              <p className="text-muted-foreground text-xs md:text-sm">Yes, our technical team is available to assist with any issues you might encounter while using EventHub.</p>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default ContactUs;
