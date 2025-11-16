import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useMutation } from "@tanstack/react-query";
import { HandHeart, CheckCircle2 } from "lucide-react";
import { z } from "zod";
import { insertVolunteerSubmissionSchema } from "@shared/schema";

export default function Sponsor() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    donationAmount: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: async (data: z.infer<typeof insertVolunteerSubmissionSchema>) => {
      await apiRequest("POST", "/api/volunteer-submit", data);
    },
    onSuccess: () => {
      setSubmitted(true);
      queryClient.invalidateQueries({ queryKey: ["/api/volunteer-submissions"] });
      toast({
        title: "Sponsorship Inquiry Submitted!",
        description: "Thank you for your interest. Our team will contact you soon.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Submission Failed",
        description: error.message || "Please try again later",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    mutation.mutate({
      name: formData.name,
      email: formData.email,
      phone: formData.phone || undefined,
      type: "sponsorship",
      message: formData.message || undefined,
      donationAmount: formData.donationAmount || undefined,
      interests: [],
    });
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary/5 to-background">
        <Card className="max-w-2xl mx-4">
          <CardContent className="p-12 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
              <CheckCircle2 className="h-10 w-10 text-primary" />
            </div>
            <h2 className="font-headings font-bold text-3xl mb-4">
              Thank You for Your Interest!
            </h2>
            <p className="text-lg text-muted-foreground mb-6">
              We've received your sponsorship inquiry and will be in touch soon to discuss opportunities.
            </p>
            <Button
              onClick={() => {
                setSubmitted(false);
                setFormData({
                  name: "",
                  email: "",
                  phone: "",
                  message: "",
                  donationAmount: "",
                });
              }}
              data-testid="button-submit-another"
            >
              Submit Another Inquiry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const sponsorshipTiers = [
    {
      name: "Community Partner",
      amount: "$1,000",
      benefits: [
        "Recognition on our website",
        "Quarterly impact reports",
        "Social media acknowledgment",
      ],
    },
    {
      name: "Program Sponsor",
      amount: "$5,000",
      benefits: [
        "All Community Partner benefits",
        "Feature in annual report",
        "Invitation to exclusive events",
        "Dedicated program updates",
      ],
    },
    {
      name: "Strategic Partner",
      amount: "$10,000+",
      benefits: [
        "All Program Sponsor benefits",
        "Naming opportunities",
        "Board presentation opportunities",
        "Custom partnership packages",
      ],
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-primary/10 via-background to-accent/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-primary/5 [mask-image:radial-gradient(white,transparent_70%)]" />
        <div className="max-w-4xl mx-auto px-4 md:px-6 text-center relative">
          <div className="inline-block animate-in fade-in zoom-in-95 duration-700">
            <HandHeart className="h-16 w-16 text-primary mx-auto mb-6" />
          </div>
          <h1 className="font-headings font-bold text-4xl md:text-5xl lg:text-6xl mb-6 bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: "150ms" }}>
            Become a Sponsor
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: "300ms" }}>
            Partner with us to create lasting impact through strategic sponsorships that transform healthcare access
          </p>
        </div>
      </section>

      {/* Sponsorship Tiers */}
      <section className="py-16 md:py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <h2 className="font-headings font-semibold text-3xl mb-12 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
            Sponsorship Opportunities
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {sponsorshipTiers.map((tier, index) => (
              <Card
                key={index}
                className="hover-elevate active-elevate-2 transition-all animate-in fade-in slide-in-from-bottom-8 duration-700"
                style={{ animationDelay: `${index * 150}ms` }}
                data-testid={`tier-${index}`}
              >
                <CardContent className="p-8">
                  <h3 className="font-headings font-semibold text-2xl mb-2">
                    {tier.name}
                  </h3>
                  <p className="text-3xl font-bold text-primary mb-6">
                    {tier.amount}
                  </p>
                  <ul className="space-y-3">
                    {tier.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16 md:py-20 bg-muted/30">
        <div className="max-w-2xl mx-auto px-4 md:px-6">
          <Card className="animate-in fade-in zoom-in-95 duration-700">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Sponsorship Inquiry</CardTitle>
            </CardHeader>
            <CardContent className="p-6 md:p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="name">Organization/Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Your organization or name"
                    required
                    data-testid="input-name"
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="contact@example.com"
                    required
                    data-testid="input-email"
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+254 123 456 789"
                    data-testid="input-phone"
                  />
                </div>

                <div>
                  <Label htmlFor="donationAmount">Sponsorship Amount (Optional)</Label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                      $
                    </span>
                    <Input
                      id="donationAmount"
                      type="number"
                      min="0"
                      step="1"
                      value={formData.donationAmount}
                      onChange={(e) => setFormData({ ...formData, donationAmount: e.target.value })}
                      placeholder="Enter amount"
                      className="pl-8"
                      data-testid="input-amount"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us about your sponsorship interests..."
                    rows={5}
                    data-testid="textarea-message"
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full text-lg font-semibold"
                  disabled={mutation.isPending}
                  data-testid="button-submit"
                >
                  {mutation.isPending ? "Submitting..." : "Submit Inquiry"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
