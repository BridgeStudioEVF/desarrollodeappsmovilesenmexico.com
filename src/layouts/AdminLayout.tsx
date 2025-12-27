import { useEffect, useState } from 'react';
import { Outlet, useNavigate, Link, useLocation } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { useAdmin, AdminProvider } from '@/context/AdminContext';
import { LayoutDashboard, FileText, Settings, LogOut, ChevronDown, UploadCloud } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Inner component to use context
const AdminLayoutContent = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { siteId, setSiteId } = useAdmin();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        // Check auth
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (!session) {
                navigate('/admin/login');
            } else {
                setUser(session.user);
                setLoading(false);
            }
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (!session) {
                navigate('/admin/login');
            }
        });

        return () => subscription.unsubscribe();
    }, [navigate]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/admin/login');
    };

    if (loading) return <div className="flex h-screen items-center justify-center">Cargando panel...</div>;

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
        { icon: FileText, label: 'Artículos', path: '/admin/articles' },
        { icon: UploadCloud, label: 'Importar PDF', path: '/admin/bulk-import' },
        // { icon: Settings, label: 'Configuración', path: '/admin/settings' },
    ];

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-white shadow-md hidden md:flex md:flex-col">
                <div className="flex h-16 items-center border-b px-6">
                    <span className="text-xl font-bold text-gray-800">Bridge Admin</span>
                </div>

                <div className="p-4">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Sitio Actual</label>
                    <select
                        value={siteId}
                        onChange={(e) => setSiteId(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-primary focus:outline-none focus:ring-primary sm:text-sm border"
                    >
                        <option value="desarrolloappsmoviles.com.mx">desarrolloappsmoviles.com.mx</option>
                        <option value="test-site">test-site</option>
                        {/* Dynamically add more if we had a sites table */}
                    </select>
                    <p className="mt-1 text-xs text-gray-400">ID: {siteId}</p>
                </div>

                <nav className="flex-1 space-y-1 px-2 py-4">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center rounded-md px-4 py-3 text-sm font-medium transition-colors ${isActive
                                    ? 'bg-primary/10 text-primary'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                    }`}
                            >
                                <item.icon className="mr-3 h-5 w-5" />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="border-t p-4">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold">
                            {user?.email?.slice(0, 2).toUpperCase()}
                        </div>
                        <div className="overflow-hidden">
                            <p className="truncate text-sm font-medium text-gray-700">{user?.email}</p>
                        </div>
                    </div>
                    <Button variant="outline" className="w-full justify-start" onClick={handleLogout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        Cerrar Sesión
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-8">
                <header className="mb-8 md:hidden">
                    <h1 className="text-2xl font-bold">Bridge Admin</h1>
                    {/* Mobile menu toggle would go here */}
                </header>
                <Outlet />
            </main>
        </div>
    );
};

// Wrapper
const AdminLayout = () => (
    <AdminProvider>
        <AdminLayoutContent />
    </AdminProvider>
);

export default AdminLayout;
