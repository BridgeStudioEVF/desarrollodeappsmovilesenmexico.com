import { createContext, useContext, useState, ReactNode } from 'react';

interface AdminContextType {
    siteId: string;
    setSiteId: (id: string) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider = ({ children }: { children: ReactNode }) => {
    // Default to development site ID or load from localStorage
    const [siteId, setSiteId] = useState<string>(
        localStorage.getItem('admin_site_id') || 'desarrolloappsmoviles.com.mx'
    );

    const handleSetSiteId = (id: string) => {
        setSiteId(id);
        localStorage.setItem('admin_site_id', id);
    };

    return (
        <AdminContext.Provider value={{ siteId, setSiteId: handleSetSiteId }}>
            {children}
        </AdminContext.Provider>
    );
};

export const useAdmin = () => {
    const context = useContext(AdminContext);
    if (context === undefined) {
        throw new Error('useAdmin must be used within an AdminProvider');
    }
    return context;
};
