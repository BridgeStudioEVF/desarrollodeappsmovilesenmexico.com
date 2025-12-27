-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Authors Table
CREATE TABLE authors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    avatar_url TEXT,
    bio TEXT,
    social_links JSONB DEFAULT '{}'::jsonb, -- e.g. {"twitter": "...", "linkedin": "..."}
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Categories Table
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    site_id TEXT DEFAULT 'main', -- Separator for multiple websites (e.g. 'apps-moviles', 'otro-nicho')
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE (slug, site_id) -- Allows same slug in different sites
);

-- 3. Tags Table
CREATE TABLE tags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    site_id TEXT DEFAULT 'main',
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE (slug, site_id)
);

-- 4. Articles Table
CREATE TABLE articles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    site_id TEXT DEFAULT 'main', -- CRITICAL: To filter articles per website
    title TEXT NOT NULL,
    slug TEXT NOT NULL,
    excerpt TEXT,
    content JSONB NOT NULL, -- Stores the recursive ArticleSection[] structure
    image_url TEXT,
    meta_description TEXT,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    
    -- Relationships
    author_id UUID REFERENCES authors(id) ON DELETE SET NULL,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    
    -- SEO
    keywords TEXT[], -- Array of strings for meta keywords
    
    -- Metadata
    read_time VARCHAR(20), -- e.g. "5 min read" (can be calculated on save)
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE (slug, site_id) -- Allows same article slug on different sites
);

-- 5. Article Tags (Many-to-Many)
CREATE TABLE article_tags (
    article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
    tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (article_id, tag_id)
);

-- Indexes for performance
CREATE INDEX idx_articles_slug ON articles(slug);
CREATE INDEX idx_articles_status ON articles(status);
CREATE INDEX idx_articles_published_at ON articles(published_at);

-- RLS Policies (Row Level Security) - Basic Setup
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE authors ENABLE ROW LEVEL SECURITY;

-- Allow public read access to published articles
CREATE POLICY "Public articles are viewable by everyone" 
ON articles FOR SELECT 
USING (status = 'published');

-- Allow authenticated users (admins) to do everything
CREATE POLICY "Admins can manage all" 
ON articles FOR ALL 
USING (auth.role() = 'authenticated');
