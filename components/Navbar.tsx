
import React, { useState, useEffect } from 'react';
import { Menu, X, ChevronDown, Search, Lock, Sun, Moon, ArrowRight, Zap, Globe, Shield, Command, Terminal as TerminalIcon } from 'lucide-react';
import { NAVIGATION } from '../constants';
import { PantherLogo } from './PantherLogo';

interface NavbarProps {
    currentPath: string;
    onNavigate: (path: string) => void;
    onSearchClick: () => void;
    toggleTheme: () => void;
    isDark: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ currentPath, onNavigate, onSearchClick, toggleTheme, isDark }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [activeMega, setActiveMega] = useState<string | null>(null);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleNav = (path: string) => {
        onNavigate(path);
        setIsOpen(false);
        setActiveMega(null);
    };

    // Close mobile menu on desktop resize
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) setIsOpen(false);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <nav 
            className={`fixed top-0 w-full z-[100] transition-all duration-700 ease-in-out ${
                scrolled || isOpen
                    ? 'bg-brand-950/90 backdrop-blur-2xl py-3 md:py-4 border-b border-brand-gold/10' 
                    : 'bg-transparent py-6 md:py-10 border-b border-transparent'
            }`}
        >
            <div className="max-w-7xl mx-auto px-6 lg:px-12">
                <div className="flex justify-between items-center">
                    <div className="flex-shrink-0 cursor-pointer flex items-center gap-3 md:gap-5 group" onClick={() => handleNav('/')}>
                        <div className="relative">
                            <PantherLogo className="h-10 md:h-14 w-auto group-hover:scale-110 transition-all duration-700 filter brightness-0 invert" />
                            <div className="absolute inset-0 bg-brand-gold blur-xl opacity-0 group-hover:opacity-20 transition-opacity"></div>
                        </div>
                        <h1 className="font-heading text-lg md:text-2xl font-bold tracking-tighter text-white flex flex-col leading-none">
                            <span className="tracking-[0.1em] group-hover:text-brand-gold transition-colors">FEDERGREEN</span> 
                            <span className="text-brand-gold font-extrabold opacity-90 tracking-[0.05em] md:tracking-[0.1em]">CAPITAL</span>
                        </h1>
                    </div>
                    
                    <div className="hidden lg:flex space-x-2 items-center">
                        {NAVIGATION.map((item) => (
                            <div 
                                key={item.label} 
                                className="relative"
                                onMouseEnter={() => item.subItems && setActiveMega(item.label)}
                                onMouseLeave={() => setActiveMega(null)}
                            >
                                <button 
                                    className={`px-4 xl:px-5 py-2.5 rounded-full font-bold text-[10px] xl:text-[11px] tracking-[0.2em] uppercase transition-all duration-300 relative group/btn ${
                                        activeMega === item.label || (currentPath === item.path || (item.path !== '/' && currentPath.startsWith(item.path)))
                                            ? 'text-brand-gold' 
                                            : 'text-white/60 hover:text-white'
                                    }`}
                                    onClick={() => !item.subItems && handleNav(item.path)}
                                >
                                    <span className="relative z-10">{item.label}</span>
                                    {(currentPath === item.path || (item.path !== '/' && currentPath.startsWith(item.path))) && (
                                        <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-brand-gold rounded-full shadow-[0_0_10px_#d4af37]"></div>
                                    )}
                                </button>
                                
                                {item.subItems && (
                                    <div 
                                        className={`absolute left-1/2 -translate-x-1/2 top-full mt-6 w-[800px] xl:w-[900px] glass shadow-[0_40px_120px_-20px_rgba(0,0,0,0.8)] rounded-[3rem] overflow-hidden transition-all duration-500 origin-top transform border border-brand-gold/20 ${
                                            activeMega === item.label ? 'opacity-100 scale-100 translate-y-0 visible' : 'opacity-0 scale-95 -translate-y-4 invisible'
                                        }`}
                                    >
                                        <div className="grid grid-cols-12 min-h-[450px]">
                                            <div className="col-span-4 bg-brand-950/50 p-12 flex flex-col justify-between relative border-r border-brand-gold/10">
                                                <div className="relative z-10">
                                                    <div className="w-16 h-16 bg-brand-gold/10 rounded-3xl flex items-center justify-center text-brand-gold mb-8 shadow-[0_0_30px_rgba(212,175,55,0.1)] border border-brand-gold/20">
                                                        <Zap size={32} />
                                                    </div>
                                                    <h3 className="font-heading font-extrabold text-3xl text-white mb-6 tracking-tight leading-tight uppercase">{item.label}</h3>
                                                    <p className="text-sm text-white/50 leading-relaxed font-medium mb-10">
                                                        Deploy institutional-grade intelligence frameworks for sovereign-level capital optimization.
                                                    </p>
                                                    <button 
                                                        onClick={() => handleNav(item.path)}
                                                        className="group flex items-center gap-3 text-[10px] font-extrabold uppercase tracking-[0.4em] text-brand-gold hover:text-white transition-all"
                                                    >
                                                        Access Node <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="col-span-8 p-12 grid grid-cols-2 gap-x-12 xl:gap-x-16 gap-y-12 content-start bg-brand-950/30">
                                                {item.subItems.map((sub) => (
                                                    <div key={sub.path} className="group/item">
                                                        <button
                                                            onClick={() => handleNav(sub.path)}
                                                            className="text-left font-extrabold text-lg xl:text-xl text-white group-hover/item:text-brand-gold transition-all block mb-4 uppercase tracking-tighter"
                                                        >
                                                            {sub.label}
                                                        </button>
                                                        {sub.subItems && (
                                                            <div className="space-y-3 pl-4 border-l border-brand-gold/10">
                                                                {sub.subItems.slice(0, 5).map(deep => (
                                                                    <button 
                                                                        key={deep.path}
                                                                        onClick={(e) => { e.stopPropagation(); handleNav(deep.path); }}
                                                                        className="block text-[9px] xl:text-[10px] text-white/40 hover:text-brand-gold transition-colors font-bold tracking-[0.2em] uppercase text-left"
                                                                    >
                                                                        {deep.label}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                        
                        <div className="h-8 w-px bg-brand-gold/20 mx-4 xl:mx-6"></div>

                        <div className="flex items-center gap-3 xl:gap-4">
                            <button 
                                onClick={onSearchClick}
                                className="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center text-white/50 hover:bg-brand-gold/10 hover:text-brand-gold transition-all border border-transparent hover:border-brand-gold/20"
                                aria-label="Search"
                            >
                                <Search size={22} />
                            </button>

                            <button 
                                onClick={() => handleNav('/portal')}
                                className="relative group px-8 xl:px-10 py-3 md:py-4 bg-white text-brand-950 font-extrabold rounded-full text-[10px] xl:text-[11px] uppercase tracking-[0.3em] transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-brand-gold/40 hover:bg-brand-gold hover:text-brand-950 overflow-hidden"
                            >
                                <span className="relative z-10 flex items-center gap-3">
                                    <TerminalIcon size={16} /> 
                                    Terminal
                                </span>
                            </button>
                        </div>
                    </div>

                    <div className="lg:hidden flex items-center gap-3">
                        <button 
                            onClick={onSearchClick}
                            className="w-10 h-10 rounded-full flex items-center justify-center text-white/50 bg-brand-gold/5"
                        >
                            <Search size={20} />
                        </button>
                        <button 
                            onClick={() => setIsOpen(!isOpen)} 
                            className="text-white p-2 bg-brand-gold/10 rounded-xl" 
                            aria-label="Menu"
                        >
                            {isOpen ? <X size={28} /> : <Menu size={28} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation Menu - Enhanced full-screen glass */}
            <div 
                className={`lg:hidden fixed inset-0 top-[64px] bg-brand-950 z-[90] overflow-y-auto pb-32 transition-all duration-700 ease-in-out ${
                    isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full pointer-events-none'
                }`}
            >
                <div className="scanline-overlay opacity-10"></div>
                <div className="absolute inset-0 bg-gradient-to-tr from-brand-950 via-brand-900/40 to-brand-950 pointer-events-none"></div>
                
                <div className="px-8 py-12 space-y-8 relative z-10">
                    <div className="flex items-center gap-4 mb-12 p-6 glass rounded-3xl border-brand-gold/20">
                        <div className="p-3 bg-brand-gold/10 rounded-2xl text-brand-gold">
                            <Lock size={20} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-brand-gold uppercase tracking-[0.3em]">Institutional Access</p>
                            <p className="text-white/60 text-xs font-mono">SECURE_SESSION_ACTIVE</p>
                        </div>
                    </div>

                    {NAVIGATION.map((item) => (
                        <div key={item.label} className="border-b border-brand-800/50 pb-6">
                            <div className="flex justify-between items-center group">
                                <button 
                                    className="text-3xl md:text-5xl font-heading font-black text-white tracking-tighter uppercase text-left group-hover:text-brand-gold transition-colors"
                                    onClick={() => handleNav(item.path)}
                                >
                                    {item.label}
                                </button>
                                {item.subItems && (
                                    <button 
                                        className="p-4 bg-brand-gold/5 rounded-2xl"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setActiveMega(activeMega === item.label ? null : item.label);
                                        }}
                                    >
                                        <ChevronDown size={24} className={`text-brand-gold transition-transform duration-500 ${activeMega === item.label ? 'rotate-180' : ''}`} />
                                    </button>
                                )}
                            </div>
                            
                            {item.subItems && activeMega === item.label && (
                                <div className="grid grid-cols-1 gap-5 mt-8 pl-4 border-l-2 border-brand-gold/20 animate-fade-in">
                                    {item.subItems.map((sub) => (
                                        <button 
                                            key={sub.path} 
                                            onClick={() => handleNav(sub.path)}
                                            className="block w-full text-left py-2 text-xl font-bold text-white/50 active:text-brand-gold transition-colors uppercase tracking-tight"
                                        >
                                            {sub.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}

                    <button 
                        onClick={() => handleNav('/portal')}
                        className="w-full mt-8 py-6 bg-brand-gold text-brand-950 font-heading font-black rounded-3xl flex items-center justify-center gap-4 uppercase tracking-[0.4em] shadow-2xl"
                    >
                        <TerminalIcon size={24} /> Initialize Portal
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
