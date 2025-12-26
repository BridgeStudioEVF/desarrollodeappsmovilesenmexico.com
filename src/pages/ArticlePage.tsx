import { useParams, Link } from "react-router-dom";
import { Calendar, Clock, ArrowLeft, User, Share2, BookmarkPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";

// Sample article data
const articles: Record<string, {
  title: string;
  excerpt: string;
  content: string;
  category: string;
  image: string;
  date: string;
  readTime: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
}> = {
  "guia-completa-desarrollo-apps-moviles-2024": {
    title: "Guía Completa: Desarrollo de Apps Móviles en 2024",
    excerpt: "Todo lo que necesitas saber sobre el desarrollo de apps móviles, desde la planificación hasta el lanzamiento en iOS y Android.",
    content: `
      <h2>Introducción al Desarrollo de Apps Móviles</h2>
      <p>El desarrollo de apps móviles ha evolucionado significativamente en los últimos años. En 2024, las empresas en México buscan cada vez más soluciones de software a la medida que les permitan conectar con sus clientes de manera efectiva.</p>
      
      <p>Ya sea que estés considerando programación iOS con Swift, desarrollo Android con Kotlin, o frameworks multiplataforma como Flutter y React Native, esta guía te proporcionará las bases necesarias para tomar decisiones informadas.</p>

      <h2>Planificación del Proyecto</h2>
      <p>Antes de comenzar el desarrollo de tu aplicación móvil, es crucial definir claramente los objetivos del proyecto. Esto incluye:</p>
      <ul>
        <li>Identificar el público objetivo de tu app</li>
        <li>Definir las funcionalidades principales (MVP)</li>
        <li>Establecer un presupuesto realista</li>
        <li>Elegir la plataforma adecuada (iOS, Android o ambas)</li>
      </ul>

      <h2>Selección de Tecnología</h2>
      <p>La elección entre desarrollo nativo y multiplataforma depende de varios factores. El desarrollo nativo con Swift para iOS y Kotlin para Android ofrece el mejor rendimiento, mientras que frameworks como Flutter y React Native permiten crear aplicaciones para ambas plataformas con una sola base de código.</p>

      <h2>Diseño UX/UI</h2>
      <p>Una interfaz intuitiva es fundamental para el éxito de cualquier aplicación móvil. Siguiendo las guías de diseño de iOS (Human Interface Guidelines) y Android (Material Design), podrás crear experiencias consistentes y atractivas para tus usuarios.</p>

      <h2>Desarrollo y Pruebas</h2>
      <p>El proceso de desarrollo debe incluir ciclos iterativos de desarrollo y pruebas. Es importante realizar pruebas en dispositivos reales y considerar diferentes tamaños de pantalla y versiones del sistema operativo.</p>

      <h2>Lanzamiento y Mantenimiento</h2>
      <p>Publicar tu app en la App Store y Google Play Store requiere seguir sus respectivas guías y políticas. Una vez publicada, el mantenimiento continuo y las actualizaciones regulares son esenciales para mantener a tus usuarios satisfechos.</p>

      <h2>Conclusión</h2>
      <p>El desarrollo de apps móviles es un proceso complejo que requiere planificación, experiencia técnica y un enfoque centrado en el usuario. Si estás buscando desarrollar una aplicación para tu empresa en México, considera trabajar con una agencia especializada como Bridge Studio para obtener los mejores resultados.</p>
    `,
    category: "Tech",
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=1200&auto=format&fit=crop&q=80",
    date: "20 Diciembre 2024",
    readTime: "8 min",
    author: {
      name: "Carlos Mendoza",
      role: "Lead Developer",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=60",
    },
  },
};

const ArticlePage = () => {
  const { slug } = useParams();
  const article = slug ? articles[slug] : null;

  if (!article) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-20">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="mb-4 text-3xl font-bold text-foreground">Artículo no encontrado</h1>
            <p className="mb-8 text-muted-foreground">
              Lo sentimos, no pudimos encontrar el artículo que buscas.
            </p>
            <Button asChild>
              <Link to="/">Volver al Blog</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const categoryColors: Record<string, string> = {
    Tech: "bg-accent/10 text-accent",
    Business: "bg-emerald-500/10 text-emerald-600",
    UX: "bg-amber-500/10 text-amber-600",
    iOS: "bg-blue-500/10 text-blue-600",
    Android: "bg-green-500/10 text-green-600",
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        {/* Hero Image */}
        <div className="relative h-[40vh] min-h-[300px] w-full overflow-hidden lg:h-[50vh]">
          <img
            src={article.image}
            alt={article.title}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
        </div>

        <div className="container relative -mt-24 lg:-mt-32">
          <div className="grid gap-8 lg:grid-cols-3 lg:gap-12">
            {/* Article Content */}
            <article className="lg:col-span-2">
              <div className="rounded-2xl border border-border bg-card p-6 shadow-card lg:p-10">
                {/* Back Button */}
                <Link
                  to="/"
                  className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Volver al Blog
                </Link>

                {/* Category */}
                <span
                  className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                    categoryColors[article.category] || "bg-primary/10 text-primary"
                  }`}
                >
                  {article.category}
                </span>

                {/* Title */}
                <h1 className="mt-4 text-2xl font-extrabold leading-tight text-card-foreground sm:text-3xl lg:text-4xl">
                  {article.title}
                </h1>

                {/* Meta */}
                <div className="mt-6 flex flex-wrap items-center gap-4 border-b border-border pb-6">
                  {/* Author */}
                  <div className="flex items-center gap-3">
                    <img
                      src={article.author.avatar}
                      alt={article.author.name}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="text-sm font-semibold text-card-foreground">
                        {article.author.name}
                      </p>
                      <p className="text-xs text-muted-foreground">{article.author.role}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {article.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {article.readTime}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="ml-auto flex gap-2">
                    <Button variant="ghost" size="icon" className="h-9 w-9">
                      <Share2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-9 w-9">
                      <BookmarkPlus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Content */}
                <div
                  className="prose prose-slate mt-8 max-w-none dark:prose-invert prose-headings:font-bold prose-headings:text-card-foreground prose-p:text-muted-foreground prose-a:text-primary prose-strong:text-card-foreground prose-ul:text-muted-foreground prose-li:marker:text-primary"
                  dangerouslySetInnerHTML={{ __html: article.content }}
                />

                {/* CTA */}
                <div className="mt-12 rounded-2xl bg-hero-gradient p-8 text-center text-primary-foreground">
                  <h3 className="text-xl font-bold">¿Listo para desarrollar tu app?</h3>
                  <p className="mt-2 text-primary-foreground/80">
                    Cotiza tu proyecto de desarrollo de apps móviles con expertos en Bridge Studio.
                  </p>
                  <Button variant="cta" size="lg" className="mt-6 bg-background text-foreground hover:bg-background/90" asChild>
                    <a href="https://bridgestudio.mx" target="_blank" rel="noopener noreferrer">
                      Cotizar en Bridge Studio
                    </a>
                  </Button>
                </div>
              </div>
            </article>

            {/* Sidebar */}
            <div className="lg:sticky lg:top-24 lg:self-start">
              <Sidebar />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ArticlePage;
