
import React, { useState, useEffect } from "react";
import { Container } from "@/components/ui/container";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useLocation } from "react-router-dom";
import PageWrapper from "@/components/PageWrapper";

const LegalPage = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("terms");
  
  useEffect(() => {
    // Extract tab parameter from URL query string
    const searchParams = new URLSearchParams(location.search);
    const tabParam = searchParams.get("tab");
    
    // Set the active tab based on URL parameter if it's valid
    if (tabParam && ["terms", "privacy", "cookies"].includes(tabParam)) {
      setActiveTab(tabParam);
    }
    
    // Scroll to the top of the page when component mounts or tab changes
    window.scrollTo(0, 0);
  }, [location.search]);

  // Also scroll to top when tab changes via UI
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    window.scrollTo(0, 0);
  };

  return (
    <PageWrapper withFooter={false}>
      <div className="py-16 md:py-20 min-h-screen bg-background">
        <Container>
          <div className="max-w-4xl mx-auto px-4 md:px-6">
            <h1 className="text-3xl font-bold mb-6">Legal Information</h1>
            <p className="text-muted-foreground mb-12">
              Please review our legal documents below to understand your rights and responsibilities 
              when using EventHub services.
            </p>

            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
              <TabsList className="w-full grid grid-cols-3 mb-8">
                <TabsTrigger value="terms">Terms of Service</TabsTrigger>
                <TabsTrigger value="privacy">Privacy Policy</TabsTrigger>
                <TabsTrigger value="cookies">Cookie Policy</TabsTrigger>
              </TabsList>
              
              <TabsContent value="terms" className="space-y-6 px-1 md:px-4">
                <div>
                  <h2 className="text-2xl font-semibold mb-4">Terms of Service</h2>
                  <Separator className="mb-8" />
                  
                  <div className="space-y-8">
                    <h3 className="text-xl font-medium mb-3">1. Acceptance of Terms</h3>
                    <p className="mb-6">
                      By accessing or using EventHub services, you agree to be bound by these Terms of Service. 
                      If you do not agree to these terms, please do not use our services.
                    </p>
                    
                    <h3 className="text-xl font-medium mb-3">2. Services Description</h3>
                    <p className="mb-6">
                      EventHub provides a platform for users to discover, create, and participate in events. 
                      We reserve the right to modify, suspend, or discontinue any aspect of our services at any time.
                    </p>
                    
                    <h3 className="text-xl font-medium mb-3">3. User Accounts</h3>
                    <p className="mb-6">
                      You are responsible for maintaining the confidentiality of your account information and 
                      for all activities that occur under your account. You must immediately notify EventHub of 
                      any unauthorized use of your account.
                    </p>
                    
                    <h3 className="text-xl font-medium mb-3">4. User Conduct</h3>
                    <p className="mb-6">
                      You agree not to use EventHub services for any illegal or unauthorized purpose. You must 
                      comply with all applicable laws and regulations when using our platform.
                    </p>
                    
                    <h3 className="text-xl font-medium mb-3">5. Intellectual Property</h3>
                    <p className="mb-6">
                      EventHub and its content are protected by copyright, trademark, and other intellectual 
                      property laws. You may not reproduce, distribute, or create derivative works without our express permission.
                    </p>
                    
                    <h3 className="text-xl font-medium mb-3">6. Termination</h3>
                    <p className="mb-6">
                      EventHub reserves the right to terminate or suspend your account at any time for any reason, 
                      including violation of these Terms of Service.
                    </p>
                    
                    <h3 className="text-xl font-medium mb-3">7. Disclaimer of Warranties</h3>
                    <p className="mb-6">
                      EventHub services are provided "as is" without any warranties, expressed or implied. 
                      We do not guarantee that our services will be error-free or uninterrupted.
                    </p>
                    
                    <h3 className="text-xl font-medium mb-3">8. Limitation of Liability</h3>
                    <p className="mb-6">
                      EventHub shall not be liable for any indirect, incidental, special, consequential, or punitive damages 
                      resulting from your use of or inability to use our services.
                    </p>
                    
                    <h3 className="text-xl font-medium mb-3">9. Changes to Terms</h3>
                    <p className="mb-6">
                      We reserve the right to modify these Terms of Service at any time. Your continued use of 
                      EventHub after such changes constitutes your acceptance of the new terms.
                    </p>
                    
                    <h3 className="text-xl font-medium mb-3">10. Governing Law</h3>
                    <p className="mb-6">
                      These Terms of Service shall be governed by the laws of the jurisdiction in which EventHub operates, 
                      without regard to its conflict of law provisions.
                    </p>
                    
                    <p className="text-sm text-muted-foreground mt-12">Last updated: {new Date().toLocaleDateString()}</p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="privacy" className="space-y-6 px-1 md:px-4">
                <div>
                  <h2 className="text-2xl font-semibold mb-4">Privacy Policy</h2>
                  <Separator className="mb-8" />
                  
                  <div className="space-y-8">
                    <h3 className="text-xl font-medium mb-3">1. Information We Collect</h3>
                    <p className="mb-6">
                      We collect personal information that you provide directly to us, such as your name, email address, 
                      and profile information. We also collect information about your use of our services.
                    </p>
                    
                    <h3 className="text-xl font-medium mb-3">2. How We Use Your Information</h3>
                    <p className="mb-6">
                      We use your information to provide, maintain, and improve our services, to communicate with you, 
                      and to personalize your experience on EventHub.
                    </p>
                    
                    <h3 className="text-xl font-medium mb-3">3. Information Sharing</h3>
                    <p className="mb-6">
                      We may share your information with third-party service providers who perform services on our behalf, 
                      such as payment processing and data analysis. We will not sell your personal information to third parties.
                    </p>
                    
                    <h3 className="text-xl font-medium mb-3">4. Data Security</h3>
                    <p className="mb-6">
                      We implement appropriate security measures to protect your personal information from unauthorized access, 
                      alteration, disclosure, or destruction.
                    </p>
                    
                    <h3 className="text-xl font-medium mb-3">5. Data Retention</h3>
                    <p className="mb-6">
                      We retain your personal information for as long as necessary to fulfill the purposes outlined in this 
                      Privacy Policy, unless a longer retention period is required by law.
                    </p>
                    
                    <h3 className="text-xl font-medium mb-3">6. Your Rights</h3>
                    <p className="mb-6">
                      Depending on your location, you may have certain rights regarding your personal information, such as the 
                      right to access, correct, or delete your data.
                    </p>
                    
                    <h3 className="text-xl font-medium mb-3">7. Children's Privacy</h3>
                    <p className="mb-6">
                      EventHub services are not directed to individuals under the age of 13. We do not knowingly collect 
                      personal information from children under 13.
                    </p>
                    
                    <h3 className="text-xl font-medium mb-3">8. Changes to This Policy</h3>
                    <p className="mb-6">
                      We may update this Privacy Policy from time to time. We will notify you of any changes by posting 
                      the new Privacy Policy on this page.
                    </p>
                    
                    <h3 className="text-xl font-medium mb-3">9. Contact Us</h3>
                    <p className="mb-6">
                      If you have any questions about this Privacy Policy, please contact us at privacy@eventhub.com.
                    </p>
                    
                    <p className="text-sm text-muted-foreground mt-12">Last updated: {new Date().toLocaleDateString()}</p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="cookies" className="space-y-6 px-1 md:px-4">
                <div>
                  <h2 className="text-2xl font-semibold mb-4">Cookie Policy</h2>
                  <Separator className="mb-8" />
                  
                  <div className="space-y-8">
                    <h3 className="text-xl font-medium mb-3">1. What Are Cookies</h3>
                    <p className="mb-6">
                      Cookies are small text files that are placed on your device when you visit our website. 
                      They help us provide you with a better experience and allow certain features to work.
                    </p>
                    
                    <h3 className="text-xl font-medium mb-3">2. Types of Cookies We Use</h3>
                    <p className="mb-6">
                      We use necessary cookies for the operation of our website, analytical cookies to understand how 
                      visitors interact with our website, and advertising cookies to provide you with relevant advertisements.
                    </p>
                    
                    <h3 className="text-xl font-medium mb-3">3. Managing Cookies</h3>
                    <p className="mb-6">
                      Most web browsers allow you to control cookies through their settings. You can usually find these 
                      settings in the "Options" or "Preferences" menu of your browser.
                    </p>
                    
                    <h3 className="text-xl font-medium mb-3">4. Third-Party Cookies</h3>
                    <p className="mb-6">
                      We may use third-party services that use cookies on our website. These third parties have their own 
                      privacy policies and cookie policies that govern their use of cookies.
                    </p>
                    
                    <h3 className="text-xl font-medium mb-3">5. Changes to This Policy</h3>
                    <p className="mb-6">
                      We may update this Cookie Policy from time to time. We will notify you of any changes by posting 
                      the new Cookie Policy on this page.
                    </p>
                    
                    <h3 className="text-xl font-medium mb-3">6. Contact Us</h3>
                    <p className="mb-6">
                      If you have any questions about this Cookie Policy, please contact us at privacy@eventhub.com.
                    </p>
                    
                    <p className="text-sm text-muted-foreground mt-12">Last updated: {new Date().toLocaleDateString()}</p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </Container>
      </div>
    </PageWrapper>
  );
};

export default LegalPage;
