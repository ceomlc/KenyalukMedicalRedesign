import { Card, CardContent } from "@/components/ui/card";
import { Heart, Target, Eye, Users } from "lucide-react";

export default function About() {
  const values = [
    {
      icon: Heart,
      title: "Compassion",
      description: "We approach every interaction with empathy and genuine care for the wellbeing of the communities we serve.",
    },
    {
      icon: Target,
      title: "Excellence",
      description: "We are committed to delivering the highest quality healthcare services and training programs.",
    },
    {
      icon: Users,
      title: "Community",
      description: "We believe in empowering local communities to take ownership of their health and wellbeing.",
    },
    {
      icon: Eye,
      title: "Transparency",
      description: "We operate with integrity and accountability, keeping our stakeholders informed every step of the way.",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-16 md:py-20 lg:py-24 bg-gradient-to-b from-primary/5 to-background">
        <div className="max-w-4xl mx-auto px-4 md:px-6 text-center">
          <h1 className="font-headings font-bold text-4xl md:text-5xl lg:text-6xl mb-6">
            About Us
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            Kenyaluk Medical Foundation is dedicated to transforming healthcare accessibility and quality in Kenya through innovative programs and community partnerships.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 md:py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <Card data-testid="card-mission">
              <CardContent className="p-8 md:p-12">
                <h2 className="font-headings font-semibold text-2xl md:text-3xl mb-4 text-primary">
                  Our Mission
                </h2>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  To provide accessible, quality healthcare services and empower communities through education, outreach, and professional development, creating lasting positive health outcomes across Kenya.
                </p>
              </CardContent>
            </Card>

            <Card data-testid="card-vision">
              <CardContent className="p-8 md:p-12">
                <h2 className="font-headings font-semibold text-2xl md:text-3xl mb-4 text-primary">
                  Our Vision
                </h2>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  A Kenya where every individual, regardless of location or economic status, has access to quality healthcare and the knowledge to maintain their wellbeing for generations to come.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 md:py-20 bg-card">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="font-headings font-semibold text-3xl md:text-4xl mb-4">
              Our Values
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              The principles that guide our work and shape our commitment to communities
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {values.map((value, index) => (
              <Card
                key={index}
                className="hover-elevate active-elevate-2 transition-all"
                data-testid={`value-card-${index}`}
              >
                <CardContent className="p-6 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                    <value.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-headings font-semibold text-xl mb-3">
                    {value.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 md:py-20 bg-background">
        <div className="max-w-4xl mx-auto px-4 md:px-6">
          <h2 className="font-headings font-semibold text-3xl md:text-4xl mb-8 text-center">
            Our Story
          </h2>
          <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
            <p>
              Founded over 15 years ago, Kenyaluk Medical Foundation began with a simple but powerful vision: to bridge the healthcare gap in underserved communities across Kenya.
            </p>
            <p>
              What started as a small medical outreach program has grown into a comprehensive healthcare initiative, serving over 10,000 individuals annually and training hundreds of healthcare professionals.
            </p>
            <p>
              Today, we operate three core programs—Health Advancement, Medical Aid Outreach, and Healthcare Professional Empowerment—each designed to address specific challenges in Kenya's healthcare landscape while creating sustainable, long-term impact.
            </p>
            <p>
              Our work is made possible by dedicated volunteers, generous donors, and partnerships with local healthcare facilities and community organizations who share our commitment to health equity.
            </p>
          </div>
        </div>
      </section>

      {/* Impact */}
      <section className="py-16 md:py-20 bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="font-headings font-semibold text-3xl md:text-4xl mb-4">
              Our Impact
            </h2>
            <p className="text-lg text-primary-foreground/90 max-w-2xl mx-auto">
              Measurable outcomes that demonstrate our commitment to healthcare transformation
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            <div className="text-center">
              <div className="font-headings font-bold text-5xl mb-2">10,000+</div>
              <p className="text-lg text-primary-foreground/90">Lives directly impacted through our programs</p>
            </div>
            <div className="text-center">
              <div className="font-headings font-bold text-5xl mb-2">50+</div>
              <p className="text-lg text-primary-foreground/90">Communities served across Kenya</p>
            </div>
            <div className="text-center">
              <div className="font-headings font-bold text-5xl mb-2">200+</div>
              <p className="text-lg text-primary-foreground/90">Healthcare workers trained and empowered</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
