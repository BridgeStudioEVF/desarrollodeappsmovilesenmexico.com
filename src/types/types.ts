export interface Author {
    name: string;
    role: string;
    avatar?: string;
    bio?: string;
}

export interface Category {
    id: string;
    name: string;
    slug: string;
    description?: string;
}

export interface ArticleSection {
    heading: string;
    content?: string;
    subsections?: ArticleSection[];
}


export interface Article {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    category: string;
    image: string;
    date: string;
    readTime: string;
    author?: Author;
    metaDescription: string;
    keywords: string[];
    content: ArticleSection[];
    relatedArticles?: string[]; // Array of article IDs
}

export interface BlogPost {
    id: string;
    title: string;
    excerpt: string;
    category: string;
    image: string;
    date: string;
    readTime: string;
    slug: string;
}
