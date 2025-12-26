import { Link } from "react-router-dom";
import { Calendar, Clock, ArrowRight } from "lucide-react";

interface BlogCardProps {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  image: string;
  date: string;
  readTime: string;
  slug: string;
}

const BlogCard = ({ id, title, excerpt, category, image, date, readTime, slug }: BlogCardProps) => {
  const categoryColors: Record<string, string> = {
    Tech: "bg-accent/10 text-accent",
    Business: "bg-emerald-500/10 text-emerald-600",
    UX: "bg-amber-500/10 text-amber-600",
    iOS: "bg-blue-500/10 text-blue-600",
    Android: "bg-green-500/10 text-green-600",
  };

  return (
    <article className="group relative overflow-hidden rounded-2xl border border-border bg-card shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover">
      {/* Image */}
      <Link to={`/articulo/${slug}`} className="block overflow-hidden">
        <div className="relative aspect-[16/10] overflow-hidden">
          <img
            src={image}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card/20 to-transparent" />
        </div>
      </Link>

      {/* Content */}
      <div className="p-5">
        {/* Category Tag */}
        <span
          className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
            categoryColors[category] || "bg-primary/10 text-primary"
          }`}
        >
          {category}
        </span>

        {/* Title */}
        <Link to={`/articulo/${slug}`}>
          <h2 className="mt-3 text-lg font-bold leading-snug text-card-foreground transition-colors group-hover:text-primary">
            {title}
          </h2>
        </Link>

        {/* Excerpt */}
        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{excerpt}</p>

        {/* Meta */}
        <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {date}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {readTime}
            </span>
          </div>
          <Link
            to={`/articulo/${slug}`}
            className="flex items-center gap-1 text-xs font-semibold text-primary transition-colors hover:text-accent"
          >
            Leer más
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </article>
  );
};

export default BlogCard;
