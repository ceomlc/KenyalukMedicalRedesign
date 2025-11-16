import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Stethoscope, GraduationCap, ArrowRight } from "lucide-react";
import healthImage from "@assets/generated_images/Health_Advancement_program_image_2dd82fce.png";
import outreachImage from "@assets/generated_images/Medical_Aid_Outreach_program_6e6641dc.png";
import empowermentImage from "@assets/generated_images/Healthcare_Professional_Empowerment_program_d2a2e1c9.png";

export default function Programs() {
  const programs = [
    {
      title: "Health Advancement",
      slug: "health-advancement",
      description: "Empowering communities through health education and wellness programs that promote disease prevention and healthy lifestyles.",
      icon: Heart,
      imageUrl: healthImage,
      highlights: [
        "Community health education workshops",
        "Nutrition and disease prevention programs",
        "Wellness screenings and health assessments",
        "Health literacy campaigns",
      ],
    },
    {
      title: "Medical Aid Outreach",
      slug: "medical-aid-outreach",
      description: "Bringing essential healthcare services directly to underserved communities through mobile medical missions.",
      icon: Stethoscope,
      imageUrl: outreachImage,
      highlights: [
        "Mobile medical clinics in rural areas",
        "Free health checkups and consultations",
        "Essential medication distribution",
        "Follow-up care coordination",
      ],
    },
    {
      title: "Healthcare Professional Empowerment",
      slug: "healthcare-professional-empowerment",
      description: "Strengthening local healthcare capacity through training, mentorship, and professional development programs.",
      icon: GraduationCap,
      imageUrl: empowermentImage,
      highlights: [
        "Medical skills training workshops",
        "Mentorship programs for healthcare workers",
        "Continuing education opportunities",
        "Best practices sharing and collaboration",
      ],
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-16 md:py-20 lg:py-24 bg-gradient-to-b from-primary/5 to-background">
        <div className="max-w-4xl mx-auto px-4 md:px-6 text-center">
          <h1 className="font-headings font-bold text-4xl md:text-5xl lg:text-6xl mb-6">
            Our Programs
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            Comprehensive healthcare initiatives designed to create sustainable impact in communities across Kenya
          </p>
        </div>
      </section>

      {/* Programs Grid */}
      <section className="py-16 md:py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="space-y-16 md:space-y-24">
            {programs.map((program, index) => (
              <Card
                key={index}
                className="overflow-hidden hover-elevate active-elevate-2 transition-all"
                data-testid={`program-${program.slug}`}
              >
                <div className={`grid grid-cols-1 lg:grid-cols-2 gap-0 ${index % 2 === 1 ? 'lg:grid-flow-dense' : ''}`}>
                  {/* Image */}
                  <div className={`relative aspect-video lg:aspect-square ${index % 2 === 1 ? 'lg:col-start-2' : ''}`}>
                    <img
                      src={program.imageUrl}
                      alt={program.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent lg:bg-gradient-to-r lg:from-background/80 lg:to-transparent" />
                  </div>

                  {/* Content */}
                  <CardContent className="p-8 md:p-12 flex flex-col justify-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
                      <program.icon className="h-8 w-8 text-primary" />
                    </div>
                    
                    <h2 className="font-headings font-semibold text-2xl md:text-3xl lg:text-4xl mb-4">
                      {program.title}
                    </h2>
                    
                    <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                      {program.description}
                    </p>

                    <ul className="space-y-3 mb-8">
                      {program.highlights.map((highlight, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                          <span className="text-muted-foreground">{highlight}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button
                        asChild
                        data-testid={`button-learn-${program.slug}`}
                      >
                        <Link href={`/programs/${program.slug}`}>
                          <a className="inline-flex items-center">
                            Learn More <ArrowRight className="ml-2 h-4 w-4" />
                          </a>
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        asChild
                        data-testid={`button-support-${program.slug}`}
                      >
                        <Link href="/donate">
                          <a>Support This Program</a>
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto px-4 md:px-6 text-center">
          <h2 className="font-headings font-semibold text-3xl md:text-4xl mb-4">
            Support Our Work
          </h2>
          <p className="text-lg md:text-xl mb-8 text-primary-foreground/90 leading-relaxed">
            Your contribution helps us expand these vital programs and reach more communities in need
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              variant="secondary"
              className="text-base md:text-lg font-semibold px-8 min-h-12 md:min-h-14"
              asChild
              data-testid="button-donate-cta"
            >
              <Link href="/donate">
                <a>Make a Donation</a>
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-base md:text-lg font-semibold px-8 bg-transparent border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10 min-h-12 md:min-h-14"
              asChild
              data-testid="button-volunteer-cta"
            >
              <Link href="/volunteer">
                <a>Become a Volunteer</a>
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
