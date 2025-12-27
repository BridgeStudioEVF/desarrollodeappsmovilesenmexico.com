import { useState } from 'react';
import { useAdmin } from '@/context/AdminContext';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { UploadCloud, FileText, CheckCircle, AlertTriangle, X } from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';

// Cargar worker desde CDN igual que en el editor individual
// Fix worker URL for pdfjs-dist v5+ which uses .mjs
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

interface DraftArticle {
    id: number;
    title: string;
    content: string;
    category_id: string;
    extracted_meta?: { slug: string; category: string; excerpt: string; };
    editMode?: boolean; // UI state for toggling edit/view
    image_url?: string; // URL of article image
}

const BulkImport = () => {
    const { siteId } = useAdmin();
    const [step, setStep] = useState<1 | 2 | 3>(1); // 1: Upload, 2: Split/Edit Raw, 3: Review & Save
    const [rawText, setRawText] = useState('');
    const [loading, setLoading] = useState(false);
    const [drafts, setDrafts] = useState<DraftArticle[]>([]);
    const [importResults, setImportResults] = useState<{ success: number, failure: number, errors: string[] } | null>(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    // PDF - Optimized Extraction WITH Structure (Geometry-based)
    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault();
        const file = Array.from(e.dataTransfer.files).find(f => f.type === 'application/pdf');
        if (!file) return alert('Solo archivos PDF');

        setLoading(true);
        try {
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

            // Phase 1: Analyze Font Sizes to detect Body Text Size vs Headings
            const sizeMap: Record<number, number> = {};
            let samplePages = Math.min(pdf.numPages, 5);

            for (let i = 1; i <= samplePages; i++) {
                const page = await pdf.getPage(i);
                const content = await page.getTextContent();
                content.items.forEach((item: any) => {
                    const height = Math.round(item.transform[3]); // Transform[3] is roughly font size
                    if (height > 0) sizeMap[height] = (sizeMap[height] || 0) + item.str.length;
                });
            }

            let bodySize = 0;
            let maxCount = 0;
            Object.entries(sizeMap).forEach(([size, count]) => {
                if (count > maxCount) {
                    maxCount = count;
                    bodySize = Number(size);
                }
            });

            console.log('Detected Body Size:', bodySize);

            // Phase 2: Extract Stylized Text
            let fullText = '';
            const maxPages = Math.min(pdf.numPages, 100);

            for (let i = 1; i <= maxPages; i++) {
                const page = await pdf.getPage(i);
                const content = await page.getTextContent();

                // Group items by Line (Y position)
                const lines: Record<number, any[]> = {};

                content.items.forEach((item: any) => {
                    const y = Math.round(item.transform[5]); // Y translation
                    if (!lines[y]) lines[y] = [];
                    lines[y].push(item);
                });

                // Sort lines by Y (Descending: Top to Bottom)
                const sortedY = Object.keys(lines).map(Number).sort((a, b) => b - a);

                for (const y of sortedY) {
                    const lineItems = lines[y].sort((a, b) => a.transform[4] - b.transform[4]); // Sort by X

                    const lineStr = lineItems.map(it => it.str).join('');
                    const avgHeight = lineItems.reduce((sum, it) => sum + it.transform[3], 0) / lineItems.length;

                    let prefix = '';

                    // Heading Detection based on Relative Size
                    if (avgHeight > bodySize * 1.5) {
                        prefix = '## ';
                    } else if (avgHeight > bodySize * 1.05 && lineStr.length < 100) {
                        // Subtitles usually slightly larger or same size but bold/short
                        prefix = '### ';
                    }

                    // Bold Detection (if fontName contains Bold)
                    const isBold = lineItems.some(it => it.fontName.toLowerCase().includes('bold'));
                    // Only mark as bold if NOT a header
                    const finalStr = (prefix === '' && isBold) ? `**${lineStr}**` : lineStr;

                    fullText += prefix + finalStr + '\n';
                }
                // Paragraph separation buffer
                fullText += '\n';
            }

            setRawText(fullText);
            setStep(2);
        } catch (err: any) {
            console.error(err);
            alert('Error leyendo PDF: ' + (err.message || 'Error desconocido'));
        } finally {
            setLoading(false);
        }
    };

    // Split Logic - "Smart Parsing"
    const processSplits = () => {
        let chunks: string[] = [];
        // Regex lookahead to find "Artículo [Number]:" and split
        const articleRegex = /(?=Artículo \d+:)/g;

        // Check if PDF matches expectation
        if (rawText.match(/Artículo \d+:/)) {
            // Split keeping the delimiter by using lookahead or capturing logic
            // Actually, split(regex) consumes delimiter. 
            // Better strategy: Split and reconstruction OR simple split by specific regex
            // Let's use split by specific regex and assume the first chunk is junk/intro

            const rawChunks = rawText.split(/Artículo \d+:\s*/);
            // rawChunks[0] is text before first article. Remove it.
            chunks = rawChunks.slice(1);
        } else {
            // Manual Fallback
            chunks = rawText.split('---').filter(c => c.trim().length > 50);
        }

        const parsed = chunks.map((chunk, idx) => {
            // Default Mode
            let title = `Borrador ${idx + 1}`;
            let slug = '';
            let category = '';
            let excerpt = '';
            let contentBody = chunk;

            // --- METADATA EXTRACTION ---
            // Pattern: Title is at start. Metadata follows as "Key: Value". Content starts after "Contenido"

            // 1. Extract known metadata fields
            const slugMatch = chunk.match(/Slug:\s*([\s\S]+?)(?=\s*(Categoría|Meta Descripción|Contenido|$))/i);
            if (slugMatch) slug = slugMatch[1].trim();

            const catMatch = chunk.match(/Categoría:\s*([\s\S]+?)(?=\s*(Slug|Meta Descripción|Contenido|$))/i);
            if (catMatch) category = catMatch[1].trim();

            const metaMatch = chunk.match(/Meta Descripción:\s*([\s\S]+?)(?=\s*(Slug|Categoría|Contenido|$))/i);
            if (metaMatch) excerpt = metaMatch[1].trim();

            // 2. Extract Title
            // Title is everything from start UNTIL the first metadata keyword
            const endOfTitleIndex = Math.min(
                chunk.search(/Slug:/i) === -1 ? Infinity : chunk.search(/Slug:/i),
                chunk.search(/Categoría:/i) === -1 ? Infinity : chunk.search(/Categoría:/i),
                chunk.search(/Meta Descripción:/i) === -1 ? Infinity : chunk.search(/Meta Descripción:/i),
                chunk.search(/Contenido/i) === -1 ? Infinity : chunk.search(/Contenido/i)
            );

            if (endOfTitleIndex !== Infinity) {
                title = chunk.substring(0, endOfTitleIndex).trim();
            } else {
                // If no metadata found, take first line
                title = chunk.split('\n')[0].trim();
            }

            // CLEAN TITLE: Remove markdown artifacts like ## or **
            title = title.replace(/[#*]/g, '').trim();

            // 3. Extract Content
            const contentSplit = chunk.split(/Contenido/i);
            if (contentSplit.length > 1) {
                // Take the rest, assuming "Contenido" appears once as a header
                // Join back in case "Contenido" appears in body text? 
                // Using the FIRST occurrence separation is safer.
                contentBody = chunk.substring(chunk.search(/Contenido/i) + "Contenido".length).trim();
            } else {
                // Fallback: remove metadata lines from body
                contentBody = chunk.replace(title, '')
                    .replace(/Slug:.*$/gmi, '')
                    .replace(/Categoría:.*$/gmi, '')
                    .replace(/Meta Descripción:.*$/gmi, '')
                    .trim();
            }

            // --- CLEANUP & STYLING ---

            // --- CLEANUP & STYLING ---

            // 1. Bullets (Clean only start of lines)
            // Geometric extraction puts each visual line on a new line \n.
            // Just ensure bullets are markdown compliant
            contentBody = contentBody.replace(/^\s*●/gm, '-');

            // 2. Headings (H2)
            // Geometry extraction already adds ## for large fonts. 
            // We ONLY maintain keywords for things that might match semantically but failed size check (e.g. bold formatted but same size)
            // But we must NOT double-comment lines that already have ##

            const semanticPatterns = [
                /^(?!#)(Fase \d+.*)$/gm,
                /^(?!#)(Preguntas Frecuentes.*)$/gm,
                /^(?!#)(Conclusión.*)$/gm,
                /^(?!#)(\d+\.\s+[A-ZÁÉÍÓÚÑ].{5,50})$/gm
            ];
            for (const pattern of semanticPatterns) {
                contentBody = contentBody.replace(pattern, '### $1'); // Use H3 for semantic matches found in body
            }

            // 3. Clean up formatting artifacts
            // Fix concatenated words from PDF join (e.g., "word.NextWord" -> "word. NextWord")
            // Geometric line splitting usually fixes this, but if multiple items are on same line...
            contentBody = contentBody.replace(/([a-z])\.([A-Z])/g, '$1. $2');

            // 3. Clean up formatting artifacts
            // Fix concatenated words from PDF join (e.g., "word.NextWord" -> "word. NextWord")
            contentBody = contentBody.replace(/([a-z])\.([A-Z])/g, '$1. $2');

            // Normalize spaces
            contentBody = contentBody.replace(/[ \t]+/g, ' ').replace(/\n\s+/g, '\n');

            // Ensure proper paragraph spacing
            contentBody = contentBody.replace(/\n{3,}/g, '\n\n');

            return {
                id: idx,
                title: title.replace(/[\r\n]+/g, ' ').substring(0, 150),
                content: contentBody,
                category_id: '',
                extracted_meta: { slug, category, excerpt }
            };
        });

        // @ts-ignore - Validating parsed shape matches DraftArticle extended
        setDrafts(parsed);
        setStep(3);
    };

    const handleImportClick = () => {
        setShowConfirmModal(true);
    };

    const handleImportConfirm = async () => {
        setShowConfirmModal(false);
        setLoading(true);
        let success = 0;
        let failure = 0;
        const errors: string[] = []; // Track errors for debugging

        // Get default author
        const { data: author } = await supabase.from('authors').select('id').limit(1).single();

        for (const draft of drafts) {
            try {
                // 1. Handle Slug and Excerpt defaults
                let slug = draft.extracted_meta?.slug || draft.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now().toString().slice(-4);
                // Clean slug: remove leading/trailing slashes that might come from PDF extraction
                slug = slug.replace(/^\/+|\/+$/g, '').trim();

                const excerpt = draft.extracted_meta?.excerpt || draft.content.substring(0, 150) + '...';

                // 2. Handle Category (Get or Create)
                let category_id = null;
                if (draft.extracted_meta?.category) {
                    const catName = draft.extracted_meta.category.trim();
                    // Check if exists
                    const { data: existingCat } = await supabase.from('categories')
                        .select('id').eq('name', catName).eq('site_id', siteId).maybeSingle();

                    if (existingCat) {
                        category_id = existingCat.id;
                    } else {
                        // Create new category
                        const newCatSlug = catName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                        const { data: newCat, error: catError } = await supabase.from('categories')
                            .insert({ site_id: siteId, name: catName, slug: newCatSlug })
                            .select('id').single();

                        if (catError) {
                            console.error('Error creating category:', catError);
                            errors.push(`Category "${catName}": ${catError.message}`);
                        } else if (newCat) {
                            category_id = newCat.id;
                        }
                    }
                }

                // 3. Parse Markdown Content into ArticleSection[]
                const rawContent = draft.content;
                const sectionsRaw = rawContent.split(/\n## /);

                const sections = sectionsRaw.map((sec, idx) => {
                    if (idx === 0 && !sec.trim()) return null;

                    let heading = "Introducción";
                    let content = sec.trim();

                    if (idx > 0 || rawContent.startsWith('## ')) {
                        const lines = sec.split('\n');
                        heading = lines[0].trim();
                        content = lines.slice(1).join('\n').trim();
                    }

                    return { heading, content };
                }).filter(Boolean);

                // Calculate read time (rough estimate: 200 words per minute)
                const wordCount = draft.content.split(/\s+/).length;
                const readTimeMinutes = Math.ceil(wordCount / 200);
                const readTime = `${readTimeMinutes} min lectura`;

                // 4. Build payload
                const payload = {
                    site_id: siteId,
                    title: draft.title,
                    slug: slug,
                    excerpt: excerpt,
                    content: sections.length > 0 ? sections : [{ heading: 'Contenido Importado', content: draft.content }],
                    category_id: category_id,
                    image_url: draft.image_url || null,
                    read_time: readTime,
                    status: 'published',
                    author_id: author?.id,
                    published_at: new Date().toISOString()
                };

                // 5. Insert article
                const { error } = await supabase.from('articles').insert(payload);

                if (!error) {
                    success++;
                } else {
                    failure++;
                    console.error(`Error importing "${draft.title}":`, error);
                    errors.push(`"${draft.title}": ${error.message}`);
                }
            } catch (err: any) {
                failure++;
                console.error(`Exception importing "${draft.title}":`, err);
                errors.push(`"${draft.title}": ${err.message || 'Unknown error'}`);
            }
        }

        setLoading(false);
        setImportResults({ success, failure, errors });



        // Don't generate infinite drafts, clear them
        setDrafts([]);
    };

    return (
        <div className="max-w-5xl mx-auto pb-20">
            {/* CONFIRMATION MODAL */}
            {showConfirmModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
                        <div className="flex items-start gap-4 mb-6">
                            <div className="bg-blue-100 rounded-full p-3">
                                <FileText className="h-6 w-6 text-blue-600" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Confirmar Importación</h3>
                                <p className="text-gray-600">
                                    ¿Deseas importar <strong className="text-gray-900">{drafts.length} artículos</strong> al sitio <strong className="text-primary">{siteId}</strong>?
                                </p>
                                <p className="text-sm text-gray-500 mt-2">
                                    Los artículos se <span className="font-semibold text-green-600">publicarán inmediatamente</span> y aparecerán en el home.
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-3 justify-end">
                            <Button
                                variant="outline"
                                onClick={() => setShowConfirmModal(false)}
                                type="button"
                            >
                                Cancelar
                            </Button>
                            <Button
                                onClick={handleImportConfirm}
                                type="button"
                            >
                                Sí, Importar
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            <h1 className="text-3xl font-bold mb-2">Importador Masivo</h1>
            <p className="text-gray-500 mb-8">Sube un PDF con múltiples artículos y sepáralos automáticamente.</p>

            {importResults && (
                <div className="mb-8 space-y-4">
                    <div className={`p-4 rounded-lg flex items-center gap-3 ${importResults.failure === 0 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        <CheckCircle className="h-5 w-5" />
                        <div className="flex-1">
                            <p className="font-bold">Proceso Finalizado</p>
                            <p>Importados: {importResults.success}. Errores: {importResults.failure}.</p>
                            <p className="text-xs mt-1">Revisa la lista de Artículos para verlos.</p>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => { setImportResults(null); setStep(1); }}>
                            Nuevo Import
                        </Button>
                    </div>

                    {importResults.errors.length > 0 && (
                        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6">
                            <div className="flex items-start gap-3 mb-4">
                                <AlertTriangle className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />
                                <div>
                                    <h3 className="font-bold text-red-900 text-lg mb-1">Errores de Importación</h3>
                                    <p className="text-sm text-red-700">Los siguientes artículos no pudieron ser importados:</p>
                                </div>
                            </div>
                            <ul className="space-y-2 ml-9">
                                {importResults.errors.map((error, idx) => (
                                    <li key={idx} className="text-sm text-red-800 bg-white rounded px-3 py-2 border border-red-200">
                                        {error}
                                    </li>
                                ))}
                            </ul>
                            <div className="mt-4 ml-9 text-xs text-red-600">
                                💡 <strong>Tip:</strong> Abre la Consola del Navegador (F12) para ver más detalles técnicos.
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* STEP 1: UPLOAD */}
            {step === 1 && (
                <div
                    className="border-2 border-dashed border-gray-300 rounded-xl p-20 text-center hover:bg-gray-50 transition-colors"
                    onDragOver={e => e.preventDefault()}
                    onDrop={handleDrop}
                >
                    <UploadCloud className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                    <p className="text-xl font-medium text-gray-700">Arrastra tu PDF multipágina aquí</p>
                    <p className="text-sm text-gray-500 mt-2">Intentaremos detectar cada artículo por separado</p>
                    {loading && <p className="mt-4 animate-pulse text-primary font-bold">Analizando PDF...</p>}
                </div>
            )}

            {/* STEP 2: RAW EDIT */}
            {step === 2 && (
                <div className="animate-fade-in">
                    <div className="flex justify-between items-center mb-4">
                        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 text-sm text-yellow-800 flex-1 mr-4">
                            <AlertTriangle className="inline-block h-4 w-4 mr-2 mb-1" />
                            <strong>Instrucciones:</strong> El texto extraído está abajo. Usa <code>---</code> (tres guiones) para separar un artículo de otro.
                            Hemos insertado marcadores de página automáticamente para ayudarte.
                        </div>
                        <Button onClick={processSplits} size="lg">
                            Previsualizar Separación
                        </Button>
                    </div>
                    <Textarea
                        value={rawText}
                        onChange={e => setRawText(e.target.value)}
                        className="font-mono text-xs min-h-[500px]"
                    />
                </div>
            )}

            {/* STEP 3: REVIEW */}
            {step === 3 && (
                <div className="animate-fade-in">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold">Se detectaron {drafts.length} artículos</h2>
                        <div className="flex gap-2">
                            <Button variant="outline" onClick={() => setStep(2)} type="button">Volver a Editar Texto</Button>
                            <Button onClick={handleImportClick} disabled={loading} type="button">
                                {loading ? 'Importando...' : `Importar ${drafts.length} Artículos`}
                            </Button>
                        </div>
                    </div>

                    <div className="grid gap-8">
                        {drafts.map((draft, idx) => (
                            <div key={idx} className="bg-white border rounded-xl p-6 relative shadow-sm hover:shadow-md transition-shadow group">
                                <button
                                    className="absolute top-4 right-4 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={() => setDrafts(d => d.filter((_, i) => i !== idx))}
                                    title="Descartar este borrador"
                                >
                                    <X className="h-5 w-5" />
                                </button>

                                <div className="space-y-4">
                                    {/* TITLE */}
                                    <div>
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Título del Artículo</label>
                                        <input
                                            className="w-full text-lg font-bold text-gray-900 border-b border-transparent hover:border-gray-300 focus:border-primary focus:outline-none transition-colors"
                                            value={draft.title}
                                            placeholder="Sin título..."
                                            onChange={e => {
                                                const newDrafts = [...drafts];
                                                newDrafts[idx].title = e.target.value;
                                                setDrafts(newDrafts);
                                            }}
                                        />
                                    </div>

                                    {/* METADATA GRID */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-lg border border-gray-100">
                                        <div>
                                            <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Categoría</label>
                                            <input
                                                className="w-full text-sm bg-transparent border-b border-gray-200 focus:border-primary focus:outline-none text-gray-700"
                                                value={draft.extracted_meta?.category || ''}
                                                placeholder="Ej. Tecnología"
                                                onChange={e => {
                                                    const newDrafts = [...drafts];
                                                    if (!newDrafts[idx].extracted_meta) newDrafts[idx].extracted_meta = { slug: '', category: '', excerpt: '' };
                                                    newDrafts[idx].extracted_meta!.category = e.target.value;
                                                    setDrafts(newDrafts);
                                                }}
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Slug (URL)</label>
                                            <input
                                                className="w-full text-sm bg-transparent border-b border-gray-200 focus:border-primary focus:outline-none text-gray-600 font-mono"
                                                value={draft.extracted_meta?.slug || ''}
                                                placeholder="url-amigable"
                                                onChange={e => {
                                                    const newDrafts = [...drafts];
                                                    if (!newDrafts[idx].extracted_meta) newDrafts[idx].extracted_meta = { slug: '', category: '', excerpt: '' };
                                                    newDrafts[idx].extracted_meta!.slug = e.target.value;
                                                    setDrafts(newDrafts);
                                                }}
                                            />
                                        </div>
                                        <div className="md:col-span-3">
                                            <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">Meta Descripción</label>
                                            <textarea
                                                className="w-full text-sm bg-transparent border-b border-gray-200 focus:border-primary focus:outline-none text-gray-600 resize-none"
                                                rows={2}
                                                value={draft.extracted_meta?.excerpt || ''}
                                                placeholder="Resumen corto para SEO..."
                                                onChange={e => {
                                                    const newDrafts = [...drafts];
                                                    if (!newDrafts[idx].extracted_meta) newDrafts[idx].extracted_meta = { slug: '', category: '', excerpt: '' };
                                                    newDrafts[idx].extracted_meta!.excerpt = e.target.value;
                                                    setDrafts(newDrafts);
                                                }}
                                            />
                                        </div>
                                        <div className="md:col-span-3">
                                            <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">🖼️ Imagen URL</label>
                                            <input
                                                className="w-full text-sm bg-transparent border-b border-gray-200 focus:border-primary focus:outline-none text-blue-600 font-mono"
                                                value={draft.image_url || ''}
                                                placeholder="https://example.com/image.jpg"
                                                onChange={e => {
                                                    const newDrafts = [...drafts];
                                                    newDrafts[idx].image_url = e.target.value;
                                                    setDrafts(newDrafts);
                                                }}
                                            />
                                        </div>
                                    </div>

                                    {/* RICH PREVIEW WITH EDIT TOGGLE */}
                                    <div>
                                        <div className="flex justify-between items-center mb-2">
                                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
                                                Contenido
                                            </label>
                                            <div className="flex bg-gray-100 rounded-lg p-1">
                                                <button
                                                    className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${!draft.editMode ? 'bg-white shadow text-primary' : 'text-gray-500 hover:text-gray-700'}`}
                                                    onClick={() => {
                                                        const newDrafts = [...drafts];
                                                        newDrafts[idx].editMode = false;
                                                        setDrafts(newDrafts);
                                                    }}
                                                >
                                                    Vista Previa
                                                </button>
                                                <button
                                                    className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${draft.editMode ? 'bg-white shadow text-primary' : 'text-gray-500 hover:text-gray-700'}`}
                                                    onClick={() => {
                                                        const newDrafts = [...drafts];
                                                        newDrafts[idx].editMode = true;
                                                        setDrafts(newDrafts);
                                                    }}
                                                >
                                                    Editar Markdown
                                                </button>
                                            </div>
                                        </div>

                                        {draft.editMode ? (
                                            <textarea
                                                className="w-full text-sm font-mono bg-gray-50 border border-gray-200 rounded-lg p-4 h-[300px] focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-y"
                                                value={draft.content}
                                                onChange={e => {
                                                    const newDrafts = [...drafts];
                                                    newDrafts[idx].content = e.target.value;
                                                    setDrafts(newDrafts);
                                                }}
                                            />
                                        ) : (
                                            <div className="prose prose-sm max-w-none prose-headings:font-bold prose-h2:text-primary prose-a:text-blue-600 prose-img:rounded-xl bg-white border border-gray-200 rounded-lg p-6 max-h-[400px] overflow-y-auto shadow-inner relative">
                                                <div className="absolute top-2 right-2 flex gap-1">
                                                    <span className="text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded border border-blue-100 uppercase font-bold">HTML Activado</span>
                                                </div>
                                                <ReactMarkdown
                                                    rehypePlugins={[rehypeRaw]}
                                                    remarkPlugins={[remarkGfm]}
                                                    components={{
                                                        a: ({ node, ...props }) => <a {...props} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline cursor-pointer" />
                                                    }}
                                                >
                                                    {draft.content}
                                                </ReactMarkdown>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default BulkImport;
