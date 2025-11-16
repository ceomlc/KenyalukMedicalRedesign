import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useMutation } from "@tanstack/react-query";
import { Users, Heart, CheckCircle2 } from "lucide-react";
import { z } from "zod";
import { insertVolunteerSubmissionSchema } from "@shared/schema";

export default function Volunteer() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    type: "general",
    availability: "",
    message: "",
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
        title: "Application Submitted!",
        description: "Thank you for your interest. We'll contact you soon.",
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
    
    if (!formData.name || !formData.email || !formData.type) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    mutation.mutate({
      ...formData,
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
              Thank You for Volunteering!
            </h2>
            <p className="text-lg text-muted-foreground mb-6">
              We've received your application and will be in touch soon with next steps.
            </p>
            <Button
              onClick={() => {
                setSubmitted(false);
                setFormData({
                  name: "",
                  email: "",
                  phone: "",
                  type: "general",
                  availability: "",
                  message: "",
                });
              }}
              data-testid="button-submit-another"
            >
              Submit Another Application
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-accent/10 via-background to-primary/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-primary/5 [mask-image:radial-gradient(white,transparent_70%)]" />
        <div className="max-w-4xl mx-auto px-4 md:px-6 text-center relative">
          <div className="inline-block animate-in fade-in zoom-in-95 duration-700">
            <Users className="h-16 w-16 text-primary mx-auto mb-6" />
          </div>
          <h1 className="font-headings font-bold text-4xl md:text-5xl lg:text-6xl mb-6 bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: "150ms" }}>
            Volunteer With Us
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: "300ms" }}>
            Join our team of dedicated volunteers making a real difference in healthcare across Kenya
          </p>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 md:py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <h2 className="font-headings font-semibold text-3xl mb-12 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
            Why Volunteer?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="animate-in fade-in slide-in-from-bottom-8 duration-700" style={{ animationDelay: "100ms" }}>
              <CardContent className="p-6 text-center">
                <Heart className="h-10 w-10 text-primary mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-2">Make an Impact</h3>
                <p className="text-muted-foreground">
                  Directly contribute to improving healthcare access for underserved communities
                </p>
              </CardContent>
            </Card>
            <Card className="animate-in fade-in slide-in-from-bottom-8 duration-700" style={{ animationDelay: "200ms" }}>
              <CardContent className="p-6 text-center">
                <Users className="h-10 w-10 text-primary mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-2">Build Skills</h3>
                <p className="text-muted-foreground">
                  Gain valuable experience in healthcare, community outreach, and program management
                </p>
              </CardContent>
            </Card>
            <Card className="animate-in fade-in slide-in-from-bottom-8 duration-700" style={{ animationDelay: "300ms" }}>
              <CardContent className="p-6 text-center">
                <Heart className="h-10 w-10 text-primary mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-2">Join Community</h3>
                <p className="text-muted-foreground">
                  Connect with like-minded individuals passionate about healthcare equity
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section className="py-16 md:py-20 bg-muted/30">
        <div className="max-w-2xl mx-auto px-4 md:px-6">
          <Card className="animate-in fade-in zoom-in-95 duration-700">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Volunteer Application</CardTitle>
            </CardHeader>
            <CardContent className="p-6 md:p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="John Doe"
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
                    placeholder="john@example.com"
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
                  <Label htmlFor="type">Volunteer Type *</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => setFormData({ ...formData, type: value })}
                  >
                    <SelectTrigger data-testid="select-type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General Volunteering</SelectItem>
                      <SelectItem value="medical_mission">Medical Mission</SelectItem>
                      <SelectItem value="sponsorship">Sponsorship</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="availability">Availability</Label>
                  <Input
                    id="availability"
                    value={formData.availability}
                    onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                    placeholder="e.g., Weekends, Monthly"
                    data-testid="input-availability"
                  />
                </div>

                <div>
                  <Label htmlFor="message">Tell Us About Yourself</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Share your interests, skills, and why you want to volunteer..."
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
                  {mutation.isPending ? "Submitting..." : "Submit Application"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
