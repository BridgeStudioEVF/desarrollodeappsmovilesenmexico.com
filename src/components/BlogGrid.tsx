import BlogCard from "./BlogCard";
import { blogPosts } from "@/data/blogPosts";

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
