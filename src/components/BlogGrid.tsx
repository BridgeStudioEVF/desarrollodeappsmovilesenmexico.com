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
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-[400px] rounded-2xl bg-muted/50 animate-pulse" />
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

