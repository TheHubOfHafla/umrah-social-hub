
import { useEffect } from "react";
import { Container } from "@/components/ui/container";
import { useLocation } from "react-router-dom";
import ContactInfo from "@/components/contact/ContactInfo";
import SocialLinks from "@/components/contact/SocialLinks";
import ContactForm from "@/components/contact/ContactForm";
import Faqs from "@/components/contact/Faqs";

const ContactUs = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <div className="pt-16 md:pt-20 pb-12 md:pb-16">
      <div className="bg-[#f5f9fc] py-8 md:py-12 mb-8 md:mb-10">
        <Container>
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-3 md:mb-4">Contact Us</h1>
          <p className="text-base md:text-lg text-center max-w-3xl mx-auto text-muted-foreground px-4">
            Have questions, suggestions, or need assistance? We're here to help!
          </p>
        </Container>
      </div>
      
      <Container className="max-w-5xl px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className="bg-white shadow-md rounded-md p-6">
            <ContactInfo />
            <SocialLinks />
          </div>
          
          <div className="bg-white shadow-md rounded-md p-6">
            <ContactForm />
          </div>
        </div>
        
        <div className="bg-white shadow-md rounded-md p-6">
          <Faqs />
        </div>
      </Container>
    </div>
  );
};

export default ContactUs;
