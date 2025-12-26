import { Smartphone, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const Sidebar = () => {
  return (
    <aside className="space-y-6">
      {/* CTA Card */}
      <div className="overflow-hidden rounded-2xl border border-primary/20 bg-hero-gradient p-6 text-primary-foreground shadow-lg">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-foreground/10">
          <Smartphone className="h-6 w-6" />
        </div>
        <h3 className="mb-2 text-xl font-bold">¿Buscas desarrollar una app?</h3>
        <p className="mb-6 text-sm text-primary-foreground/80">
          En Bridge Studio creamos aplicaciones móviles y software a la medida para empresas en México.
        </p>
        <Button variant="cta" className="w-full bg-background text-foreground hover:bg-background/90" asChild>
          <a href="https://bridgestudio.mx" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2">
            Cotizar en Bridge Studio
            <ArrowRight className="h-4 w-4" />
          </a>
        </Button>
      </div>

      {/* Newsletter Card */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10">
          <Sparkles className="h-6 w-6 text-accent" />
        </div>
        <h3 className="mb-2 text-lg font-bold text-card-foreground">Newsletter Semanal</h3>
        <p className="mb-4 text-sm text-muted-foreground">
          Recibe las últimas tendencias sobre desarrollo de apps móviles directo a tu correo.
        </p>
        <form className="space-y-3">
          <input
            type="email"
            placeholder="tu@email.com"
            className="h-11 w-full rounded-xl border border-border bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
          />
          <Button variant="default" className="w-full">
            Suscribirse
          </Button>
        </form>
      </div>

      {/* Popular Tags */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
        <h3 className="mb-4 text-lg font-bold text-card-foreground">Temas Populares</h3>
        <div className="flex flex-wrap gap-2">
          {[
            "Desarrollo de Apps Móviles",
            "iOS",
            "Android",
            "Flutter",
            "React Native",
            "Software a la medida",
            "UX/UI",
            "Kotlin",
            "Swift",
          ].map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-border bg-muted/50 px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent/10 hover:text-accent cursor-pointer"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
