
import React, { useState } from 'react';
import { 
    ChevronDown, Plus, LayoutDashboard, Settings, 
    Share2, FileDown, Layers, Terminal as TerminalIcon, X, Check
} from 'lucide-react';
import { FinancialScenario } from '../../types';
import ToolRenderer from './ToolRenderer';
import ScenarioDashboard from './ScenarioDashboard';

interface DataToolsLayoutProps {
    currentPath: string;
    onNavigate: (path: string) => void;
    scenario: FinancialScenario;
    allScenarios: FinancialScenario[];
    onUpdateScenario: (updates: Partial<FinancialScenario>) => void;
    onCreateScenario: () => void;
    onSelectScenario: (id: string) => void;
}

const DataToolsLayout: React.FC<DataToolsLayoutProps> = ({ 
    currentPath, onNavigate, scenario, allScenarios, onUpdateScenario, onCreateScenario, onSelectScenario 
}) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    
    const pathParts = currentPath.split('/').filter(Boolean);
    const categoryId = pathParts[1] || null;
    const toolId = pathParts[2] || null;
    const isMainDataHub = currentPath === '/data-tools';

    return (
        <div className="space-y-12 animate-fade-in">
            {/* Command Bar - Global Controls */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 bg-brand-950/80 backdrop-blur-3xl border border-brand-gold/20 rounded-[3rem] p-8 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.5)]">
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-3">
                        <TerminalIcon size={18} className="text-brand-gold animate-pulse" />
                        <span className="text-[10px] font-mono font-bold text-white/30 uppercase tracking-[0.4em] hidden sm:block">SYSTEM_SESSION:</span>
                    </div>
                    
                    {/* Scenario Selector Dropdown */}
                    <div className="relative">
                        <button 
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="group flex items-center gap-4 bg-brand-gold/5 border border-brand-gold/20 hover:border-brand-gold/40 px-5 py-2.5 rounded-2xl transition-all"
                        >
                            <div className="text-left">
                                <p className="text-[8px] font-mono font-bold text-brand-gold/50 uppercase tracking-widest leading-none mb-1">Active Scenario</p>
                                <p className="text-sm font-bold text-white uppercase tracking-tighter truncate max-w-[140px] md:max-w-[200px] leading-none">
                                    {scenario.name}
                                </p>
                            </div>
                            <ChevronDown size={16} className={`text-brand-gold transition-transform duration-300 ${isMenuOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {isMenuOpen && (
                            <>
                                <div className="fixed inset-0 z-[100]" onClick={() => setIsMenuOpen(false)}></div>
                                <div className="absolute left-0 top-full mt-4 w-80 bg-brand-950 border border-brand-gold/30 rounded-[2.5rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,1)] overflow-hidden animate-fade-in z-[110]">
                                    <div className="scanline-overlay opacity-10"></div>
                                    <div className="p-6 border-b border-brand-gold/10 flex justify-between items-center bg-brand-gold/5">
                                        <h4 className="text-[10px] font-mono font-bold text-brand-gold uppercase tracking-[0.3em]">Select Logic Node</h4>
                                        <button onClick={onCreateScenario} className="p-2 bg-brand-gold text-brand-950 rounded-xl hover:bg-white transition-all shadow-lg">
                                            <Plus size={14} />
                                        </button>
                                    </div>
                                    <div className="max-h-96 overflow-y-auto custom-scrollbar p-3 space-y-1">
                                        {allScenarios.map(s => (
                                            <button 
                                                key={s.id}
                                                onClick={() => { onSelectScenario(s.id); setIsMenuOpen(false); }}
                                                className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all text-left group ${
                                                    s.id === scenario.id 
                                                        ? 'bg-brand-gold/20 border border-brand-gold/30' 
                                                        : 'hover:bg-white/5 border border-transparent'
                                                }`}
                                            >
                                                <div>
                                                    <p className={`font-bold text-sm uppercase tracking-tighter ${s.id === scenario.id ? 'text-brand-gold' : 'text-white/70 group-hover:text-white'}`}>{s.name}</p>
                                                    <p className="text-[9px] text-white/30 font-mono mt-1 truncate max-w-[180px]">{s.propertyAddress}</p>
                                                </div>
                                                {s.id === scenario.id && <Check size={14} className="text-brand-gold" />}
                                            </button>
                                        ))}
                                    </div>
                                    <button 
                                        onClick={() => { onCreateScenario(); setIsMenuOpen(false); }}
                                        className="w-full p-6 text-center text-[10px] font-bold text-brand-gold uppercase tracking-[0.4em] hover:bg-brand-gold hover:text-brand-950 transition-all border-t border-brand-gold/10"
                                    >
                                        Initialize New Branch_
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button className="p-3 bg-brand-gold/5 border border-brand-gold/10 text-brand-gold rounded-2xl hover:bg-brand-gold hover:text-brand-950 transition-all group shadow-inner">
                        <Share2 size={16} />
                    </button>
                    <button className="p-3 bg-brand-gold/5 border border-brand-gold/10 text-brand-gold rounded-2xl hover:bg-brand-gold hover:text-brand-950 transition-all group shadow-inner">
                        <FileDown size={16} />
                    </button>
                    <button 
                        onClick={() => onNavigate('/data-tools')}
                        className="flex items-center gap-3 bg-brand-gold text-brand-950 font-extrabold px-6 py-2.5 rounded-2xl transition-all shadow-[0_0_30px_rgba(212,175,55,0.3)] hover:scale-105 active:scale-95"
                    >
                        <LayoutDashboard size={16} />
                        <span className="text-[10px] uppercase tracking-[0.2em]">Master Hub</span>
                    </button>
                </div>
            </div>

            {/* Layout Content */}
            {isMainDataHub ? (
                <div className="glass rounded-[4rem] p-12 shadow-2xl border border-brand-gold/10">
                    <ScenarioDashboard scenario={scenario} />
                </div>
            ) : (
                <ToolRenderer 
                    toolId={toolId || categoryId} // Pass specific toolId or the category id if no specific tool is selected
                    categoryId={categoryId}
                    scenario={scenario}
                    allScenarios={allScenarios}
                    onUpdateScenario={onUpdateScenario}
                    onNavigate={onNavigate}
                />
            )}
        </div>
    );
};

export default DataToolsLayout;
