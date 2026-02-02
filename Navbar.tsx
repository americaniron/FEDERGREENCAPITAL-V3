
import React, { useState, useEffect } from 'react';
import { Menu, X, ChevronDown, Search, Lock, Sun, Moon, ArrowRight, Zap, Globe, Shield, Command, Terminal as TerminalIcon } from 'lucide-react';
import { PantherLogo } from './PantherLogo';
import { NavItem } from '../types';

interface NavbarProps {
    navigation: NavItem[];
    currentPath: string;
    onNavigate: (path: string) => void;
    onSearchClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ navigation, currentPath, onNavigate, onSearchClick }) => {
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

    return (
        <nav 
            className={`fixed top-0 w-full z-[100] transition-all duration-700 ease-in-out ${
                scrolled || isOpen
                    ? 'bg-brand-950/90 backdrop-blur-3xl py-3 md:py-4 border-b border-brand-gold/10' 
                    : 'bg-transparent py-6 md:py-8 border-b border-transparent'
            }`}
        >
            <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-12">
                <div className="flex items-center justify-between">
                    {/* Left: Logo and Links Container */}
                    <div className="flex items-center gap-6 xl:gap-12 flex-grow min-w-0">
                        <div className="flex-shrink-0 cursor-pointer flex items-center gap-3 group" onClick={() => handleNav('/')}>
                            <div className="relative">
                                <PantherLogo className="h-8 sm:h-10 w-auto group-hover:scale-110 transition-all duration-700 filter brightness-0 invert" />
                                <div className="absolute inset-0 bg-brand-gold blur-xl opacity-0 group-hover:opacity-30 transition-opacity"></div>
                            </div>
                            <h1 className="font-heading text-base sm:text-lg font-bold tracking-tighter text-white flex flex-col leading-none hidden sm:flex">
                                <span className="tracking-[0.1em] group-hover:text-brand-gold transition-colors uppercase">Federgreen</span> 
                                <span className="text-brand-gold font-extrabold opacity-90 tracking-[0.05em] uppercase">Capital</span>
                            </h1>
                        </div>
                        
                        {/* Middle: Left-Aligned Flexible Links */}
                        <div className="hidden lg:flex flex-wrap items-center gap-1 xl:gap-2">
                            {navigation.map((item) => (
                                <div 
                                    key={item.label} 
                                    className="relative"
                                    onMouseEnter={() => item.subItems && setActiveMega(item.label)}
                                    onMouseLeave={() => setActiveMega(null)}
                                >
                                    <button 
                                        className={`px-3 xl:px-4 py-2 rounded-xl font-bold text-[9px] xl:text-[10px] tracking-[0.2em] uppercase transition-all duration-300 relative group/btn ${
                                            activeMega === item.label || (currentPath === item.path || (item.path !== '/' && currentPath.startsWith(item.path)))
                                                ? 'text-brand-gold bg-white/5' 
                                                : 'text-white/70 hover:text-white hover:bg-white/5'
                                        }`}
                                        onClick={() => !item.subItems && handleNav(item.path)}
                                    >
                                        <span className="relative z-10">{item.label}</span>
                                        {(currentPath === item.path || (item.path !== '/' && currentPath.startsWith(item.path))) && (
                                            <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-brand-gold rounded-full shadow-[0_0_10px_#d4af37]"></div>
                                        )}
                                    </button>
                                    
                                    {item.subItems && (
                                        <div 
                                            className={`absolute left-0 top-full mt-4 w-[600px] xl:w-[800px] glass shadow-[0_40px_120px_-20px_rgba(0,0,0,0.9)] rounded-[2.5rem] overflow-hidden transition-all duration-500 origin-top transform border border-brand-gold/20 ${
                                                activeMega === item.label ? 'opacity-100 scale-100 translate-y-0 visible' : 'opacity-0 scale-95 -translate-y-4 invisible'
                                            }`}
                                        >
                                            <div className="grid grid-cols-12 min-h-[300px]">
                                                <div className="col-span-4 bg-brand-950/60 p-8 flex flex-col justify-between border-r border-brand-gold/10">
                                                    <div className="space-y-6">
                                                        <div className="w-12 h-12 bg-brand-gold/10 rounded-2xl flex items-center justify-center text-brand-gold border border-brand-gold/20">
                                                            <Zap size={24} />
                                                        </div>
                                                        <h3 className="font-heading font-extrabold text-xl text-white tracking-tight uppercase">{item.label}</h3>
                                                        <p className="text-[10px] text-white/40 leading-relaxed font-bold uppercase tracking-widest">
                                                            Deploy institutional intelligence frameworks for sovereign capital optimization.
                                                        </p>
                                                    </div>
                                                    <button 
                                                        onClick={() => handleNav(item.path)}
                                                        className="group flex items-center gap-3 text-[9px] font-extrabold uppercase tracking-[0.4em] text-brand-gold hover:text-white transition-all"
                                                    >
                                                        Access Node <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
                                                    </button>
                                                </div>

                                                <div className="col-span-8 p-8 grid grid-cols-2 gap-8 content-start bg-brand-950/30">
                                                    {item.subItems.map((sub) => (
                                                        <div key={sub.path} className="group/item">
                                                            <button
                                                                onClick={() => handleNav(sub.path)}
                                                                className="text-left font-black text-sm text-white group-hover/item:text-brand-gold transition-all block mb-2 uppercase tracking-tight"
                                                            >
                                                                {sub.label}
                                                            </button>
                                                            {sub.subItems && (
                                                                <div className="space-y-1.5 pl-3 border-l border-brand-gold/10">
                                                                    {sub.subItems.slice(0, 4).map(deep => (
                                                                        <button 
                                                                            key={deep.path}
                                                                            onClick={(e) => { e.stopPropagation(); handleNav(deep.path); }}
                                                                            className="block text-[8px] text-white/60 hover:text-brand-gold transition-colors font-bold tracking-[0.2em] uppercase text-left"
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
                        </div>
                    </div>
                    
                    {/* Right: Utilities & Mobile Trigger */}
                    <div className="flex items-center gap-2 sm:gap-4 ml-4">
                        <button 
                            onClick={onSearchClick}
                            className="hidden sm:flex w-10 h-10 rounded-full items-center justify-center text-white/40 hover:bg-white/5 hover:text-brand-gold transition-all"
                            aria-label="Search"
                        >
                            <Search size={20} />
                        </button>

                        <button 
                            onClick={() => handleNav('/portal')}
                            className="relative group px-5 sm:px-8 py-2.5 bg-white text-brand-950 font-black rounded-xl text-[9px] sm:text-[10px] uppercase tracking-[0.3em] transition-all shadow-[0_10px_30px_rgba(255,255,255,0.1)] hover:shadow-brand-gold/30 hover:bg-brand-gold overflow-hidden"
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                <TerminalIcon size={12} className="hidden xs:block" /> 
                                Terminal
                            </span>
                        </button>

                        <button 
                            onClick={() => setIsOpen(!isOpen)} 
                            className="lg:hidden text-white p-2.5 bg-brand-gold/10 rounded-xl hover:bg-brand-gold/20 transition-all" 
                            aria-label="Menu"
                        >
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Enhanced Mobile Navigation Menu */}
            <div 
                className={`lg:hidden fixed inset-0 top-[60px] sm:top-[70px] bg-brand-950 z-[90] overflow-y-auto pb-32 transition-all duration-700 ease-in-out ${
                    isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
                }`}
            >
                <div className="scanline-overlay opacity-5"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-brand-950 via-brand-900/20 to-brand-950 pointer-events-none"></div>
                
                <div className="px-6 py-8 space-y-8 relative z-10">
                    <div className="grid grid-cols-2 gap-4">
                        <button onClick={() => handleNav('/portal')} className="flex flex-col items-center gap-3 p-6 glass rounded-2xl border-brand-gold/20">
                            <TerminalIcon size={24} className="text-brand-gold" />
                            <span className="text-[9px] font-black uppercase tracking-widest text-white/60">Terminal</span>
                        </button>
                        <button onClick={onSearchClick} className="flex flex-col items-center gap-3 p-6 glass rounded-2xl border-brand-gold/20">
                            <Search size={24} className="text-brand-gold" />
                            <span className="text-[9px] font-black uppercase tracking-widest text-white/60">Search</span>
                        </button>
                    </div>

                    <div className="space-y-4">
                        {navigation.map((item) => (
                            <div key={item.label} className="border-b border-white/5 pb-2">
                                <button 
                                    className={`w-full text-left py-3 text-2xl font-heading font-black tracking-tighter uppercase transition-colors flex justify-between items-center ${
                                        currentPath === item.path ? 'text-brand-gold' : 'text-white'
                                    }`}
                                    onClick={() => item.subItems ? setActiveMega(activeMega === item.label ? null : item.label) : handleNav(item.path)}
                                >
                                    {item.label}
                                    {item.subItems && <ChevronDown size={20} className={`text-brand-gold/40 transition-transform ${activeMega === item.label ? 'rotate-180' : ''}`} />}
                                </button>
                                
                                {item.subItems && activeMega === item.label && (
                                    <div className="grid grid-cols-1 gap-1 py-4 pl-4 border-l border-brand-gold/20 animate-fade-in bg-white/5 rounded-r-2xl">
                                        {item.subItems.map((sub) => (
                                            <button 
                                                key={sub.path} 
                                                onClick={() => handleNav(sub.path)}
                                                className="block w-full text-left py-3 px-4 text-sm font-bold text-white/70 active:text-brand-gold hover:text-white uppercase tracking-widest"
                                            >
                                                {sub.label}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
