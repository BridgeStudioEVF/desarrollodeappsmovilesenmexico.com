import BlogCard from "./BlogCard";

// Sample blog data with SEO-optimized content
const blogPosts = [
  {
    id: "1",
    title: "Guía Completa: Desarrollo de Apps Móviles en 2024",
    excerpt: "Todo lo que necesitas saber sobre el desarrollo de apps móviles, desde la planificación hasta el lanzamiento en iOS y Android.",
    category: "Tech",
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&auto=format&fit=crop&q=60",
    date: "20 Dic 2024",
    readTime: "8 min",
    slug: "guia-completa-desarrollo-apps-moviles-2024",
  },
  {
    id: "2",
    title: "Flutter vs React Native: ¿Cuál Elegir para tu App?",
    excerpt: "Comparativa detallada entre los dos frameworks más populares para desarrollo de aplicaciones móviles multiplataforma.",
    category: "Tech",
    image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&auto=format&fit=crop&q=60",
    date: "18 Dic 2024",
    readTime: "6 min",
    slug: "flutter-vs-react-native-comparativa",
  },
  {
    id: "3",
    title: "Costo de Desarrollar una App Móvil en México",
    excerpt: "Análisis de los factores que influyen en el costo del desarrollo de apps móviles y cómo planificar tu presupuesto de software a la medida.",
    category: "Business",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=60",
    date: "15 Dic 2024",
    readTime: "7 min",
    slug: "costo-desarrollar-app-movil-mexico",
  },
  {
    id: "4",
    title: "Mejores Prácticas de UX en Apps iOS y Android",
    excerpt: "Descubre cómo diseñar interfaces intuitivas que mejoren la experiencia del usuario en el desarrollo de apps móviles.",
    category: "UX",
    image: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=800&auto=format&fit=crop&q=60",
    date: "12 Dic 2024",
    readTime: "5 min",
    slug: "mejores-practicas-ux-apps-ios-android",
  },
  {
    id: "5",
    title: "Programación iOS: Swift vs Objective-C en 2024",
    excerpt: "¿Cuál lenguaje deberías usar para la programación iOS? Analizamos las ventajas de cada uno para el desarrollo de apps.",
    category: "iOS",
    image: "https://images.unsplash.com/photo-1621839673705-6617adf9e890?w=800&auto=format&fit=crop&q=60",
    date: "10 Dic 2024",
    readTime: "6 min",
    slug: "programacion-ios-swift-vs-objective-c",
  },
  {
    id: "6",
    title: "Kotlin para Android: Guía de Inicio Rápido",
    excerpt: "Aprende los fundamentos de Kotlin para programación Android y crea tu primera aplicación móvil paso a paso.",
    category: "Android",
    image: "https://images.unsplash.com/photo-1607252650355-f7fd0460ccdb?w=800&auto=format&fit=crop&q=60",
    date: "8 Dic 2024",
    readTime: "10 min",
    slug: "kotlin-android-guia-inicio-rapido",
  },
];

interface BlogGridProps {
  searchQuery?: string;
}

const BlogGrid = ({ searchQuery }: BlogGridProps) => {
  const filteredPosts = searchQuery
    ? blogPosts.filter(
        (post) =>
          post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : blogPosts;

  return (
    <section className="py-12 lg:py-16">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-foreground lg:text-3xl">
          {searchQuery ? `Resultados para "${searchQuery}"` : "Últimos Artículos"}
        </h2>
        <p className="mt-2 text-muted-foreground">
          Explora nuestras guías sobre desarrollo de apps móviles, programación iOS y Android
        </p>
      </div>

      {filteredPosts.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredPosts.map((post, index) => (
            <div
              key={post.id}
              className="animate-fade-up opacity-0"
              style={{ animationDelay: `${index * 100}ms`, animationFillMode: "forwards" }}
            >
              <BlogCard {...post} />
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-card p-12 text-center">
          <p className="text-lg text-muted-foreground">
            No se encontraron artículos para "{searchQuery}"
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Intenta con otros términos como "desarrollo de apps móviles", "iOS" o "Android"
          </p>
        </div>
      )}
    </section>
  );
};

export default BlogGrid;
