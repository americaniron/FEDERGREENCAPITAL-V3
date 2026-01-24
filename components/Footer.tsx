
import React from 'react';
import { PantherLogo } from './PantherLogo';
import { Twitter, Linkedin, Facebook, Mail, ShieldCheck, Lock, Globe, FileCheck, Server } from 'lucide-react';

const Footer: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => {
    return (
        <footer className="relative bg-brand-950 text-slate-400 pt-24 pb-12 border-t border-brand-800 overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-700/10 rounded-full blur-[128px] pointer-events-none"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-brand-gold/5 rounded-full blur-[128px] pointer-events-none"></div>

            <div className="relative z-10 max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
                    <div className="col-span-1 lg:col-span-2 space-y-8">
                        <div className="flex items-center gap-4">
                            <PantherLogo className="h-14 w-auto drop-shadow-[0_0_15px_rgba(212,175,55,0.3)]" />
                            <h2 className="text-3xl font-heading font-bold text-white tracking-tight leading-none">
                                FEDERGREEN <br/><span className="text-brand-gold text-2xl">CAPITAL</span>
                            </h2>
                        </div>
                        <p className="max-w-md text-lg leading-relaxed text-slate-400 font-light">
                            Empowering visionary investors with global reach and strategic foresight. 
                            We bridge the gap between ambition and achievement through elite financial instruments.
                        </p>
                        <div className="flex gap-4">
                            {[Linkedin, Twitter, Facebook, Mail].map((Icon, i) => (
                                <button key={i} className="w-12 h-12 rounded-full bg-brand-900 border border-brand-800 flex items-center justify-center hover:bg-brand-gold hover:text-brand-900 hover:border-brand-gold transition-all duration-300 hover:-translate-y-1 shadow-lg">
                                    <Icon size={20} />
                                </button>
                            ))}
                        </div>
                    </div>
                    
                    <div>
                        <h3 className="text-white font-bold mb-8 uppercase tracking-widest text-xs border-b border-brand-800 pb-2 inline-block">Strategic</h3>
                        <ul className="space-y-4 text-sm font-medium">
                            <li><button onClick={() => onNavigate('/about-us')} className="hover:text-brand-gold transition-colors hover:translate-x-1 inline-block duration-200">About Us</button></li>
                            <li><button onClick={() => onNavigate('/services')} className="hover:text-brand-gold transition-colors hover:translate-x-1 inline-block duration-200">Our Services</button></li>
                            <li><button onClick={() => onNavigate('/sectors')} className="hover:text-brand-gold transition-colors hover:translate-x-1 inline-block duration-200">Sectors Covered</button></li>
                            <li><button onClick={() => onNavigate('/contact')} className="hover:text-brand-gold transition-colors hover:translate-x-1 inline-block duration-200">Contact Concierge</button></li>
                        </ul>
                    </div>
                    
                    <div>
                        <h3 className="text-white font-bold mb-8 uppercase tracking-widest text-xs border-b border-brand-800 pb-2 inline-block">Legal & Compliance</h3>
                        <ul className="space-y-4 text-sm font-medium">
                            <li><button onClick={() => onNavigate('/terms')} className="hover:text-brand-gold transition-colors hover:translate-x-1 inline-block duration-200">Terms of Use</button></li>
                            <li><button onClick={() => onNavigate('/privacy')} className="hover:text-brand-gold transition-colors hover:translate-x-1 inline-block duration-200">Privacy Policy</button></li>
                            <li><button onClick={() => onNavigate('/disclaimer')} className="hover:text-brand-gold transition-colors hover:translate-x-1 inline-block duration-200">Investment Disclaimer</button></li>
                            <li><button onClick={() => onNavigate('/portal')} className="flex items-center gap-2 hover:text-brand-gold transition-colors hover:translate-x-1 duration-200 group"><span className="w-2 h-2 rounded-full bg-brand-gold group-hover:animate-pulse"></span> Secure Portal</button></li>
                        </ul>
                    </div>
                </div>

                {/* Trust & Compliance Strip */}
                <div className="mb-12 p-6 bg-brand-900/40 rounded-2xl border border-brand-800/50 backdrop-blur-sm grid grid-cols-2 md:grid-cols-4 gap-6 items-center justify-items-center">
                     <div className="flex items-center gap-3 opacity-60 hover:opacity-100 transition-opacity">
                        <Lock size={18} className="text-brand-gold"/>
                        <span className="text-xs font-bold uppercase tracking-wider">256-Bit SSL Encrypted</span>
                     </div>
                     <div className="flex items-center gap-3 opacity-60 hover:opacity-100 transition-opacity">
                        <ShieldCheck size={18} className="text-brand-gold"/>
                        <span className="text-xs font-bold uppercase tracking-wider">KYC/AML Compliant</span>
                     </div>
                     <div className="flex items-center gap-3 opacity-60 hover:opacity-100 transition-opacity">
                        <Globe size={18} className="text-brand-gold"/>
                        <span className="text-xs font-bold uppercase tracking-wider">Global Regulated</span>
                     </div>
                     <div className="flex items-center gap-3 opacity-60 hover:opacity-100 transition-opacity">
                        <Server size={18} className="text-brand-gold"/>
                        <span className="text-xs font-bold uppercase tracking-wider">ISO 27001 Certified</span>
                     </div>
                </div>

                <div className="pt-8 border-t border-brand-900 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500 font-medium">
                    <p>&copy; {new Date().getFullYear()} Federgreen Capital. All Rights Reserved.</p>
                    <div className="flex gap-6 mt-4 md:mt-0">
                        <span>New York</span>
                        <span>London</span>
                        <span>Singapore</span>
                        <span>Dubai</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
