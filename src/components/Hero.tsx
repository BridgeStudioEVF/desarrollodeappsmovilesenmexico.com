import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface HeroProps {
  onSearch?: (query: string) => void;
}

const Hero = ({ onSearch }: HeroProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(searchQuery);
  };

  return (
    <section className="relative overflow-hidden bg-hero-gradient py-20 lg:py-32">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -right-40 -top-40 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="container relative">
        <div className="mx-auto max-w-3xl text-center">
          {/* Badge */}
          <div className="animate-fade-up mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm text-primary-foreground opacity-0">
            <span className="h-2 w-2 animate-pulse rounded-full bg-accent" />
            Desarrollo de apps móviles en México
          </div>

          {/* H1 - Main Headline */}
          <h1 className="animate-fade-up mb-6 text-4xl font-extrabold leading-tight tracking-tight text-primary-foreground opacity-0 animation-delay-100 sm:text-5xl lg:text-6xl">
            Expertos en Desarrollo de Apps Móviles en México
          </h1>

          {/* Subheadline */}
          <p className="animate-fade-up mx-auto mb-10 max-w-2xl text-lg text-primary-foreground/80 opacity-0 animation-delay-200 sm:text-xl">
            Guías, tendencias y estrategias técnicas para crear aplicaciones exitosas en iOS y Android.
          </p>

          {/* Search Bar */}
          <form
            onSubmit={handleSearch}
            className="animate-fade-up mx-auto flex max-w-xl flex-col gap-3 opacity-0 animation-delay-300 sm:flex-row"
          >
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar artículos sobre desarrollo de apps..."
                className="h-12 w-full rounded-xl border-0 bg-background/95 pl-12 pr-4 text-foreground shadow-lg backdrop-blur placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent sm:h-14"
              />
            </div>
            <Button type="submit" variant="hero" size="lg" className="h-12 sm:h-14">
              Buscar
            </Button>
          </form>

          {/* Quick Tags */}
          <div className="animate-fade-up mt-8 flex flex-wrap justify-center gap-2 opacity-0 animation-delay-400">
            <span className="text-sm text-primary-foreground/60">Temas populares:</span>
            {["iOS", "Android", "Flutter", "React Native", "Software a la medida"].map((tag) => (
              <button
                key={tag}
                onClick={() => {
                  setSearchQuery(tag);
                  onSearch?.(tag);
                }}
                className="rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-3 py-1 text-sm text-primary-foreground/80 transition-colors hover:bg-primary-foreground/20"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
