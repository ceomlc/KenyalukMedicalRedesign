import { Card, CardContent } from "@/components/ui/card";
import { Heart, Target, Eye, Users } from "lucide-react";
import { useEffect, useState, useRef } from "react";

function AnimatedCounter({ end, duration = 2000, suffix = "" }: { end: number; duration?: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;

    const startTime = Date.now();
    const endTime = startTime + duration;

    const updateCount = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / duration, 1);
      const easeOutQuad = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(easeOutQuad * end);

      setCount(current);

      if (now < endTime) {
        requestAnimationFrame(updateCount);
      } else {
        setCount(end);
      }
    };

    updateCount();
  }, [hasStarted, end, duration]);

  return (
    <div ref={ref} className="font-headings font-bold text-5xl mb-2">
      {count.toLocaleString()}{suffix}
    </div>
  );
}

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
      <section className="py-16 md:py-20 lg:py-24 bg-gradient-to-br from-primary/10 via-background to-accent/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-primary/5 [mask-image:radial-gradient(white,transparent_70%)]" />
        <div className="max-w-4xl mx-auto px-4 md:px-6 text-center relative">
          <div className="inline-block animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h1 className="font-headings font-bold text-4xl md:text-5xl lg:text-6xl mb-6 bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
              About Us
            </h1>
          </div>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: "150ms" }}>
            Kenyaluk Medical Foundation is dedicated to transforming healthcare accessibility and quality in Kenya through innovative programs and community partnerships.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 md:py-20 bg-background">
        <div className="max-w-4xl mx-auto px-4 md:px-6">
          <h2 className="font-headings font-semibold text-3xl md:text-4xl mb-8 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
            Our Story
          </h2>
          <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
            <p className="animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: "100ms" }}>
              Founded over 15 years ago, Kenyaluk Medical Foundation began with a simple but powerful vision: to bridge the healthcare gap in underserved communities across Kenya.
            </p>
            <p className="animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: "200ms" }}>
              What started as a small medical outreach program has grown into a comprehensive healthcare initiative, serving over 10,000 individuals annually and training hundreds of healthcare professionals.
            </p>
            <p className="animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: "300ms" }}>
              Today, we operate three core programs—Health Advancement, Medical Aid Outreach, and Healthcare Professional Empowerment—each designed to address specific challenges in Kenya's healthcare landscape while creating sustainable, long-term impact.
            </p>
            <p className="animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: "400ms" }}>
              Our work is made possible by dedicated volunteers, generous donors, and partnerships with local healthcare facilities and community organizations who share our commitment to health equity.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 md:py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            <Card 
              className="animate-in fade-in slide-in-from-left-8 duration-700 border-primary/20 hover-elevate transition-all" 
              data-testid="card-mission"
            >
              <CardContent className="p-8 md:p-12">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-6">
                  <Target className="h-7 w-7 text-primary" />
                </div>
                <h2 className="font-headings font-semibold text-2xl md:text-3xl mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  Our Mission
                </h2>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  To provide accessible, quality healthcare services and empower communities through education, outreach, and professional development, creating lasting positive health outcomes across Kenya.
                </p>
              </CardContent>
            </Card>

            <Card 
              className="animate-in fade-in slide-in-from-right-8 duration-700 border-accent/20 hover-elevate transition-all"
              style={{ animationDelay: "150ms" }}
              data-testid="card-vision"
            >
              <CardContent className="p-8 md:p-12">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-accent/10 mb-6">
                  <Eye className="h-7 w-7 text-accent" />
                </div>
                <h2 className="font-headings font-semibold text-2xl md:text-3xl mb-4 bg-gradient-to-r from-accent to-accent/70 bg-clip-text text-transparent">
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
      <section className="py-16 md:py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
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
                className="hover-elevate active-elevate-2 transition-all animate-in fade-in slide-in-from-bottom-8 duration-700"
                style={{ animationDelay: `${index * 100}ms` }}
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

      {/* Impact */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-primary via-primary to-primary/90 text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/5" />
        <div className="max-w-7xl mx-auto px-4 md:px-6 relative">
          <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h2 className="font-headings font-semibold text-3xl md:text-4xl mb-4">
              Our Impact
            </h2>
            <p className="text-lg text-primary-foreground/90 max-w-2xl mx-auto">
              Measurable outcomes that demonstrate our commitment to healthcare transformation
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            <div className="text-center animate-in fade-in zoom-in-95 duration-700" style={{ animationDelay: "200ms" }}>
              <AnimatedCounter end={10000} suffix="+" />
              <p className="text-lg text-primary-foreground/90">Lives directly impacted through our programs</p>
            </div>
            <div className="text-center animate-in fade-in zoom-in-95 duration-700" style={{ animationDelay: "400ms" }}>
              <AnimatedCounter end={50} suffix="+" />
              <p className="text-lg text-primary-foreground/90">Communities served across Kenya</p>
            </div>
            <div className="text-center animate-in fade-in zoom-in-95 duration-700" style={{ animationDelay: "600ms" }}>
              <AnimatedCounter end={200} suffix="+" />
              <p className="text-lg text-primary-foreground/90">Healthcare workers trained and empowered</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
