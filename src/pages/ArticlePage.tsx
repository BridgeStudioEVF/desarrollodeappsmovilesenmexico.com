import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getArticleBySlug, getRelatedArticles } from "@/services/blogService";
import { Calendar, Clock, ArrowLeft, ChevronRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import BlogCard from "@/components/BlogCard";
import TableOfContents from "@/components/TableOfContents";
import ShareButtons from "@/components/ShareButtons";
import SEO from "@/components/SEO";
import ReadingProgress from "@/components/ReadingProgress";
import { ArticleSection } from "@/types/types";
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';

const ArticlePage = () => {
  const { slug } = useParams();

  const { data: article, isLoading } = useQuery({
    queryKey: ['article', slug],
    queryFn: () => getArticleBySlug(slug || ''),
    enabled: !!slug
  });

  const { data: relatedArticles = [] } = useQuery({
    queryKey: ['related-articles', slug],
    queryFn: () => getRelatedArticles(slug || '', ''), // Category ID logic to be improved if needed, service handles by slug exclusion mainly
    enabled: !!article
  });


  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 container flex items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    );
  }

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
    "Costos y Presupuestos": "bg-orange-500/10 text-orange-600",
    "Tecnología": "bg-cyan-500/10 text-cyan-600",
    "Negocios": "bg-emerald-500/10 text-emerald-600",
    "Diseño UX/UI": "bg-amber-500/10 text-amber-600",
    "Desarrollo": "bg-blue-500/10 text-blue-600",
    "Seguridad": "bg-red-500/10 text-red-600",
  };

  const processContent = (text: string) => {
    if (!text) return null;
    const parts = text.split(/(Bridge Studio)/g);
    return parts.map((part, i) => {
      if (part === 'Bridge Studio') {
        return (
          <a
            key={i}
            href="https://bridgestudio.mx"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary font-bold hover:underline"
            title="Visitar Bridge Studio - Expertos en Desarrollo de Apps"
          >
            Bridge Studio
          </a>
        );
      }
      return part;
    });
  };

  const renderSection = (section: ArticleSection, level: number = 2, index: number, parentIndex?: number) => {
    const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements;
    const id = parentIndex !== undefined ? `section-${parentIndex}-${index}` : `section-${index}`;

    return (
      <div key={section.heading} className="mb-8" id={id}>
        <HeadingTag className={`font-bold text-card-foreground ${level === 2 ? 'text-2xl mb-4 scroll-mt-24' : 'text-xl mb-3 scroll-mt-24'}`}>
          {section.heading}
        </HeadingTag>
        {section.content && (
          <div className="prose prose-gray max-w-none prose-headings:text-card-foreground prose-h3:text-lg prose-h3:font-semibold prose-h3:mt-6 prose-h3:mb-3 prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:mb-4 prose-ul:text-muted-foreground prose-ol:text-muted-foreground prose-li:mb-2 prose-strong:text-card-foreground prose-strong:font-semibold prose-a:text-primary prose-a:font-bold hover:prose-a:underline">
            <ReactMarkdown
              rehypePlugins={[rehypeRaw]}
              remarkPlugins={[remarkGfm]}
              components={{
                p: ({ node, ...props }) => {
                  const content = props.children;
                  if (typeof content === 'string') {
                    const processedContent = processContent(content);
                    return <p {...props}>{processedContent}</p>;
                  }
                  return <p {...props} />;
                },
                a: ({ node, ...props }) => {
                  if (props.href?.includes('bridgestudio.mx')) {
                    return (
                      <a
                        {...props}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary font-bold hover:underline"
                        title="Visitar Bridge Studio - Expertos en Desarrollo de Apps"
                      />
                    );
                  }
                  return <a {...props} target="_blank" rel="noopener noreferrer" />;
                },
              }}
            >
              {section.content}
            </ReactMarkdown>
          </div>
        )}
        {section.subsections && section.subsections.length > 0 && (
          <div className="ml-4 space-y-6">
            {section.subsections.map((subsection, subIndex) => renderSection(subsection, Math.min(level + 1, 6), subIndex, index))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={`${article.title} | Bridge Studio`}
        description={article.metaDescription}
        image={article.image}
        url={window.location.href}
        type="article"
      />
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
          <div className="grid gap-8 lg:grid-cols-12 lg:gap-8">
            {/* Main Content - 8 cols */}
            <article className="lg:col-span-8">
              <div className="rounded-2xl border border-border bg-card p-6 shadow-card lg:p-10">
                {/* Breadcrumb */}
                <nav className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
                  <Link to="/" className="hover:text-primary transition-colors">
                    Blog
                  </Link>
                  <ChevronRight className="h-4 w-4" />
                  <span className="text-card-foreground">{article.category}</span>
                </nav>

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
                  className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${categoryColors[article.category] || "bg-primary/10 text-primary"
                    }`}
                >
                  {article.category}
                </span>

                {/* Title */}
                <h1 className="mt-4 text-2xl font-extrabold leading-tight text-card-foreground sm:text-3xl lg:text-4xl">
                  {article.title}
                </h1>

                {/* Meta */}
                <div className="mt-6 flex flex-wrap items-center gap-6 border-b border-border pb-6">
                  {/* Author */}
                  {article.author && (
                    <div className="flex items-center gap-3">
                      {article.author.avatar && (
                        <img
                          src={article.author.avatar}
                          alt={article.author.name}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      )}
                      <div>
                        <p className="text-sm font-semibold text-card-foreground">
                          {article.author.name}
                        </p>
                        <p className="text-xs text-muted-foreground">{article.author.role}</p>
                      </div>
                    </div>
                  )}

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
                </div>

                {/* Share Buttons Mobile */}
                <div className="mt-6 lg:hidden">
                  <ShareButtons title={article.title} />
                </div>

                {/* Excerpt */}
                <p className="mt-6 text-lg text-muted-foreground leading-relaxed italic border-l-4 border-primary pl-4">
                  {article.excerpt}
                </p>

                {/* Table of Contents Mobile */}
                <div className="mt-8 lg:hidden rounded-lg bg-muted/50 p-4">
                  <TableOfContents sections={article.content} />
                </div>

                {/* Content */}
                <div className="mt-10 space-y-6">
                  {article.content.map((section, index) => renderSection(section, 2, index))}
                </div>

                {/* Keywords/Tags */}
                {article.keywords && article.keywords.length > 0 && (
                  <div className="mt-12 border-t border-border pt-6">
                    <h3 className="text-sm font-semibold text-card-foreground mb-3">
                      Etiquetas:
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {article.keywords.map((keyword) => (
                        <span
                          key={keyword}
                          className="rounded-full border border-border bg-muted px-3 py-1 text-xs text-muted-foreground"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Share Buttons Bottom */}
                <div className="mt-8 border-t border-border pt-6">
                  <ShareButtons title={article.title} />
                </div>

                {/* CTA */}
                <div className="mt-12 rounded-2xl bg-hero-gradient p-8 text-center text-primary-foreground">
                  <h3 className="text-xl font-bold">¿Listo para desarrollar tu app?</h3>
                  <p className="mt-2 text-primary-foreground/80">
                    Cotiza tu proyecto de desarrollo de apps móviles con expertos en Bridge Studio.
                  </p>
                  <Button
                    variant="secondary"
                    size="lg"
                    className="mt-6"
                    asChild
                  >
                    <a href="https://bridgestudio.mx" target="_blank" rel="noopener noreferrer">
                      Cotizar Proyecto
                    </a>
                  </Button>
                </div>
              </div>

              {/* Related Articles */}
              {relatedArticles.length > 0 && (
                <div className="mt-12">
                  <h2 className="text-2xl font-bold text-foreground mb-6">
                    Artículos Relacionados
                  </h2>
                  <div className="grid gap-6 sm:grid-cols-2">
                    {relatedArticles.slice(0, 2).map((relatedPost) => (
                      <BlogCard key={relatedPost.id} {...relatedPost} />
                    ))}
                  </div>
                </div>
              )}
            </article>

            {/* Sidebar Column - 4 cols */}
            <aside className="hidden lg:block lg:col-span-4 space-y-8">
              {/* Sticky Container */}
              <div className="sticky top-24 space-y-8">
                {/* Share Widget */}
                <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
                  <ShareButtons title={article.title} />
                </div>

                {/* Table of Contents Widget */}
                <div className="rounded-xl border border-border bg-card p-5 shadow-sm max-h-[calc(100vh-250px)] overflow-y-auto">
                  <TableOfContents sections={article.content} />
                </div>

                {/* Standard Sidebar */}
                <Sidebar />
              </div>
            </aside>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ArticlePage;
