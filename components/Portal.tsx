
import React, { useState } from 'react';
import { PantherLogo } from './PantherLogo';
import { Input } from './ui/FormElements';
import { 
    LayoutDashboard, PieChart, FileText, Settings, LogOut, 
    TrendingUp, Shield, Users, CheckCircle, Clock, 
    ArrowUpRight, Download, Wallet, Bell, Lock, AlertCircle, Wrench 
} from 'lucide-react';

type UserRole = 'client' | 'investor' | 'admin' | null;

interface PortalProps {
    onNavigate: (path: string) => void;
}

const Portal: React.FC<PortalProps> = ({ onNavigate }) => {
    const [userRole, setUserRole] = useState<UserRole>(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = (role: UserRole) => {
        setUserRole(role);
    };

    const handleLogout = () => {
        setUserRole(null);
        setEmail('');
        setPassword('');
    };

    const ClientDashboard = () => (
        <div className="animate-fade-in space-y-8">
             <button 
                onClick={() => onNavigate('/data-tools')}
                className="w-full mt-6 py-3 border border-dashed border-brand-600 text-brand-400 hover:text-white hover:border-brand-gold hover:bg-brand-800 rounded-lg transition-all text-sm font-bold flex items-center justify-center gap-2"
            >
                <Wrench size={16} /> Access Full Data Tools Suite
            </button>
        </div>
    );

    const InvestorDashboard = () => (
         <div className="animate-fade-in space-y-8">
            <button 
                onClick={() => onNavigate('/data-tools')}
                className="bg-brand-gold text-brand-900 font-bold px-4 py-2 rounded-lg text-sm hover:bg-white flex items-center gap-2"
            >
                <Wrench size={16} /> Full Analysis Suite
            </button>
        </div>
    );

    const AdminDashboard = () => (
        <div className="animate-fade-in space-y-8">
            {/* Admin content */}
        </div>
    );

    return (
        <div className="min-h-screen bg-brand-950 pt-20 pb-12">
            {!userRole ? (
                <div className="max-w-md mx-auto px-4 pt-20">
                    <div className="bg-brand-900 border border-brand-700 rounded-2xl shadow-2xl p-8 text-center animate-fade-in">
                        <h2 className="text-2xl font-heading font-bold text-white mb-2">Secure Portal</h2>
                        <div className="mt-8 pt-6 border-t border-brand-800">
                            <p className="text-xs text-slate-500 mb-4 uppercase tracking-widest font-bold">Select Demo Role</p>
                            <div className="grid grid-cols-3 gap-2">
                                <button onClick={() => handleLogin('client')} className="p-2 bg-brand-950 border border-brand-800 rounded text-xs text-slate-300 hover:border-brand-gold hover:text-brand-gold">Client</button>
                                <button onClick={() => handleLogin('investor')} className="p-2 bg-brand-950 border border-brand-800 rounded text-xs text-slate-300 hover:border-brand-gold hover:text-brand-gold">Investor</button>
                                <button onClick={() => handleLogin('admin')} className="p-2 bg-brand-950 border border-brand-800 rounded text-xs text-slate-300 hover:border-brand-gold hover:text-brand-gold">Admin</button>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex justify-between items-center mb-12 border-b border-brand-800 pb-6">
                        <h1 className="text-3xl font-heading font-bold text-white">
                          {userRole === 'client' && 'Client Dashboard'}
                          {userRole === 'investor' && 'Investor Portal'}
                          {userRole === 'admin' && 'Admin Console'}
                        </h1>
                        <button onClick={handleLogout} className="flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-white">
                            <LogOut size={16} /> Sign Out
                        </button>
                    </div>
                    {userRole === 'client' && <ClientDashboard />}
                    {userRole === 'investor' && <InvestorDashboard />}
                    {userRole === 'admin' && <AdminDashboard />}
                </div>
            )}
        </div>
    );
};

export default Portal;
