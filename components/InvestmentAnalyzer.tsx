
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
    
    const ExplainabilityNode = () => (
        <div className="bg-brand-950/50 border border-brand-gold/10 p-10 rounded-[3rem] mt-8 animate-fade-in">
          <h4 className="text-[10px] font-bold text-brand-gold uppercase tracking-[0.3em] mb-6 border-b border-white/5 pb-4 flex items-center gap-3">
            <Cpu size={14} /> DECLASSIFIED_LOGIC_KERNEL
          </h4>
          <div className="space-y-6 text-xs font-mono text-white/50 leading-relaxed">
            <div>
              <h5 className="text-brand-gold/70 font-black tracking-widest uppercase mb-2">&gt; ASSUMPTIONS_MATRIX</h5>
              <p className="pl-4 border-l-2 border-brand-gold/20">Analysis was executed based on the provided strategic thesis and the following parameters: Target IRR of {targetIrr}%, {riskTolerance} risk profile, over a {horizon}-year horizon.</p>
            </div>
            <div>
              <h5 className="text-brand-gold/70 font-black tracking-widest uppercase mb-2">&gt; REASONING_MODEL</h5>
              <p className="pl-4 border-l-2 border-brand-gold/20">The AI core (Gemini 3.0 Pro) employs a multi-vector analysis, correlating the thesis against proprietary market data, risk indices, and historical capital performance benchmarks to synthesize a probable strategic outcome.</p>
            </div>
            <div>
              <h5 className="text-brand-gold/70 font-black tracking-widest uppercase mb-2">&gt; INTERPRETATION_GUIDANCE</h5>
              <p className="pl-4 border-l-2 border-brand-gold/20">This is a high-fidelity diagnostic, not a guarantee of future performance. The 'Verdict' section provides a top-line institutional recommendation. Use the 'Risk Assessment' to identify key strategic vulnerabilities requiring mitigation.</p>
            </div>
          </div>
        </div>
    );

    const renderAnalysis = (text: string) => {
        const sections: Record<string, string[]> = {
            "RISK ASSESSMENT": [], "CAPITAL EFFICIENCY": [], "MARKET ALIGNMENT": [], "VERDICT": []
        };
        let currentSection: keyof typeof sections | null = null;
        text.split('\n').forEach(line => {
            const upperLine = line.toUpperCase().replace(/[*:_:]/g, '').trim();
            if (upperLine in sections) currentSection = upperLine as keyof typeof sections;
            else if (currentSection) sections[currentSection].push(line);
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
             <div className="space-y-8 animate-fade-in">
                {Object.entries(sections).map(([title, content]) => ( content.length > 0 && (
                    <div key={title} className={`p-10 rounded-[3rem] border backdrop-blur-xl relative overflow-hidden group/item shadow-2xl ${getSectionColor(title)}`}>
                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover/item:opacity-100 transition-opacity"></div>
                        <h4 className="text-[11px] font-heading font-black uppercase tracking-[0.5em] mb-8 border-b border-current/10 pb-6 flex items-center gap-4">{getSectionIcon(title)} {title}</h4>
                        <div className="prose prose-invert prose-sm text-white/80 font-mono leading-relaxed whitespace-pre-wrap text-xs selection:bg-brand-gold selection:text-brand-950">
                            {content.join('\n').replace(/[*-]/g, '::')}
                        </div>
                    </div>
                )))}
                <ExplainabilityNode />
            </div>
        );
    };

    return (
        <div className="space-y-12">
            <header className="flex flex-col md:flex-row justify-between items-start gap-12">
                <div className="flex items-center gap-6">
                    <div className="w-20 h-20 bg-brand-gold/10 rounded-[2.5rem] flex items-center justify-center shadow-lg border border-brand-gold/20">
                        <PantherLogo className="h-12 w-auto brightness-0 invert"/>
                    </div>
                    <div>
                        <span className="text-[10px] font-bold text-brand-gold uppercase tracking-[0.5em]">Sovereign Node</span>
                        <h3 className="text-4xl font-heading font-black text-white tracking-tighter uppercase leading-none mt-2">Strategic Audit.</h3>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* --- LEFT: INPUTS --- */}
                <div className="lg:col-span-5 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-brand-950/60 border border-brand-gold/20 p-6 rounded-3xl space-y-2">
                            <div className="flex items-center gap-2 text-brand-gold text-[9px] font-black uppercase tracking-widest"><TrendingUp size={12} /> Target IRR</div>
                            <input type="range" min="5" max="50" value={targetIrr} onChange={(e) => setTargetIrr(parseInt(e.target.value))} className="w-full accent-brand-gold h-1 bg-white/10 rounded-full appearance-none cursor-pointer"/>
                            <span className="text-lg font-heading font-black text-white text-center block">{targetIrr}%</span>
                        </div>
                        <div className="bg-brand-950/60 border border-brand-gold/20 p-6 rounded-3xl space-y-2">
                            <div className="flex items-center gap-2 text-brand-gold text-[9px] font-black uppercase tracking-widest"><Shield size={12} /> Risk Profile</div>
                            <select value={riskTolerance} onChange={(e) => setRiskTolerance(e.target.value)} className="w-full bg-transparent text-white font-heading font-bold text-base focus:outline-none cursor-pointer">
                                <option className="bg-brand-950">Institutional</option><option className="bg-brand-950">Venture/Growth</option>
                            </select>
                        </div>
                        <div className="bg-brand-950/60 border border-brand-gold/20 p-6 rounded-3xl space-y-2">
                            <div className="flex items-center gap-2 text-brand-gold text-[9px] font-black uppercase tracking-widest"><Clock size={12} /> Horizon</div>
                            <input type="range" min="1" max="30" value={horizon} onChange={(e) => setHorizon(parseInt(e.target.value))} className="w-full accent-brand-gold h-1 bg-white/10 rounded-full appearance-none cursor-pointer"/>
                            <span className="text-lg font-heading font-black text-white text-center block">{horizon} years</span>
                        </div>
                    </div>

                    <textarea
                        className="w-full p-8 rounded-[2.5rem] bg-brand-gold/5 border border-brand-gold/10 text-white placeholder-white/20 focus:ring-4 focus:ring-brand-gold/5 focus:border-brand-gold/50 outline-none h-48 transition-all text-base font-medium leading-relaxed shadow-inner"
                        placeholder="Primary Investment Thesis..."
                        value={thesis}
                        onChange={(e) => setThesis(e.target.value)}
                    />
                    <textarea
                        className="w-full p-8 rounded-[2.5rem] bg-white/5 border border-white/10 text-white placeholder-white/10 focus:ring-4 focus:ring-brand-gold/5 focus:border-brand-gold/30 outline-none h-32 transition-all text-sm font-mono leading-relaxed shadow-inner"
                        placeholder="Key Assumptions Matrix..."
                        value={assumptions}
                        onChange={(e) => setAssumptions(e.target.value)}
                    />
                     <button
                        onClick={handleAnalyze}
                        disabled={loading || !thesis}
                        className="group/btn relative w-full px-12 py-7 bg-brand-gold text-brand-950 font-heading font-black rounded-full transition-all hover:bg-white disabled:opacity-50 overflow-hidden shadow-[0_20px_50px_-10px_rgba(212,175,55,0.4)] hover:shadow-brand-gold/20 active:scale-95 flex items-center justify-center gap-6"
                    >
                        <span className="relative z-10 text-xs uppercase tracking-[0.4em]">{loading ? 'AUDIT IN PROGRESS...' : 'EXECUTE AUDIT'}</span>
                        {loading ? <Loader2 size={22} className="animate-spin relative z-10" /> : <Zap size={22} className="relative z-10 group-hover/btn:rotate-6 transition-transform" />}
                    </button>
                </div>

                {/* --- RIGHT: RESULTS --- */}
                <div className="lg:col-span-7">
                    {loading && (
                        <div className="w-full h-full flex flex-col justify-center items-center bg-brand-950/30 border border-brand-gold/10 rounded-[3rem] p-12 space-y-8 animate-fade-in">
                            <div className="w-full max-w-lg space-y-4">
                                <div className="flex justify-between items-center text-[10px] font-mono font-black text-brand-gold uppercase tracking-[0.4em]">
                                    <div className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-brand-gold animate-ping"></div>{LOG_PHRASES[currentLog]}</div>
                                    <span>{progress.toFixed(0)}%</span>
                                </div>
                                <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden border border-white/10 p-0.5"><div className="h-full bg-brand-gold shadow-[0_0_20px_#d4af37] rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div></div>
                            </div>
                        </div>
                    )}
                    {!loading && !analysis && (
                        <div className="w-full h-full flex flex-col justify-center items-center text-center bg-brand-950/30 border-2 border-dashed border-brand-gold/10 rounded-[3rem] p-12 text-brand-gold/20">
                            <Fingerprint size={80} className="mb-6 opacity-30"/>
                            <p className="font-mono font-black uppercase tracking-[0.4em] text-xs">AWAITING_STRATEGIC_INPUT</p>
                            <p className="text-[10px] mt-2 text-white/20 uppercase tracking-widest">Output will render in this node.</p>
                        </div>
                    )}
                    {!loading && analysis && renderAnalysis(analysis)}
                </div>
            </div>
        </div>
    );
};

export default InvestmentAnalyzer;
