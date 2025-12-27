import { useEffect, useState } from 'react';
import { useAdmin } from '@/context/AdminContext';
import { supabase } from '@/lib/supabaseClient';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

const ArticleList = () => {
    const { siteId } = useAdmin();
    const [articles, setArticles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleteModal, setDeleteModal] = useState<{ show: boolean; articleId: string; articleTitle: string }>({ show: false, articleId: '', articleTitle: '' });

    useEffect(() => {
        fetchArticles();
    }, [siteId]);

    const fetchArticles = async () => {
        setLoading(true);
        const { data } = await supabase
            .from('articles')
            .select('*, categories(name)')
            .eq('site_id', siteId)
            .order('published_at', { ascending: false });

        setArticles(data || []);
        setLoading(false);
    };

    const handleDeleteClick = (id: string, title: string) => {
        setDeleteModal({ show: true, articleId: id, articleTitle: title });
    };

    const handleDeleteConfirm = async () => {
        const { error } = await supabase.from('articles').delete().eq('id', deleteModal.articleId);

        setDeleteModal({ show: false, articleId: '', articleTitle: '' });

        if (!error) {
            fetchArticles();
        } else {
            alert('Error al eliminar: ' + error.message);
        }
    };

    const handleToggleStatus = async (id: string, currentStatus: string) => {
        const newStatus = currentStatus === 'published' ? 'draft' : 'published';

        const { error } = await supabase
            .from('articles')
            .update({ status: newStatus })
            .eq('id', id);

        if (!error) {
            fetchArticles();
        } else {
            alert('Error al actualizar el estado');
        }
    };

    return (
        <div>
            {/* DELETE CONFIRMATION MODAL */}
            {deleteModal.show && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
                        <div className="flex items-start gap-4 mb-6">
                            <div className="bg-red-100 rounded-full p-3">
                                <Trash2 className="h-6 w-6 text-red-600" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Confirmar Eliminación</h3>
                                <p className="text-gray-600">
                                    ¿Estás seguro de eliminar el artículo <strong className="text-gray-900">"{deleteModal.articleTitle}"</strong>?
                                </p>
                                <p className="text-sm text-red-600 mt-2">
                                    ⚠️ Esta acción no se puede deshacer.
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-3 justify-end">
                            <Button
                                variant="outline"
                                onClick={() => setDeleteModal({ show: false, articleId: '', articleTitle: '' })}
                                type="button"
                            >
                                Cancelar
                            </Button>
                            <Button
                                onClick={handleDeleteConfirm}
                                type="button"
                                className="bg-red-600 hover:bg-red-700"
                            >
                                Sí, Eliminar
                            </Button>
                        </div>
                    </div>
                </div>
            )}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Artículos</h1>
                    <p className="text-gray-500">Gestiona el contenido del blog</p>
                </div>
                <Button asChild>
                    <Link to="/admin/articles/new">
                        <Plus className="mr-2 h-4 w-4" /> Nuevo Artículo
                    </Link>
                </Button>
            </div>

            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Título</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoría</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Imagen</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                        {loading ? (
                            <tr><td colSpan={6} className="p-4 text-center">Cargando...</td></tr>
                        ) : articles.length === 0 ? (
                            <tr><td colSpan={6} className="p-8 text-center text-gray-500">No hay artículos aún. ¡Crea uno nuevo!</td></tr>
                        ) : (
                            articles.map((article) => (
                                <tr key={article.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-medium text-gray-900 line-clamp-1">{article.title}</div>
                                        <div className="text-xs text-gray-500 line-clamp-1">{article.slug}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                                            {article.categories?.name || 'Sin Cat'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                        {article.image_url ? (
                                            <span className="text-green-600 text-lg" title="Tiene imagen">✅</span>
                                        ) : (
                                            <span className="text-red-600 text-lg" title="Sin imagen">❌</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {format(new Date(article.published_at), 'dd MMM yyyy')}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <button
                                            onClick={() => handleToggleStatus(article.id, article.status)}
                                            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${article.status === 'published' ? 'bg-green-600' : 'bg-gray-300'
                                                }`}
                                            role="switch"
                                            aria-checked={article.status === 'published'}
                                            title={article.status === 'published' ? 'Click para despublicar' : 'Click para publicar'}
                                        >
                                            <span
                                                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${article.status === 'published' ? 'translate-x-5' : 'translate-x-0'
                                                    }`}
                                            />
                                        </button>
                                        <span className={`ml-3 text-xs font-medium ${article.status === 'published' ? 'text-green-800' : 'text-gray-600'
                                            }`}>
                                            {article.status === 'published' ? 'Publicado' : 'Borrador'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <Button variant="ghost" size="sm" asChild className="mr-2">
                                            <Link to={`/admin/articles/edit/${article.id}`}><Edit className="h-4 w-4" /></Link>
                                        </Button>
                                        <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-900 hover:bg-red-50" onClick={() => handleDeleteClick(article.id, article.title)} type="button">
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ArticleList;
