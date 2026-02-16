import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Users, Stethoscope, GraduationCap, ArrowRight, HandHeart, Calendar, Mail, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { useCloudinaryImages, heroUrl, optimizedUrl } from "@/hooks/useCloudinaryImages";
import heroImage1 from "@assets/generated_images/Homepage_hero_medical_mission_8407b3a7.png";
import heroImage2 from "@assets/generated_images/Medical_Aid_Outreach_program_6e6641dc.png";
import heroImage3 from "@assets/generated_images/Health_Advancement_program_image_2dd82fce.png";
import heroImage4 from "@assets/generated_images/Healthcare_Professional_Empowerment_program_d2a2e1c9.png";

const fallbackHeroSlides = [
  { image: heroImage1, alt: "Healthcare workers providing medical care to community members" },
  { image: heroImage2, alt: "Medical outreach program serving rural communities" },
  { image: heroImage3, alt: "Health advancement and education program" },
  { image: heroImage4, alt: "Healthcare professional training and empowerment" },
];

const fallbackMissionImage = heroImage1;

export default function Landing() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const { images: cloudinaryHeroImages, hasImages: hasHeroImages } = useCloudinaryImages({
    folder: "hero",
    limit: 10,
  });

  const { images: cloudinaryMissionImages, hasImages: hasMissionImages } = useCloudinaryImages({
    folder: "mission",
    limit: 1,
  });

  const heroSlides = useMemo(() => {
    if (hasHeroImages) {
      return cloudinaryHeroImages.map((img) => ({
        image: heroUrl(img.url),
        alt: img.alt || img.caption || "Kenyaluk Medical Foundation",
      }));
    }
    return fallbackHeroSlides;
  }, [hasHeroImages, cloudinaryHeroImages]);

  const missionImage = useMemo(() => {
    if (hasMissionImages) {
      return {
        src: optimizedUrl(cloudinaryMissionImages[0].url, 800),
        alt: cloudinaryMissionImages[0].alt || "Healthcare workers serving the community",
      };
    }
    return { src: fallbackMissionImage, alt: "Healthcare workers serving the community" };
  }, [hasMissionImages, cloudinaryMissionImages]);

  useEffect(() => {
    if (heroSlides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  useEffect(() => {
    if (currentSlide >= heroSlides.length) {
      setCurrentSlide(0);
    }
  }, [heroSlides.length, currentSlide]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);

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

  const getInvolvedOptions = [
    {
      title: "Support Our Advocacy",
      description: "Help us advocate for better healthcare policies and resources in underserved communities.",
      icon: Heart,
      link: "/donate",
      buttonText: "Donate Now",
    },
    {
      title: "Sign Up As a Sponsor",
      description: "Partner with us to create lasting impact through strategic sponsorships.",
      icon: HandHeart,
      link: "/sponsor",
      buttonText: "Become a Sponsor",
    },
    {
      title: "Be a Volunteer",
      description: "Join our team of dedicated volunteers making a real difference in healthcare across Kenya.",
      icon: Users,
      link: "/volunteer",
      buttonText: "Join Us",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section with Image Carousel */}
      <section className="relative min-h-[600px] md:min-h-[700px] lg:min-h-[800px] overflow-hidden">
        {/* Image Slider */}
        <div className="absolute inset-0">
          {heroSlides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? "opacity-100" : "opacity-0"
              }`}
            >
              <img
                src={slide.image}
                alt={slide.alt}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
        </div>

        {/* Slider Controls */}
        {heroSlides.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors"
              aria-label="Previous slide"
              data-testid="button-prev-slide"
            >
              <ChevronLeft className="h-6 w-6 text-white" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors"
              aria-label="Next slide"
              data-testid="button-next-slide"
            >
              <ChevronRight className="h-6 w-6 text-white" />
            </button>

            {/* Slide Indicators */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2" role="tablist">
              {heroSlides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentSlide ? "bg-white w-8" : "bg-white/50"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                  aria-pressed={index === currentSlide}
                  role="tab"
                  aria-selected={index === currentSlide}
                  data-testid={`slide-indicator-${index}`}
                />
              ))}
            </div>
          </>
        )}

        {/* Hero Content */}
        <div className="relative z-10 h-full min-h-[600px] md:min-h-[700px] lg:min-h-[800px] flex items-center justify-center">
          <div className="max-w-4xl mx-auto px-4 md:px-6 text-center text-white">
            <h2 className="text-lg md:text-xl uppercase tracking-widest mb-4 text-white/80">
              Welcome to Kenyaluk Medical Foundation
            </h2>
            <h1 className="font-headings font-bold text-4xl md:text-5xl lg:text-6xl xl:text-7xl mb-6 leading-tight">
              Compassion Knows No Borders
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl mb-10 text-white/90 max-w-2xl mx-auto leading-relaxed">
              Compassion is the universal language that unites us to make a positive impact around the world.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="text-lg px-8"
                asChild
                data-testid="button-find-out-more"
              >
                <Link href="/about">Find Out More</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20"
                asChild
                data-testid="button-donate-hero"
              >
                <Link href="/donate">
                  Donate Now
                  <Heart className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Welcome Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="max-w-4xl mx-auto px-4 md:px-6 text-center">
          <h2 className="font-headings font-bold text-3xl md:text-4xl lg:text-5xl mb-6 text-primary">
            Welcome to Kenyaluk Medical Foundation
          </h2>
          <p className="text-lg md:text-xl leading-relaxed text-muted-foreground">
            Welcome to where we believe in the transformative power of healthcare and the strength of unity in action. 
            We invite you to explore our website to learn more about our initiatives, programs, and partnerships aimed 
            at creating a healthier and more equitable world. Join us on this journey to make a meaningful difference. 
            Together, we can build a brighter and healthier future for all.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 md:py-24 bg-muted/50">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <h3 className="text-sm uppercase tracking-widest text-primary font-semibold mb-2">
                We Are Committed
              </h3>
              <h2 className="font-headings font-bold text-3xl md:text-4xl mb-6">
                Our Mission Statement
              </h2>
              <p className="text-lg leading-relaxed text-muted-foreground mb-8">
                Our mission is clear; to provide quality healthcare and promote well-being in underserved communities in Kenya. Through collaborative efforts, innovative initiatives, and a strong commitment to equity, we aim to address pressing healthcare challenges and empower individuals to lead healthier lives.
              </p>
              <Button asChild data-testid="button-about-mission">
                <Link href="/about#mission">
                  Learn More About Us
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="order-1 lg:order-2">
              <div className="relative rounded-2xl overflow-hidden shadow-xl">
                <img
                  src={missionImage.src}
                  alt={missionImage.alt}
                  className="w-full h-[400px] object-cover"
                  data-testid="image-mission"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Start a Change Today CTA */}
      <section className="py-16 md:py-24 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto px-4 md:px-6 text-center">
          <h2 className="font-headings font-bold text-3xl md:text-4xl lg:text-5xl mb-4">
            Start a Change Today!
          </h2>
          <p className="text-lg md:text-xl mb-8 opacity-90">
            Start creating a positive change in the world today.
          </p>
          <Button
            size="lg"
            variant="secondary"
            className="text-lg px-8"
            asChild
            data-testid="button-view-programs"
          >
            <Link href="/programs">
              Explore Our Programs
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Get Involved Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h3 className="text-sm uppercase tracking-widest text-primary font-semibold mb-2">
              You Are Important to Us
            </h3>
            <h2 className="font-headings font-bold text-3xl md:text-4xl lg:text-5xl mb-4">
              Let's Get Started
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Your impact matters: Let's get started on your journey to making a difference together.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {getInvolvedOptions.map((option, index) => (
              <Card
                key={index}
                className="group hover-elevate transition-all duration-300 border-2 hover:border-primary/30"
                data-testid={`get-involved-card-${index}`}
              >
                <CardContent className="p-8 text-center">
                  <div className="inline-flex p-4 rounded-full bg-primary/10 mb-6 group-hover:bg-primary/20 transition-colors">
                    <option.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-headings font-semibold text-xl md:text-2xl mb-4">
                    {option.title}
                  </h3>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {option.description}
                  </p>
                  <Button asChild data-testid={`button-${option.buttonText.toLowerCase().replace(/\s/g, '-')}`}>
                    <Link href={option.link}>
                      {option.buttonText}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Programs Preview */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="font-headings font-bold text-3xl md:text-4xl lg:text-5xl mb-4">
              Our Programs
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Comprehensive healthcare solutions addressing critical needs across Kenya
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {programs.map((program, index) => (
              <Card
                key={index}
                className="group overflow-hidden hover-elevate transition-all duration-300"
                data-testid={`program-card-${index}`}
              >
                <CardContent className="p-8">
                  <div className="inline-flex p-4 rounded-2xl bg-primary/10 mb-6 group-hover:bg-primary/20 transition-colors">
                    <program.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-headings font-semibold text-xl md:text-2xl mb-4">
                    {program.title}
                  </h3>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {program.description}
                  </p>
                  <Button variant="ghost" className="p-0 h-auto font-semibold text-primary" asChild>
                    <Link href={program.link}>
                      Learn More
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events Preview */}
      <section className="py-16 md:py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12">
            <div>
              <h2 className="font-headings font-bold text-3xl md:text-4xl mb-2">
                Upcoming Events
              </h2>
              <p className="text-muted-foreground">
                Join us at our upcoming events and workshops
              </p>
            </div>
            <Button variant="outline" asChild data-testid="button-view-all-events">
              <Link href="/events">
                View All Events
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <Card className="overflow-hidden">
            <CardContent className="p-8 md:p-12">
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                    <Calendar className="w-10 h-10 text-primary" />
                  </div>
                </div>
                <div className="flex-grow text-center md:text-left">
                  <h3 className="font-headings font-semibold text-2xl mb-2">
                    Medical Mission Fair
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Join us for our annual medical mission fair featuring health screenings, 
                    wellness workshops, and community outreach programs.
                  </p>
                  <Button asChild data-testid="button-event-register">
                    <Link href="/events">
                      Learn More & Register
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 md:py-24 bg-accent text-accent-foreground">
        <div className="max-w-4xl mx-auto px-4 md:px-6 text-center">
          <Mail className="w-16 h-16 mx-auto mb-6 opacity-90" />
          <h2 className="font-headings font-bold text-3xl md:text-4xl mb-4">
            Reach Out to Us
          </h2>
          <p className="text-lg md:text-xl mb-8 opacity-90">
            Have questions or want to get involved? Let's connect; we're here to help.
          </p>
          <Button
            size="lg"
            variant="secondary"
            className="text-lg px-8"
            asChild
            data-testid="button-send-message"
          >
            <Link href="/contact">
              Send Us a Message
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
