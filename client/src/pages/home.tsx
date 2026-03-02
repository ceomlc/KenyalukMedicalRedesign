import { useState, useEffect, useCallback } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Stethoscope, GraduationCap, ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useCloudinaryImages, heroUrl } from "@/hooks/useCloudinaryImages";
import heroImageFallback from "@assets/generated_images/Homepage_hero_medical_mission_8407b3a7.png";

const SLIDE_INTERVAL_MS = 7000;
const FADE_DURATION_MS = 1000;

export default function Home() {
  const { data: randomizerSetting } = useQuery<{ key: string; value: string }>({
    queryKey: ["/api/settings/hero_randomizer"],
    staleTime: 30 * 1000,
  });

  const isRandomMode = randomizerSetting?.value === "true";

  const { images: heroFolderImages, hasImages: hasHeroImages } = useCloudinaryImages({
    folder: "hero",
    limit: 1,
    enabled: !isRandomMode,
  });

  const { images: allCloudinaryImages, hasImages: hasAnyImages } = useCloudinaryImages({
    folder: "",
    limit: 100,
    enabled: isRandomMode,
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState(1);
  const [isFading, setIsFading] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (hasAnyImages && allCloudinaryImages.length > 0) {
      const start = Math.floor(Math.random() * allCloudinaryImages.length);
      setCurrentIndex(start);
      setNextIndex((start + 1) % allCloudinaryImages.length);
    }
  }, [hasAnyImages, allCloudinaryImages.length]);

  const advance = useCallback(() => {
    if (!isRandomMode || allCloudinaryImages.length <= 1) return;
    setIsFading(true);
    setTimeout(() => {
      setCurrentIndex((prev) => {
        const next = (prev + 1) % allCloudinaryImages.length;
        setNextIndex((next + 1) % allCloudinaryImages.length);
        return next;
      });
      setIsFading(false);
    }, FADE_DURATION_MS);
  }, [isRandomMode, allCloudinaryImages.length]);

  useEffect(() => {
    if (!isRandomMode || allCloudinaryImages.length <= 1 || isPaused) return;
    const timer = setInterval(advance, SLIDE_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [isRandomMode, allCloudinaryImages.length, isPaused, advance]);

  const carouselImages = isRandomMode && hasAnyImages ? allCloudinaryImages : null;

  const fixedImage = (() => {
    if (isRandomMode) return null;
    if (hasHeroImages) return heroUrl(heroFolderImages[0].url);
    return heroImageFallback;
  })();

  const programs = [
    {
      title: "Health Advancement",
      description: "Community health education and wellness programs",
      icon: Heart,
      slug: "health-advancement",
    },
    {
      title: "Medical Aid Outreach",
      description: "Mobile medical services for underserved communities",
      icon: Stethoscope,
      slug: "medical-aid-outreach",
    },
    {
      title: "Healthcare Professional Empowerment",
      description: "Training and mentoring for healthcare workers",
      icon: GraduationCap,
      slug: "healthcare-professional-empowerment",
    },
  ];

  const stats = [
    { value: "10,000+", label: "Lives Impacted" },
    { value: "50+", label: "Communities Served" },
    { value: "200+", label: "Healthcare Workers Trained" },
    { value: "15+", label: "Years of Service" },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section
        className="relative min-h-[600px] md:min-h-[700px] lg:min-h-[800px] flex items-center justify-center overflow-hidden"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {carouselImages ? (
          <>
            {/* Current image */}
            <div
              className="absolute inset-0 transition-opacity"
              style={{ transitionDuration: `${FADE_DURATION_MS}ms`, opacity: isFading ? 0 : 1 }}
            >
              <img
                src={heroUrl(carouselImages[currentIndex]?.url ?? heroImageFallback)}
                alt="Homepage hero"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Next image (pre-loaded underneath for seamless fade) */}
            <div
              className="absolute inset-0 transition-opacity"
              style={{ transitionDuration: `${FADE_DURATION_MS}ms`, opacity: isFading ? 1 : 0 }}
            >
              <img
                src={heroUrl(carouselImages[nextIndex]?.url ?? heroImageFallback)}
                alt="Homepage hero"
                className="w-full h-full object-cover"
              />
            </div>
          </>
        ) : (
          <div className="absolute inset-0">
            <img
              src={fixedImage ?? heroImageFallback}
              alt="Homepage hero"
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Dark wash overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70 z-10" />

        {/* Hero content */}
        <div className="relative z-20 max-w-5xl mx-auto px-4 md:px-6 text-center">
          <h1 className="font-headings font-bold text-white text-4xl md:text-6xl lg:text-7xl mb-6 leading-tight">
            Transforming Lives Through Healthcare
          </h1>
          <p className="text-white/90 text-lg md:text-xl lg:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed">
            Empowering communities in Kenya with accessible healthcare, medical education, and professional development.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              className="text-base md:text-lg font-semibold px-8 backdrop-blur-sm bg-white/10 border border-white/20 text-white hover:bg-white/20 min-h-12 md:min-h-14"
              asChild
              data-testid="button-donate-hero"
            >
              <Link href="/donate">Donate Now</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-base md:text-lg font-semibold px-8 backdrop-blur-sm bg-white/10 border border-white/20 text-white hover:bg-white/20 min-h-12 md:min-h-14"
              asChild
              data-testid="button-volunteer-hero"
            >
              <Link href="/volunteer">Volunteer</Link>
            </Button>
          </div>
        </div>

      </section>

      {/* Impact Metrics */}
      <section className="py-16 md:py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
            {stats.map((stat, index) => (
              <div key={index} className="text-center" data-testid={`stat-${index}`}>
                <div className="font-headings font-bold text-4xl md:text-5xl text-primary mb-2">
                  {stat.value}
                </div>
                <div className="text-lg text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section className="py-16 md:py-20 lg:py-24 bg-card">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="font-headings font-semibold text-3xl md:text-4xl lg:text-5xl mb-4">
              Our Programs
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Comprehensive healthcare initiatives creating lasting impact
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {programs.map((program, index) => (
              <Card
                key={index}
                className="hover-elevate active-elevate-2 transition-all duration-200"
                data-testid={`program-card-${index}`}
              >
                <CardContent className="p-6 md:p-8">
                  <program.icon className="h-12 w-12 text-primary mb-4" />
                  <h3 className="font-headings font-semibold text-xl md:text-2xl mb-3">
                    {program.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    {program.description}
                  </p>
                  <Button
                    variant="ghost"
                    className="p-0 h-auto font-medium text-primary"
                    asChild
                    data-testid={`link-program-${program.slug}`}
                  >
                    <Link href={`/programs/${program.slug}`}>
                      <span className="inline-flex items-center">
                        Learn More <ArrowRight className="ml-2 h-4 w-4" />
                      </span>
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto px-4 md:px-6 text-center">
          <h2 className="font-headings font-semibold text-3xl md:text-4xl mb-4">
            Join Us in Making a Difference
          </h2>
          <p className="text-lg md:text-xl mb-8 text-primary-foreground/90 leading-relaxed">
            Your support helps us provide essential healthcare services to communities that need it most
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              variant="secondary"
              className="text-base md:text-lg font-semibold px-8 min-h-12 md:min-h-14"
              asChild
              data-testid="button-donate-cta"
            >
              <Link href="/donate">Donate Now</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-base md:text-lg font-semibold px-8 bg-transparent border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10 min-h-12 md:min-h-14"
              asChild
              data-testid="button-get-involved"
            >
              <Link href="/volunteer">Get Involved</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
