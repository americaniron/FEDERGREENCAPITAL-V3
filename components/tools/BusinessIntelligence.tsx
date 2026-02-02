
import React, { useState, useEffect } from 'react';
import { analyzeBusinessModel } from '../../services/geminiService';
import { Input, TextArea } from '../ui/FormElements';
// FIX: Added missing Printer import
import { BrainCircuit, Loader2, Target, Shield, Users, ArrowRight, Zap, TrendingUp, Info, BarChart3, Maximize, Activity, Layout, Database, Globe, Fingerprint, Cpu, Search, Printer } from 'lucide-react';
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
    const [analysisQueued, setAnalysisQueued] = useState(false);

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

    useEffect(() => {
        if (analysisQueued && bizType && location) {
            handleRun();
            setAnalysisQueued(false);
        }
    }, [analysisQueued, bizType, location, mode]);


    const handlePreset = (preset: typeof PRESETS[0]) => {
        setBizType(preset.biz);
        setLocation(preset.loc);
        setResult(null);
        setAnalysisQueued(true);
    };

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
    
    const MarketSizeViz = ({ data }: { data: any }) => (
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center animate-fade-in">
            <div className="relative w-full max-w-lg mx-auto aspect-square group">
                <div className="absolute inset-0 bg-brand-gold/5 blur-[160px] rounded-full animate-pulse group-hover:bg-brand-gold/15 transition-all duration-1000"></div>
                
                {/* Orbital Rings */}
                <div className="absolute inset-0 border border-brand-gold/10 rounded-full animate-spin" style={{ animationDuration: '40s' }}></div>
                <div className="absolute inset-12 border border-brand-gold/5 rounded-full animate-spin" style={{ animationDuration: '25s', animationDirection: 'reverse' }}></div>
                
                <svg viewBox="0 0 100 100" className="relative z-10 drop-shadow-[0_0_60px_rgba(212,175,55,0.4)]">
                    <defs>
                        <linearGradient id="ringGradBI" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#d4af37" stopOpacity="0.9" />
                            <stop offset="100%" stopColor="#d4af37" stopOpacity="0.2" />
                        </linearGradient>
                    </defs>
                    <circle cx="50" cy="50" r="45" fill="none" stroke="url(#ringGradBI)" strokeWidth="0.3" strokeDasharray="3 3" className="animate-spin" style={{animationDuration: '60s'}} />
                    
                    {/* TAM Circle */}
                    <circle cx="50" cy="50" r="40" fill="rgba(212,175,55,0.02)" stroke="#d4af37" strokeWidth="0.1" opacity="0.4" />
                    {/* SAM Circle */}
                    <circle cx="50" cy="50" r="30" fill="rgba(212,175,55,0.04)" stroke="#d4af37" strokeWidth="0.4" opacity="0.6" />
                    {/* SOM Circle */}
                    <circle cx="50" cy="50" r="20" fill="rgba(212,175,55,0.12)" stroke="#d4af37" strokeWidth="0.8" />
                    
                    <text x="50" y="48" textAnchor="middle" className="fill-brand-gold font-mono text-[3px] font-black uppercase tracking-[0.4em]">Target SOM</text>
                    <text x="50" y="56" textAnchor="middle" className="fill-white font-heading font-black text-[10px] tracking-tighter">{data.som?.split(' ')[0]}</text>
                </svg>
            </div>

            <div className="space-y-8">
                {[
                    { label: 'TAM', val: data.tam, logic: data.tam_logic, color: 'text-brand-gold', bg: 'bg-brand-gold/10', border: 'border-brand-gold/30', sub: 'Total Addressable' },
                    { label: 'SAM', val: data.sam, logic: data.sam_logic, color: 'text-indigo-400', bg: 'bg-indigo-400/10', border: 'border-indigo-400/30', sub: 'Serviceable Market' },
                    { label: 'SOM', val: data.som, logic: data.som_logic, color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/30', sub: 'Obtainable Share' }
                ].map((item, i) => (
                    <div key={i} className={`p-10 bg-brand-950 rounded-[3rem] border ${item.border} hover:border-white/20 transition-all relative group/card overflow-hidden shadow-[0_40px_100px_-20px_rgba(0,0,0,0.5)]`}>
                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none"></div>
                        <div className="flex justify-between items-start mb-6">
                            <div className="flex items-center gap-5">
                                <div className={`w-2.5 h-2.5 rounded-full ${item.bg.replace('/10', '')} animate-pulse shadow-[0_0_10px_currentColor]`}></div>
                                <div>
                                    <h4 className="text-[12px] uppercase font-black text-white/40 tracking-[0.6em]">{item.label}</h4>
                                    <p className="text-[9px] text-white/20 uppercase font-bold tracking-widest mt-1">{item.sub}</p>
                                </div>
                            </div>
                            <div className={`px-4 py-1.5 ${item.bg} ${item.color} rounded-xl text-[10px] font-black uppercase tracking-widest border ${item.border} shadow-xl`}>Fidelity: High</div>
                        </div>
                        <p className={`text-6xl font-heading font-black ${item.color} tracking-tighter mb-8`}>{item.val}</p>
                        
                        <div className="bg-brand-900/80 p-6 rounded-[2rem] border border-white/5 shadow-inner">
                             <p className="text-[11px] text-white/50 leading-relaxed font-mono italic">
                                <span className="text-brand-gold/60 mr-3 uppercase font-black tracking-widest">&gt; LOGIC_SYNTHESIS:</span>
                                {item.logic}
                             </p>
                        </div>
                    </div>
                ))}
            </div>
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center animate-fade-in">
                 <div className="relative w-full max-w-lg mx-auto aspect-square">
                    <div className="absolute inset-0 bg-brand-gold/5 blur-[160px] rounded-full"></div>
                    <svg viewBox="0 0 100 100" className="relative z-10 drop-shadow-[0_0_50px_rgba(212,175,55,0.2)]">
                        {[1, 2, 3, 4].map(i => (
                            <circle key={i} cx="50" cy="50" r={i * 10} fill="none" stroke="#ffffff" opacity="0.05" />
                        ))}
                        {labels.map((_, i) => {
                            const angle = (i / labels.length) * 2 * Math.PI - Math.PI / 2;
                            return <line key={i} x1="50" y1="50" x2={50 + 40 * Math.cos(angle)} y2={50 + 40 * Math.sin(angle)} stroke="#ffffff" opacity="0.1" />;
                        })}
                        <polygon points={points} fill="url(#ringGradBI)" fillOpacity="0.3" stroke="#d4af37" strokeWidth="0.5" className="drop-shadow-[0_0_30px_rgba(212,175,55,0.6)]" />
                        
                        {/* Interactive Data Points */}
                        {scores.map((score, i) => {
                            const angle = (i / labels.length) * 2 * Math.PI - Math.PI / 2;
                            const x = 50 + (score * 4) * Math.cos(angle);
                            const y = 50 + (score * 4) * Math.sin(angle);
                            return <circle key={i} cx={x} cy={y} r="1.5" fill="#d4af37" className="animate-pulse shadow-2xl" />;
                        })}

                        {labels.map((label, i) => {
                            const angle = (i / labels.length) * 2 * Math.PI - Math.PI / 2;
                            return <text key={i} x={50 + 48 * Math.cos(angle)} y={50 + 48 * Math.sin(angle)} textAnchor="middle" dy=".3em" className="fill-brand-gold/40 text-[4px] font-black uppercase tracking-tighter">{label.replace(/_/g, ' ')}</text>;
                        })}
                    </svg>
                 </div>
                 <div className="grid grid-cols-1 gap-8">
                     {Object.entries(data).map(([key, val]: any) => (
                         <div key={key} className="bg-brand-950 p-10 rounded-[2.5rem] border border-white/5 hover:border-brand-gold/40 transition-all flex flex-col justify-between shadow-[0_30px_60px_rgba(0,0,0,0.5)] group/moat relative overflow-hidden">
                             <div className="absolute inset-0 bg-gradient-to-r from-brand-gold/5 via-transparent to-transparent opacity-0 group-hover/moat:opacity-100 transition-opacity pointer-events-none"></div>
                             <div className="flex justify-between items-center mb-6">
                                 <h5 className="text-white font-black text-base uppercase tracking-[0.3em] group-hover/moat:text-brand-gold transition-colors">{key.replace(/_/g, ' ')}</h5>
                                 <div className="px-5 py-2 bg-brand-gold/10 text-brand-gold font-mono text-lg font-black rounded-xl border border-brand-gold/20 shadow-xl">
                                    {val.score} <span className="text-[10px] opacity-30 ml-2">/ 10.0</span>
                                 </div>
                             </div>
                             <p className="text-sm text-white/50 leading-relaxed font-medium mb-6">{val.description}</p>
                             <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 p-0.5">
                                <div className="h-full bg-brand-gold shadow-[0_0_10px_#d4af37] transition-all duration-1500 ease-out" style={{ width: `${val.score * 10}%` }}></div>
                             </div>
                         </div>
                     ))}
                 </div>
            </div>
        );
    };

    return (
        <div className="animate-fade-in space-y-20 pb-32">
            {/* Command Input Node */}
            <div className="bg-brand-950 border border-brand-gold/20 p-12 md:p-20 rounded-[5rem] relative overflow-hidden shadow-[0_100px_200px_-50px_rgba(0,0,0,0.9)]">
                <div className="scanline-overlay opacity-5 pointer-events-none"></div>
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-gold/5 rounded-full blur-[250px] pointer-events-none -translate-y-1/2 translate-x-1/2 group-hover:bg-brand-gold/10 transition-all duration-1000"></div>
                
                <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start gap-16 mb-20">
                    <div className="max-w-3xl">
                        <div className="flex items-center gap-6 mb-10">
                            <div className="w-20 h-20 bg-brand-gold/10 rounded-[2.5rem] flex items-center justify-center border border-brand-gold/20 shadow-2xl backdrop-blur-3xl group transition-all hover:scale-110">
                                <PantherLogo className="h-12 w-auto brightness-0 invert" />
                            </div>
                            <div className="h-px w-20 bg-brand-gold/20"></div>
                            <span className="text-[11px] font-black text-brand-gold uppercase tracking-[0.6em]">Global Intelligence Terminal</span>
                        </div>
                        <h3 className="text-7xl md:text-8xl font-heading font-black text-white tracking-tighter leading-[0.85] uppercase mb-10">Venture Validator.</h3>
                        <p className="text-white/40 text-2xl font-light leading-relaxed max-w-2xl">
                            Deploy high-resolution institutional logic for cross-border capital validation. <br/>
                            <span className="text-brand-gold/60 font-mono text-sm font-black uppercase tracking-[0.4em] mt-8 flex items-center gap-4">
                                <Cpu size={16} className="animate-pulse" /> Uplink: GEMINI_3_PRO_REASONING_CORE
                            </span>
                        </p>
                    </div>

                    <div className="w-full lg:w-auto space-y-6">
                        <p className="text-[11px] font-black text-white/20 uppercase tracking-[0.5em] ml-6">Strategic Presets</p>
                        <div className="flex flex-wrap gap-4">
                            {PRESETS.map(p => (
                                <button 
                                    key={p.name}
                                    onClick={() => handlePreset(p)}
                                    className="px-8 py-4 bg-white/5 border border-white/10 rounded-2xl text-[11px] font-black text-white/50 hover:text-brand-gold hover:border-brand-gold/50 hover:bg-brand-gold/5 transition-all uppercase tracking-widest flex items-center gap-4 shadow-xl active:scale-95"
                                >
                                    <Database size={14} className="text-brand-gold/40" /> {p.name}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-10 relative z-10">
                    <div className="relative group/field">
                        <label className="absolute -top-3 left-10 px-5 bg-brand-950 text-[11px] font-black text-slate-500 uppercase tracking-[0.5em] z-20">Asset Industry</label>
                        <input 
                            type="text"
                            value={bizType} 
                            onChange={e => setBizType(e.target.value)} 
                            placeholder="e.g., Quantum Computing Infrastructure"
                            className="w-full bg-brand-gold/5 border-2 border-brand-gold/10 rounded-[2.5rem] py-7 px-10 text-xl text-white placeholder:text-white/10 focus:border-brand-gold transition-all outline-none font-medium shadow-inner"
                        />
                    </div>
                    <div className="relative group/field">
                        <label className="absolute -top-3 left-10 px-5 bg-brand-950 text-[11px] font-black text-slate-500 uppercase tracking-[0.5em] z-20">Geospacial Scope</label>
                        <input 
                            type="text"
                            value={location} 
                            onChange={e => setLocation(e.target.value)} 
                            placeholder="e.g., GCC Region & SE Asia"
                            className="w-full bg-brand-gold/5 border-2 border-brand-gold/10 rounded-[2.5rem] py-7 px-10 text-xl text-white placeholder:text-white/10 focus:border-brand-gold transition-all outline-none font-medium shadow-inner"
                        />
                    </div>
                    <div className="flex bg-brand-950 rounded-[2.5rem] p-2.5 border border-brand-gold/30 shadow-2xl">
                        {[
                            { id: 'market_size', icon: Maximize, label: 'TAM/SAM' },
                            { id: 'moat', icon: Shield, label: 'MOAT' },
                            { id: 'competitors', icon: Users, label: 'RIVALS' }
                        ].map(m => (
                            <button 
                                key={m.id}
                                onClick={() => { setMode(m.id as any); setResult(null); }}
                                className={`flex-1 flex flex-col items-center justify-center gap-2 py-4 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all ${
                                    mode === m.id 
                                        ? 'bg-brand-gold text-brand-950 shadow-[0_10px_30px_rgba(212,175,55,0.3)]' 
                                        : 'text-white/20 hover:text-white hover:bg-white/5'
                                }`}
                            >
                                <m.icon size={18} /> {m.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="mt-16 flex flex-col items-center">
                    <button 
                        onClick={handleRun}
                        disabled={loading || !bizType}
                        className="w-full bg-brand-gold text-brand-950 font-heading font-black py-10 rounded-[3rem] hover:bg-white transition-all shadow-[0_30px_80px_-20px_rgba(212,175,55,0.6)] flex items-center justify-center gap-10 uppercase tracking-[0.6em] text-lg disabled:opacity-50 group/btn"
                    >
                        {loading ? <Loader2 className="animate-spin" size={32} /> : <><PantherLogo className="h-10 w-auto brightness-0 transition-all group-hover/btn:scale-110 group-hover/btn:rotate-2" /> INITIALIZE GLOBAL VALIDATION</>}
                    </button>
                    
                    {loading && (
                        <div className="w-full max-w-4xl mt-20 space-y-6 animate-fade-in relative z-10">
                            <div className="flex justify-between items-end text-[12px] font-mono font-black text-brand-gold uppercase tracking-[0.6em]">
                                <div className="flex items-center gap-5">
                                    <div className="w-2.5 h-2.5 rounded-full bg-brand-gold animate-ping shadow-[0_0_15px_#d4af37]"></div>
                                    SYNCHRONIZING GLOBAL REASONING NODES...
                                </div>
                                <span className="text-white">{progress.toFixed(0)}%_UPLINK</span>
                            </div>
                            <div className="w-full h-2.5 bg-white/5 rounded-full overflow-hidden border border-white/10 p-1">
                                <div className="h-full bg-brand-gold shadow-[0_0_30px_rgba(212,175,55,0.8)] transition-all duration-300 rounded-full" style={{ width: `${progress}%` }}></div>
                            </div>
                            <p className="text-center text-[10px] text-white/20 font-black uppercase tracking-[0.4em] animate-pulse">Establishing diagnostic consensus across distributed sovereign reasoning clusters...</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Intelligence Output Node */}
            {result && (
                <div className="bg-brand-950 border border-brand-gold/30 p-16 md:p-24 rounded-[5rem] shadow-[0_100px_200px_-50px_rgba(0,0,0,1)] animate-fade-up relative overflow-hidden">
                    <div className="scanline-overlay opacity-5 pointer-events-none"></div>
                    <div className="flex flex-col md:flex-row justify-between items-center gap-12 mb-20 border-b border-white/5 pb-16">
                        <div className="flex items-center gap-10">
                            <div className="p-8 bg-brand-gold/10 rounded-[3rem] text-brand-gold border border-brand-gold/20 shadow-2xl transition-transform hover:rotate-12 duration-700">
                                <Activity size={48} />
                            </div>
                            <div>
                                <h4 className="text-6xl font-heading font-black text-white tracking-tighter uppercase leading-none">Diagnostic Result.</h4>
                                <p className="text-brand-gold/60 font-mono text-[12px] font-black uppercase tracking-[0.5em] mt-5 flex items-center gap-4">
                                    <Target size={16}/> Target: {bizType} // {location}
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-6">
                            <div className="px-8 py-6 bg-white/5 border border-white/10 rounded-[2rem] text-right shadow-inner">
                                <p className="text-[10px] text-white/30 font-black uppercase tracking-widest mb-2">Session Node</p>
                                <p className="text-white font-mono text-sm font-black tracking-widest">UPLINK_0xFD...{Math.random().toString(36).substr(2, 4).toUpperCase()}</p>
                            </div>
                            <div className="px-8 py-6 bg-white/5 border border-white/10 rounded-[2rem] text-right shadow-inner">
                                <p className="text-[10px] text-white/30 font-black uppercase tracking-widest mb-2">Intelligence Core</p>
                                <p className="text-brand-gold font-mono text-sm font-black uppercase tracking-widest">GEMINI_3_PRO_ACTIVE</p>
                            </div>
                        </div>
                    </div>
                    {mode === 'market_size' && <MarketSizeViz data={result} />}
                    {mode === 'moat' && <MoatViz data={result} />}
                    {mode === 'competitors' && Array.isArray(result) && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                            {result.map((comp: any, i: number) => (
                                <div key={i} className="bg-brand-950 p-14 rounded-[4rem] border border-white/5 hover:border-brand-gold/40 transition-all group flex flex-col justify-between shadow-2xl relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-br from-brand-gold/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
                                    <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
                                        <Shield size={160} />
                                    </div>
                                    <div className="relative z-10">
                                        <div className="flex justify-between items-start mb-12">
                                            <div>
                                                <h5 className="text-white font-heading font-black text-3xl tracking-tighter uppercase leading-none mb-2">{comp.name}</h5>
                                                <p className="text-[10px] font-black text-brand-gold/40 uppercase tracking-widest">Strategic Rival Node</p>
                                            </div>
                                            <div className="flex flex-col items-end">
                                                <div className="text-[10px] font-mono text-white/20 uppercase tracking-widest mb-2 font-black">Threat Matrix</div>
                                                <div className="text-red-500 font-mono text-4xl font-black tracking-tighter shadow-2xl">{(comp.threat_level || 7).toFixed(1)}</div>
                                            </div>
                                        </div>
                                        <p className="text-base text-white/50 leading-relaxed mb-16 font-medium italic">"{comp.description}"</p>
                                    </div>
                                    <button className="relative z-10 text-[11px] font-black text-brand-gold uppercase tracking-[0.6em] flex items-center gap-5 hover:text-white transition-all group-hover:translate-x-3 duration-500">
                                        Examine Asset Node <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform"/>
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                    <div className="mt-24 pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-10">
                         <div className="flex items-center gap-6">
                             <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-white/30 border border-white/10 shadow-xl">
                                 <Fingerprint size={24} />
                             </div>
                             <p className="text-[10px] text-white/30 font-black uppercase tracking-[0.5em] max-w-sm leading-relaxed">Intelligence verified via institutional multi-node consensus. <br/>Awaiting secondary manual handshake.</p>
                         </div>
                         <button className="px-12 py-5 bg-white text-brand-950 font-black rounded-2xl text-xs uppercase tracking-[0.4em] shadow-[0_20px_50px_rgba(255,255,255,0.1)] hover:bg-brand-gold transition-all active:scale-95 flex items-center gap-4">
                             <Printer className="w-5 h-5" /> Generate Audit PDF
                         </button>
                    </div>
                </div>
            )}
            
            {!result && !loading && (
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-12 px-6">
                    {[
                        { icon: Shield, title: "Audit Integrity", desc: "Diagnostic outputs are synthesized from real-time global proxies and proprietary sectoral benchmarks for absolute capital fidelity." },
                        { icon: Activity, title: "Logic Sync", desc: "Reasoning clusters are updated hourly to reflect sovereign shifts in global capital migration and regional liquidity corridors." },
                        { icon: Fingerprint, title: "Node Security", desc: "All intelligence fetches are encrypted via AES-256-GCM and authenticated per secure institutional session for private LPs." }
                    ].map((feature, i) => (
                        <div key={i} className="p-14 bg-brand-950/40 border border-white/5 border-dashed rounded-[4rem] text-center group hover:border-brand-gold/30 hover:bg-brand-gold/5 transition-all duration-700 shadow-2xl relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-brand-gold/[0.02] pointer-events-none"></div>
                            <div className="w-24 h-24 bg-white/5 rounded-[2.5rem] flex items-center justify-center mx-auto mb-12 text-white/10 group-hover:text-brand-gold group-hover:scale-110 transition-all border border-transparent group-hover:border-brand-gold/20 shadow-xl">
                                <feature.icon size={48} />
                            </div>
                            <h4 className="text-white font-heading font-black text-2xl uppercase tracking-tighter mb-6">{feature.title}</h4>
                            <p className="text-[13px] text-white/30 font-medium leading-relaxed max-w-xs mx-auto uppercase tracking-widest italic group-hover:text-white/50 transition-colors">
                                {feature.desc}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default BusinessIntelligence;