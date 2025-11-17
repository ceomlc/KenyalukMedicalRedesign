import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Users, Stethoscope, GraduationCap, ArrowRight, CheckCircle2, Quote, Sparkles, TrendingUp, Shield } from "lucide-react";
import heroImage from "@assets/generated_images/Homepage_hero_medical_mission_8407b3a7.png";

export default function Landing() {
  const programs = [
    {
      title: "Health Advancement",
      description: "Community health education and wellness programs that empower individuals with knowledge about nutrition, disease prevention, and healthy lifestyles.",
      icon: Heart,
      link: "/programs/health-advancement",
    },
    {
      title: "Medical Aid Outreach",
      description: "Mobile medical services bringing healthcare directly to underserved communities across Kenya, providing essential checkups and treatments.",
      icon: Stethoscope,
      link: "/programs/medical-outreach",
    },
    {
      title: "Healthcare Professional Empowerment",
      description: "Training and mentoring programs that strengthen the capacity of local healthcare workers to deliver quality medical services.",
      icon: GraduationCap,
      link: "/programs/professional-empowerment",
    },
  ];

  const stats = [
    { value: "10,000+", label: "Lives Impacted", icon: Heart },
    { value: "50+", label: "Communities Served", icon: Users },
    { value: "200+", label: "Healthcare Workers Trained", icon: GraduationCap },
    { value: "15+", label: "Years of Service", icon: TrendingUp },
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
      {/* Hero Section with Animated Background */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Gradient Orbs Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5">
          <div className="absolute top-0 left-0 w-96 h-96 bg-primary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-accent/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000" />
          <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-primary/10 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000" />
        </div>

        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-grid-primary/5 [mask-image:radial-gradient(ellipse_at_center,white_40%,transparent_75%)]" />

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-32">
          <div className="text-center space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Transforming Healthcare Across Kenya</span>
            </div>

            {/* Main Heading - Extra Large */}
            <h1 className="font-headings font-bold text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl leading-none tracking-tight">
              <span className="block">Make a Difference</span>
              <span className="block bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
                Today
              </span>
            </h1>

            {/* Subheading */}
            <p className="max-w-3xl mx-auto text-lg sm:text-xl md:text-2xl lg:text-3xl text-muted-foreground leading-relaxed">
              Empowering communities through accessible healthcare, medical education,
              and professional development.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Button
                size="lg"
                className="text-lg px-8 py-6 rounded-full"
                asChild
                data-testid="button-donate-hero"
              >
                <Link href="/donate">
                  Donate Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-6 rounded-full backdrop-blur-sm bg-background/50"
                asChild
                data-testid="button-learn-more"
              >
                <Link href="/about">Learn More</Link>
              </Button>
            </div>

            {/* Trust Indicator */}
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground pt-4">
              <Shield className="w-4 h-4" />
              <span>Trusted by 10,000+ beneficiaries across Kenya</span>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-primary/30 rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-3 bg-primary/50 rounded-full animate-pulse" />
          </div>
        </div>
      </section>

      {/* Impact Stats Section with Glass Morphism */}
      <section className="relative py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="relative group animate-in fade-in slide-in-from-bottom-8 duration-700"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="p-8 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm hover-elevate transition-all">
                  <stat.icon className="w-8 h-8 text-primary mb-4" />
                  <div className="text-4xl md:text-5xl font-bold bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <div className="text-sm md:text-base text-muted-foreground mt-2">
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Programs Section - Premium Cards */}
      <section className="py-24 md:py-32 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-4">
            <h2 className="font-headings font-bold text-4xl md:text-5xl lg:text-6xl">
              Our Programs
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
              Comprehensive healthcare solutions addressing critical needs across Kenya
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {programs.map((program, index) => (
              <Card
                key={index}
                className="group relative overflow-hidden border-0 shadow-lg hover-elevate transition-all duration-500 animate-in fade-in slide-in-from-bottom-8"
                style={{ animationDelay: `${index * 150}ms` }}
                data-testid={`program-card-${index}`}
              >
                {/* Gradient Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <CardContent className="relative p-8 space-y-6">
                  {/* Icon */}
                  <div className="inline-flex p-4 rounded-2xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <program.icon className="w-8 h-8 text-primary" />
                  </div>

                  {/* Content */}
                  <div className="space-y-3">
                    <h3 className="font-headings font-semibold text-2xl md:text-3xl">
                      {program.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {program.description}
                    </p>
                  </div>

                  {/* CTA */}
                  <Button
                    variant="ghost"
                    className="group/btn p-0 h-auto font-semibold text-primary hover:text-primary"
                    asChild
                  >
                    <Link href={program.link}>
                      Learn More
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Full Width with Gradient */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-primary/90" />
        <div className="absolute inset-0 bg-grid-white/5" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 md:px-6 lg:px-8 text-center text-primary-foreground">
          <h2 className="font-headings font-bold text-4xl md:text-5xl lg:text-6xl mb-6">
            Every Contribution Counts
          </h2>
          <p className="text-lg md:text-xl lg:text-2xl mb-10 opacity-90 max-w-3xl mx-auto leading-relaxed">
            Join us in transforming healthcare access for underserved communities.
            Your support makes a lasting impact.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              variant="secondary"
              className="text-lg px-8 py-6 rounded-full"
              asChild
              data-testid="button-donate-cta"
            >
              <Link href="/donate">
                Make a Donation
                <Heart className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-6 rounded-full bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
              asChild
              data-testid="button-volunteer-cta"
            >
              <Link href="/volunteer">Volunteer With Us</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials - Modern Grid */}
      <section className="py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-4">
            <h2 className="font-headings font-bold text-4xl md:text-5xl lg:text-6xl">
              Impact Stories
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground">
              Hear from those we serve
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="relative overflow-hidden border-0 shadow-lg hover-elevate transition-all animate-in fade-in slide-in-from-bottom-8"
                style={{ animationDelay: `${index * 150}ms` }}
                data-testid={`testimonial-card-${index}`}
              >
                <CardContent className="p-8 md:p-10 space-y-6">
                  {/* Quote Icon */}
                  <Quote className="w-12 h-12 text-primary/20" />

                  {/* Quote */}
                  <blockquote className="text-lg md:text-xl leading-relaxed italic">
                    "{testimonial.quote}"
                  </blockquote>

                  {/* Attribution */}
                  <div className="flex items-center gap-4 pt-4 border-t">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-xl font-semibold text-primary">
                        {testimonial.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <div className="font-semibold">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
