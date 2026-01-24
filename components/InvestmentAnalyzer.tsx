import React, { useState } from 'react';
import { analyzeInvestmentStrategy } from '../services/geminiService';
import { BrainCircuit, Loader2 } from 'lucide-react';

const InvestmentAnalyzer: React.FC = () => {
    const [strategy, setStrategy] = useState('');
    const [analysis, setAnalysis] = useState('');
    const [loading, setLoading] = useState(false);

    const handleAnalyze = async () => {
        if (!strategy) return;
        setLoading(true);
        setAnalysis('');
        const result = await analyzeInvestmentStrategy(strategy);
        setAnalysis(result || "Analysis failed.");
        setLoading(false);
    };

    return (
        <div className="bg-white dark:bg-brand-800 p-8 rounded-xl shadow-lg border border-brand-700 my-8">
            <div className="flex items-center gap-3 mb-6">
                <BrainCircuit className="text-brand-gold w-8 h-8" />
                <h3 className="text-2xl font-heading font-bold text-white">AI Strategy Simulator</h3>
            </div>
            <p className="text-slate-300 mb-6">
                Use our advanced "Thinking" AI to stress-test your investment thesis. 
                Describe your strategy (e.g., "Leveraging real estate assets in South East Asia to fund renewable energy projects in Europe").
            </p>
            
            <textarea
                className="w-full p-4 rounded-lg bg-brand-900 border border-brand-700 text-white placeholder-slate-500 focus:ring-2 focus:ring-brand-gold outline-none h-32 mb-4"
                placeholder="Describe your strategy here..."
                value={strategy}
                onChange={(e) => setStrategy(e.target.value)}
            />
            
            <button
                onClick={handleAnalyze}
                disabled={loading}
                className="bg-brand-gold hover:bg-brand-gold_light text-brand-900 font-bold py-3 px-6 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
            >
                {loading ? <Loader2 className="animate-spin" /> : 'Run Analysis'}
            </button>

            {analysis && (
                <div className="mt-8 p-6 bg-brand-900 rounded-lg border border-brand-700">
                    <h4 className="text-brand-gold font-bold mb-4 uppercase text-sm tracking-wider">Analysis Report</h4>
                    <div className="prose prose-invert max-w-none text-slate-300">
                        <p className="whitespace-pre-wrap">{analysis}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InvestmentAnalyzer;