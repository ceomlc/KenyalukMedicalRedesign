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
    address: "",
    type: "fundraising",
    availability: "",
    message: "",
    experience: "",
    contactPreference: "email",
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
      name: formData.name,
      email: formData.email,
      phone: formData.phone || undefined,
      address: formData.address || undefined,
      type: formData.type,
      availability: formData.availability || undefined,
      message: formData.message || undefined,
      experience: formData.experience || undefined,
      contactPreference: formData.contactPreference || undefined,
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
                  address: "",
                  type: "fundraising",
                  availability: "",
                  message: "",
                  experience: "",
                  contactPreference: "email",
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
            Volunteer
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: "300ms" }}>
            Join our passionate and dedicated team of volunteers who are at the forefront of our efforts to create a better world. Your time and skills can play a crucial role in our mission's success. Whether you're interested in hands-on work, event coordination, or fundraising, there's a meaningful way for you to contribute.
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
                  <Label htmlFor="address">Address *</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Your mailing address"
                    required
                    data-testid="input-address"
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Contact Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="240-413-1321"
                    required
                    data-testid="input-phone"
                  />
                </div>

                <div>
                  <Label htmlFor="type">Area of Interest *</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => setFormData({ ...formData, type: value })}
                  >
                    <SelectTrigger data-testid="select-type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fundraising">Fundraising</SelectItem>
                      <SelectItem value="pr_marketing">PR/Marketing</SelectItem>
                      <SelectItem value="office_assistance">Office Assistance</SelectItem>
                      <SelectItem value="volunteer_recruitment">Volunteer Recruitment</SelectItem>
                      <SelectItem value="special_events">Special Events</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="heardAbout">How did you first hear about our program? *</Label>
                  <Input
                    id="heardAbout"
                    value={formData.availability}
                    onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                    placeholder="e.g., Social media, friend, website..."
                    data-testid="input-heard-about"
                  />
                </div>

                <div>
                  <Label htmlFor="skills">Special skills and other languages spoken *</Label>
                  <Textarea
                    id="skills"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Please list any special skills and other languages you speak..."
                    rows={3}
                    data-testid="textarea-skills"
                  />
                </div>

                <div>
                  <Label htmlFor="experience">Previous volunteer experience</Label>
                  <Textarea
                    id="experience"
                    value={formData.experience || ""}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    placeholder="If you have previous volunteer experience, please describe it here..."
                    rows={3}
                    data-testid="textarea-experience"
                  />
                </div>

                <div>
                  <Label htmlFor="contactPref">How would you like to receive information from us? *</Label>
                  <Select
                    value={formData.contactPreference}
                    onValueChange={(value) => setFormData({ ...formData, contactPreference: value })}
                  >
                    <SelectTrigger data-testid="select-contact-preference">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="phone">Phone</SelectItem>
                      <SelectItem value="mail">Mail</SelectItem>
                    </SelectContent>
                  </Select>
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
