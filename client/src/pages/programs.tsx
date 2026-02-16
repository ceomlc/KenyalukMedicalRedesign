import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Stethoscope, GraduationCap, ArrowRight, Users, MapPin, TrendingUp } from "lucide-react";
import { useCloudinaryImages, optimizedUrl } from "@/hooks/useCloudinaryImages";
import healthImage from "@assets/generated_images/Health_Advancement_program_image_2dd82fce.png";
import outreachImage from "@assets/generated_images/Medical_Aid_Outreach_program_6e6641dc.png";
import empowermentImage from "@assets/generated_images/Healthcare_Professional_Empowerment_program_d2a2e1c9.png";

const programConfigs = [
  {
    title: "Health Advancement",
    slug: "health-advancement",
    cloudinaryFolder: "programs/health-advancement",
    fallbackImage: healthImage,
    description: "Empowering communities through health education and wellness programs that promote disease prevention and healthy lifestyles.",
    icon: Heart,
    color: "text-pink-600 dark:text-pink-400",
    bgColor: "bg-pink-50 dark:bg-pink-950/20",
    highlights: [
      "Community health education workshops",
      "Nutrition and disease prevention programs",
      "Wellness screenings and health assessments",
      "Health literacy campaigns",
    ],
    stats: {
      beneficiaries: "5,000+",
      communities: "25+",
      impact: "40% improvement",
    },
  },
  {
    title: "Medical Aid Outreach",
    slug: "medical-aid-outreach",
    cloudinaryFolder: "programs/medical-aid-outreach",
    fallbackImage: outreachImage,
    description: "Bringing essential healthcare services directly to underserved communities through mobile medical missions.",
    icon: Stethoscope,
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-50 dark:bg-blue-950/20",
    highlights: [
      "Mobile medical clinics in rural areas",
      "Free health checkups and consultations",
      "Essential medication distribution",
      "Follow-up care coordination",
    ],
    stats: {
      beneficiaries: "3,000+",
      communities: "15+",
      impact: "60% access increase",
    },
  },
  {
    title: "Healthcare Professional Empowerment",
    slug: "healthcare-professional-empowerment",
    cloudinaryFolder: "programs/healthcare-professional-empowerment",
    fallbackImage: empowermentImage,
    description: "Strengthening local healthcare capacity through training, mentorship, and professional development programs.",
    icon: GraduationCap,
    color: "text-purple-600 dark:text-purple-400",
    bgColor: "bg-purple-50 dark:bg-purple-950/20",
    highlights: [
      "Medical skills training workshops",
      "Mentorship programs for healthcare workers",
      "Continuing education opportunities",
      "Best practices sharing and collaboration",
    ],
    stats: {
      beneficiaries: "200+",
      communities: "10+",
      impact: "85% skill improvement",
    },
  },
];

function ProgramImage({ folder, fallback, alt }: { folder: string; fallback: string; alt: string }) {
  const { images, hasImages } = useCloudinaryImages({ folder, limit: 1 });
  const src = hasImages ? optimizedUrl(images[0].url, 800) : fallback;
  const imgAlt = hasImages ? (images[0].alt || alt) : alt;
  return (
    <img
      src={src}
      alt={imgAlt}
      className="w-full h-full object-cover"
      data-testid={`image-${folder.replace(/\//g, '-')}`}
    />
  );
}

export default function Programs() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 md:py-28 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-muted/30" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(var(--primary-rgb,0,0,0),0.1),transparent_50%)]" />
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 md:px-6 text-center">
          <Badge className="mb-6" variant="outline" data-testid="badge-programs">
            Transforming Lives
          </Badge>
          
          <h1 className="font-headings font-bold text-4xl md:text-5xl lg:text-6xl xl:text-7xl mb-6 tracking-tight bg-gradient-to-br from-foreground to-foreground/60 bg-clip-text">
            Our Programs
          </h1>
          
          <p className="text-lg md:text-xl lg:text-2xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
            Comprehensive healthcare initiatives designed to create sustainable impact in communities across Kenya
          </p>
        </div>
      </section>

      {/* Programs Grid */}
      <section className="py-16 md:py-20 lg:py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="space-y-20 md:space-y-28">
            {programConfigs.map((program, index) => (
              <div
                key={index}
                className="animate-in fade-in slide-in-from-bottom-8 duration-1000"
                style={{ animationDelay: `${index * 200}ms` }}
                data-testid={`program-section-${program.slug}`}
              >
                <Card className="overflow-hidden border-2 hover-elevate active-elevate-2 transition-all duration-500 group">
                  <div className={`flex flex-col ${index % 2 === 1 ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}>
                    {/* Image Column */}
                    <div className="relative lg:w-2/5 flex-shrink-0">
                      <div className="relative aspect-[4/3] lg:aspect-auto lg:h-full">
                        <ProgramImage
                          folder={program.cloudinaryFolder}
                          fallback={program.fallbackImage}
                          alt={program.title}
                        />
                        
                        {/* Floating Icon Badge */}
                        <div className="absolute top-6 left-6 lg:top-8 lg:left-8">
                          <div className={`inline-flex items-center justify-center p-4 rounded-2xl ${program.bgColor} backdrop-blur-sm shadow-lg`}>
                            <program.icon className={`h-8 w-8 ${program.color}`} />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Content Column */}
                    <CardContent className="lg:w-3/5 p-8 md:p-10 lg:p-12 flex flex-col justify-center">
                      <h2 className="font-headings font-bold text-3xl md:text-4xl lg:text-5xl mb-4 tracking-tight group-hover:text-primary transition-colors">
                        {program.title}
                      </h2>
                      
                      <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-8">
                        {program.description}
                      </p>

                      {/* Program Stats */}
                      <div className="grid grid-cols-3 gap-4 mb-8 p-6 rounded-xl bg-gradient-to-br from-muted/50 to-background">
                        <div className="text-center">
                          <Users className="h-5 w-5 text-primary mx-auto mb-2" />
                          <div className="font-bold text-lg text-foreground">{program.stats.beneficiaries}</div>
                          <div className="text-xs text-muted-foreground">Beneficiaries</div>
                        </div>
                        <div className="text-center">
                          <MapPin className="h-5 w-5 text-primary mx-auto mb-2" />
                          <div className="font-bold text-lg text-foreground">{program.stats.communities}</div>
                          <div className="text-xs text-muted-foreground">Communities</div>
                        </div>
                        <div className="text-center">
                          <TrendingUp className="h-5 w-5 text-primary mx-auto mb-2" />
                          <div className="font-bold text-lg text-foreground">{program.stats.impact}</div>
                          <div className="text-xs text-muted-foreground">Impact</div>
                        </div>
                      </div>

                      {/* Highlights */}
                      <ul className="space-y-3 mb-8">
                        {program.highlights.map((highlight, i) => (
                          <li key={i} className="flex items-start gap-3 group/item">
                            <div className={`w-2 h-2 rounded-full ${program.color.replace('text-', 'bg-')} mt-2 flex-shrink-0`} />
                            <span className="text-base text-muted-foreground leading-relaxed">{highlight}</span>
                          </li>
                        ))}
                      </ul>

                      {/* CTAs */}
                      <div className="flex flex-col sm:flex-row gap-3">
                        <Button
                          size="lg"
                          asChild
                          data-testid={`button-learn-${program.slug}`}
                        >
                          <Link href={`/programs/${program.slug}`}>
                            Learn More <ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                        <Button
                          size="lg"
                          variant="outline"
                          asChild
                          data-testid={`button-support-${program.slug}`}
                        >
                          <Link href="/donate">Support This Program</Link>
                        </Button>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-primary/80" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.1),transparent_50%)]" />
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 md:px-6 text-center">
          <h2 className="font-headings font-bold text-4xl md:text-5xl lg:text-6xl mb-6 text-primary-foreground tracking-tight">
            Support Our Work
          </h2>
          <p className="text-xl md:text-2xl mb-10 text-primary-foreground/90 leading-relaxed max-w-2xl mx-auto">
            Your contribution helps us expand these vital programs and reach more communities in need
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              variant="secondary"
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
