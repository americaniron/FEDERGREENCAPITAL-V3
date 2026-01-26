
import React, { useState } from 'react';
import { PantherLogo } from './PantherLogo';
import { ArrowRight, ShieldAlert, Lock } from 'lucide-react';

const ACCESS_CODE = 'Davina';

interface LaunchGateProps {
    onAuthorize: () => void;
}

const LaunchGate: React.FC<LaunchGateProps> = ({ onAuthorize }) => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isAuthenticating, setIsAuthenticating] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsAuthenticating(true);

        setTimeout(() => {
            if (password === ACCESS_CODE) {
                onAuthorize();
            } else {
                setError('ACCESS_DENIED :: AUTHENTICATION_FAILED');
                setIsAuthenticating(false);
                setPassword('');
            }
        }, 1000);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-brand-950 text-white font-sans relative overflow-hidden px-4">
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-15%] left-[-5%] w-[60%] h-[60%] bg-brand-gold/5 rounded-full blur-[140px] animate-glow"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-brand-gold/5 rounded-full blur-[140px] animate-glow delay-1000"></div>
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.06] mix-blend-overlay"></div>
                <div className="scanline-overlay opacity-5"></div>
            </div>

            <div className="relative z-10 w-full max-w-xl mx-auto text-center py-12 animate-fade-up">
                <div className="relative inline-block mb-8 sm:mb-12 group">
                    <div className="absolute -inset-4 bg-brand-gold blur-3xl opacity-10 group-hover:opacity-30 transition-opacity duration-1000"></div>
                    <PantherLogo className="h-16 sm:h-24 w-auto relative z-10 brightness-0 invert" />
                </div>
                
                <h1 className="font-heading text-3xl sm:text-5xl font-black tracking-tighter text-white uppercase mb-4 sm:mb-6 px-2">
                    Strategic Access <br className="xs:hidden" /> <span className="text-brand-gold">Protocol.</span>
                </h1>
                <p className="text-white/40 text-sm sm:text-lg mb-10 sm:mb-16 font-medium max-w-md mx-auto leading-relaxed px-4 uppercase tracking-widest">
                    This terminal is restricted. Authorization is required to proceed.
                </p>

                <form onSubmit={handleSubmit} className="w-full max-w-sm mx-auto px-4">
                    <div className="relative group">
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter_Key_"
                            className={`w-full bg-white/5 border-2 rounded-2xl pl-6 pr-20 py-5 text-lg focus:ring-4 focus:ring-brand-gold/10 outline-none placeholder:text-white/10 font-mono tracking-widest transition-all duration-500 text-center ${
                                error ? 'border-red-500/50' : 'border-brand-gold/20 group-hover:border-brand-gold/40'
                            }`}
                            disabled={isAuthenticating}
                        />
                        <button 
                            type="submit" 
                            className="absolute right-2.5 top-2.5 bg-brand-gold text-brand-950 p-4 rounded-xl hover:bg-white transition-all shadow-xl flex items-center justify-center disabled:opacity-50"
                            disabled={isAuthenticating || !password}
                        >
                            {isAuthenticating ? (
                                <div className="w-5 h-5 border-2 border-brand-950 border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <ArrowRight size={20} />
                            )}
                        </button>
                    </div>
                </form>

                {error && (
                    <div className="mt-8 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 font-mono text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 animate-fade-in max-w-sm mx-auto">
                        <ShieldAlert size={14} /> {error}
                    </div>
                )}

                <div className="mt-16 sm:mt-24 flex items-center justify-center gap-3 opacity-20">
                    <Lock size={12} className="text-brand-gold" />
                    <p className="text-[8px] sm:text-[9px] font-mono text-white uppercase tracking-[0.5em] text-center">
                        SECURE_SESSION_LOCKED :: ISO_27001
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LaunchGate;
