
import React, { useState, useEffect, useRef } from 'react';
import { analyzeInvestmentStrategy } from '../services/geminiService';
import { 
    Loader2, Zap, ShieldCheck, FileText, CheckCircle, 
    AlertTriangle, Terminal as TerminalIcon, Cpu, Activity, 
    ShieldAlert, BarChart3, Search, Fingerprint, Globe, 
    Shield, Clock, Target, TrendingUp 
} from 'lucide-react';
import { PantherLogo } from './PantherLogo';

interface InvestmentAnalyzerProps {
    toolId?: string;
}

const LOG_PHRASES = [
    "INITIALIZING SOVEREIGN_CORE_V4...",
    "ESTABLISHING SECURE KERNEL UPLINK...",
    "SCANNING GLOBAL LIQUIDITY CORRIDORS...",
    "DEBATING MULTI-STAGE MOIC MULTIPLES...",
    "STRESS-TESTING YIELD ELASTICITY...",
    "CONSULTING SOVEREIGN BOND INDICES...",
    "AUDITING REGIONAL COMPLIANCE MATRICES...",
    "OPTIMIZING RISK-ADJUSTED ALPHA...",
    "CALCULATING TERMINAL VALUE EXIT NODES...",
    "FINALIZING STRATEGIC VERDICT..."
];

const InvestmentAnalyzer: React.FC<InvestmentAnalyzerProps> = ({ toolId }) => {
    const [thesis, setThesis] = useState('');
    const [assumptions, setAssumptions] = useState('');
    const [metrics, setMetrics] = useState('');
    const [analysis, setAnalysis] = useState('');
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [currentLog, setCurrentLog] = useState(0);
    
    // New Strategic Parameters
    const [targetIrr, setTargetIrr] = useState(18);
    const [riskTolerance, setRiskTolerance] = useState('Institutional');
    const [horizon, setHorizon] = useState(5);

    const logIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => {
        let timer: ReturnType<typeof setInterval>;
        if (loading) {
            setProgress(0);
            setCurrentLog(0);
            timer = setInterval(() => {
                setProgress(prev => {
                    if (prev >= 100) {
                        clearInterval(timer);
                        return 100;
                    }
                    return prev + 0.3;
                });
            }, 40);

            logIntervalRef.current = setInterval(() => {
                setCurrentLog(prev => (prev + 1) % LOG_PHRASES.length);
            }, 1000);
        } else {
            if (logIntervalRef.current) clearInterval(logIntervalRef.current);
        }
        return () => {
            clearInterval(timer);
            if (logIntervalRef.current) clearInterval(logIntervalRef.current);
        };
    }, [loading]);

    const handleAnalyze = async () => {
        if (!thesis) return;
        const fullStrategy = `
            Core Thesis: ${thesis}
            Strategic Parameters:
            - Target Net IRR: ${targetIrr}%
            - Risk Tolerance Profile: ${riskTolerance}
            - Investment Horizon: ${horizon} Years
            Key Assumptions: ${assumptions || 'Not provided'}
            Additional Target Metrics: ${metrics || 'Not provided'}
            Context: This is a ${toolId || 'general'} strategic audit.
        `;
        setLoading(true);
        setAnalysis('');
        const result = await analyzeInvestmentStrategy(fullStrategy);
        setAnalysis(result || "Analysis failed.");
        setLoading(false);
    };

    const renderAnalysis = (text: string) => {
        const sections: Record<string, string[]> = {
            "RISK ASSESSMENT": [],
            "CAPITAL EFFICIENCY": [],
            "MARKET ALIGNMENT": [],
            "VERDICT": []
        };
        let currentSection: keyof typeof sections | null = null;

        text.split('\n').forEach(line => {
            const upperLine = line.toUpperCase().replace(/[*:_:]/g, '').trim();
            if (upperLine in sections) {
                currentSection = upperLine as keyof typeof sections;
            } else if (currentSection) {
                sections[currentSection].push(line);
            }
        });

        const getSectionColor = (key: string) => {
            if (key.includes("RISK")) return "text-red-400 border-red-500/20 bg-red-500/5";
            if (key.includes("VERDICT")) return "text-emerald-400 border-emerald-500/20 bg-emerald-500/5";
            return "text-brand-gold border-brand-gold/20 bg-brand-gold/5";
        }

        const getSectionIcon = (key: string) => {
            if (key.includes("RISK")) return <ShieldAlert size={18} />;
            if (key.includes("VERDICT")) return <CheckCircle size={18} />;
            return <Activity size={18} />;
        }

        return (
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in">
                {Object.entries(sections).map(([title, content]) => (
                    content.length > 0 && (
                        <div key={title} className={`p-10 rounded-[3rem] border backdrop-blur-xl relative overflow-hidden group/item shadow-2xl transition-all hover:scale-[1.01] ${getSectionColor(title)}`}>
                            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover/item:opacity-100 transition-opacity"></div>
                            <div className="scanline-overlay opacity-5 pointer-events-none"></div>
                            <h4 className={`text-[11px] font-heading font-black uppercase tracking-[0.5em] mb-8 border-b border-current/10 pb-6 flex items-center justify-between`}>
                                <div className="flex items-center gap-4">
                                    {getSectionIcon(title)}
                                    {title}
                                </div>
                                <span className="font-mono opacity-40">UPLINK_STABLE</span>
                            </h4>
                            <div className="prose prose-invert prose-sm text-white/80 font-mono leading-relaxed whitespace-pre-wrap text-xs selection:bg-brand-gold selection:text-brand-950">
                                {content.join('\n').replace(/[*-]/g, '::')}
                            </div>
                        </div>
                    )
                ))}
            </div>
        );
    };

    return (
        <div className="bg-brand-950/40 backdrop-blur-xl p-2 md:p-14 rounded-[4.5rem] shadow-[0_100px_200px_-50px_rgba(0,0,0,0.7)] border border-brand-gold/20 my-16 relative overflow-hidden group">
            <div className="scanline-overlay opacity-5 pointer-events-none"></div>
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-brand-gold/5 rounded-full blur-[160px] pointer-events-none group-hover:bg-brand-gold/10 transition-all duration-1000"></div>
            
            <div className="relative z-10">
                <header className="flex flex-col md:flex-row items-center justify-between gap-12 mb-24 px-4 md:px-0">
                    <div className="flex items-center gap-10">
                        <div className="w-28 h-28 bg-brand-gold/10 rounded-[3rem] flex items-center justify-center shadow-[0_20px_50px_rgba(0,0,0,0.4)] border border-brand-gold/20 relative group-hover:scale-110 transition-all duration-700 overflow-hidden">
                            <div className="absolute inset-0 bg-brand-gold blur-2xl opacity-0 group-hover:opacity-30 transition-opacity"></div>
                            <PantherLogo className="h-16 w-auto brightness-0 invert relative z-10" />
                        </div>
                        <div>
                            <div className="flex items-center gap-4 mb-3">
                                <Globe size={14} className="text-brand-gold/60" />
                                <span className="text-[10px] font-bold text-brand-gold/60 uppercase tracking-[0.6em]">Sovereign Node</span>
                            </div>
                            <h3 className="text-5xl md:text-6xl font-heading font-black text-white tracking-tighter uppercase leading-none">Strategic Audit.</h3>
                            <div className="flex items-center gap-5 mt-6">
                                <span className="px-4 py-1.5 bg-brand-gold/10 text-brand-gold rounded-full text-[10px] font-mono font-extrabold uppercase tracking-widest border border-brand-gold/30 flex items-center gap-3">
                                    <Cpu size={12} /> Gemini 3.0 Pro Active
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-5">
                        <div className="px-8 py-5 bg-white/5 border border-white/10 rounded-3xl flex flex-col items-end shadow-inner">
                            <p className="text-[10px] font-mono font-bold text-white/20 uppercase tracking-widest">Logic Fidelity</p>
                            <p className="text-brand-terminal font-mono text-sm font-black mt-1 tracking-widest">99.82%_STABLE</p>
                        </div>
                    </div>
                </header>
                
                {!analysis && (
                    <div className="space-y-12 animate-fade-in max-w-6xl mx-auto">
                        
                        {/* New Structured Parameter Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                            <div className="bg-brand-950/60 border border-brand-gold/20 p-8 rounded-[2.5rem] space-y-4 shadow-xl">
                                <div className="flex items-center gap-3 text-brand-gold mb-2">
                                    <TrendingUp size={18} />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Target Net IRR</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <input 
                                        type="range" min="5" max="50" value={targetIrr} 
                                        onChange={(e) => setTargetIrr(parseInt(e.target.value))}
                                        className="flex-1 accent-brand-gold h-1 bg-white/10 rounded-full appearance-none cursor-pointer"
                                    />
                                    <span className="text-2xl font-heading font-black text-white w-16 text-right">{targetIrr}%</span>
                                </div>
                            </div>

                            <div className="bg-brand-950/60 border border-brand-gold/20 p-8 rounded-[2.5rem] space-y-4 shadow-xl">
                                <div className="flex items-center gap-3 text-brand-gold mb-2">
                                    <Shield size={18} />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Risk Profile</span>
                                </div>
                                <select 
                                    value={riskTolerance}
                                    onChange={(e) => setRiskTolerance(e.target.value)}
                                    className="w-full bg-transparent text-white font-heading font-bold text-lg focus:outline-none cursor-pointer"
                                >
                                    <option className="bg-brand-950">Conservative</option>
                                    <option className="bg-brand-950">Institutional</option>
                                    <option className="bg-brand-950">Venture/Growth</option>
                                    <option className="bg-brand-950">High-Leverage</option>
                                </select>
                            </div>

                            <div className="bg-brand-950/60 border border-brand-gold/20 p-8 rounded-[2.5rem] space-y-4 shadow-xl">
                                <div className="flex items-center gap-3 text-brand-gold mb-2">
                                    <Clock size={18} />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Capital Horizon</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <input 
                                        type="range" min="1" max="30" value={horizon} 
                                        onChange={(e) => setHorizon(parseInt(e.target.value))}
                                        className="flex-1 accent-brand-gold h-1 bg-white/10 rounded-full appearance-none cursor-pointer"
                                    />
                                    <span className="text-2xl font-heading font-black text-white w-16 text-right">{horizon}y</span>
                                </div>
                            </div>
                        </div>

                        <div className="relative group/field">
                            <div className="absolute -top-4 left-10 px-5 bg-brand-950/80 backdrop-blur-md text-[11px] font-heading font-black text-brand-gold uppercase tracking-[0.5em] z-20 transition-all group-focus-within/field:text-white flex items-center gap-3">
                                <TerminalIcon size={14} /> Primary Investment Thesis
                            </div>
                            <textarea
                                className="w-full p-12 rounded-[3.5rem] bg-brand-gold/5 border border-brand-gold/10 text-white placeholder-white/20 focus:ring-8 focus:ring-brand-gold/5 focus:border-brand-gold/50 outline-none h-56 transition-all text-xl font-medium leading-relaxed shadow-[inset_0_10px_30px_rgba(0,0,0,0.3)] custom-scrollbar"
                                placeholder="Describe the core capital logic, target sector, and geospacial scope..."
                                value={thesis}
                                onChange={(e) => setThesis(e.target.value)}
                            />
                            <div className="absolute bottom-8 right-10 text-brand-gold/20 group-focus-within/field:text-brand-gold/60 transition-colors">
                                <Fingerprint size={32} />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="relative group/field">
                                <label className="absolute -top-3 left-8 px-4 bg-brand-950/80 backdrop-blur-md text-[10px] font-heading font-extrabold text-slate-500 uppercase tracking-widest z-20">Assumptions Matrix</label>
                                <textarea
                                    className="w-full p-10 rounded-[3rem] bg-white/5 border border-white/10 text-white placeholder-white/10 focus:ring-8 focus:ring-brand-gold/5 focus:border-brand-gold/30 outline-none h-44 transition-all text-sm font-mono leading-relaxed shadow-inner"
                                    placeholder="Input baseline variables (e.g., Target LTV, Exit Cap)..."
                                    value={assumptions}
                                    onChange={(e) => setAssumptions(e.target.value)}
                                />
                            </div>
                            <div className="relative group/field">
                                <label className="absolute -top-3 left-8 px-4 bg-brand-950/80 backdrop-blur-md text-[10px] font-heading font-extrabold text-slate-500 uppercase tracking-widest z-20">Target Benchmarks</label>
                                <textarea
                                    className="w-full p-10 rounded-[3rem] bg-white/5 border border-white/10 text-white placeholder-white/10 focus:ring-8 focus:ring-brand-gold/5 focus:border-brand-gold/30 outline-none h-44 transition-all text-sm font-mono leading-relaxed shadow-inner"
                                    placeholder="Define desired alpha (e.g., 2.5x Multiplier)..."
                                    value={metrics}
                                    onChange={(e) => setMetrics(e.target.value)}
                                />
                            </div>
                        </div>
                        
                        <div className="pt-12 flex flex-col items-center">
                            <button
                                onClick={handleAnalyze}
                                disabled={loading || !thesis}
                                className="group/btn relative px-24 py-9 bg-brand-gold text-brand-950 font-heading font-black rounded-full transition-all hover:bg-white disabled:opacity-50 overflow-hidden shadow-[0_30px_70px_-15px_rgba(212,175,55,0.5)] hover:shadow-[0_0_80px_rgba(212,175,55,0.2)] active:scale-95 flex items-center gap-8"
                            >
                                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-700"></div>
                                <span className="relative z-10 text-base uppercase tracking-[0.6em]">{loading ? 'AUDIT_IN_PROGRESS...' : 'EXECUTE STRATEGIC AUDIT'}</span>
                                {loading ? <Loader2 size={28} className="animate-spin relative z-10" /> : <Zap size={28} className="relative z-10 group-hover/btn:rotate-12 transition-transform" />}
                            </button>
                            
                            {loading && (
                                <div className="w-full max-w-3xl mt-24 space-y-8 animate-fade-in relative">
                                    <div className="absolute inset-0 bg-brand-gold/5 blur-3xl opacity-20 animate-pulse"></div>
                                    <div className="flex justify-between items-center text-[11px] font-mono font-black text-brand-gold uppercase tracking-[0.5em] relative z-10">
                                        <div className="flex items-center gap-4">
                                            <div className="w-2.5 h-2.5 rounded-full bg-brand-gold animate-ping"></div>
                                            {LOG_PHRASES[currentLog]}
                                        </div>
                                        <span className="text-white">{progress.toFixed(0)}%_SYNCED</span>
                                    </div>
                                    <div className="w-full h-2.5 bg-white/5 rounded-full overflow-hidden border border-white/10 p-1 relative z-10">
                                        <div className="h-full bg-brand-gold shadow-[0_0_30px_rgba(212,175,55,0.8)] rounded-full transition-all duration-300 ease-out" style={{ width: `${progress}%` }}></div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {analysis && !loading && (
                    <div className="animate-fade-in space-y-16 max-w-6xl mx-auto">
                         <div className="flex flex-col md:flex-row justify-between items-end border-b border-white/5 pb-12 gap-10">
                            <div className="space-y-6">
                                <div className="flex items-center gap-4">
                                     <div className="w-2 h-2 rounded-full bg-brand-gold animate-pulse"></div>
                                     <p className="text-[12px] font-black text-brand-gold uppercase tracking-[0.6em]">Audit Master Log</p>
                                </div>
                                <h4 className="text-6xl md:text-7xl font-heading font-black text-white tracking-tighter uppercase leading-none">Diagnostic Result.</h4>
                                <p className="text-white/40 text-lg font-medium leading-relaxed max-w-xl">Deep-reasoning synthesis complete. Parameters aligned with {targetIrr}% Target IRR and {riskTolerance} Risk Profile.</p>
                            </div>
                            <button 
                                onClick={() => { setAnalysis(''); setThesis(''); }} 
                                className="px-10 py-5 bg-white/10 backdrop-blur-md border border-white/10 text-white font-heading font-black rounded-[2rem] hover:bg-brand-gold hover:text-brand-950 transition-all text-[11px] uppercase tracking-widest flex items-center gap-4 no-print shadow-xl group"
                            >
                                <Search size={20} className="group-hover:scale-110 transition-transform" /> New Strategic Scan
                            </button>
                        </div>
                        
                        <div className="relative">
                            <div className="scanline-overlay opacity-10 rounded-[4rem] pointer-events-none"></div>
                            {renderAnalysis(analysis)}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default InvestmentAnalyzer;
