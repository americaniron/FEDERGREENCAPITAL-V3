
import React, { useState } from 'react';
import { adminAuthService } from '../../services/adminAuthService';
import { PantherLogo } from '../PantherLogo';
import { ExternalLink, ShieldAlert, Loader2 } from 'lucide-react';

interface AdminLoginProps {
    onLoginSuccess: () => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const user = await adminAuthService.login(email, password);
            if (user) {
                onLoginSuccess();
            } else {
                setError('Invalid credentials or insufficient permissions.');
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-900 text-slate-300 font-sans">
            <div className="w-full max-w-md p-8 space-y-8">
                <div className="text-center">
                    <PantherLogo className="h-12 w-auto mx-auto filter brightness-0 invert opacity-50" />
                    <h1 className="mt-6 text-2xl font-bold text-slate-100">Admin Control Panel</h1>
                    <p className="text-sm text-slate-400">Restricted Access</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="text-xs font-semibold text-slate-400">Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                            className="w-full px-4 py-3 mt-1 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-gold"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-semibold text-slate-400">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                            className="w-full px-4 py-3 mt-1 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-gold"
                        />
                    </div>

                    {error && (
                        <div className="flex items-center gap-2 p-3 text-sm text-red-400 bg-red-900/30 border border-red-500/30 rounded-lg">
                            <ShieldAlert size={16} />
                            <span>{error}</span>
                        </div>
                    )}

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex justify-center items-center gap-2 px-4 py-3 font-semibold text-brand-950 bg-brand-gold rounded-lg hover:bg-yellow-300 transition-colors disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : 'Sign In'}
                        </button>
                    </div>
                </form>

                <div className="text-center pt-8 border-t border-slate-700/50">
                    <button
                        onClick={() => window.location.hash = '/'}
                        className="text-sm font-semibold text-slate-400 hover:text-brand-gold transition-colors flex items-center gap-2 mx-auto"
                    >
                        <ExternalLink size={16} />
                        Return to Main Site
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
