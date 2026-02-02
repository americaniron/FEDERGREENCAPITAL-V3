import React, { useState, useMemo } from 'react';
import { userService } from '../../../services/userService';
import { SiteUser } from '../../../types';
import { TOOL_REGISTRY } from '../../../lib/tool-registry';
import { settingsService } from '../../../services/settingsService';
import { auditLogService } from '../../../services/auditLogService';
import { adminAuthService } from '../../../services/adminAuthService';
import { Search, X, Shield, Save, CheckSquare, Square, ChevronDown } from 'lucide-react';

const AdminEntitlements: React.FC = () => {
    const [activeTab, setActiveTab] = useState('overrides');
    const [users, setUsers] = useState<SiteUser[]>(() => userService.getUsers());
    const [search, setSearch] = useState('');
    const [selectedUser, setSelectedUser] = useState<SiteUser | null>(null);

    const tiers = useMemo(() => settingsService.getPublishedSettings().membership.tiers, []);
    const adminUser = adminAuthService.getCurrentUser();

    const filteredUsers = users.filter(u => u.email.toLowerCase().includes(search.toLowerCase()));

    const handleUpdateUser = (updatedUser: SiteUser) => {
        const originalUser = users.find(u => u.id === updatedUser.id);
        userService.updateUser(updatedUser);
        setUsers(userService.getUsers());
        
        if (adminUser && originalUser) {
            auditLogService.logChange(
                adminUser.email,
                'Updated User Entitlements',
                `User: ${updatedUser.email}`,
                { tier: originalUser.membershipTier, overrides: originalUser.entitlementOverrides },
                { tier: updatedUser.membershipTier, overrides: updatedUser.entitlementOverrides }
            );
        }
        setSelectedUser(updatedUser); // Keep modal open with updated data
    };
    
    const UserOverrides = () => (
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl">
            <div className="p-4 border-b border-slate-700/50">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input
                        type="text"
                        placeholder="Search users to manage entitlements..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-600 rounded-lg pl-10 pr-4 py-2 text-sm text-white"
                    />
                </div>
            </div>
            <div className="max-h-[60vh] overflow-y-auto">
                <table className="w-full text-sm">
                    <tbody>
                        {filteredUsers.map(user => (
                            <tr key={user.id} className="border-b border-slate-700/50 last:border-0 hover:bg-slate-800">
                                <td className="p-4 text-white font-semibold">{user.email}</td>
                                <td className="p-4 text-brand-gold">{user.membershipTier}</td>
                                <td className="p-4 text-right">
                                    <button onClick={() => setSelectedUser(user)} className="px-3 py-1 bg-slate-700 text-xs rounded-md text-slate-300 hover:bg-slate-600">
                                        Manage
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
    
    const UserEntitlementModal = () => {
        if (!selectedUser) return null;
        
        const handleTierChange = (tier: string) => {
            handleUpdateUser({ ...selectedUser, membershipTier: tier });
        };

        const handleOverrideToggle = (toolId: string) => {
            const currentOverrides = { ...selectedUser.entitlementOverrides };
            if (currentOverrides[toolId] === undefined) {
                currentOverrides[toolId] = true; // Default -> Allow
            } else if (currentOverrides[toolId] === true) {
                 currentOverrides[toolId] = false; // Allow -> Deny
            } else {
                 delete currentOverrides[toolId]; // Deny -> Default
            }
             handleUpdateUser({ ...selectedUser, entitlementOverrides: currentOverrides });
        };

        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md animate-fade-in" onClick={() => setSelectedUser(null)}>
                <div className="bg-slate-800 border border-slate-700 rounded-3xl w-full max-w-4xl shadow-2xl flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
                    <header className="p-8 border-b border-slate-700 flex justify-between items-start">
                        <div>
                            <h3 className="text-2xl font-bold text-white">{selectedUser.email}</h3>
                            <p className="text-sm text-slate-400 mt-1">Manage tier and individual tool access entitlements.</p>
                        </div>
                        <button onClick={() => setSelectedUser(null)} className="p-2 text-slate-500 hover:text-white"><X /></button>
                    </header>
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="md:col-span-1 space-y-6">
                             <div>
                                <label className="text-sm font-semibold text-slate-400">Membership Tier</label>
                                <select 
                                    value={selectedUser.membershipTier}
                                    onChange={e => handleTierChange(e.target.value)}
                                    className="w-full mt-2 bg-slate-900 border border-slate-600 rounded-lg p-3 text-lg font-bold"
                                >
                                    {tiers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                                </select>
                            </div>
                            <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700">
                                <p className="text-xs text-slate-400 font-bold mb-2">Legend</p>
                                <div className="space-y-2 text-xs">
                                    <p className="flex items-center gap-2"><Square size={14} className="text-slate-500"/> Default (Inherits from Tier)</p>
                                    <p className="flex items-center gap-2"><CheckSquare size={14} className="text-emerald-400"/> Allowed (Override)</p>
                                    <p className="flex items-center gap-2"><X size={14} className="text-red-400"/> Denied (Override)</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="md:col-span-2">
                            <h4 className="text-sm font-semibold text-slate-400 mb-4">Individual Tool Overrides</h4>
                            <div className="bg-slate-900/50 p-2 rounded-xl border border-slate-700 space-y-1">
                                {TOOL_REGISTRY.map(tool => {
                                    const hasOverride = selectedUser.entitlementOverrides[tool.id] !== undefined;
                                    const overrideValue = selectedUser.entitlementOverrides[tool.id];
                                    let status: 'default' | 'allowed' | 'denied' = 'default';
                                    if (hasOverride) status = overrideValue ? 'allowed' : 'denied';

                                    return (
                                        <button key={tool.id} onClick={() => handleOverrideToggle(tool.id)} className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-slate-800/50 transition-colors">
                                            <div>
                                                <p className="text-base font-semibold text-white">{tool.name}</p>
                                                <p className="text-xs text-slate-500">Default Access: <span className="font-bold text-slate-400">{tool.defaultTier}</span></p>
                                            </div>
                                            <div className="flex items-center gap-3 p-2 rounded-lg" style={{backgroundColor: status === 'allowed' ? 'rgba(52, 211, 153, 0.1)' : status === 'denied' ? 'rgba(248, 113, 113, 0.1)' : 'transparent'}}>
                                                {status === 'allowed' && <CheckSquare size={20} className="text-emerald-400" />}
                                                {status === 'denied' && <X size={20} className="text-red-400" />}
                                                {status === 'default' && <Square size={20} className="text-slate-600" />}
                                                <span className={`text-xs font-bold w-16 text-center ${
                                                    status === 'allowed' ? 'text-emerald-400' :
                                                    status === 'denied' ? 'text-red-400' :
                                                    'text-slate-500'
                                                }`}>
                                                    {status.toUpperCase()}
                                                </span>
                                            </div>
                                        </button>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold text-slate-100 mb-6">User Entitlement Overrides</h2>
            <UserOverrides />
            <UserEntitlementModal />
        </div>
    );
};

export default AdminEntitlements;
