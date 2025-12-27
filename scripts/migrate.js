
import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. Setup Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL;
// Prefer Service Role Key for admin tasks (bypasses RLS), fallback to Anon Key
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("❌ Error: Missing Supabase credentials in .env");
    console.error("   Please ensure VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or ANNON_KEY) are set.");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);
const SITE_ID = 'desarrolloappsmoviles.com.mx';

console.log(`🚀 Starting migration for site: ${SITE_ID}`);
console.log(`Using Supabase URL: ${supabaseUrl}`);

// 2. Extract Data from TypeScript file
function getBlogData() {
    try {
        const filePath = path.join(__dirname, '../src/data/blogData.ts');
        let content = fs.readFileSync(filePath, 'utf8');

        // Cut off helper functions at the end to avoid complex TS parsing
        content = content.split('// Helper function')[0];

        // Clean up TypeScript syntax
        // Remove imports
        content = content.replace(/^import .*?$/gm, '');
        // Remove type annotations (e.g., : Category[], : Author)
        // Simple regex for : Type
        content = content.replace(/:\s*[A-Z][a-zA-Z0-9\[\]\|]+/g, '');
        // Remove : string/number etc in objects if any (mostly handled by above if Capitalized, but lowercase types too)
        content = content.replace(/:\s*string/g, '');

        // Remove export keywords
        content = content.replace(/export const/g, 'const');

        // Prepare code for evaluation
        // We need to construct the result object
        content += '\nreturn { articles, categories, defaultAuthor };';

        // Execute safely
        const func = new Function(content);
        return func();
    } catch (error) {
        console.error("❌ Error extracting data from blogData.ts:", error);
        process.exit(1);
    }
}

const { articles, categories, defaultAuthor } = getBlogData();
console.log(`📦 Found ${articles.length} articles, ${categories.length} categories.`);

async function migrate() {
    try {
        // 3. Upsert Author
        // Assuming we use the default author for all for now, or per article if defined differently
        // In blogData.ts, all articles use 'author: defaultAuthor' reference.

        // Check if author exists or create
        console.log(`\n👤 Processing Author: ${defaultAuthor.name}...`);
        const { data: authorData, error: authorError } = await supabase
            .from('authors')
            .select('id')
            .eq('name', defaultAuthor.name)
            .single();

        let authorId;

        if (authorData) {
            authorId = authorData.id;
            console.log(`   - Author found: ${authorId}`);
        } else {
            const { data: newAuthor, error: createError } = await supabase
                .from('authors')
                .insert([{
                    name: defaultAuthor.name,
                    role: defaultAuthor.role,
                    bio: defaultAuthor.bio,
                    avatar_url: defaultAuthor.avatar_url || null
                }])
                .select()
                .single();

            if (createError) throw createError;
            authorId = newAuthor.id;
            console.log(`   - Author created: ${authorId}`);
        }

        // 4. Upsert Categories
        console.log(`\nTb Processing Categories...`);
        const categoryMap = new Map(); // slug -> id

        for (const cat of categories) {
            // Upsert category (unique by slug AND site_id)
            // Since schema uses unique(slug, site_id), we should include site_id in lookup

            // First try to find
            const { data: catData, error: catError } = await supabase
                .from('categories')
                .select('id')
                .eq('slug', cat.slug)
                .eq('site_id', SITE_ID) // Important for multi-tenant
                .single();

            let catId;

            if (catData) {
                catId = catData.id;
            } else {
                // Insert
                const { data: newCat, error: createCatError } = await supabase
                    .from('categories')
                    .insert({
                        name: cat.name,
                        slug: cat.slug,
                        site_id: SITE_ID
                    })
                    .select()
                    .single();

                if (createCatError) {
                    // Handle race condition or duplicate key error gracefully
                    if (createCatError.code === '23505') { // Unique violation
                        const { data: retryCat } = await supabase.from('categories').select('id').eq('slug', cat.slug).eq('site_id', SITE_ID).single();
                        catId = retryCat?.id;
                    } else {
                        console.error(`   - Error creating category ${cat.name}:`, createCatError.message);
                        continue;
                    }
                } else {
                    catId = newCat.id;
                }
            }

            if (catId) {
                categoryMap.set(cat.name, catId); // blogData uses name in article.category ref usually? No, let's check article.category type.
                // In blogData.ts: category: "Costos y Presupuestos" (String name)
                // So we map Name -> ID
                console.log(`   - Category '${cat.name}': ${catId}`);
            }
        }

        // 5. Upsert Articles
        console.log(`\n📄 Processing Articles...`);

        for (const article of articles) {
            const catId = categoryMap.get(article.category);
            if (!catId) {
                console.warn(`   ⚠️ Category not found for article: ${article.title} (${article.category})`);
            }


            // Helper to parse Spanish dates like "15 Ene 2026"
            function parseSpanishDate(dateStr) {
                if (!dateStr) return new Date();

                const months = {
                    'Ene': 'Jan', 'Feb': 'Feb', 'Mar': 'Mar', 'Abr': 'Apr', 'May': 'May', 'Jun': 'Jun',
                    'Jul': 'Jul', 'Ago': 'Aug', 'Sep': 'Sep', 'Oct': 'Oct', 'Nov': 'Nov', 'Dic': 'Dec'
                };

                const parts = dateStr.split(' ');
                if (parts.length === 3) {
                    const [day, month, year] = parts;
                    const engMonth = months[month];
                    if (engMonth) {
                        return new Date(`${day} ${engMonth} ${year}`);
                    }
                }
                return new Date(dateStr); // Try standard parse as fallback
            }

            const articlePayload = {
                site_id: SITE_ID,
                title: article.title,
                slug: article.slug,
                excerpt: article.excerpt,
                content: article.content, // JSONB
                image_url: article.image,
                meta_description: article.metaDescription,
                keywords: article.keywords, // Array
                read_time: article.readTime,
                published_at: parseSpanishDate(article.date).toISOString(), // Parse Spanish Date
                status: 'published',
                author_id: authorId,
                category_id: catId
            };

            // Upsert based on slug + site_id
            const { data: upsertData, error: upsertError } = await supabase
                .from('articles')
                .upsert(articlePayload, { onConflict: 'slug, site_id' })

            if (upsertError) {
                console.error(`   ❌ Error saving article '${article.title}':`, upsertError.message);
            } else {
                console.log(`   ✅ Saved: ${article.title}`);
            }
        }

        console.log(`\n✨ Migration completed successfully!`);

    } catch (err) {
        console.error("\n❌ Fatal Error:", err);
        process.exit(1);
    }
}

migrate();
