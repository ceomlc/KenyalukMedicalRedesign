import { Link } from "wouter";
import { Heart, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export function Footer() {
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const [isSubscribing, setIsSubscribing] = useState(false);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setIsSubscribing(true);
    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to subscribe");
      }
      toast({
        title: "Subscribed!",
        description: "Thank you for subscribing to our newsletter.",
      });
      setEmail("");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to subscribe. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubscribing(false);
    }
  };

  const socialLinks = [
    { icon: Facebook, href: "https://facebook.com/kenyalukmedical", label: "Facebook" },
    { icon: Twitter, href: "https://twitter.com/kenyalukmedical", label: "Twitter" },
    { icon: Instagram, href: "https://instagram.com/kenyalukmedical", label: "Instagram" },
    { icon: Linkedin, href: "https://linkedin.com/company/kenyalukmedical", label: "LinkedIn" },
  ];

  return (
    <footer className="bg-gradient-to-b from-background to-muted/30 border-t">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Column 1: About */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 font-headings font-bold text-xl">
              <div className="p-2 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5">
                <Heart className="h-6 w-6 text-primary fill-primary" />
              </div>
              <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                Kenyaluk Medical
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Empowering communities through accessible healthcare, medical education, and professional development in Kenya.
            </p>
            <div className="flex gap-2">
              {socialLinks.map((social) => (
                <Button
                  key={social.label}
                  variant="outline"
                  size="icon"
                  asChild
                  data-testid={`link-social-${social.label.toLowerCase()}`}
                >
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                  >
                    <social.icon className="h-4 w-4" />
                  </a>
                </Button>
              ))}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-4">
            <h3 className="font-headings font-bold text-base">Quick Links</h3>
            <nav className="flex flex-col gap-2">
              {[
                { label: "Programs", href: "/programs" },
                { label: "Projects", href: "/projects" },
                { label: "Events", href: "/events" },
                { label: "About Us", href: "/about" },
                { label: "News & Stories", href: "/news" },
              ].map((link) => (
                <Link 
                  key={link.href}
                  href={link.href}
                >
                  <span
                    className="block text-sm text-muted-foreground hover:text-foreground transition-colors hover-elevate px-2 py-1.5 rounded-md cursor-pointer" 
                    data-testid={`link-footer-${link.label.toLowerCase().replace(/\s+/g, '-').replace('&-', '')}`}
                  >
                    {link.label}
                  </span>
                </Link>
              ))}
            </nav>
          </div>

          {/* Column 3: Get Involved */}
          <div className="space-y-4">
            <h3 className="font-headings font-bold text-base">Get Involved</h3>
            <nav className="flex flex-col gap-2">
              {[
                { label: "Donate", href: "/donate" },
                { label: "Volunteer", href: "/volunteer" },
                { label: "Sponsor", href: "/sponsor" },
                { label: "Contact Us", href: "/contact" },
              ].map((link) => (
                <Link 
                  key={link.href}
                  href={link.href}
                >
                  <span
                    className="block text-sm text-muted-foreground hover:text-foreground transition-colors hover-elevate px-2 py-1.5 rounded-md cursor-pointer" 
                    data-testid={`link-footer-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    {link.label}
                  </span>
                </Link>
              ))}
            </nav>
          </div>

          {/* Column 4: Newsletter */}
          <div className="space-y-4">
            <h3 className="font-headings font-bold text-base">Stay Updated</h3>
            <p className="text-sm text-muted-foreground">
              Subscribe to our newsletter for impact stories and updates.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="space-y-3">
              <Input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                data-testid="input-newsletter-email"
              />
              <Button 
                type="submit" 
                size="sm" 
                className="w-full font-semibold"
                disabled={isSubscribing}
                data-testid="button-subscribe"
              >
                {isSubscribing ? "Subscribing..." : "Subscribe"}
              </Button>
            </form>
            
            <div className="space-y-3 pt-4 border-t">
              <h4 className="font-semibold text-sm">Contact</h4>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <a 
                    href="tel:+12404131321" 
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors" 
                    data-testid="link-phone"
                  >
                    240-413-1321
                  </a>
                </div>
                <div className="flex items-start gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <a 
                    href="mailto:kenyalukmedicalfoundation@gmail.com" 
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors break-all" 
                    data-testid="link-email"
                  >
                    kenyalukmedicalfoundation@gmail.com
                  </a>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <span className="text-xs text-muted-foreground">
                    2165 New Holland Pike<br />Lancaster, PA 17601
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <p className="text-center md:text-left">
              © {new Date().getFullYear()} Kenyaluk Medical Foundation. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <Link href="/privacy">
                <span
                  className="hover:text-foreground transition-colors cursor-pointer" 
                  data-testid="link-privacy"
                >
                  Privacy Policy
                </span>
              </Link>
              <Link href="/accessibility">
                <span
                  className="hover:text-foreground transition-colors cursor-pointer" 
                  data-testid="link-accessibility"
                >
                  Accessibility
                </span>
              </Link>
              <Link href="/terms">
                <span
                  className="hover:text-foreground transition-colors cursor-pointer" 
                  data-testid="link-terms"
                >
                  Terms of Service
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
