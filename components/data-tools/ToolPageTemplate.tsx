
import React from 'react';
import { FinancialScenario } from '../../types';
import ToolRenderer from './ToolRenderer';
import DataToolsSidebar from './DataToolsSidebar';
import { 
    ChevronRight, Home, Database, FileText, 
    Calculator, Download, Printer, Copy, Info, Zap
} from 'lucide-react';

interface ToolPageTemplateProps {
    currentPath: string;
    onNavigate: (path: string) => void;
    scenario: FinancialScenario;
    allScenarios: FinancialScenario[];
    onUpdateScenario: (updates: Partial<FinancialScenario>) => void;
}

const ToolPageTemplate: React.FC<ToolPageTemplateProps> = ({ 
    currentPath, onNavigate, scenario, allScenarios, onUpdateScenario 
}) => {
    const pathParts = currentPath.split('/').filter(Boolean);
    const categoryId = pathParts[1] || 'General';
    const toolId = pathParts[2] || null;

    return (
        <div className="animate-fade-in space-y-12 pb-32">
            {/* Breadcrumbs - Left Aligned */}
            <nav className="flex flex-wrap items-center gap-3 md:gap-4 text-[9px] md:text-[10px] font-bold uppercase tracking-[0.4em] text-white/20 mb-8 no-print">
                <button onClick={() => onNavigate('/')} className="hover:text-brand-gold flex items-center gap-2 transition-colors">
                    <Home size={12}/> HOME
                </button>
                <ChevronRight size={10} className="opacity-30" />
                <button onClick={() => onNavigate('/data-tools')} className="hover:text-brand-gold flex items-center gap-2 transition-colors">
                    <Database size={12}/> DATA TOOLS
                </button>
                <ChevronRight size={10} className="opacity-30" />
                <span className="text-brand-gold tracking-[0.5em]">{categoryId.replace(/-/g, ' ')}</span>
                {toolId && (
                    <>
                        <ChevronRight size={10} className="opacity-30" />
                        <span className="text-white whitespace-nowrap">{toolId.replace(/-/g, ' ')}</span>
                    </>
                )}
            </nav>

            <div className="flex flex-col lg:flex-row gap-8 xl:gap-12 items-start">
                {/* Sidebar */}
                <DataToolsSidebar currentPath={currentPath} onNavigate={onNavigate} />

                {/* Main Action Content Area */}
                <div className="flex-1 w-full space-y-12 min-w-0">
                    <div className="glass rounded-[2rem] md:rounded-[4rem] p-6 md:p-12 xl:p-16 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.8)] border border-brand-gold/10 relative overflow-hidden">
                        <div className="scanline-overlay opacity-5"></div>
                        <ToolRenderer 
                            toolId={toolId || categoryId}
                            categoryId={categoryId}
                            scenario={scenario}
                            allScenarios={allScenarios}
                            onUpdateScenario={onUpdateScenario}
                            onNavigate={onNavigate}
                        />
                    </div>

                    {/* Institutional Logic Footer */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 pt-16 border-t border-brand-800/50">
                        <div className="lg:col-span-4">
                            <div className="flex items-center gap-4 text-brand-gold font-bold uppercase tracking-[0.4em] text-[10px] mb-6">
                                <Info size={16} /> Strategic Context
                            </div>
                            <p className="text-white/40 leading-relaxed text-sm font-medium">
                                This analytical model evaluates asset velocity and risk exposure. Results are benchmarked against current 10-year sovereign yields and regional inflation targets.
                            </p>
                        </div>

                        <div className="lg:col-span-4">
                            <div className="flex items-center gap-4 text-brand-gold font-bold uppercase tracking-[0.4em] text-[10px] mb-6">
                                <Calculator size={16} /> Core Logic
                            </div>
                            <div className="p-6 bg-brand-950/50 border border-brand-gold/10 rounded-2xl md:rounded-3xl">
                                <details className="group">
                                    <summary className="flex justify-between items-center cursor-pointer list-none text-[9px] font-bold text-white/60 uppercase tracking-[0.3em] group-hover:text-white transition-colors">
                                        Formulas & Weights
                                        <ChevronRight size={14} className="text-brand-gold group-open:rotate-90 transition-transform" />
                                    </summary>
                                    <div className="mt-4 pt-4 border-t border-brand-gold/10 text-[10px] font-mono text-brand-gold/40 space-y-3 leading-relaxed">
                                        <p>• ROI_NET = (Terminal_V - Basis + ΣCashFlow) / Basis</p>
                                        <p>• DSCR_MIN = 1.25x (Sector Adjusted)</p>
                                        <p>• WACC: 360-day standard discount.</p>
                                    </div>
                                </details>
                            </div>
                        </div>

                        <div className="lg:col-span-4 flex flex-col justify-end gap-3 no-print">
                            <div className="flex flex-wrap sm:flex-nowrap gap-3">
                                <button className="flex-1 min-w-[120px] flex items-center justify-center gap-3 py-4 md:py-5 bg-white/5 border border-brand-gold/20 text-brand-gold rounded-2xl hover:bg-brand-gold hover:text-brand-950 transition-all text-[10px] font-extrabold uppercase tracking-widest">
                                    <Printer size={14} /> EXPORT PDF
                                </button>
                                <button className="flex-1 min-w-[120px] flex items-center justify-center gap-3 py-4 md:py-5 bg-white/5 border border-brand-gold/20 text-brand-gold rounded-2xl hover:bg-brand-gold hover:text-brand-950 transition-all text-[10px] font-extrabold uppercase tracking-widest">
                                    <Download size={14} /> EXPORT CSV
                                </button>
                            </div>
                            <button className="w-full flex items-center justify-center gap-3 py-4 md:py-5 bg-brand-gold/10 border border-brand-gold/40 text-white rounded-2xl hover:bg-brand-gold hover:text-brand-950 transition-all text-[10px] font-extrabold uppercase tracking-widest shadow-lg">
                                <Copy size={14} /> COPY ANALYTIC SNAPSHOT
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ToolPageTemplate;
