
import React, { useState } from 'react';
import { analyzeBusinessModel } from '../../services/geminiService';
import { Input, TextArea } from '../ui/FormElements';
// FIX: Added BarChart3 to the imports to resolve a component usage error.
import { BrainCircuit, Loader2, Target, Shield, Users, ArrowRight, Zap, TrendingUp, Info, BarChart3 } from 'lucide-react';

const BusinessIntelligence: React.FC = () => {
    const [bizType, setBizType] = useState('');
    const [location, setLocation] = useState('');
    const [mode, setMode] = useState<'market_size' | 'moat' | 'competitors'>('market_size');
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const handleRun = async () => {
        if (!bizType || !location) return;
        setLoading(true);
        setResult(null);
        
        try {
            const jsonStr = await analyzeBusinessModel(bizType, location, mode);
            if (jsonStr) {
                // Sanitize markdown code blocks if Gemini returns them
                const cleanJson = jsonStr.replace(/```json/g, '').replace(/```/g, '').trim();
                setResult(JSON.parse(cleanJson));
            }
        } catch (e) {
            console.error("Parse Error", e);
        }
        setLoading(false);
    };

    return (
        <div className="animate-fade-in space-y-12 pb-20">
            {/* Header Area */}
            <div className="bg-brand-900 border border-brand-800 p-12 rounded-[2.5rem] relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-96 h-96 bg-brand-gold/5 rounded-full blur-[128px] pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
                
                <div className="relative z-10 max-w-3xl mb-12">
                    <h3 className="text-4xl font-heading font-bold text-white mb-4 flex items-center gap-4">
                        <BrainCircuit className="text-brand-gold" size={40} />
                        Venture Validator AI
                    </h3>
                    <p className="text-slate-400 text-lg leading-relaxed">
                        Execute institutional-grade market mapping and strategic audits using deep-reasoning AI. 
                        Validate market size, competitive moats, and regional viability.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
                    <Input 
                        label="Industry / Niche" 
                        value={bizType} 
                        onChange={e => setBizType(e.target.value)} 
                        placeholder="e.g. Luxury Private Equity" 
                        className="mb-0"
                    />
                    <Input 
                        label="Regional Scope" 
                        value={location} 
                        onChange={e => setLocation(e.target.value)} 
                        placeholder="e.g. London & UAE" 
                        className="mb-0"
                    />
                    <div className="flex bg-brand-950 rounded-xl p-1.5 border border-brand-800 shadow-inner">
                        {[
                            { id: 'market_size', icon: Target, label: 'TAM' },
                            { id: 'moat', icon: Shield, label: 'MOAT' },
                            { id: 'competitors', icon: Users, label: 'COMP' }
                        ].map(m => (
                            <button 
                                key={m.id}
                                onClick={() => setMode(m.id as any)}
                                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${
                                    mode === m.id 
                                        ? 'bg-brand-gold text-brand-900 shadow-lg' 
                                        : 'text-slate-500 hover:text-slate-300'
                                }`}
                            >
                                <m.icon size={14} /> {m.label}
                            </button>
                        ))}
                    </div>
                </div>

                <button 
                    onClick={handleRun}
                    disabled={loading || !bizType}
                    className="mt-8 w-full bg-brand-gold text-brand-900 font-bold py-5 rounded-2xl hover:bg-white transition-all shadow-xl shadow-brand-gold/10 flex items-center justify-center gap-3 uppercase tracking-[0.2em] text-xs disabled:opacity-50"
                >
                    {loading ? <Loader2 className="animate-spin" size={20} /> : <><Zap size={18}/> Execute Validation Scan</>}
                </button>
            </div>

            {/* Results Display */}
            {result && (
                <div className="space-y-8 animate-fade-in">
                    {mode === 'market_size' && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[
                                { label: 'TAM (Total Potential)', val: result.tam, logic: result.tam_logic, color: 'text-brand-gold', bg: 'bg-brand-900' },
                                { label: 'SAM (Serviceable)', val: result.sam, logic: result.sam_logic, color: 'text-blue-400', bg: 'bg-brand-900' },
                                { label: 'SOM (Year 1 Target)', val: result.som, logic: result.som_logic, color: 'text-green-400', bg: 'bg-brand-900' },
                            ].map((item, i) => (
                                <div key={i} className={`${item.bg} border border-brand-800 p-8 rounded-3xl shadow-xl transition-transform hover:-translate-y-2`}>
                                    <h4 className="text-[10px] uppercase font-bold text-slate-500 tracking-widest mb-4 flex items-center justify-between">
                                        {item.label}
                                        <TrendingUp size={12}/>
                                    </h4>
                                    <p className={`text-4xl font-heading font-bold mb-6 ${item.color}`}>{item.val}</p>
                                    <p className="text-xs text-slate-400 leading-relaxed italic border-l-2 border-brand-800 pl-4">{item.logic}</p>
                                </div>
                            ))}
                        </div>
                    )}
                    
                    {mode === 'moat' && (
                        <div className="bg-brand-900 border border-brand-800 p-10 rounded-[2.5rem] shadow-2xl">
                             <h4 className="text-white font-bold text-2xl mb-10 flex items-center gap-3">
                                 <Shield className="text-brand-gold" size={24}/>
                                 Strategic Competitive Moat Audit
                             </h4>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                 {Object.entries(result).map(([key, val]: any) => (
                                     <div key={key} className="bg-brand-950 border border-brand-800 p-8 rounded-2xl flex flex-col justify-between group hover:border-brand-gold transition-all">
                                         <div className="flex justify-between items-start mb-6">
                                             <h5 className="text-white font-bold text-lg capitalize tracking-tight">{key.replace(/_/g, ' ')}</h5>
                                             <div className="px-3 py-1 bg-brand-900 rounded-full border border-brand-800 text-brand-gold font-bold text-xs">
                                                 {val.score || '8'}/10
                                             </div>
                                         </div>
                                         <p className="text-sm text-slate-400 leading-relaxed">{val.description || val}</p>
                                         <div className="w-full h-1 bg-brand-900 rounded-full mt-6 overflow-hidden">
                                             <div className="h-full bg-brand-gold" style={{ width: `${(val.score || 8) * 10}%` }}></div>
                                         </div>
                                     </div>
                                 ))}
                             </div>
                        </div>
                    )}

                    {mode === 'competitors' && Array.isArray(result) && (
                        <div className="bg-brand-900 border border-brand-800 p-10 rounded-[2.5rem]">
                            <h4 className="text-white font-bold text-2xl mb-10 flex items-center gap-3">
                                <Users className="text-brand-gold" size={24}/>
                                Regional Competitor Map
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {result.map((comp: any, i: number) => (
                                    <div key={i} className="bg-brand-950 p-6 rounded-2xl border border-brand-800 hover:border-brand-gold transition-all flex flex-col justify-between group">
                                        <div>
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="w-10 h-10 rounded-xl bg-brand-900 flex items-center justify-center text-brand-gold font-bold text-sm border border-brand-800 group-hover:bg-brand-gold group-hover:text-brand-900 transition-colors">
                                                    {i+1}
                                                </div>
                                                <h5 className="text-white font-bold text-lg">{comp.name || comp}</h5>
                                            </div>
                                            <p className="text-xs text-slate-500 leading-relaxed mb-6">{comp.description || "Identified institutional competitor operating in the specified geographic corridor."}</p>
                                        </div>
                                        <button className="text-[10px] font-bold text-brand-gold uppercase tracking-widest flex items-center gap-2 hover:text-white transition-colors">
                                            Deep Intelligence <ArrowRight size={12}/>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Empty State / Methodology */}
            {!result && !loading && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-10">
                    <div className="bg-brand-950/50 border border-brand-800 border-dashed p-10 rounded-[2rem] text-center">
                        <Info className="mx-auto text-slate-700 mb-6" size={40} />
                        <h4 className="text-white font-bold mb-2">Model Constraints</h4>
                        <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                            Venture Validator uses historical and real-time market proxies. All calculations are estimated based on sectoral benchmarks and should be cross-verified by regional specialists.
                        </p>
                    </div>
                    <div className="bg-brand-950/50 border border-brand-800 border-dashed p-10 rounded-[2rem] text-center">
                        <BarChart3 className="mx-auto text-slate-700 mb-6" size={40} />
                        <h4 className="text-white font-bold mb-2">Data Integrity</h4>
                        <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                            Market size is derived from top-down demographic data combined with bottom-up sectoral multiples.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BusinessIntelligence;
