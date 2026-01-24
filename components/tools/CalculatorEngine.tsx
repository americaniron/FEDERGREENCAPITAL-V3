import React, { useState, useEffect } from 'react';
import { CalculatorDef } from '../../constants/toolDefinitions';
import { PieChart, Save, RefreshCw } from 'lucide-react';

interface CalculatorEngineProps {
    calculator: CalculatorDef;
}

const CalculatorEngine: React.FC<CalculatorEngineProps> = ({ calculator }) => {
    // Initialize state with default values
    const [inputs, setInputs] = useState<Record<string, number>>(() => {
        const defaults: Record<string, number> = {};
        calculator.fields.forEach(f => defaults[f.id] = f.defaultValue);
        return defaults;
    });

    const [output, setOutput] = useState<any>(null);

    // Recalculate whenever inputs change
    useEffect(() => {
        const res = calculator.calculate(inputs);
        setOutput(res);
    }, [inputs, calculator]);

    const handleChange = (id: string, val: string) => {
        setInputs(prev => ({
            ...prev,
            [id]: parseFloat(val) || 0
        }));
    };

    const formatVal = (val: number, type: 'currency' | 'percent' | 'number') => {
        if (type === 'currency') return `$${val.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
        if (type === 'percent') return `${val.toFixed(2)}%`;
        return val.toLocaleString(undefined, { maximumFractionDigits: 2 });
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
            {/* Input Section */}
            <div className="lg:col-span-1 bg-brand-900 border border-brand-800 p-6 rounded-xl shadow-lg">
                <h3 className="text-white font-bold mb-6 flex items-center gap-2">
                    <span className="w-1 h-6 bg-brand-gold rounded-full"></span>
                    Parameters
                </h3>
                <div className="space-y-5">
                    {calculator.fields.map(field => (
                        <div key={field.id}>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                                {field.label}
                            </label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-gold text-sm font-bold">
                                    {field.type === 'currency' ? '$' : field.type === 'percent' ? '%' : '#'}
                                </span>
                                <input 
                                    type="number" 
                                    value={inputs[field.id]} 
                                    onChange={(e) => handleChange(field.id, e.target.value)}
                                    className="w-full bg-brand-950 border border-brand-700 rounded-lg py-3 pl-8 pr-3 text-white focus:outline-none focus:border-brand-gold transition-colors font-mono"
                                />
                            </div>
                        </div>
                    ))}
                </div>
                <button className="mt-8 w-full flex items-center justify-center gap-2 text-sm font-bold text-slate-400 hover:text-white transition-colors border border-dashed border-brand-700 p-3 rounded-lg hover:bg-brand-800">
                    <Save size={16} /> Save Scenario
                </button>
            </div>

            {/* Results Section */}
            <div className="lg:col-span-2 space-y-6">
                {/* Main Result Card */}
                <div className="bg-gradient-to-br from-brand-800 to-brand-900 p-8 rounded-xl border border-brand-700 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gold/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                    
                    <h4 className="text-brand-gold font-bold uppercase tracking-widest text-sm mb-2">{output?.resultLabel}</h4>
                    <div className="text-5xl font-heading font-bold text-white mb-6 tracking-tight">
                        {output && formatVal(output.result, output.format)}
                    </div>

                    {output?.details && (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 border-t border-brand-700/50 pt-6">
                            {output.details.map((d: any, i: number) => (
                                <div key={i}>
                                    <p className="text-slate-400 text-xs uppercase mb-1">{d.label}</p>
                                    <p className="text-white font-bold">{d.value}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Visualization */}
                {output?.chartData && (
                    <div className="bg-brand-900 p-6 rounded-xl border border-brand-800">
                        <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                            <PieChart size={18} className="text-brand-gold" /> Breakdown
                        </h4>
                        <div className="flex items-center gap-8">
                            <div className="flex-1 space-y-3">
                                {output.chartData.map((d: any, i: number) => (
                                    <div key={i}>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="text-slate-300">{d.label}</span>
                                            <span className="text-white font-bold">
                                                {((d.value / output.chartData.reduce((a:any,b:any) => a + b.value, 0)) * 100).toFixed(1)}%
                                            </span>
                                        </div>
                                        <div className="w-full h-2 bg-brand-950 rounded-full overflow-hidden">
                                            <div 
                                                className="h-full rounded-full" 
                                                style={{ width: `${(d.value / output.chartData.reduce((a:any,b:any) => a + b.value, 0)) * 100}%`, backgroundColor: d.color }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {/* Simple CSS Donut Chart */}
                            <div className="relative w-32 h-32 hidden md:block">
                                <svg viewBox="0 0 32 32" className="w-full h-full rotate-[-90deg]">
                                    {output.chartData.map((d: any, i: number, arr: any[]) => {
                                        const total = arr.reduce((acc, curr) => acc + curr.value, 0);
                                        const dashArray = (d.value / total) * 100;
                                        const prevTotal = arr.slice(0, i).reduce((acc, curr) => acc + curr.value, 0);
                                        const offset = 100 - (prevTotal / total) * 100;
                                        
                                        return (
                                            <circle 
                                                key={i}
                                                r="16" 
                                                cx="16" 
                                                cy="16" 
                                                fill="transparent" 
                                                stroke={d.color} 
                                                strokeWidth="32" 
                                                strokeDasharray={`${dashArray} 100`} 
                                                strokeDashoffset={offset} 
                                            />
                                        );
                                    })}
                                    <circle r="12" cx="16" cy="16" fill="#0f1026" />
                                </svg>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CalculatorEngine;