import React, { useState } from 'react';
import { auditLogService } from '../../services/auditLogService';
import { AuditLogEntry } from '../../types';
import { History, X, Eye } from 'lucide-react';

const AdminAuditLog: React.FC = () => {
    const [logs, setLogs] = useState<AuditLogEntry[]>(() => auditLogService.getLogs());
    const [selectedLog, setSelectedLog] = useState<AuditLogEntry | null>(null);

    const DiffViewer = ({ before, after }: { before: any, after: any }) => {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs bg-slate-900 p-6 rounded-xl border border-slate-700">
                <div>
                    <h4 className="font-bold text-slate-400 mb-4 border-b border-red-500/30 pb-2">Before</h4>
                    <pre className="text-red-400/70 whitespace-pre-wrap">{JSON.stringify(before, null, 2)}</pre>
                </div>
                <div>
                    <h4 className="font-bold text-slate-400 mb-4 border-b border-emerald-500/30 pb-2">After</h4>
                    <pre className="text-emerald-400/70 whitespace-pre-wrap">{JSON.stringify(after, null, 2)}</pre>
                </div>
            </div>
        );
    };

    return (
        <div>
            <h1 className="text-4xl font-black text-slate-100 tracking-tight uppercase">System Audit Log</h1>
            <p className="mt-2 text-lg text-slate-400 font-light">Immutable record of all administrative actions and system events.</p>

            <div className="mt-12 bg-slate-800/50 border border-slate-700 rounded-3xl overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-slate-900/30">
                        <tr>
                            <th className="p-5 text-left text-slate-400 font-semibold uppercase tracking-wider">Timestamp</th>
                            <th className="p-5 text-left text-slate-400 font-semibold uppercase tracking-wider">Admin</th>
                            <th className="p-5 text-left text-slate-400 font-semibold uppercase tracking-wider">Action</th>
                            <th className="p-5 text-left text-slate-400 font-semibold uppercase tracking-wider">Entity</th>
                            <th className="p-5"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {logs.map((log, index) => (
                            <tr key={log.id} className={`border-t border-slate-700/50 hover:bg-slate-800/70 transition-colors ${index % 2 === 0 ? 'bg-slate-800/30' : ''}`}>
                                <td className="p-5 text-slate-400 font-mono text-xs whitespace-nowrap">{new Date(log.timestamp).toLocaleString()}</td>
                                <td className="p-5 text-slate-300 font-semibold">{log.adminEmail}</td>
                                <td className="p-5 text-slate-300">{log.action}</td>
                                <td className="p-5 text-brand-gold font-semibold">{log.entity}</td>
                                <td className="p-5 text-right">
                                    <button onClick={() => setSelectedLog(log)} className="p-2 text-slate-400 hover:text-brand-gold rounded-md hover:bg-slate-700/50">
                                        <Eye size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {selectedLog && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md animate-fade-in">
                    <div className="bg-slate-800 border border-slate-700 rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
                        <header className="p-6 border-b border-slate-700 flex justify-between items-center">
                            <div>
                                <h3 className="text-xl font-bold text-white">Log Event Details</h3>
                                <p className="text-xs text-slate-400 font-mono mt-1">{selectedLog.id}</p>
                            </div>
                            <button onClick={() => setSelectedLog(null)} className="p-2 text-slate-500 hover:text-white"><X /></button>
                        </header>
                        <div className="p-8 space-y-6 overflow-y-auto custom-scrollbar">
                            <div className="grid grid-cols-3 gap-6 text-sm text-slate-300">
                                <p><strong>Action:</strong> {selectedLog.action}</p>
                                <p><strong>Entity:</strong> {selectedLog.entity}</p>
                                <p><strong>Admin:</strong> {selectedLog.adminEmail}</p>
                            </div>
                            <DiffViewer before={selectedLog.details.before} after={selectedLog.details.after} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminAuditLog;
