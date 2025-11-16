import { useRoute, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Stethoscope, GraduationCap, ArrowRight } from "lucide-react";
import healthImage from "@assets/generated_images/Health_Advancement_program_image_2dd82fce.png";
import outreachImage from "@assets/generated_images/Medical_Aid_Outreach_program_6e6641dc.png";
import empowermentImage from "@assets/generated_images/Healthcare_Professional_Empowerment_program_d2a2e1c9.png";

export default function ProgramDetail() {
  const [, params] = useRoute("/programs/:slug");
  const slug = params?.slug;

  const programsData: Record<string, any> = {
    "health-advancement": {
      title: "Health Advancement",
      description: "Empowering communities through comprehensive health education and wellness programs",
      icon: Heart,
      imageUrl: healthImage,
      overview: "Our Health Advancement program focuses on preventive healthcare through community education, wellness screenings, and health literacy initiatives. We work directly with communities to provide knowledge and resources for maintaining healthy lifestyles and preventing common diseases.",
      objectives: [
        "Increase health literacy in underserved communities",
        "Promote disease prevention through education",
        "Conduct regular wellness screenings and assessments",
        "Build sustainable health practices in communities",
      ],
      activities: [
        "Community health education workshops on nutrition, hygiene, and disease prevention",
        "Wellness screenings including blood pressure, diabetes, and general health assessments",
        "Health literacy campaigns tailored to local needs and cultural contexts",
        "Partnerships with local health facilities for follow-up care",
      ],
      impact: {
        beneficiaries: "4,500+",
        communities: "25+",
        workshops: "150+",
      },
      testimonial: {
        quote: "The health education program has transformed our community's understanding of preventive care. We now have the knowledge to make better health decisions for our families.",
        author: "Community Health Worker, Nairobi",
      },
    },
    "medical-aid-outreach": {
      title: "Medical Aid Outreach",
      description: "Bringing essential healthcare services to underserved communities",
      icon: Stethoscope,
      imageUrl: outreachImage,
      overview: "Our Mobile Medical Outreach program brings healthcare directly to remote and underserved communities that lack access to medical facilities. Through mobile clinics and medical missions, we provide free consultations, essential medications, and coordinate follow-up care.",
      objectives: [
        "Provide accessible healthcare to remote communities",
        "Deliver essential medical consultations and treatments",
        "Distribute vital medications to those in need",
        "Create pathways for ongoing medical support",
      ],
      activities: [
        "Mobile medical clinics visiting rural and underserved areas monthly",
        "Free health checkups, consultations, and basic treatments",
        "Distribution of essential medications and medical supplies",
        "Coordination with local healthcare facilities for complex cases and follow-up care",
      ],
      impact: {
        beneficiaries: "3,800+",
        communities: "15+",
        clinics: "200+",
      },
      testimonial: {
        quote: "Before the mobile clinic started visiting our village, we had to travel hours to see a doctor. Now we receive quality healthcare right in our community.",
        author: "Patient, Rural Kenya",
      },
    },
    "healthcare-professional-empowerment": {
      title: "Healthcare Professional Empowerment",
      description: "Building capacity through training and mentorship programs",
      icon: GraduationCap,
      imageUrl: empowermentImage,
      overview: "Our Healthcare Professional Empowerment program strengthens the local healthcare workforce through comprehensive training, mentorship, and professional development opportunities. We invest in healthcare workers to improve the quality and sustainability of healthcare delivery.",
      objectives: [
        "Enhance clinical skills of local healthcare workers",
        "Provide mentorship and professional development",
        "Share best practices and latest medical knowledge",
        "Build sustainable healthcare capacity in communities",
      ],
      activities: [
        "Medical skills training workshops covering latest clinical practices",
        "One-on-one mentorship programs pairing experienced and emerging healthcare professionals",
        "Continuing education courses and certifications",
        "Knowledge sharing sessions and collaborative learning opportunities",
      ],
      impact: {
        trained: "200+",
        workshops: "50+",
        partnerships: "10+",
      },
      testimonial: {
        quote: "The mentorship program has enhanced my clinical skills and confidence tremendously. I'm now able to provide better care to my patients.",
        author: "Clinical Officer, Kisumu",
      },
    },
  };

  const program = slug ? programsData[slug] : null;

  if (!program) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Program Not Found</h1>
          <Button asChild>
            <Link href="/programs">
              <a>View All Programs</a>
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[400px] md:min-h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={program.imageUrl}
            alt={program.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 md:px-6 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
            <program.icon className="h-10 w-10 text-white" />
          </div>
          <h1 className="font-headings font-bold text-white text-4xl md:text-5xl lg:text-6xl mb-4">
            {program.title}
          </h1>
          <p className="text-white/90 text-lg md:text-xl max-w-3xl mx-auto">
            {program.description}
          </p>
        </div>
      </section>

      {/* Overview */}
      <section className="py-16 md:py-20 bg-background">
        <div className="max-w-4xl mx-auto px-4 md:px-6">
          <h2 className="font-headings font-semibold text-3xl md:text-4xl mb-6">
            Overview
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            {program.overview}
          </p>
        </div>
      </section>

      {/* Objectives & Activities */}
      <section className="py-16 md:py-20 bg-card">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h2 className="font-headings font-semibold text-2xl md:text-3xl mb-6">
                Objectives
              </h2>
              <ul className="space-y-4">
                {program.objectives.map((objective: string, index: number) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <span className="text-muted-foreground leading-relaxed">{objective}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="font-headings font-semibold text-2xl md:text-3xl mb-6">
                Activities
              </h2>
              <ul className="space-y-4">
                {program.activities.map((activity: string, index: number) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <span className="text-muted-foreground leading-relaxed">{activity}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-16 md:py-20 bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <h2 className="font-headings font-semibold text-3xl md:text-4xl mb-12 text-center">
            Impact & Reach
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {Object.entries(program.impact).map(([key, value], index) => (
              <div key={index} className="text-center">
                <div className="font-headings font-bold text-5xl mb-2">{value as string}</div>
                <p className="text-lg text-primary-foreground/90 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-16 md:py-20 bg-background">
        <div className="max-w-4xl mx-auto px-4 md:px-6">
          <Card>
            <CardContent className="p-8 md:p-12">
              <p className="text-xl md:text-2xl font-medium text-foreground mb-6 italic">
                "{program.testimonial.quote}"
              </p>
              <p className="text-muted-foreground">
                — {program.testimonial.author}
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 bg-card">
        <div className="max-w-4xl mx-auto px-4 md:px-6 text-center">
          <h2 className="font-headings font-semibold text-3xl md:text-4xl mb-4">
            Support This Program
          </h2>
          <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
            Your contribution helps us expand {program.title} and reach more communities
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="text-base md:text-lg font-semibold px-8 min-h-12 md:min-h-14"
              asChild
              data-testid="button-donate"
            >
              <Link href="/donate">
                <a>Donate Now</a>
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-base md:text-lg font-semibold px-8 min-h-12 md:min-h-14"
              asChild
              data-testid="button-volunteer"
            >
              <Link href="/volunteer">
                <a>Volunteer</a>
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
