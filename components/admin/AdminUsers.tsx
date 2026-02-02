import React, { useState, useMemo } from 'react';
import { userService } from '../../services/userService';
import { SiteUser } from '../../types';
import { Search, Sliders, Shield } from 'lucide-react';

const AdminUsers: React.FC = () => {
    const [users, setUsers] = useState<SiteUser[]>(() => userService.getUsers());
    const [searchQuery, setSearchQuery] = useState('');

    const filteredUsers = useMemo(() => 
        users.filter(user => 
            user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.membershipTier.toLowerCase().includes(searchQuery.toLowerCase())
        ), 
    [users, searchQuery]);

    const navigateToEntitlements = () => {
        window.location.hash = '/admin/settings';
        // A more advanced router would allow passing state to open the correct tab.
        // For now, we inform the user via an alert to provide clear guidance.
        alert("Navigating to Site Configuration. Please select the 'AI Entitlements' tab to manage user permissions.");
    };

    return (
        <div>
            <h1 className="text-4xl font-black text-slate-100 tracking-tight uppercase">User & Member Registry</h1>
            <p className="mt-2 text-lg text-slate-400 font-light">Search, view, and manage institutional member profiles and entitlements.</p>

            <div className="mt-12 bg-slate-800/50 border border-slate-700 rounded-3xl overflow-hidden">
                 <div className="p-6 border-b border-slate-700/50 flex items-center justify-between">
                     <div className="relative w-full max-w-sm">
                         <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                         <input
                            type="text"
                            placeholder="Search by email or tier..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-600 rounded-lg pl-12 pr-4 py-3 text-sm text-white"
                         />
                     </div>
                     <button className="flex items-center gap-2 px-4 py-3 bg-slate-700 text-slate-300 rounded-lg text-sm font-semibold hover:bg-slate-600">
                         <Sliders size={16} /> Filters
                     </button>
                 </div>
                 
                 <table className="w-full text-sm">
                    <thead className="bg-slate-900/30">
                        <tr>
                            <th className="p-4 text-left font-semibold text-slate-400 uppercase tracking-wider">User</th>
                            <th className="p-4 text-left font-semibold text-slate-400 uppercase tracking-wider">Membership Tier</th>
                            <th className="p-4 text-left font-semibold text-slate-400 uppercase tracking-wider">Entitlement Overrides</th>
                            <th className="p-4"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map(user => (
                            <tr key={user.id} className="border-t border-slate-700/50 hover:bg-slate-800 transition-colors">
                                <td className="p-4">
                                    <p className="font-bold text-slate-200">{user.email}</p>
                                    <p className="text-xs text-slate-500 font-mono">{user.id}</p>
                                </td>
                                <td className="p-4">
                                    <span className="px-3 py-1 bg-brand-gold/10 text-brand-gold border border-brand-gold/20 rounded-full font-bold text-xs">{user.membershipTier}</span>
                                </td>
                                <td className="p-4">
                                    <span className="font-mono text-slate-300">{Object.keys(user.entitlementOverrides).length}</span>
                                </td>
                                <td className="p-4 text-right">
                                    <button 
                                        onClick={navigateToEntitlements}
                                        className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-md text-xs font-semibold text-slate-200 flex items-center gap-2"
                                    >
                                        <Shield size={14} /> Manage
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                 </table>
                 {filteredUsers.length === 0 && (
                     <div className="p-16 text-center text-slate-500">
                         <p>No users found matching your query.</p>
                     </div>
                 )}
            </div>
        </div>
    );
};

export default AdminUsers;
