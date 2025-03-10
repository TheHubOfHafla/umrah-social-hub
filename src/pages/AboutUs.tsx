import { Container } from "@/components/ui/container";

const AboutUs = () => {
  return (
    <div className="pt-20 pb-16">
      <div className="bg-primary/10 py-12 mb-10">
        <Container>
          <h1 className="text-4xl font-bold text-center mb-4">About HaflaHub</h1>
          <p className="text-lg text-center max-w-3xl mx-auto text-muted-foreground">
            Connecting communities through meaningful events and experiences
          </p>
        </Container>
      </div>
      
      <Container className="max-w-4xl mb-16">
        <div className="space-y-8">
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Our Story</h2>
            <p className="text-muted-foreground">
              HaflaHub was founded in 2023 with a simple but powerful vision: to create a platform where people could easily discover
              and participate in events that matter to them. What began as a small project has evolved into a vibrant community
              connecting event organizers with attendees across the globe.
            </p>
            <p className="text-muted-foreground">
              We believe that meaningful connections happen when people come together in real life. Whether it's a local
              workshop, a major conference, or a community gathering, events have the power to inspire, educate, and transform.
            </p>
          </section>
          
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Our Mission</h2>
            <p className="text-muted-foreground">
              At HaflaHub, our mission is to make events more accessible, discoverable, and engaging for everyone. We're dedicated
              to building tools that help organizers create successful events and enable attendees to find experiences that
              resonate with their interests and values.
            </p>
          </section>
          
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Our Values</h2>
            <div className="grid md:grid-cols-2 gap-6 mt-4">
              <div className="bg-secondary/30 p-6 rounded-lg">
                <h3 className="text-xl font-medium mb-2">Community First</h3>
                <p className="text-muted-foreground">We believe in the power of community and work to foster connections that last beyond events.</p>
              </div>
              <div className="bg-secondary/30 p-6 rounded-lg">
                <h3 className="text-xl font-medium mb-2">Inclusivity</h3>
                <p className="text-muted-foreground">We're committed to creating a platform where everyone feels welcome and represented.</p>
              </div>
              <div className="bg-secondary/30 p-6 rounded-lg">
                <h3 className="text-xl font-medium mb-2">Innovation</h3>
                <p className="text-muted-foreground">We continuously improve our platform to meet the evolving needs of event organizers and attendees.</p>
              </div>
              <div className="bg-secondary/30 p-6 rounded-lg">
                <h3 className="text-xl font-medium mb-2">Transparency</h3>
                <p className="text-muted-foreground">We operate with honesty and openness in all our interactions and business practices.</p>
              </div>
            </div>
          </section>
          
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Our Team</h2>
            <p className="text-muted-foreground">
              HaflaHub is powered by a diverse team of passionate individuals who are dedicated to our mission.
              From engineers and designers to customer support specialists, each team member brings unique
              perspectives and skills to create the best possible platform for our users.
            </p>
          </section>
        </div>
      </Container>
    </div>
  );
};

export default AboutUs;
