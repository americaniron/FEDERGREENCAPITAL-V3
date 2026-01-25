
import React from 'react';
import { PantherLogo } from './PantherLogo';
// Added ArrowRight to imports to fix undefined variable error
import { Twitter, Linkedin, Facebook, Mail, ShieldCheck, Lock, Globe, FileCheck, Server, ArrowUp, ArrowRight } from 'lucide-react';

const Footer: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => {
    
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <footer className="relative bg-brand-950 text-slate-400 pt-32 pb-12 border-t border-brand-800/50 overflow-hidden">
            {/* Cinematic Aurora Background */}
            <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-tr from-brand-950 via-brand-700/30 to-brand-950 animate-aurora" style={{backgroundSize: '400% 400%'}}></div>
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05] contrast-150 mix-blend-overlay"></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-20 mb-32">
                    <div className="col-span-1 lg:col-span-2 space-y-12">
                        <div className="flex items-center gap-6 cursor-pointer group" onClick={() => onNavigate('/')}>
                            <PantherLogo className="h-16 w-auto brightness-0 invert opacity-100 group-hover:scale-110 transition-transform duration-500" />
                            <h2 className="text-4xl font-heading font-black text-white tracking-tighter leading-none">
                                FEDERGREEN <br/><span className="text-brand-gold text-3xl">CAPITAL</span>
                            </h2>
                        </div>
                        <p className="max-w-md text-xl leading-relaxed text-white/40 font-light">
                            Empowering visionary investors with global reach and strategic foresight. 
                            We bridge the gap between ambition and achievement through elite financial instruments.
                        </p>
                        <div className="flex gap-6">
                            {[Linkedin, Twitter, Facebook, Mail].map((Icon, i) => (
                                <button key={i} className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-brand-gold hover:bg-brand-gold hover:text-brand-950 hover:border-brand-gold transition-all duration-500 hover:-translate-y-2 shadow-2xl">
                                    <Icon size={24} />
                                </button>
                            ))}
                        </div>
                    </div>
                    
                    <div>
                        <h3 className="text-white font-black mb-10 uppercase tracking-[0.4em] text-[10px] border-b border-brand-gold/20 pb-4 inline-block">Strategic Access</h3>
                        <ul className="space-y-6 text-sm font-bold uppercase tracking-widest">
                            <li><button onClick={() => onNavigate('/about-us')} className="hover:text-brand-gold transition-all hover:translate-x-2 flex items-center gap-3">ABOUT FEDERGREEN <ArrowRight size={14} className="opacity-0 group-hover:opacity-100"/></button></li>
                            <li><button onClick={() => onNavigate('/services')} className="hover:text-brand-gold transition-all hover:translate-x-2 flex items-center gap-3">OUR CAPABILITIES <ArrowRight size={14} className="opacity-0 group-hover:opacity-100"/></button></li>
                            <li><button onClick={() => onNavigate('/sectors')} className="hover:text-brand-gold transition-all hover:translate-x-2 flex items-center gap-3">SECTORS COVERED <ArrowRight size={14} className="opacity-0 group-hover:opacity-100"/></button></li>
                            <li><button onClick={() => onNavigate('/contact')} className="hover:text-brand-gold transition-all hover:translate-x-2 flex items-center gap-3 text-brand-gold">CONTACT CONCIERGE <ArrowRight size={14} className="opacity-0 group-hover:opacity-100"/></button></li>
                        </ul>
                    </div>
                    
                    <div>
                        <h3 className="text-white font-black mb-10 uppercase tracking-[0.4em] text-[10px] border-b border-brand-gold/20 pb-4 inline-block">Institutional Standards</h3>
                        <ul className="space-y-6 text-sm font-bold uppercase tracking-widest">
                            <li><button onClick={() => onNavigate('/terms')} className="hover:text-brand-gold transition-all hover:translate-x-2">TERMS OF USE</button></li>
                            <li><button onClick={() => onNavigate('/privacy')} className="hover:text-brand-gold transition-all hover:translate-x-2">PRIVACY POLICY</button></li>
                            <li><button onClick={() => onNavigate('/disclaimer')} className="hover:text-brand-gold transition-all hover:translate-x-2">INVESTMENT DISCLAIMER</button></li>
                            <li><button onClick={() => onNavigate('/portal')} className="flex items-center gap-3 hover:text-brand-gold transition-all group"><span className="w-2 h-2 rounded-full bg-brand-gold group-hover:animate-ping"></span> SECURE PORTAL</button></li>
                        </ul>
                    </div>
                </div>

                {/* Upscaled Trust Indicators */}
                <div className="mb-24 p-10 glass rounded-[3rem] border-brand-gold/20 grid grid-cols-2 lg:grid-cols-4 gap-12 items-center">
                     <div className="flex items-center gap-5 opacity-40 hover:opacity-100 transition-opacity">
                        <Lock size={24} className="text-brand-gold"/>
                        <div className="text-left">
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Encrypted Node</p>
                            <p className="text-[9px] font-mono text-brand-gold/60 mt-1">AES-256-GCM</p>
                        </div>
                     </div>
                     <div className="flex items-center gap-5 opacity-40 hover:opacity-100 transition-opacity">
                        <ShieldCheck size={24} className="text-brand-gold"/>
                        <div className="text-left">
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Compliance Protocol</p>
                            <p className="text-[9px] font-mono text-brand-gold/60 mt-1">KYC/AML V4.2</p>
                        </div>
                     </div>
                     <div className="flex items-center gap-5 opacity-40 hover:opacity-100 transition-opacity">
                        <Globe size={24} className="text-brand-gold"/>
                        <div className="text-left">
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Global Jurisdiction</p>
                            <p className="text-[9px] font-mono text-brand-gold/60 mt-1">SEC/FCA/ADGM</p>
                        </div>
                     </div>
                     <div className="flex items-center gap-5 opacity-40 hover:opacity-100 transition-opacity">
                        <Server size={24} className="text-brand-gold"/>
                        <div className="text-left">
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Secure Uplink</p>
                            <p className="text-[9px] font-mono text-brand-gold/60 mt-1">ISO_27001_ACTIVE</p>
                        </div>
                     </div>
                </div>

                <div className="pt-12 border-t border-brand-800/50 flex flex-col md:flex-row justify-between items-center text-[10px] text-white/20 font-black uppercase tracking-[0.5em]">
                    <p>&copy; {new Date().getFullYear()} FEDERGREEN CAPITAL PARTNERS. ALL SYSTEM NODES PROTECTED.</p>
                    <div className="flex gap-10 mt-8 md:mt-0">
                        <span className="hover:text-white transition-colors cursor-default">NEW YORK</span>
                        <span className="hover:text-white transition-colors cursor-default">LONDON</span>
                        <span className="hover:text-white transition-colors cursor-default">SINGAPORE</span>
                        <span className="hover:text-white transition-colors cursor-default">DUBAI</span>
                    </div>
                    <button onClick={scrollToTop} className="mt-12 md:mt-0 p-5 rounded-2xl bg-brand-gold text-brand-950 hover:bg-white transition-all hover:-translate-y-2 shadow-2xl">
                        <ArrowUp size={20}/>
                    </button>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
