import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { Menu, X, Heart } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";

export function Header() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  const navItems = [
    { label: "About", path: "/about" },
    { label: "Programs", path: "/programs" },
    { label: "Events", path: "/events" },
    { label: "News", path: "/news" },
    { label: "Contact", path: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex h-16 md:h-20 items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/">
            <div
              className="flex items-center gap-2 font-headings font-bold text-lg md:text-xl text-primary hover-elevate active-elevate-2 px-3 py-2 rounded-md transition-colors cursor-pointer"
              data-testid="link-home"
            >
              <Heart className="h-6 w-6 fill-primary" />
              <span className="hidden sm:inline">Kenyaluk Medical</span>
              <span className="sm:hidden">KMF</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link key={item.path} href={item.path}>
                <div
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors hover-elevate active-elevate-2 cursor-pointer ${
                    location === item.path
                      ? "bg-accent text-accent-foreground"
                      : "text-foreground"
                  }`}
                  data-testid={`link-${item.label.toLowerCase()}`}
                >
                  {item.label}
                </div>
              </Link>
            ))}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            
            {isAuthenticated && (
              <Link href="/portal">
                <Button
                  variant="ghost"
                  size="sm"
                  className="hidden sm:flex"
                  data-testid="link-portal"
                >
                  Portal
                </Button>
              </Link>
            )}

            <Link href="/donate">
              <Button
                variant="default"
                size="sm"
                className="hidden sm:flex font-semibold"
                data-testid="button-donate-header"
              >
                Donate
              </Button>
            </Link>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              data-testid="button-mobile-menu"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-4 space-y-2 border-t">
            {navItems.map((item) => (
              <Link key={item.path} href={item.path}>
                <div
                  className={`block px-4 py-3 text-base font-medium rounded-md transition-colors hover-elevate active-elevate-2 cursor-pointer ${
                    location === item.path
                      ? "bg-accent text-accent-foreground"
                      : "text-foreground"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                  data-testid={`link-mobile-${item.label.toLowerCase()}`}
                >
                  {item.label}
                </div>
              </Link>
            ))}
            
            {isAuthenticated && (
              <Link href="/portal">
                <div
                  className="block px-4 py-3 text-base font-medium rounded-md transition-colors hover-elevate active-elevate-2 text-foreground cursor-pointer"
                  onClick={() => setMobileMenuOpen(false)}
                  data-testid="link-mobile-portal"
                >
                  Portal
                </div>
              </Link>
            )}

            <div className="px-4 pt-2">
              <Link href="/donate">
                <Button
                  variant="default"
                  className="w-full font-semibold"
                  onClick={() => setMobileMenuOpen(false)}
                  data-testid="button-donate-mobile"
                >
                  Donate Now
                </Button>
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
