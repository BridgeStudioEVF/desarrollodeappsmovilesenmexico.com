import { useEffect, useState } from 'react';
import { useAdmin } from '@/context/AdminContext';
import { supabase } from '@/lib/supabaseClient';
import { FileText, Users, Eye } from 'lucide-react';

const Dashboard = () => {
    const { siteId } = useAdmin();
    const [stats, setStats] = useState({ articles: 0, loading: true });

    useEffect(() => {
        const fetchStats = async () => {
            setStats(prev => ({ ...prev, loading: true }));
            const { count } = await supabase
                .from('articles')
                .select('*', { count: 'exact', head: true })
                .eq('site_id', siteId);

            setStats({ articles: count || 0, loading: false });
        };

        fetchStats();
    }, [siteId]);

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>
            <p className="text-gray-500 mb-6">Vista general para: <strong>{siteId}</strong></p>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {/* Card 1 */}
                <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Total Artículos</p>
                            <p className="text-3xl font-bold text-gray-900">
                                {stats.loading ? '...' : stats.articles}
                            </p>
                        </div>
                        <div className="rounded-full bg-blue-50 p-3 text-blue-600">
                            <FileText className="h-6 w-6" />
                        </div>
                    </div>
                </div>

                {/* Placeholder Cards */}
                <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Categorías Activas</p>
                            <p className="text-3xl font-bold text-gray-900">6</p>
                        </div>
                        <div className="rounded-full bg-green-50 p-3 text-green-600">
                            <Users className="h-6 w-6" /> {/* Icon placeholder */}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Dashboard;
