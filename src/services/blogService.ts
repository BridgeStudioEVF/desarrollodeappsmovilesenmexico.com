import { supabase } from "@/lib/supabaseClient";
import { Article, BlogPost } from "@/types/types";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const SITE_ID = 'desarrollodeappsmovilesenmexico.com';

// Helper to format date consistent with UI
const formatDate = (isoString: string) => {
    if (!isoString) return "";
    try {
        return format(new Date(isoString), "d MMM yyyy", { locale: es });
    } catch (e) {
        return isoString;
    }
};

export const getArticles = async (searchQuery: string = ""): Promise<BlogPost[]> => {
    let query = supabase
        .from('articles')
        .select(`
      id,
      title,
      slug,
      excerpt,
      image_url,
      published_at,
      read_time,
      categories ( name )
    `)
        .eq('site_id', SITE_ID)
        .eq('status', 'published')
        .order('published_at', { ascending: false });

    if (searchQuery) {
        // Search in title or excerpt
        query = query.or(`title.ilike.%${searchQuery}%,excerpt.ilike.%${searchQuery}%`);
    }

    const { data, error } = await query;

    if (error) {
        console.error("Error fetching articles:", error);
        throw error;
    }

    return data.map((row: any) => ({
        id: row.id,
        title: row.title,
        slug: row.slug,
        excerpt: row.excerpt,
        image: row.image_url,
        date: formatDate(row.published_at),
        readTime: row.read_time,
        category: row.categories?.name || "General",
    }));
};

export const getArticleBySlug = async (slug: string): Promise<Article | null> => {
    const { data, error } = await supabase
        .from('articles')
        .select(`
      *,
      categories ( name, slug, id, description ),
      authors ( name, role, avatar_url, bio )
    `)
        .eq('site_id', SITE_ID)
        .eq('slug', slug)
        .single();

    if (error) { // Not found or other error
        console.warn("Error fetching article by slug:", error);
        return null;
    }

    // Transform to Article type
    return {
        id: data.id,
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt,
        category: data.categories?.name || "General",
        image: data.image_url,
        date: formatDate(data.published_at),
        readTime: data.read_time,
        author: data.authors ? {
            name: data.authors.name,
            role: data.authors.role,
            avatar: data.authors.avatar_url,
            bio: data.authors.bio
        } : undefined,
        metaDescription: data.meta_description,
        keywords: data.keywords || [],
        content: data.content as any, // Cast JSONB to ArticleSection[]
        relatedArticles: [] // We can implement fetching related later if needed, mostly handled by manual linking or separate query
    };
};

// Optional: Get strictly related articles based on category or tags
export const getRelatedArticles = async (currentSlug: string, categoryId: string): Promise<BlogPost[]> => {
    const { data } = await supabase
        .from('articles')
        .select(`
      id, title, slug, excerpt, image_url, published_at, read_time, categories(name)
    `)
        .eq('site_id', SITE_ID)
        // .eq('category_id', categoryId) // If we want same category
        .neq('slug', currentSlug)
        .limit(3);

    return (data || []).map((row: any) => ({
        id: row.id,
        title: row.title,
        slug: row.slug,
        excerpt: row.excerpt, // Optional for related
        image: row.image_url,
        date: formatDate(row.published_at),
        readTime: row.read_time,
        category: row.categories?.name || "General",
    }));
}
