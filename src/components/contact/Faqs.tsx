
const Faqs = () => {
  return (
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
  );
};

export default Faqs;
