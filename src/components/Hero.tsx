import SearchAutocomplete from "./SearchAutocomplete";

interface HeroProps {
  onSearch?: (query: string) => void;
}

const Hero = ({ onSearch }: HeroProps) => {
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

          {/* Search Bar with Autocomplete */}
          <div className="animate-fade-up mx-auto max-w-xl opacity-0 animation-delay-300">
            <SearchAutocomplete onSearch={onSearch} />
          </div>

          {/* Quick Tags */}
          <div className="animate-fade-up mt-8 flex flex-wrap justify-center gap-2 opacity-0 animation-delay-400">
            <span className="text-sm text-primary-foreground/60">Temas populares:</span>
            {["iOS", "Android", "Flutter", "React Native", "Software a la medida"].map((tag) => (
              <button
                key={tag}
                onClick={() => onSearch?.(tag)}
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
