
import React from 'react';
import { Lock, Zap, ArrowRight, Shield } from 'lucide-react';

interface UpgradeNoticeProps {
    toolName?: string;
    requiredTier?: string;
}

const UpgradeNotice: React.FC<UpgradeNoticeProps> = ({ toolName, requiredTier }) => {
    return (
        <div className="bg-brand-950/50 border-2 border-dashed border-brand-gold/20 p-12 md:p-20 rounded-[4rem] text-center flex flex-col items-center justify-center animate-fade-in min-h-[500px]">
            <div className="w-24 h-24 bg-brand-gold/10 rounded-3xl flex items-center justify-center mb-10 border border-brand-gold/20 shadow-xl">
                <Lock size={48} className="text-brand-gold" />
            </div>
            <h3 className="text-4xl font-heading font-black text-brand-gold tracking-tighter uppercase mb-4">
                Institutional Access Required
            </h3>
            <p className="text-white/60 text-lg max-w-xl mx-auto leading-relaxed mb-10">
                The <span className="text-white font-bold">{toolName || 'selected tool'}</span> is restricted to members with{' '}
                <span className="text-white font-bold">{requiredTier || 'a higher'}</span> tier or greater.
            </p>
            <button className="group relative px-12 py-6 bg-brand-gold text-brand-950 font-heading font-black rounded-2xl flex items-center justify-center gap-4 transition-all hover:bg-white shadow-[0_20px_50px_rgba(212,175,55,0.3)] text-xs uppercase tracking-[0.4em] overflow-hidden">
                <span className="relative z-10">Upgrade Membership</span>
                <ArrowRight size={18} className="relative z-10 group-hover:translate-x-2 transition-transform" />
            </button>
            <div className="mt-16 flex items-center gap-3 text-white/20">
                <Shield size={14} />
                <p className="text-[9px] font-mono uppercase tracking-[0.3em]">
                    All AI tools are subject to institutional compliance protocols.
                </p>
            </div>
        </div>
    );
};

export default UpgradeNotice;
