
import React, { useState } from 'react';
import { PantherLogo } from './PantherLogo';
import { ArrowRight, ShieldAlert } from 'lucide-react';

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
        <div className="flex items-center justify-center min-h-screen bg-brand-950 text-white font-sans relative overflow-hidden">
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-15%] left-[-5%] w-[60%] h-[60%] bg-brand-gold/5 rounded-full blur-[160px] animate-glow"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-brand-gold/5 rounded-full blur-[160px] animate-glow delay-1000"></div>
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.08] mix-blend-overlay"></div>
                <div className="scanline-overlay opacity-10"></div>
            </div>

            <div className="relative z-10 w-full max-w-lg mx-auto text-center p-8 animate-fade-up">
                <div className="relative inline-block mb-12 group">
                    <div className="absolute -inset-2 bg-brand-gold blur-3xl opacity-20 group-hover:opacity-30 transition-opacity duration-1000"></div>
                    <PantherLogo className="h-24 w-auto relative z-10 brightness-0 invert" />
                </div>
                
                <h1 className="font-heading text-4xl md:text-5xl font-extrabold tracking-tighter text-white uppercase mb-4">
                    Strategic Access Protocol
                </h1>
                <p className="text-white/40 text-lg mb-12 font-light max-w-md mx-auto leading-relaxed">
                    This terminal is restricted pending global launch. Authorization is required to proceed.
                </p>

                <form onSubmit={handleSubmit} className="w-full max-w-sm mx-auto">
                    <div className="relative group">
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter_Pre-Launch_Key_"
                            className={`w-full bg-brand-gold/5 border-2 rounded-2xl pl-6 pr-20 py-5 text-lg focus:ring-2 focus:ring-brand-gold outline-none placeholder:text-white/20 font-mono tracking-widest transition-all duration-300 ${
                                error ? 'border-red-500/50 animate-pulse' : 'border-brand-gold/20 group-hover:border-brand-gold/50'
                            }`}
                            disabled={isAuthenticating}
                        />
                        <button 
                            type="submit" 
                            className="absolute right-3 top-3 bg-brand-gold text-brand-950 p-4 rounded-xl hover:bg-white transition-all shadow-lg flex items-center justify-center disabled:opacity-50"
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
                    <p className="mt-6 text-red-400 font-mono text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-2 animate-fade-in">
                        <ShieldAlert size={14} /> {error}
                    </p>
                )}

                <p className="text-[9px] font-mono text-white/10 uppercase tracking-[0.6em] mt-20 text-center">
                    Federgreen_OS_v4.2.0_Secure_Uplink :: Pre-Launch Environment
                </p>
            </div>
        </div>
    );
};

export default LaunchGate;
