
import React, { useState, useEffect } from 'react';
import { analyzeBusinessModel } from '../../services/geminiService';
import { Input, TextArea } from '../ui/FormElements';
// FIX: Added missing Printer import
import { BrainCircuit, Loader2, Target, Shield, Users, ArrowRight, Zap, TrendingUp, Info, BarChart3, Maximize, Activity, Layout, Database, Globe, Fingerprint, Cpu, Search, Printer, Maximize2 } from 'lucide-react';
import { PantherLogo } from '../PantherLogo';

const PRESETS = [
    { name: 'Luxury Auto GCC', biz: 'Ultra-Luxury Automotive', loc: 'UAE & GCC Region' },
    { name: 'Green Tech EU', biz: 'Green Hydrogen Infrastructure', loc: 'European Union' },
    { name: 'Sovereign AI APAC', biz: 'Sovereign AI Cloud Infrastructure', loc: 'APAC' }
];

const BusinessIntelligence: React.FC = () => {
    const [bizType, setBizType] = useState('');
    const [location, setLocation] = useState('');
    const [mode, setMode] = useState<'market_size' | 'moat' | 'competitors'>('market_size');
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        let interval: any;
        if (loading) {
            setProgress(0);
            interval = setInterval(() => {
                setProgress(p => p < 95 ? p + Math.random() * 5 : p);
            }, 100);
        }
        return () => clearInterval(interval);
    }, [loading]);

    const handleRun = async () => {
        if (!bizType || !location) return;
        setLoading(true);
        setResult(null);
        try {
            const jsonStr = await analyzeBusinessModel(bizType, location, mode);
            if (jsonStr) {
                const cleanJson = jsonStr.replace(/```json/g, '').replace(/```/g, '').trim();
                setResult(JSON.parse(cleanJson));
            }
        } catch (e) {
            console.error("Parse Error", e);
        }
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
              <p className="pl-4 border-l-2 border-brand-gold/20">Analysis executed for an asset class of <span className="text-white">"{bizType}"</span> within the geospacial scope of <span className="text-white">"{location}"</span>.</p>
            </div>
            <div>
              <h5 className="text-brand-gold/70 font-black tracking-widest uppercase mb-2">&gt; REASONING_MODEL</h5>
              <p className="pl-4 border-l-2 border-brand-gold/20">The AI core (Gemini 3.0 Pro) correlates the target asset profile against sovereign trade data, demographic indices, and private capital benchmarks to generate the requested intelligence module ({mode.replace('_', ' ').toUpperCase()}).</p>
            </div>
            <div>
              <h5 className="text-brand-gold/70 font-black tracking-widest uppercase mb-2">&gt; INTERPRETATION_GUIDANCE</h5>
              <p className="pl-4 border-l-2 border-brand-gold/20">Market sizing figures are institutional estimates. Moat scores are relative strengths. Competitor analysis identifies primary capital rivals. This data is for strategic evaluation, not a substitute for granular due diligence.</p>
            </div>
          </div>
        </div>
    );
    
    const MarketSizeViz = ({ data }: { data: any }) => (
         <div className="flex flex-col gap-12 items-center animate-fade-in">
            <div className="relative w-full max-w-sm mx-auto aspect-square group">
                <svg viewBox="0 0 100 100" className="relative z-10 drop-shadow-[0_0_40px_rgba(212,175,55,0.3)]">
                    <circle cx="50" cy="50" r="40" fill="rgba(212,175,55,0.02)" stroke="#d4af37" strokeWidth="0.1" opacity="0.4" />
                    <circle cx="50" cy="50" r="30" fill="rgba(212,175,55,0.04)" stroke="#d4af37" strokeWidth="0.4" opacity="0.6" />
                    <circle cx="50" cy="50" r="20" fill="rgba(212,175,55,0.12)" stroke="#d4af37" strokeWidth="0.8" />
                    <text x="50" y="48" textAnchor="middle" className="fill-brand-gold font-mono text-[3px] font-black uppercase tracking-[0.4em]">Target SOM</text>
                    <text x="50" y="56" textAnchor="middle" className="fill-white font-heading font-black text-[10px] tracking-tighter">{data.som?.split(' ')[0]}</text>
                </svg>
            </div>
            <div className="space-y-6 w-full">
                {[
                    { label: 'TAM', val: data.tam, logic: data.tam_logic, sub: 'Total Addressable' },
                    { label: 'SAM', val: data.sam, logic: data.sam_logic, sub: 'Serviceable Market' },
                    { label: 'SOM', val: data.som, logic: data.som_logic, sub: 'Obtainable Share' }
                ].map((item, i) => (
                    <div key={i} className={`p-6 bg-brand-950 rounded-3xl border border-white/5 shadow-lg`}>
                        <div className="flex justify-between items-center mb-4">
                            <div>
                                <h4 className="text-[10px] uppercase font-black text-white/40 tracking-[0.4em]">{item.label}</h4>
                                <p className="text-[8px] text-white/20 uppercase font-bold tracking-widest mt-1">{item.sub}</p>
                            </div>
                            <p className="text-3xl font-heading font-black text-brand-gold tracking-tighter">{item.val}</p>
                        </div>
                    </div>
                ))}
            </div>
            <ExplainabilityNode />
        </div>
    );
    
    const MoatViz = ({ data }: { data: any }) => {
        const labels = Object.keys(data);
        const scores = Object.values(data).map((v: any) => v.score || 0);
        const points = scores.map((score, i) => {
            const angle = (i / labels.length) * 2 * Math.PI - Math.PI / 2;
            const x = 50 + (score * 4) * Math.cos(angle);
            const y = 50 + (score * 4) * Math.sin(angle);
            return `${x},${y}`;
        }).join(' ');

        return (
            <div className="flex flex-col gap-12 items-center animate-fade-in">
                 <div className="relative w-full max-w-sm mx-auto aspect-square">
                    <svg viewBox="0 0 100 100" className="relative z-10 drop-shadow-[0_0_30px_rgba(212,175,55,0.2)]">
                        {[1, 2, 3, 4].map(i => <circle key={i} cx="50" cy="50" r={i * 10} fill="none" stroke="#ffffff" opacity="0.05" />)}
                        {labels.map((_, i) => {
                            const angle = (i / labels.length) * 2 * Math.PI - Math.PI / 2;
                            return <line key={i} x1="50" y1="50" x2={50 + 40 * Math.cos(angle)} y2={50 + 40 * Math.sin(angle)} stroke="#ffffff" opacity="0.1" />;
                        })}
                        <polygon points={points} fill="rgba(212, 175, 55, 0.3)" stroke="#d4af37" strokeWidth="0.5" />
                        {labels.map((label, i) => {
                            const angle = (i / labels.length) * 2 * Math.PI - Math.PI / 2;
                            return <text key={i} x={50 + 48 * Math.cos(angle)} y={50 + 48 * Math.sin(angle)} textAnchor="middle" dy=".3em" className="fill-brand-gold/40 text-[4px] font-black uppercase tracking-tighter">{label.replace(/_/g, ' ')}</text>;
                        })}
                    </svg>
                 </div>
                 <div className="grid grid-cols-1 gap-6 w-full">
                     {Object.entries(data).map(([key, val]: any) => (
                         <div key={key} className="bg-brand-950 p-6 rounded-3xl border border-white/5">
                             <div className="flex justify-between items-center mb-4">
                                 <h5 className="text-white font-black text-sm uppercase tracking-[0.2em]">{key.replace(/_/g, ' ')}</h5>
                                 <div className="px-4 py-1.5 bg-brand-gold/10 text-brand-gold font-mono text-lg font-black rounded-lg border border-brand-gold/20">{val.score}</div>
                             </div>
                             <div className="h-1.5 w-full bg-white/5 rounded-full"><div className="h-full bg-brand-gold" style={{ width: `${val.score * 10}%` }}></div></div>
                         </div>
                     ))}
                 </div>
                 <ExplainabilityNode />
            </div>
        );
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            {/* --- LEFT: INPUTS --- */}
            <div className="lg:col-span-5 space-y-8">
                <header className="flex items-center gap-6">
                    <div className="w-20 h-20 bg-brand-gold/10 rounded-[2.5rem] flex items-center justify-center border border-brand-gold/20 shadow-lg">
                        <PantherLogo className="h-12 w-auto brightness-0 invert" />
                    </div>
                    <div>
                        <span className="text-[10px] font-bold text-brand-gold uppercase tracking-[0.5em]">Global Intelligence</span>
                        <h3 className="text-4xl font-heading font-black text-white tracking-tighter uppercase leading-none mt-2">Venture Validator.</h3>
                    </div>
                </header>
                
                <div className="space-y-4">
                    <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] ml-4">Strategic Presets</p>
                    <div className="flex flex-wrap gap-3">
                        {PRESETS.map(p => (
                            <button key={p.name} onClick={() => { setBizType(p.biz); setLocation(p.loc); handleRun(); }}
                                className="px-5 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black text-white/50 hover:text-brand-gold hover:border-brand-gold/50 hover:bg-brand-gold/5 transition-all uppercase tracking-widest flex items-center gap-3">
                                <Database size={12} /> {p.name}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="relative group/field">
                    <label className="absolute -top-2.5 left-6 px-3 bg-brand-900 text-[9px] font-black text-slate-500 uppercase tracking-[0.4em] z-20">Asset Industry</label>
                    <input type="text" value={bizType} onChange={e => setBizType(e.target.value)} placeholder="e.g., Quantum Computing Infrastructure"
                        className="w-full bg-brand-900 border-2 border-brand-gold/10 rounded-3xl py-6 px-8 text-lg text-white placeholder:text-white/10 focus:border-brand-gold transition-all outline-none font-medium shadow-inner"/>
                </div>
                <div className="relative group/field">
                    <label className="absolute -top-2.5 left-6 px-3 bg-brand-900 text-[9px] font-black text-slate-500 uppercase tracking-[0.4em] z-20">Geospacial Scope</label>
                    <input type="text" value={location} onChange={e => setLocation(e.target.value)} placeholder="e.g., GCC Region & SE Asia"
                        className="w-full bg-brand-900 border-2 border-brand-gold/10 rounded-3xl py-6 px-8 text-lg text-white placeholder:text-white/10 focus:border-brand-gold transition-all outline-none font-medium shadow-inner"/>
                </div>

                <div className="flex bg-brand-950 rounded-3xl p-2 border border-brand-gold/30 shadow-xl">
                    {[
                        { id: 'market_size', icon: Maximize2, label: 'Market Size' },
                        { id: 'moat', icon: Shield, label: 'Strategic Moat' },
                        { id: 'competitors', icon: Users, label: 'Rival Landscape' }
                    ].map(m => (
                        <button key={m.id} onClick={() => setMode(m.id as any)}
                            className={`flex-1 flex flex-col items-center justify-center gap-2 py-3 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all ${
                                mode === m.id ? 'bg-brand-gold text-brand-950 shadow-lg' : 'text-white/30 hover:text-white hover:bg-white/5'
                            }`}>
                            <m.icon size={16} /> {m.label}
                        </button>
                    ))}
                </div>

                <button onClick={handleRun} disabled={loading || !bizType}
                    className="w-full bg-brand-gold text-brand-950 font-heading font-black py-7 rounded-3xl hover:bg-white transition-all shadow-[0_20px_60px_-15px_rgba(212,175,55,0.5)] flex items-center justify-center gap-6 uppercase tracking-[0.5em] text-sm disabled:opacity-50">
                    {loading ? <Loader2 className="animate-spin" size={24} /> : <> <Zap size={20}/> Initialize Validation</>}
                </button>
            </div>

            {/* --- RIGHT: RESULTS --- */}
            <div className="lg:col-span-7">
                <div className="bg-brand-900/50 border border-brand-gold/10 rounded-[4rem] p-12 min-h-[600px] shadow-2xl">
                    {loading && (
                        <div className="w-full h-full flex flex-col justify-center items-center space-y-6 animate-fade-in">
                             <div className="w-full max-w-lg space-y-4">
                                <div className="flex justify-between items-end text-[10px] font-mono font-bold text-brand-gold uppercase tracking-[0.4em]">
                                    <div className="flex items-center gap-3"><Loader2 className="animate-spin" size={12}/> SYNCHRONIZING NODES...</div>
                                    <span>{progress.toFixed(0)}%</span>
                                </div>
                                <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden border border-white/10"><div className="h-full bg-brand-gold" style={{ width: `${progress}%` }}></div></div>
                            </div>
                        </div>
                    )}
                    {!loading && !result && (
                         <div className="w-full h-full flex flex-col justify-center items-center text-center text-brand-gold/10">
                            <Cpu size={80} className="mb-6"/>
                            <p className="font-mono font-black uppercase tracking-[0.4em] text-xs">AI CORE STANDBY</p>
                        </div>
                    )}
                    {!loading && result && (
                        <>
                            {mode === 'market_size' && <MarketSizeViz data={result} />}
                            {mode === 'moat' && <MoatViz data={result} />}
                            {mode === 'competitors' && Array.isArray(result) && (
                                <div className="space-y-6 animate-fade-in">
                                    {result.map((comp: any, i: number) => (
                                        <div key={i} className="bg-brand-950 p-8 rounded-3xl border border-white/5 group">
                                            <div className="flex justify-between items-start mb-4">
                                                <h5 className="text-white font-heading font-black text-xl tracking-tighter uppercase">{comp.name}</h5>
                                                <div className="text-red-500 font-mono text-3xl font-black">{(comp.threat_level || 7).toFixed(1)}</div>
                                            </div>
                                            <p className="text-sm text-white/50 leading-relaxed italic">"{comp.description}"</p>
                                        </div>
                                    ))}
                                     <ExplainabilityNode />
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BusinessIntelligence;
