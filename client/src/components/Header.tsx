import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { Menu, X, Heart } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";

export function Header() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { label: "About", path: "/about" },
    { label: "Programs", path: "/programs" },
    { label: "Events", path: "/events" },
    { label: "Gallery", path: "/gallery" },
    { label: "News", path: "/news" },
    { label: "Contact", path: "/contact" },
  ];

  return (
    <header 
      className={`sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-lg supports-[backdrop-filter]:bg-background/60 transition-shadow duration-300 ${
        scrolled ? 'shadow-md' : ''
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 py-4 md:py-5">
          {/* Logo */}
          <Link href="/">
            <div
              className="flex items-center gap-2 font-headings font-bold text-lg md:text-xl hover-elevate active-elevate-2 px-3 py-2 rounded-lg transition-all cursor-pointer"
              data-testid="link-home"
            >
              <div className="p-1 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5">
                <Heart className="h-5 w-5 md:h-6 md:w-6 text-primary fill-primary" />
              </div>
              <span className="hidden sm:inline bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                Kenyaluk Medical
              </span>
              <span className="sm:hidden">KMF</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Button
                key={item.path}
                variant={location === item.path ? "secondary" : "ghost"}
                size="sm"
                className={location === item.path ? "border border-primary/20" : ""}
                asChild
                data-testid={`link-${item.label.toLowerCase()}`}
              >
                <Link href={item.path}>{item.label}</Link>
              </Button>
            ))}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            
            <Button
              variant="ghost"
              size="sm"
              className="hidden sm:flex"
              asChild
              data-testid="link-portal"
            >
              <Link href="/portal">{isAuthenticated ? "Portal" : "Login"}</Link>
            </Button>

            <Button
              variant="default"
              size="sm"
              className="hidden sm:flex font-semibold"
              asChild
              data-testid="button-donate-header"
            >
              <Link href="/donate">
                <Heart className="h-4 w-4 mr-2 fill-current" />
                Donate
              </Link>
            </Button>

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
          <nav className="md:hidden py-4 space-y-2 border-t animate-in slide-in-from-top-2 duration-300">
            {navItems.map((item, index) => (
              <Button
                key={item.path}
                variant={location === item.path ? "secondary" : "ghost"}
                className={`w-full justify-start animate-in fade-in slide-in-from-right-4 ${
                  location === item.path ? "border border-primary/20" : ""
                }`}
                style={{ animationDelay: `${index * 50}ms`, animationDuration: '300ms' }}
                asChild
                data-testid={`link-mobile-${item.label.toLowerCase()}`}
              >
                <Link href={item.path} onClick={() => setMobileMenuOpen(false)}>
                  {item.label}
                </Link>
              </Button>
            ))}
            
            <Button
              variant="ghost"
              className="w-full justify-start"
              asChild
              data-testid="link-mobile-portal"
            >
              <Link href="/portal" onClick={() => setMobileMenuOpen(false)}>
                {isAuthenticated ? "Portal" : "Login"}
              </Link>
            </Button>

            <div className="pt-2">
              <Button
                variant="default"
                size="lg"
                className="w-full font-semibold"
                asChild
                data-testid="button-donate-mobile"
              >
                <Link href="/donate" onClick={() => setMobileMenuOpen(false)}>
                  <Heart className="h-4 w-4 mr-2 fill-current" />
                  Donate Now
                </Link>
              </Button>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
