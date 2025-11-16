import { Link } from "wouter";
import { Heart, Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Footer() {
  return (
    <footer className="bg-card border-t">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Column 1: About */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 font-headings font-bold text-lg text-primary">
              <Heart className="h-6 w-6 fill-primary" />
              <span>Kenyaluk Medical</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Empowering communities through accessible healthcare, medical education, and professional development in Kenya.
            </p>
            <div className="flex gap-2">
              {/* Social icons can be added here */}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-4">
            <h3 className="font-headings font-semibold text-base">Quick Links</h3>
            <nav className="flex flex-col gap-2">
              <Link 
                href="/programs" 
                className="text-sm text-muted-foreground hover:text-foreground transition-colors hover-elevate px-2 py-1 rounded-md" 
                data-testid="link-footer-programs"
              >
                Programs
              </Link>
              <Link 
                href="/events" 
                className="text-sm text-muted-foreground hover:text-foreground transition-colors hover-elevate px-2 py-1 rounded-md" 
                data-testid="link-footer-events"
              >
                Events
              </Link>
              <Link 
                href="/about" 
                className="text-sm text-muted-foreground hover:text-foreground transition-colors hover-elevate px-2 py-1 rounded-md" 
                data-testid="link-footer-about"
              >
                About Us
              </Link>
              <Link 
                href="/news" 
                className="text-sm text-muted-foreground hover:text-foreground transition-colors hover-elevate px-2 py-1 rounded-md" 
                data-testid="link-footer-news"
              >
                News & Stories
              </Link>
            </nav>
          </div>

          {/* Column 3: Get Involved */}
          <div className="space-y-4">
            <h3 className="font-headings font-semibold text-base">Get Involved</h3>
            <nav className="flex flex-col gap-2">
              <Link 
                href="/donate" 
                className="text-sm text-muted-foreground hover:text-foreground transition-colors hover-elevate px-2 py-1 rounded-md" 
                data-testid="link-footer-donate"
              >
                Donate
              </Link>
              <Link 
                href="/volunteer" 
                className="text-sm text-muted-foreground hover:text-foreground transition-colors hover-elevate px-2 py-1 rounded-md" 
                data-testid="link-footer-volunteer"
              >
                Volunteer
              </Link>
              <Link 
                href="/sponsor" 
                className="text-sm text-muted-foreground hover:text-foreground transition-colors hover-elevate px-2 py-1 rounded-md" 
                data-testid="link-footer-sponsor"
              >
                Sponsor
              </Link>
              <Link 
                href="/contact" 
                className="text-sm text-muted-foreground hover:text-foreground transition-colors hover-elevate px-2 py-1 rounded-md" 
                data-testid="link-footer-contact"
              >
                Contact Us
              </Link>
            </nav>
          </div>

          {/* Column 4: Contact */}
          <div className="space-y-4">
            <h3 className="font-headings font-semibold text-base">Contact</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <Mail className="h-4 w-4 text-muted-foreground mt-0.5" />
                <a href="mailto:info@kenyalukmedical.org" className="text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="link-email">
                  info@kenyalukmedical.org
                </a>
              </div>
              <div className="flex items-start gap-2">
                <Phone className="h-4 w-4 text-muted-foreground mt-0.5" />
                <a href="tel:+254123456789" className="text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="link-phone">
                  +254 123 456 789
                </a>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                <span className="text-sm text-muted-foreground">
                  Nairobi, Kenya
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <p>© 2024 Kenyaluk Medical Foundation. All rights reserved.</p>
            <div className="flex gap-6">
              <Link 
                href="/privacy" 
                className="hover:text-foreground transition-colors" 
                data-testid="link-privacy"
              >
                Privacy Policy
              </Link>
              <Link 
                href="/accessibility" 
                className="hover:text-foreground transition-colors" 
                data-testid="link-accessibility"
              >
                Accessibility
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
