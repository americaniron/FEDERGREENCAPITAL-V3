import React, { useState, useEffect, useMemo } from 'react';
import { Users, DollarSign, Activity, Eye, History } from 'lucide-react';
import { userService } from '../../services/userService';
import { auditLogService } from '../../services/auditLogService';
import { SIMULATED_USERS } from '../../lib/rbac';
import { SiteUser, AuditLogEntry } from '../../types';

const AdminDashboard: React.FC = () => {
    const [users, setUsers] = useState<SiteUser[]>([]);
    const [logs, setLogs] = useState<AuditLogEntry[]>([]);

    useEffect(() => {
        setUsers(userService.getUsers());
        setLogs(auditLogService.getLogs());
    }, []);

    const tierCounts = useMemo(() => {
        return users.reduce((acc: Record<string, number>, user) => {
            acc[user.membershipTier] = (acc[user.membershipTier] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);
    }, [users]);

    // FIX: Cast object values to number[] to resolve TypeScript inference issue where it's treated as `unknown`.
    const maxTierCount = Math.max(...(Object.values(tierCounts) as number[]), 0);
    
    const stats = [
        { label: 'Registered Site Users', value: users.length, icon: Users, change: '+2 since last week' },
        { label: 'Admin Accounts', value: SIMULATED_USERS.length, icon: Activity, change: 'System Monitored' },
        { label: 'Total Audit Events', value: logs.length, icon: History, change: 'Since Inception' },
    ];

    return (
        <div>
            <h1 className="text-4xl font-black text-slate-100 tracking-tight uppercase">System Dashboard</h1>
            <p className="mt-2 text-lg text-slate-400 font-light">Live overview of Federgreen Capital's operational metrics.</p>
            
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
                {stats.map(stat => (
                    <div key={stat.label} className="bg-slate-800/50 border border-slate-700 rounded-3xl p-8 relative overflow-hidden group hover:border-brand-gold/50 transition-all">
                        <div className="absolute top-0 left-0 w-full h-1 bg-brand-gold/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="flex justify-between items-start">
                            <div className="p-3 rounded-xl bg-slate-700/50 border border-slate-600 text-brand-gold">
                                <stat.icon className="h-8 w-8" />
                            </div>
                            <span className="text-xs font-bold text-emerald-400/70 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                                {stat.change}
                            </span>
                        </div>
                        <p className="mt-8 text-6xl font-black text-slate-100 tracking-tighter">{stat.value.toLocaleString()}</p>
                        <p className="text-sm text-slate-400 uppercase tracking-wider mt-2">{stat.label}</p>
                    </div>
                ))}
            </div>

            <div className="mt-12 grid grid-cols-1 lg:grid-cols-5 gap-8">
                <div className="lg:col-span-3 bg-slate-800/50 border border-slate-700 rounded-3xl p-8">
                     <h2 className="text-xl font-bold text-slate-100 mb-6">Recent Admin Activity</h2>
                     <div className="space-y-4">
                        {logs.slice(0, 5).map(log => (
                            <div key={log.id} className="flex justify-between items-center p-4 bg-slate-900/50 rounded-xl border border-slate-700/50 hover:bg-slate-700/30 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-slate-800 rounded-full text-slate-400"><History size={16} /></div>
                                    <div>
                                        <p className="text-sm text-slate-300 font-semibold">{log.action} on <span className="text-brand-gold">{log.entity}</span></p>
                                        <p className="text-xs text-slate-500 font-mono">{new Date(log.timestamp).toLocaleString()}</p>
                                    </div>
                                </div>
                                <div className="text-xs text-slate-400 font-mono">{log.adminEmail}</div>
                            </div>
                        ))}
                     </div>
                </div>

                <div className="lg:col-span-2 bg-slate-800/50 border border-slate-700 rounded-3xl p-8">
                    <h2 className="text-xl font-bold text-slate-100 mb-6">User Tier Distribution</h2>
                    <div className="space-y-6">
                        {Object.entries(tierCounts).map(([tier, count]) => (
                            <div key={tier} className="group">
                                <div className="flex justify-between text-sm font-bold mb-2">
                                    <span className="text-slate-300">{tier}</span>
                                    <span className="text-brand-gold">{count} users</span>
                                </div>
                                <div className="h-3 w-full bg-slate-700/50 rounded-full border border-slate-600/50 p-0.5">
                                    <div 
                                        className="h-full bg-brand-gold rounded-full shadow-[0_0_10px_theme(colors.brand.gold)] transition-all duration-1000 ease-out" 
                                        // FIX: Cast count to Number to allow arithmetic operation, as it's inferred as `unknown`.
                                        style={{ width: `${(Number(count) / (maxTierCount || 1)) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
