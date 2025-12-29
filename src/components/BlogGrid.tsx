import BlogCard from "./BlogCard";
import { BlogPost } from "@/types/types";

interface BlogGridProps {
  searchQuery?: string;
  posts: BlogPost[];
  isLoading: boolean;
}

const BlogGrid = ({ searchQuery, posts, isLoading }: BlogGridProps) => {
  if (isLoading) {
    return (
      <section className="py-12 lg:py-16">
        {/* Magazine-style loading skeleton */}
        <div className="mb-8 h-[500px] rounded-3xl bg-muted/50 animate-pulse" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-[350px] rounded-2xl bg-muted/50 animate-pulse" />
          ))}
        </div>
      </section>
    );
  }

  const filteredPosts = searchQuery
    ? posts.filter(
      (post) =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.category.toLowerCase().includes(searchQuery.toLowerCase())
    )
    : posts;

  // Split posts: first one featured, rest in grid
  const [featuredPost, ...remainingPosts] = filteredPosts;

  return (
    <section className="py-12 lg:py-16">
      <div className="mb-8">
        <h2 className="text-3xl font-black text-foreground lg:text-4xl">
          {searchQuery ? `Resultados para "${searchQuery}"` : "Artículos Destacados"}
        </h2>
        <p className="mt-3 text-lg text-muted-foreground">
          Contenido de vanguardia sobre desarrollo móvil
        </p>
      </div>

      {filteredPosts.length > 0 ? (
        <>
          {/* Featured Article - Magazine Style */}
          {featuredPost && !searchQuery && (
            <div className="animate-fade-up mb-12 opacity-0">
              <div className="group relative overflow-hidden rounded-3xl border-2 border-border bg-card shadow-card transition-all hover:shadow-card-hover lg:grid lg:grid-cols-2 lg:gap-8">
                {/* Image Section */}
                <div className="relative h-64 overflow-hidden lg:h-full">
                  <img
                    src={featuredPost.image}
                    alt={featuredPost.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent lg:bg-gradient-to-r" />

                  {/* Category badge on image */}
                  <div className="absolute left-6 top-6">
                    <span className="rounded-full border border-primary/20 bg-primary/90 px-4 py-1.5 text-sm font-semibold text-primary-foreground backdrop-blur">
                      {featuredPost.category}
                    </span>
                  </div>
                </div>

                {/* Content Section */}
                <div className="relative p-8 lg:py-12">
                  <div className="mb-3 flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{featuredPost.date}</span>
                    <span>•</span>
                    <span>{featuredPost.readTime || "5 min"}</span>
                  </div>

                  <h3 className="mb-4 text-3xl font-bold leading-tight text-foreground transition-colors group-hover:text-primary lg:text-4xl">
                    {featuredPost.title}
                  </h3>

                  <p className="mb-6 line-clamp-3 text-lg leading-relaxed text-muted-foreground">
                    {featuredPost.excerpt}
                  </p>

                  <a
                    href={`/articulo/${featuredPost.slug}`}
                    className="inline-flex items-center gap-2 text-lg font-semibold text-primary transition-all group-hover:gap-4"
                  >
                    Leer más
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Grid of remaining articles */}
          {remainingPosts.length > 0 && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {remainingPosts.map((post, index) => (
                <div
                  key={post.id}
                  className="animate-fade-up opacity-0"
                  style={{ animationDelay: `${index * 100}ms`, animationFillMode: "forwards" }}
                >
                  <BlogCard {...post} />
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="rounded-3xl border-2 border-dashed border-border bg-muted/30 p-16 text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
            <svg className="h-10 w-10 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <p className="mb-2 text-xl font-bold text-foreground">
            No se encontraron artículos
          </p>
          <p className="text-muted-foreground">
            Intenta con: "React Native", "iOS", "Android" o "Flutter"
          </p>
        </div>
      )}
    </section>
  );
};

export default BlogGrid;
