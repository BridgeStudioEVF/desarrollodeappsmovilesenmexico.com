import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, Send, Clock } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const Contacto = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    empresa: "",
    mensaje: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Mensaje enviado",
      description: "Nos pondremos en contacto contigo pronto.",
    });
    setFormData({ nombre: "", email: "", empresa: "", mensaje: "" });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-hero-gradient py-20 lg:py-28">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -right-40 -top-40 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
            <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-accent/10 blur-3xl" />
          </div>

          <div className="container relative">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="animate-fade-up mb-6 text-4xl font-extrabold leading-tight tracking-tight text-primary-foreground opacity-0 sm:text-5xl">
                Contacto
              </h1>
              <p className="animate-fade-up mx-auto max-w-2xl text-lg text-primary-foreground/80 opacity-0 animation-delay-100">
                ¿Tienes un proyecto de desarrollo de apps móviles en mente? Contáctanos y te ayudamos a hacerlo realidad.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="container py-16 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Contact Form */}
            <div className="animate-fade-up opacity-0" style={{ animationFillMode: "forwards" }}>
              <h2 className="mb-6 text-2xl font-bold text-foreground">Envíanos un mensaje</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="nombre" className="mb-2 block text-sm font-medium text-foreground">
                      Nombre
                    </label>
                    <input
                      type="text"
                      id="nombre"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleChange}
                      required
                      className="h-12 w-full rounded-xl border border-border bg-card px-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                      placeholder="Tu nombre"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="mb-2 block text-sm font-medium text-foreground">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="h-12 w-full rounded-xl border border-border bg-card px-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                      placeholder="tu@email.com"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="empresa" className="mb-2 block text-sm font-medium text-foreground">
                    Empresa (Opcional)
                  </label>
                  <input
                    type="text"
                    id="empresa"
                    name="empresa"
                    value={formData.empresa}
                    onChange={handleChange}
                    className="h-12 w-full rounded-xl border border-border bg-card px-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                    placeholder="Nombre de tu empresa"
                  />
                </div>
                <div>
                  <label htmlFor="mensaje" className="mb-2 block text-sm font-medium text-foreground">
                    Mensaje
                  </label>
                  <textarea
                    id="mensaje"
                    name="mensaje"
                    value={formData.mensaje}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full rounded-xl border border-border bg-card px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                    placeholder="Cuéntanos sobre tu proyecto de desarrollo de apps móviles..."
                  />
                </div>
                <Button type="submit" variant="cta" size="lg" className="w-full sm:w-auto">
                  Enviar Mensaje
                  <Send className="ml-2 h-5 w-5" />
                </Button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="animate-fade-up opacity-0 animation-delay-200" style={{ animationFillMode: "forwards" }}>
              <h2 className="mb-6 text-2xl font-bold text-foreground">Información de contacto</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4 rounded-xl border border-border bg-card p-6 shadow-card">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent/10">
                    <Mail className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-card-foreground">Email</h3>
                    <p className="mt-1 text-muted-foreground">contacto@bridgestudio.mx</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 rounded-xl border border-border bg-card p-6 shadow-card">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent/10">
                    <Phone className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-card-foreground">Teléfono</h3>
                    <p className="mt-1 text-muted-foreground">+52 (55) 1234-5678</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 rounded-xl border border-border bg-card p-6 shadow-card">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent/10">
                    <MapPin className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-card-foreground">Ubicación</h3>
                    <p className="mt-1 text-muted-foreground">Ciudad de México, México</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 rounded-xl border border-border bg-card p-6 shadow-card">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent/10">
                    <Clock className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-card-foreground">Horario</h3>
                    <p className="mt-1 text-muted-foreground">Lunes a Viernes: 9:00 - 18:00</p>
                  </div>
                </div>
              </div>

              {/* Bridge Studio CTA */}
              <div className="mt-8 rounded-2xl bg-hero-gradient p-8 text-primary-foreground">
                <h3 className="mb-3 text-xl font-bold">¿Prefieres cotizar directamente?</h3>
                <p className="mb-6 text-primary-foreground/80">
                  Visita Bridge Studio para una cotización rápida de tu proyecto de desarrollo de apps móviles.
                </p>
                <Button variant="cta" className="bg-background text-foreground hover:bg-background/90" asChild>
                  <a href="https://bridgestudio.mx" target="_blank" rel="noopener noreferrer">
                    Ir a Bridge Studio
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Contacto;
