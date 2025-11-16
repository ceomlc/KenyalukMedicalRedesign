import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Users, Stethoscope, GraduationCap, ArrowRight, CheckCircle2, Quote } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import heroImage from "@assets/generated_images/Homepage_hero_medical_mission_8407b3a7.png";

export default function Landing() {
  const programs = [
    {
      title: "Health Advancement",
      description: "Community health education and wellness programs that empower individuals with knowledge about nutrition, disease prevention, and healthy lifestyles.",
      icon: Heart,
      color: "text-pink-600 dark:text-pink-400",
    },
    {
      title: "Medical Aid Outreach",
      description: "Mobile medical services bringing healthcare directly to underserved communities across Kenya, providing essential checkups and treatments.",
      icon: Stethoscope,
      color: "text-blue-600 dark:text-blue-400",
    },
    {
      title: "Healthcare Professional Empowerment",
      description: "Training and mentoring programs that strengthen the capacity of local healthcare workers to deliver quality medical services.",
      icon: GraduationCap,
      color: "text-purple-600 dark:text-purple-400",
    },
  ];

  const stats = [
    { value: 10000, label: "Lives Impacted", suffix: "+" },
    { value: 50, label: "Communities Served", suffix: "+" },
    { value: 200, label: "Healthcare Workers Trained", suffix: "+" },
    { value: 15, label: "Years of Service", suffix: "+" },
  ];

  const testimonials = [
    {
      name: "Dr. Sarah Kimani",
      role: "Community Health Director",
      quote: "The medical training programs have transformed how our team delivers care to rural communities.",
    },
    {
      name: "James Ochieng",
      role: "Community Leader",
      quote: "Having access to regular health screenings has made a profound difference in our village's wellbeing.",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[600px] md:min-h-[700px] lg:min-h-[800px] flex items-center justify-center overflow-hidden">
        {/* Background Image with Gradient Overlay */}
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Healthcare workers providing medical care to community members"
            className="w-full h-full object-cover"
            data-testid="hero-image"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/60" />
        </div>

        {/* Animated Hero Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-6 text-center animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <Badge className="mb-6 text-white bg-white/20 backdrop-blur-sm border-white/30" data-testid="badge-hero">
            Transforming Healthcare in Kenya
          </Badge>
          
          <h1 className="font-headings font-bold text-white text-4xl md:text-6xl lg:text-7xl mb-6 leading-tight tracking-tight">
            Empowering Communities
            <br />
            <span className="bg-gradient-to-r from-primary/90 to-primary bg-clip-text text-transparent">
              Through Healthcare
            </span>
          </h1>
          
          <p className="text-white/90 text-lg md:text-xl lg:text-2xl mb-10 max-w-3xl mx-auto leading-relaxed">
            Providing accessible healthcare, medical education, and professional development for a healthier tomorrow.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              className="backdrop-blur-sm bg-white/10 border border-white/20 text-white"
              asChild
              data-testid="button-login"
            >
              <a href="/api/login">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="backdrop-blur-sm bg-white/10 border border-white/20 text-white"
              asChild
              data-testid="button-learn-more"
            >
              <Link href="/about">Learn More About Our Mission</Link>
            </Button>
          </div>
          
          <p className="mt-8 text-white/70 text-sm md:text-base">
            <CheckCircle2 className="inline-block h-4 w-4 mr-2" />
            Trusted by 10,000+ beneficiaries across Kenya
          </p>
        </div>

        {/* Floating scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-3 bg-white/50 rounded-full" />
          </div>
        </div>
      </section>

      {/* Impact Metrics with Animation */}
      <section className="py-20 md:py-24 bg-gradient-to-b from-background to-muted/30">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
            {stats.map((stat, index) => (
              <StatCounter
                key={index}
                value={stat.value}
                label={stat.label}
                suffix={stat.suffix}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section className="py-20 md:py-24 lg:py-32 bg-background">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Badge className="mb-4" variant="outline" data-testid="badge-programs">
              Our Impact
            </Badge>
            <h2 className="font-headings font-bold text-4xl md:text-5xl lg:text-6xl mb-6 tracking-tight">
              Comprehensive Healthcare Programs
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Designed to create lasting impact in communities across Kenya through education, outreach, and empowerment
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {programs.map((program, index) => (
              <Card
                key={index}
                className="hover-elevate active-elevate-2 transition-all duration-300 border-2 group"
                data-testid={`program-card-${index}`}
              >
                <CardContent className="p-8 md:p-10">
                  <div className="mb-6 inline-block p-4 rounded-2xl bg-gradient-to-br from-muted to-background">
                    <program.icon className={`h-10 w-10 ${program.color}`} />
                  </div>
                  
                  <h3 className="font-headings font-bold text-2xl md:text-3xl mb-4 group-hover:text-primary transition-colors">
                    {program.title}
                  </h3>
                  
                  <p className="text-muted-foreground leading-relaxed mb-6 text-base">
                    {program.description}
                  </p>
                  
                  <Button
                    variant="link"
                    className="group/btn font-semibold text-primary"
                    asChild
                    data-testid={`link-program-${index}`}
                  >
                    <Link href="/programs">
                      <span className="inline-flex items-center">
                        Learn More 
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                      </span>
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 md:py-24 bg-gradient-to-b from-muted/50 to-background">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="font-headings font-bold text-4xl md:text-5xl mb-6 tracking-tight">
              Stories from the Field
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Hear from those making a difference every day
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="hover-elevate transition-all duration-300"
                data-testid={`testimonial-card-${index}`}
              >
                <CardContent className="p-8 md:p-10">
                  <Quote className="h-10 w-10 text-primary/20 mb-4" />
                  <p className="text-lg leading-relaxed mb-6 italic">
                    "{testimonial.quote}"
                  </p>
                  <div>
                    <div className="font-semibold text-foreground">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section with Gradient */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-primary/80" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.1),transparent_50%)]" />
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 md:px-6 text-center">
          <h2 className="font-headings font-bold text-4xl md:text-5xl lg:text-6xl mb-6 text-primary-foreground tracking-tight">
            Join Us in Making a Difference
          </h2>
          <p className="text-xl md:text-2xl mb-10 text-primary-foreground/90 leading-relaxed max-w-2xl mx-auto">
            Your support helps us provide essential healthcare services to communities that need it most
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              variant="secondary"
              asChild
              data-testid="button-donate-cta"
            >
              <Link href="/donate">
                Donate Now
                <Heart className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            
            <Button
              size="lg"
              variant="outline"
              className="bg-transparent border-primary-foreground/20 text-primary-foreground backdrop-blur-sm"
              asChild
              data-testid="button-volunteer-cta"
            >
              <Link href="/volunteer">
                Become a Volunteer
                <Users className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

// Animated stat counter component
function StatCounter({ value, label, suffix, index }: { value: number; label: string; suffix: string; index: number }) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) return;

    const duration = 2000;
    const steps = 60;
    const stepValue = value / steps;
    const stepDuration = duration / steps;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      if (currentStep <= steps) {
        setCount(Math.floor(stepValue * currentStep));
      } else {
        setCount(value);
        clearInterval(timer);
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, [isVisible, value]);

  return (
    <div
      ref={ref}
      className="text-center animate-in fade-in slide-in-from-bottom-4 duration-700"
      style={{ animationDelay: `${index * 100}ms` }}
      data-testid={`stat-${index}`}
    >
      <div className="font-headings font-bold text-5xl md:text-6xl lg:text-7xl bg-gradient-to-br from-primary to-primary/60 bg-clip-text text-transparent mb-3">
        {count.toLocaleString()}{suffix}
      </div>
      <div className="text-base md:text-lg text-muted-foreground font-medium">{label}</div>
    </div>
  );
}
