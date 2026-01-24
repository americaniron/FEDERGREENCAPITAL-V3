
import React, { useState, useEffect } from 'react';
import { Menu, X, ChevronDown, Search, Lock, Sun, Moon, ArrowRight, Zap, Globe, Shield } from 'lucide-react';
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

    // Scroll effect for glassmorphism
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
            className={`fixed top-0 w-full z-50 transition-all duration-500 ${
                scrolled 
                    ? 'bg-white/80 dark:bg-brand-950/80 backdrop-blur-xl shadow-2xl py-3 border-b border-slate-200/50 dark:border-brand-800/50' 
                    : 'bg-transparent py-8 border-b border-transparent'
            }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center">
                    {/* Logo Area */}
                    <div className="flex-shrink-0 cursor-pointer flex items-center gap-4 group" onClick={() => handleNav('/')}>
                        <PantherLogo className="h-12 w-auto drop-shadow-2xl group-hover:scale-105 transition-transform duration-500 ease-out" />
                        <h1 className="font-heading text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex flex-col md:block leading-none">
                            <span>FEDERGREEN</span> <span className="text-brand-gold">CAPITAL</span>
                        </h1>
                    </div>
                    
                    {/* Desktop Menu */}
                    <div className="hidden lg:flex space-x-1 items-center">
                        {NAVIGATION.map((item) => (
                            <div 
                                key={item.label} 
                                className="relative px-3 py-2"
                                onMouseEnter={() => item.subItems && setActiveMega(item.label)}
                                onMouseLeave={() => setActiveMega(null)}
                            >
                                <button 
                                    className={`flex items-center space-x-1 font-semibold text-sm tracking-wide uppercase transition-all duration-300 ${
                                        activeMega === item.label || (currentPath.startsWith(item.path) && item.path !== '/') 
                                            ? 'text-brand-gold scale-105' 
                                            : 'text-slate-700 dark:text-slate-200 hover:text-brand-gold'
                                    }`}
                                    onClick={() => !item.subItems && handleNav(item.path)}
                                >
                                    <span>{item.label}</span>
                                    {item.subItems && <ChevronDown size={12} className={`transform transition-transform duration-300 ${activeMega === item.label ? 'rotate-180 text-brand-gold' : 'opacity-50'}`} />}
                                </button>
                                
                                {/* MEGA MENU DROPDOWN */}
                                {item.subItems && (
                                    <div 
                                        className={`absolute left-1/2 -translate-x-1/2 top-full mt-4 w-[650px] bg-white dark:bg-brand-900/95 backdrop-blur-2xl border border-slate-200 dark:border-brand-700 shadow-[0_20px_50px_rgba(0,0,0,0.3)] rounded-2xl overflow-hidden transition-all duration-300 origin-top transform ${
                                            activeMega === item.label ? 'opacity-100 scale-100 translate-y-0 visible' : 'opacity-0 scale-95 -translate-y-2 invisible'
                                        }`}
                                    >
                                        <div className="grid grid-cols-12 min-h-[320px]">
                                            {/* Decorative Sidebar in Mega Menu */}
                                            <div className="col-span-4 bg-slate-50 dark:bg-brand-950 p-8 flex flex-col justify-between relative overflow-hidden">
                                                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gold/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                                                <div className="relative z-10">
                                                    {item.icon ? <item.icon className="text-brand-gold mb-4" size={32} /> : <Globe className="text-brand-gold mb-4" size={32} />}
                                                    <h3 className="font-heading font-bold text-xl text-brand-gold mb-3">{item.label}</h3>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                                                        Access premium tools and resources designed for institutional-grade decision making.
                                                    </p>
                                                </div>
                                                <button 
                                                    onClick={() => handleNav(item.path)}
                                                    className="mt-6 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 text-slate-900 dark:text-white hover:text-brand-gold transition-colors group"
                                                >
                                                    View All <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                                                </button>
                                            </div>

                                            {/* Links Grid */}
                                            <div className="col-span-8 p-8 grid grid-cols-2 gap-x-8 gap-y-6 content-start">
                                                {item.subItems.map((sub) => (
                                                    <div key={sub.path} className="group/item">
                                                        <button
                                                            onClick={() => handleNav(sub.path)}
                                                            className="text-left font-bold text-sm text-slate-800 dark:text-slate-100 group-hover/item:text-brand-gold transition-colors block mb-1.5 flex items-center gap-2"
                                                        >
                                                            <span className="w-1.5 h-1.5 rounded-full bg-brand-gold/0 group-hover/item:bg-brand-gold transition-all duration-300"></span>
                                                            {sub.label}
                                                        </button>
                                                        {/* Render deep nested items as small list if any */}
                                                        {sub.subItems && (
                                                            <div className="pl-3.5 space-y-1.5 border-l border-brand-800/30">
                                                                {sub.subItems.slice(0, 3).map(deep => (
                                                                    <button 
                                                                        key={deep.path}
                                                                        onClick={(e) => { e.stopPropagation(); handleNav(deep.path); }}
                                                                        className="block text-[11px] text-slate-500 dark:text-slate-500 hover:text-brand-gold hover:underline transition-colors"
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
                        
                        <div className="h-8 w-px bg-slate-200 dark:bg-brand-800 mx-6"></div>

                        {/* Utility Buttons */}
                        <div className="flex items-center gap-2">
                            <button 
                                onClick={toggleTheme}
                                className="w-10 h-10 rounded-full flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-brand-800 hover:text-brand-gold transition-all"
                                aria-label="Toggle Theme"
                            >
                                {isDark ? <Sun size={18} /> : <Moon size={18} />}
                            </button>

                            <button 
                                onClick={onSearchClick}
                                className="w-10 h-10 rounded-full flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-brand-800 hover:text-brand-gold transition-all"
                                aria-label="Search"
                            >
                                <Search size={18} />
                            </button>

                            <button 
                                onClick={() => handleNav('/portal')}
                                className="ml-4 flex items-center gap-2 bg-slate-900 dark:bg-brand-800 hover:bg-brand-gold dark:hover:bg-brand-700 text-white border border-transparent dark:border-brand-600 px-6 py-2.5 rounded-full text-[11px] font-bold uppercase tracking-widest transition-all shadow-lg hover:shadow-brand-gold/30 hover:-translate-y-0.5"
                            >
                                <Lock size={12} className="text-brand-gold" />
                                Portal
                            </button>
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="lg:hidden flex items-center gap-4">
                        <button onClick={onSearchClick} className="text-slate-600 dark:text-white"><Search size={24} /></button>
                        <button onClick={() => setIsOpen(!isOpen)} className="text-slate-900 dark:text-white p-2">
                            {isOpen ? <X size={32} /> : <Menu size={32} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {isOpen && (
                <div className="lg:hidden fixed inset-0 top-24 bg-white dark:bg-brand-950 z-40 overflow-y-auto pb-32 animate-fade-in border-t border-brand-800">
                     <div className="px-4 py-8 space-y-6">
                        {NAVIGATION.map((item) => (
                            <div key={item.label} className="border-b border-slate-100 dark:border-brand-800 pb-4">
                                <button 
                                    className="w-full flex justify-between items-center py-2 text-xl font-bold text-slate-900 dark:text-white"
                                    onClick={() => !item.subItems && handleNav(item.path)}
                                >
                                    {item.label}
                                    {item.subItems && <ChevronDown size={20} className="text-brand-gold" />}
                                </button>
                                {item.subItems && (
                                    <div className="pl-4 mt-3 space-y-3 border-l-2 border-brand-gold/20">
                                        {item.subItems.map((sub) => (
                                            <button 
                                                key={sub.path} 
                                                onClick={() => handleNav(sub.path)}
                                                className="block w-full text-left py-1 text-base font-medium text-slate-600 dark:text-slate-400 active:text-brand-gold"
                                            >
                                                {sub.label}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                        <div className="flex gap-4 pt-6">
                             <button onClick={toggleTheme} className="flex-1 py-4 bg-slate-100 dark:bg-brand-900 rounded-xl flex items-center justify-center gap-2 text-slate-900 dark:text-white font-bold border border-transparent dark:border-brand-800">
                                {isDark ? <Sun size={20} /> : <Moon size={20} />} Theme
                             </button>
                             <button onClick={() => handleNav('/portal')} className="flex-[2] py-4 bg-brand-gold text-brand-900 font-bold rounded-xl shadow-lg">
                                Access Portal
                             </button>
                        </div>
                     </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
