import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Smartphone, Monitor, Layers, Zap, CheckCircle, ArrowRight } from "lucide-react";

const services = [
  {
    icon: Smartphone,
    title: "Desarrollo iOS Nativo",
    description: "Aplicaciones nativas para iPhone y iPad con Swift, optimizadas para el ecosistema Apple.",
    features: ["Swift & SwiftUI", "Integración con Apple Pay", "Push Notifications", "App Store Optimization"],
  },
  {
    icon: Monitor,
    title: "Desarrollo Android Nativo",
    description: "Apps Android de alto rendimiento con Kotlin, compatibles con todos los dispositivos.",
    features: ["Kotlin & Jetpack Compose", "Material Design 3", "Google Play Services", "Firebase Integration"],
  },
  {
    icon: Layers,
    title: "Apps Multiplataforma",
    description: "Desarrollo con Flutter o React Native para iOS y Android con una sola base de código.",
    features: ["Flutter & React Native", "Código compartido 90%+", "Menor tiempo de desarrollo", "Mantenimiento unificado"],
  },
  {
    icon: Zap,
    title: "Software a la Medida",
    description: "Soluciones personalizadas que se adaptan exactamente a las necesidades de tu negocio.",
    features: ["Análisis de requerimientos", "Arquitectura escalable", "Integración con APIs", "Soporte continuo"],
  },
];

const Servicios = () => {
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
                Servicios de Desarrollo de Apps Móviles
              </h1>
              <p className="animate-fade-up mx-auto mb-8 max-w-2xl text-lg text-primary-foreground/80 opacity-0 animation-delay-100">
                Creamos aplicaciones móviles de alta calidad para iOS y Android que impulsan el crecimiento de tu negocio en México.
              </p>
              <Button variant="hero" size="lg" className="animate-fade-up opacity-0 animation-delay-200" asChild>
                <a href="https://bridgestudio.mx" target="_blank" rel="noopener noreferrer">
                  Cotizar Proyecto con Bridge Studio
                  <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </Button>
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="container py-16 lg:py-24">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-foreground">Nuestros Servicios</h2>
            <p className="mt-3 text-muted-foreground">
              Soluciones completas de desarrollo de apps móviles y software a la medida
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {services.map((service, index) => (
              <article
                key={service.title}
                className="animate-fade-up group rounded-2xl border border-border bg-card p-8 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover opacity-0"
                style={{ animationDelay: `${index * 100}ms`, animationFillMode: "forwards" }}
              >
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-cta-gradient">
                  <service.icon className="h-7 w-7 text-primary-foreground" />
                </div>
                <h3 className="mb-3 text-xl font-bold text-card-foreground">{service.title}</h3>
                <p className="mb-6 text-muted-foreground">{service.description}</p>
                <ul className="space-y-3">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3 text-sm text-muted-foreground">
                      <CheckCircle className="h-5 w-5 text-accent" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-secondary py-16 lg:py-24">
          <div className="container">
            <div className="mx-auto max-w-3xl rounded-2xl bg-hero-gradient p-10 text-center text-primary-foreground shadow-lg lg:p-16">
              <h2 className="mb-4 text-3xl font-bold">¿Listo para crear tu app?</h2>
              <p className="mb-8 text-primary-foreground/80">
                Contacta a Bridge Studio para una cotización personalizada de tu proyecto de desarrollo de apps móviles.
              </p>
              <Button variant="cta" size="xl" className="bg-background text-foreground hover:bg-background/90" asChild>
                <a href="https://bridgestudio.mx" target="_blank" rel="noopener noreferrer">
                  Cotizar en Bridge Studio
                  <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Servicios;
