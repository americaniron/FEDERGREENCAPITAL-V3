
import React, { useState, useEffect } from 'react';
import { CalculatorDef } from '../../constants/toolDefinitions';
import { PieChart, Save, RefreshCw, ChevronRight, Activity, BrainCircuit, Loader2, ShieldCheck, AlertTriangle } from 'lucide-react';
import { analyzePortfolioRisk } from '../../services/geminiService';

interface CalculatorEngineProps {
    calculator: CalculatorDef;
}

const CalculatorEngine: React.FC<CalculatorEngineProps> = ({ calculator }) => {
    const [inputs, setInputs] = useState<Record<string, number>>(() => {
        const defaults: Record<string, number> = {};
        calculator.fields.forEach(f => defaults[f.id] = f.defaultValue);
        return defaults;
    });

    const [output, setOutput] = useState<any>(null);
    const [aiRiskResult, setAiRiskResult] = useState<any>(null);
    const [loadingAi, setLoadingAi] = useState(false);

    useEffect(() => {
        const res = calculator.calculate(inputs);
        setOutput(res);
        setAiRiskResult(null); // Reset AI audit when inputs change
    }, [inputs, calculator]);

    const handleChange = (id: string, val: string) => {
        setInputs(prev => ({ ...prev, [id]: parseFloat(val) || 0 }));
    };

    const formatVal = (val: number, type: 'currency' | 'percent' | 'number') => {
        if (type === 'currency') return `$${val.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
        if (type === 'percent') return `${val.toFixed(2)}%`;
        return val.toLocaleString(undefined, { maximumFractionDigits: 0 });
    };

    const handleExecuteAiAudit = async () => {
        setLoadingAi(true);
        setAiRiskResult(null);
        const context = {
            calculatorName: calculator.name,
            description: calculator.description,
            inputs: inputs,
            results: output,
        };
        const result = await analyzePortfolioRisk(context);
        setAiRiskResult(result);
        setLoadingAi(false);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left: Inputs */}
            <div className="lg:col-span-4 space-y-8">
                <div className="bg-brand-950 border border-brand-gold/10 p-10 rounded-[3rem] shadow-2xl">
                    <h3 className="text-xs font-bold text-brand-gold uppercase tracking-[0.4em] mb-10 border-b border-white/5 pb-4">Variable Matrix</h3>
                    <div className="space-y-8">
                        {calculator.fields.map(field => (
                            <div key={field.id} className="space-y-3">
                                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                    {field.label}
                                </label>
                                <div className="relative group">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-gold text-xs font-bold">
                                        {field.type === 'currency' ? '$' : field.type === 'percent' ? '%' : '#'}
                                    </span>
                                    <input 
                                        type="number" 
                                        value={inputs[field.id]} 
                                        onChange={(e) => handleChange(field.id, e.target.value)}
                                        className="w-full bg-brand-gold/5 border border-brand-gold/20 rounded-xl py-4 pl-10 pr-4 text-white focus:outline-none focus:border-brand-gold transition-all font-mono text-sm"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right: Results */}
            <div className="lg:col-span-8 space-y-8">
                <div className="bg-gradient-to-br from-brand-900 to-brand-950 p-16 rounded-[4rem] border border-brand-gold/10 shadow-2xl relative overflow-hidden group">
                    <div className="scanline-overlay opacity-5"></div>
                    <div className="absolute top-0 right-0 w-64 h-64 bg-brand-gold/5 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2 group-hover:bg-brand-gold/10 transition-all duration-1000"></div>
                    
                    <h4 className="text-brand-gold font-bold uppercase tracking-widest text-[10px] mb-6">{output?.resultLabel}</h4>
                    <div className="text-7xl font-heading font-extrabold text-white mb-12 tracking-tighter">
                        {output && formatVal(output.result, output.format)}
                    </div>

                    {output?.details && (
                        <div className="grid grid-cols-2 gap-8 border-t border-white/5 pt-12">
                            {output.details.map((d: any, i: number) => (
                                <div key={i} className="space-y-2">
                                    <p className="text-white/30 text-[10px] font-bold uppercase tracking-widest">{d.label}</p>
                                    <p className="text-white font-extrabold text-xl">{d.value}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {output?.chartData && (
                    <div className="bg-brand-950 border border-brand-gold/10 p-12 rounded-[3rem] shadow-2xl">
                        <h4 className="text-white font-bold text-xs uppercase tracking-widest mb-10 flex items-center gap-4">
                            <PieChart size={18} className="text-brand-gold" /> Component Distribution
                        </h4>
                        <div className="flex flex-col md:flex-row items-center gap-12">
                            <div className="flex-1 w-full space-y-6">
                                {output.chartData.map((d: any, i: number) => (
                                    <div key={i} className="space-y-2">
                                        <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                                            <span className="text-white/40">{d.label}</span>
                                            <span className="text-white">
                                                {((d.value / output.chartData.reduce((a:any,b:any) => a + b.value, 0)) * 100).toFixed(1)}%
                                            </span>
                                        </div>
                                        <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                                            <div 
                                                className="h-full rounded-full shadow-[0_0_10px_currentColor]" 
                                                style={{ width: `${(d.value / output.chartData.reduce((a:any,b:any) => a + b.value, 0)) * 100}%`, backgroundColor: d.color, color: d.color }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="w-48 h-48 rounded-full border-[20px] border-white/5 relative flex items-center justify-center">
                                <Activity className="text-brand-gold/20" size={48} />
                                <div className="absolute inset-0 rounded-full border-[20px] border-brand-gold border-t-transparent animate-spin opacity-40"></div>
                            </div>
                        </div>
                    </div>
                )}

                {/* AI Risk Audit Section */}
                <div className="mt-8">
                    {!aiRiskResult && !loadingAi && (
                        <button
                            onClick={handleExecuteAiAudit}
                            className="w-full flex items-center justify-center gap-4 py-6 bg-brand-950 border-2 border-dashed border-brand-gold/20 text-brand-gold rounded-3xl hover:bg-brand-gold/10 hover:border-brand-gold transition-all group"
                        >
                            <BrainCircuit size={20} />
                            <span className="text-sm font-bold uppercase tracking-widest">Execute AI Strategic Audit</span>
                        </button>
                    )}
                    {loadingAi && (
                        <div className="w-full mt-8 space-y-4 animate-fade-in relative p-8 bg-brand-950 border border-brand-gold/10 rounded-3xl">
                            <div className="flex justify-between items-center text-[10px] font-mono font-black text-brand-gold uppercase tracking-[0.4em]">
                                <div className="flex items-center gap-3">
                                    <Loader2 size={12} className="animate-spin" />
                                    SYNCHRONIZING REASONING CORE...
                                </div>
                            </div>
                            <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/10">
                                <div className="h-full bg-brand-gold animate-shimmer shadow-[0_0_20px_#d4af37]"></div>
                            </div>
                        </div>
                    )}
                    {aiRiskResult && !loadingAi && (
                        <div className="bg-brand-950 border border-brand-gold/20 p-8 md:p-12 rounded-[3rem] shadow-2xl animate-fade-in space-y-8">
                            <div className="flex justify-between items-start">
                                <h4 className="text-xl font-heading font-black text-white uppercase tracking-tighter flex items-center gap-4">
                                    <ShieldCheck className="text-brand-gold" size={24} />
                                    AI Risk Audit Complete
                                </h4>
                                <button onClick={() => setAiRiskResult(null)} className="text-xs text-white/30 hover:text-white font-mono uppercase tracking-widest">Reset</button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <div className="md:col-span-1 bg-brand-gold/5 border border-brand-gold/10 rounded-3xl p-6 text-center flex flex-col justify-center">
                                    <p className="text-[9px] font-mono font-bold text-brand-gold/50 uppercase tracking-[0.4em] mb-2">Risk Score</p>
                                    <div className="text-7xl font-heading font-black text-white tracking-tighter leading-none">{aiRiskResult.riskScore}</div>
                                </div>
                                <div className="md:col-span-2 bg-white/5 border border-white/10 rounded-3xl p-6">
                                    <p className="text-[9px] font-mono font-bold text-white/40 uppercase tracking-[0.4em] mb-2">Sentiment: {aiRiskResult.sentiment.rating}</p>
                                    <p className="text-sm text-white/70 italic">"{aiRiskResult.sentiment.logic}"</p>
                                </div>
                            </div>
                            <div>
                                <h5 className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] mb-4">Vulnerability Nodes</h5>
                                <div className="space-y-3">
                                    {aiRiskResult.vulnerabilities.map((v: any, i: number) => (
                                        <div key={i} className="flex items-start gap-3 bg-brand-900/50 p-4 rounded-xl border border-white/5">
                                            <AlertTriangle size={16} className="text-red-400/50 shrink-0 mt-1" />
                                            <div>
                                                <p className="text-sm font-bold text-white/80">{v.node}</p>
                                                <p className="text-xs text-white/40">{v.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="border-t border-white/10 pt-6">
                                <p className="text-xs text-white/30 italic text-center">AI-generated analysis. For institutional guidance only. Not a substitute for professional due diligence.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CalculatorEngine;
