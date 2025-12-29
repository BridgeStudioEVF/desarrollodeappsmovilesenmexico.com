import { Search, X, Rocket, Code, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

interface HeroProps {
  onSearch?: (query: string) => void;
  searchQuery?: string;
}

const Hero = ({ onSearch, searchQuery: externalSearchQuery }: HeroProps) => {
  const [localSearchQuery, setLocalSearchQuery] = useState(externalSearchQuery || "");

  useEffect(() => {
    if (externalSearchQuery !== undefined) {
      setLocalSearchQuery(externalSearchQuery);
    }
  }, [externalSearchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(localSearchQuery);
  };

  const handleClear = () => {
    setLocalSearchQuery("");
    onSearch?.("");
  };

  return (
    <section className="relative overflow-hidden bg-hero-gradient py-16 lg:py-24">
      {/* Modern Geometric Background Pattern */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        <div className="absolute left-0 top-0 h-full w-1/3 bg-gradient-to-br from-primary/30 to-transparent" />
        <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-bl from-accent/30 to-transparent" />

        {/* Animated geometric shapes */}
        <div className="absolute left-10 top-20 h-32 w-32 rotate-45 border-4 border-primary/20 animate-pulse" />
        <div className="absolute right-20 top-40 h-24 w-24 rounded-full border-4 border-accent/20" />
        <div className="absolute bottom-20 left-1/3 h-40 w-40 rotate-12 border-4 border-secondary/20" style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }} />

        {/* Dot pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,_hsl(173_80%_40%_/_0.15)_1px,_transparent_0)] bg-[size:40px_40px]" />
      </div>

      {/* Badge flotante */}
      <div className="container relative">
        <div className="animate-fade-up mb-8 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/5 px-4 py-1.5 text-sm font-medium text-primary-foreground backdrop-blur opacity-0">
          <Rocket className="h-4 w-4 text-accent" />
          Innovación Tecnológica en México 🇲🇽
        </div>

        {/* 2 Column Layout */}
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          {/* Left Column - Content */}
          <div className="animate-fade-up opacity-0 animation-delay-100">
            {/* H1 with aggressive styling */}
            <h1 className="mb-6 text-5xl font-black leading-[1.1] tracking-tight text-primary-foreground sm:text-6xl lg:text-7xl">
              Apps Móviles
              <span className="block bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
                de Clase Mundial
              </span>
            </h1>

            {/* Subheadline */}
            <p className="mb-8 max-w-xl text-lg leading-relaxed text-primary-foreground/80 sm:text-xl">
              Descubre estrategias, tendencias y tecnologías de vanguardia para crear aplicaciones móviles exitosas en el mercado mexicano.
            </p>

            {/* Dual CTAs */}
            <div className="mb-8 flex flex-col gap-4 sm:flex-row">
              <Button
                variant="hero"
                size="lg"
                className="group relative overflow-hidden"
                asChild
              >
                <a href="#blog-section">
                  <span className="relative z-10">Explorar Artículos</span>
                  <div className="absolute in set-0 translate-y-full bg-accent transition-transform group-hover:translate-y-0" />
                </a>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-2 border-primary-foreground/20 bg-transparent text-primary-foreground hover:bg-primary-foreground/10"
                asChild
              >
                <a href="/servicios">Ver Recursos</a>
              </Button>
            </div>

            {/* Compact Quick Search */}
            <form onSubmit={handleSearch} className="relative max-w-md">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={localSearchQuery}
                onChange={(e) => setLocalSearchQuery(e.target.value)}
                placeholder="Búsqueda rápida..."
                className="h-12 w-full rounded-xl border-2 border-primary-foreground/10 bg-background/60 pl-12 pr-12 text-foreground backdrop-blur placeholder:text-muted-foreground focus:border-accent focus:outline-none"
              />
              {localSearchQuery && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </form>
          </div>

          {/* Right Column - Visual Elements */}
          <div className="animate-fade-up relative hidden opacity-0 animation-delay-200 lg:block">
            {/* Floating Cards/Elements */}
            <div className="relative h-[400px]">
              {/* Main card */}
              <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-2xl border-2 border-primary/20 bg-background/40 p-8 shadow-2xl backdrop-blur">
                <Smartphone className="mb-4 h-16 w-16 text-accent" />
                <h3 className="mb-2 text-xl font-bold text-foreground">Desarrollo Móvil</h3>
                <p className="text-sm text-muted-foreground">iOS, Android & Cross-platform</p>

                {/* Decorative elements */}
                <div className="mt-6 flex gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                  <div className="h-2 w-2 rounded-full bg-accent animate-pulse animation-delay-100" />
                  <div className="h-2 w-2 rounded-full bg-secondary animate-pulse animation-delay-200" />
                </div>
              </div>

              {/* Floating accent cards */}
              <div className="absolute -left-4 top-4 rounded-xl border border-primary/20 bg-primary/10 p-4 backdrop-blur">
                <Code className="h-8 w-8 text-primary" />
              </div>
              <div className="absolute -right-4 bottom-4 rounded-xl border border-accent/20 bg-accent/10 p-4 backdrop-blur">
                <Rocket className="h-8 w-8 text-accent" />
              </div>

              {/* Orbiting circles */}
              <div className="absolute left-0 top-0 h-full w-full">
                <div className="absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-dashed border-primary/10 animate-spin" style={{ animationDuration: '20s' }} />
                <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full border border-accent/10 animate-spin" style={{ animationDuration: '30s', animationDirection: 'reverse' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Tech Tags - Moved to bottom */}
        <div className="animate-fade-up mt-12 opacity-0 animation-delay-300">
          <p className="mb-3 text-sm font-medium text-primary-foreground/60">Tecnologías Featured:</p>
          <div className="flex flex-wrap gap-3">
            {["Swift", "Kotlin", "React Native", "Flutter", "Firebase"].map((tech) => (
              <button
                key={tech}
                onClick={() => {
                  setLocalSearchQuery(tech);
                  onSearch?.(tech);
                }}
                className="group relative overflow-hidden rounded-lg border border-primary-foreground/20 bg-background/20 px-4 py-2 text-sm font-medium text-primary-foreground backdrop-blur transition-all hover:border-accent hover:bg-accent/10"
              >
                {tech}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
