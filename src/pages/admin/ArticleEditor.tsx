import { useEffect, useState, useCallback } from 'react';
import { useAdmin } from '@/context/AdminContext';
import { supabase } from '@/lib/supabaseClient';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Save, UploadCloud } from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';

// Set worker source (using unpkg for v5 .mjs support)
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

interface ArticleForm {
    title: string;
    slug: string;
    excerpt: string;
    content: string; // We'll edit as JSON string or plain text for MVP
    category_id: string;
    image_url: string;
}

const ArticleEditor = () => {
    const { id } = useParams(); // If id exists, it's edit mode
    const { siteId } = useAdmin();
    const navigate = useNavigate();

    // Form State
    const [form, setForm] = useState<ArticleForm>({
        title: '',
        slug: '',
        excerpt: '',
        content: JSON.stringify([{ heading: 'Introducción', content: 'Escribe aquí...' }], null, 2),
        category_id: '',
        image_url: ''
    });

    const [categories, setCategories] = useState<any[]>([]);
    const [authors, setAuthors] = useState<any[]>([]); // Selecting author not fully implemented in UI for brevity, defaulting to first found
    const [loading, setLoading] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [pdfProcessing, setPdfProcessing] = useState(false);

    useEffect(() => {
        loadDependencies();
        if (id) loadArticle(id);
    }, [id, siteId]);

    const loadDependencies = async () => {
        const { data: cats } = await supabase.from('categories').select('*').eq('site_id', siteId);
        setCategories(cats || []);
    };

    const loadArticle = async (articleId: string) => {
        const { data } = await supabase.from('articles').select('*').eq('id', articleId).single();
        if (data) {
            setForm({
                title: data.title,
                slug: data.slug,
                excerpt: data.excerpt || '',
                content: JSON.stringify(data.content, null, 2),
                category_id: data.category_id,
                image_url: data.image_url || ''
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Basic validation
            let contentJson;
            try {
                contentJson = JSON.parse(form.content);
            } catch (err) {
                alert('El contenido debe ser un JSON válido. Revisa formato.');
                setLoading(false);
                return;
            }

            const payload = {
                ...form,
                content: contentJson,
                site_id: siteId,
                status: 'published',
                published_at: new Date().toISOString(), // Update date on save? Optional
            };

            // Get default author if needed
            const { data: author } = await supabase.from('authors').select('id').limit(1).single();
            if (author) (payload as any).author_id = author.id;

            let error;
            if (id) {
                const { error: updateError } = await supabase.from('articles').update(payload).eq('id', id);
                error = updateError;
            } else {
                const { error: insertError } = await supabase.from('articles').insert(payload);
                error = insertError;
            }

            if (error) throw error;

            navigate('/admin/articles');
        } catch (error: any) {
            alert('Error al guardar: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    // --- PDF HANDLING ---
    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => setIsDragging(false);

    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        const files = Array.from(e.dataTransfer.files);
        const pdfFile = files.find(f => f.type === 'application/pdf');

        if (pdfFile) {
            processPDF(pdfFile);
        } else {
            alert('Por favor, arrastra un archivo PDF válido.');
        }
    };

    const processPDF = async (file: File) => {
        setPdfProcessing(true);
        try {
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

            let fullText = '';

            // Limit to first 5 pages for performance/relevance
            const maxPages = Math.min(pdf.numPages, 10);

            for (let i = 1; i <= maxPages; i++) {
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();
                const pageText = textContent.items.map((item: any) => item.str).join(' ');
                fullText += pageText + '\n\n';
            }

            // Heuristics
            // 1. Title: Assuming first non-empty line
            const lines = fullText.split('\n').filter(line => line.trim().length > 0);
            const potentialTitle = lines[0] || '';

            // 2. Content: The rest, structured as a simple section
            const bodyContent = lines.slice(1).join('\n\n');

            setForm(prev => ({
                ...prev,
                title: prev.title || potentialTitle, // Only overwrite if empty? No, PDF is authoritative here
                slug: prev.slug || potentialTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
                content: JSON.stringify([
                    {
                        heading: "Contenido Importado (PDF)",
                        content: bodyContent.substring(0, 5000) // Limit size for initial safety
                    }
                ], null, 2)
            }));

            alert('¡PDF procesado! Se han extraído título y contenido.');

        } catch (error: any) {
            console.error(error);
            alert('Error leyendo PDF: ' + (error.message || 'Revisa la consola'));
        } finally {
            setPdfProcessing(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto pb-10">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-bold">{id ? 'Editar Artículo' : 'Nuevo Artículo'}</h1>
                <Button onClick={handleSubmit} disabled={loading || pdfProcessing}>
                    <Save className="mr-2 h-4 w-4" />
                    {loading ? 'Guardando...' : 'Guardar Artículo'}
                </Button>
            </div>

            {/* PDF Drop Zone */}
            <div
                className={`mb-8 border-2 border-dashed rounded-xl p-10 text-center transition-colors ${isDragging ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary/50'
                    }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <div className="flex flex-col items-center justify-center text-gray-500">
                    <UploadCloud className="h-12 w-12 mb-4 text-gray-400" />
                    <p className="text-lg font-medium">Arrastra tu PDF aquí</p>
                    <p className="text-sm">Extraeremos el texto automáticamente para crear tu blog.</p>
                    {pdfProcessing && <p className="mt-4 text-primary font-bold animate-pulse">Procesando PDF...</p>}
                </div>
            </div>

            <div className="grid gap-6 bg-white p-6 rounded-xl shadow-sm border">
                <div className="grid gap-2">
                    <label className="text-sm font-medium">Título</label>
                    <Input
                        value={form.title}
                        onChange={e => setForm({ ...form, title: e.target.value })}
                        placeholder="Título del artículo"
                    />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <div className="grid gap-2">
                        <label className="text-sm font-medium">Slug (URL)</label>
                        <Input
                            value={form.slug}
                            onChange={e => setForm({ ...form, slug: e.target.value })}
                        />
                    </div>
                    <div className="grid gap-2">
                        <label className="text-sm font-medium">Categoría</label>
                        <select
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            value={form.category_id}
                            onChange={e => setForm({ ...form, category_id: e.target.value })}
                        >
                            <option value="">Selecciona Categoría</option>
                            {categories.map(c => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="grid gap-2">
                    <label className="text-sm font-medium">Extracto (Resumen)</label>
                    <Textarea
                        value={form.excerpt}
                        onChange={e => setForm({ ...form, excerpt: e.target.value })}
                        rows={3}
                    />
                </div>

                <div className="grid gap-2">
                    <label className="text-sm font-medium">Imagen del Artículo</label>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <Input
                                value={form.image_url}
                                onChange={e => setForm({ ...form, image_url: e.target.value })}
                                placeholder="https://... o sube una imagen →"
                                className="mb-2"
                            />
                            <div className="relative">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={async (e) => {
                                        const file = e.target.files?.[0];
                                        if (!file) return;

                                        setLoading(true);
                                        try {
                                            const fileExt = file.name.split('.').pop();
                                            const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
                                            const filePath = `${fileName}`;

                                            const { error: uploadError, data } = await supabase.storage
                                                .from('article-images')
                                                .upload(filePath, file);

                                            if (uploadError) throw uploadError;

                                            const { data: { publicUrl } } = supabase.storage
                                                .from('article-images')
                                                .getPublicUrl(filePath);

                                            setForm({ ...form, image_url: publicUrl });
                                        } catch (error: any) {
                                            alert('Error subiendo imagen: ' + error.message);
                                        } finally {
                                            setLoading(false);
                                        }
                                    }}
                                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/90 cursor-pointer"
                                />
                            </div>
                        </div>
                        {form.image_url && (
                            <div className="relative rounded-lg overflow-hidden border border-gray-200">
                                <img
                                    src={form.image_url}
                                    alt="Preview"
                                    className="w-full h-40 object-cover"
                                    onError={(e) => {
                                        e.currentTarget.src = 'https://via.placeholder.com/400x200?text=Imagen+no+disponible';
                                    }}
                                />
                            </div>
                        )}
                    </div>
                </div>

                <div className="grid gap-2">
                    <div className="flex justify-between">
                        <label className="text-sm font-medium">Contenido JSON (Estructura de Secciones)</label>
                        <span className="text-xs text-gray-400">Edita el JSON o usa el importador PDF</span>
                    </div>
                    <Textarea
                        className="font-mono text-xs"
                        value={form.content}
                        onChange={e => setForm({ ...form, content: e.target.value })}
                        rows={15}
                    />
                </div>
            </div>
        </div>
    );
};

export default ArticleEditor;
