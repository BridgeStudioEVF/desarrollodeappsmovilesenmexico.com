import { Link, useLocation } from "react-router-dom";
import { Smartphone, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";



const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: "Blog", href: "/" },
    { name: "Servicios", href: "/servicios" },
    { name: "Contacto", href: "/contacto" },
  ];

  const isActive = (href: string) => location.pathname === href;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cta-gradient">
            <Smartphone className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="hidden text-lg font-bold text-foreground sm:inline-block">
            Apps Móviles MX
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              className={`text-sm font-medium transition-colors hover:text-primary ${isActive(link.href) ? "text-primary" : "text-muted-foreground"
                }`}
            >
              {link.name}
            </Link>
          ))}
          <Button variant="navCta" size="sm" asChild>

            <a href="https://bridgestudio.mx" target="_blank" rel="noopener noreferrer">
              Cotizar App en Bridge Studio
            </a>
          </Button>
        </div>


        {/* Mobile Menu Button */}
        <button
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-border md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="animate-fade-in border-t border-border bg-background md:hidden">
          <div className="container flex flex-col gap-4 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                onClick={() => setIsMenuOpen(false)}
                className={`text-sm font-medium transition-colors hover:text-primary ${isActive(link.href) ? "text-primary" : "text-muted-foreground"
                  }`}
              >
                {link.name}
              </Link>
            ))}
            <Button variant="navCta" size="sm" asChild className="w-full">
              <a href="https://bridgestudio.mx" target="_blank" rel="noopener noreferrer">
                Cotizar App en Bridge Studio
              </a>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
