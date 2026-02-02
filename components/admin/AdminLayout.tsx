import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Users, Settings, LogOut, ShieldAlert, Cpu, History, ExternalLink } from 'lucide-react';
import { PantherLogo } from '../PantherLogo';
import AdminDashboard from './AdminDashboard';
import AdminUsers from './AdminUsers';
import AdminSettings from './AdminSettings';
import AdminAuditLog from './AdminAuditLog';
import { adminAuthService } from '../../services/adminAuthService';
import { hasPermission, AdminUser, Permission } from '../../lib/rbac';

const AdminLayout: React.FC = () => {
    const [activePage, setActivePage] = useState('settings'); // Default to settings
    const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);

    useEffect(() => {
        const user = adminAuthService.getCurrentUser();
        setCurrentUser(user);

        const hash = window.location.hash.split('/')[2] || 'settings';
        setActivePage(hash);
        if (window.location.hash.split('/')[1] === 'admin' && !window.location.hash.split('/')[2]) {
             window.location.hash = '/admin/settings';
        }

        const handleHashChange = () => {
            const newHash = window.location.hash.split('/')[2] || 'settings';
            setActivePage(newHash);
        };
        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);

    const navigate = (page: string) => {
        window.location.hash = `/admin/${page}`;
    };
    
    const handleLogout = () => {
        adminAuthService.logout();
        window.location.reload(); 
    };
    
    interface AdminNavItem {
        id: string;
        label: string;
        icon: React.ComponentType<{ size?: number | string }>;
        permission: Permission;
    }

    const navItems: AdminNavItem[] = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, permission: 'dashboard:view' },
        { id: 'users', label: 'User Management', icon: Users, permission: 'users:manage' },
        { id: 'settings', label: 'Site Configuration', icon: Settings, permission: 'settings:manage' },
        { id: 'audit', label: 'Audit Log', icon: History, permission: 'audit:view' },
    ];
    
    const visibleNavItems = navItems.filter(item => currentUser && hasPermission(currentUser.role, item.permission));

    const AccessDenied: React.FC = () => (
        <div className="bg-red-900/20 border border-red-500/30 rounded-2xl p-8 text-center">
            <ShieldAlert className="mx-auto text-red-500 mb-4" size={32} />
            <h3 className="font-bold text-red-400">Access Denied</h3>
            <p className="text-sm text-red-400/70 mt-2">You do not have the required permissions to access this module.</p>
        </div>
    );

    const renderContent = () => {
        if (!currentUser) return null; 
        
        switch (activePage) {
            case 'users':
                return hasPermission(currentUser.role, 'users:manage') ? <AdminUsers /> : <AccessDenied />;
            case 'settings':
                return hasPermission(currentUser.role, 'settings:manage') ? <AdminSettings /> : <AccessDenied />;
            case 'audit':
                return hasPermission(currentUser.role, 'audit:view') ? <AdminAuditLog /> : <AccessDenied />;
            case 'dashboard':
            default:
                return hasPermission(currentUser.role, 'dashboard:view') ? <AdminDashboard /> : <AccessDenied />;
        }
    };

    return (
        <div className="flex h-screen bg-slate-900 text-slate-300 font-sans">
            <aside className="w-72 flex-shrink-0 bg-slate-900 border-r border-slate-700/50 flex flex-col">
                <div className="h-24 flex items-center px-8 border-b border-slate-700/50">
                    <PantherLogo className="h-10 w-auto filter brightness-0 invert opacity-75" />
                    <div className="ml-4">
                        <span className="font-black text-slate-100 text-lg tracking-tighter">ADMIN</span>
                        <p className="text-xs text-brand-gold/50 font-mono tracking-widest">v4.2.0</p>
                    </div>
                </div>
                <nav className="flex-1 px-6 py-8 space-y-2">
                    {visibleNavItems.map(item => (
                        <button
                            key={item.id}
                            onClick={() => navigate(item.id)}
                            className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl text-sm font-bold transition-all duration-300 transform hover:scale-105 ${
                                activePage === item.id 
                                    ? 'bg-brand-gold text-brand-950 shadow-lg shadow-brand-gold/20' 
                                    : 'text-slate-400 hover:bg-slate-700/50 hover:text-slate-100'
                            }`}
                        >
                            <item.icon size={20} />
                            {item.label}
                        </button>
                    ))}
                </nav>
                <div className="p-6 border-t border-slate-700/50 space-y-4">
                    <div className="p-4 bg-slate-800 rounded-lg">
                        <p className="text-sm font-semibold text-slate-300 truncate">{currentUser?.email}</p>
                        <p className="text-[10px] font-mono text-brand-gold tracking-widest">{currentUser?.role}</p>
                    </div>
                     <button
                        onClick={() => window.location.hash = '/'}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold text-slate-400 hover:bg-slate-700/50 hover:text-slate-100 transition-colors"
                    >
                        <ExternalLink size={18} />
                        Return to Site
                    </button>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold text-slate-400 hover:bg-slate-700/50 hover:text-red-400 transition-colors"
                    >
                        <LogOut size={18} />
                        Logout
                    </button>
                </div>
            </aside>

            <main className="flex-1 overflow-y-auto relative">
                <div className="absolute inset-0 z-0 opacity-20" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '2rem 2rem' }}></div>
                <div className="p-8 md:p-12 relative z-10">
                    {renderContent()}
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
