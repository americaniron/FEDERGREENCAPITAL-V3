
import React, { useMemo, useState } from 'react';
import { FinancialScenario } from '../../types';
import { Finance } from '../../lib/finance-engine';
import { analyzePortfolioRisk } from '../../services/geminiService';
import { 
    LayoutDashboard, TrendingUp, DollarSign, BarChart3, 
    Layers, PieChart, ShieldCheck, ArrowRight,
    Building2, Activity, Percent, Clock, Wallet, Shield,
    BrainCircuit, Loader2, Cpu, ShieldAlert, CheckCircle, XCircle
} from 'lucide-react';
// FIX: Import PantherLogo to resolve 'Cannot find name' error.
import { PantherLogo } from '../PantherLogo';

interface PortfolioPerformanceProps {
    allScenarios: FinancialScenario[];
    onNavigate: (path: string) => void;
}

const PortfolioPerformance: React.FC<PortfolioPerformanceProps> = ({ allScenarios, onNavigate }) => {
    
    const [aiRiskResult, setAiRiskResult] = useState<any>(null);
    const [loadingAi, setLoadingAi] = useState(false);

    const aggregates = useMemo(() => {
        let totalValue = 0;
        let totalNoi = 0;
        let totalCashFlow = 0;
        let totalDebt = 0;

        const assetDetails = allScenarios.map(s => {
            const monthlyRent = s.grossPotentialRent + s.otherIncome;
            const vacancyLoss = monthlyRent * (s.vacancyRate / 100);
            const egi = (monthlyRent - vacancyLoss) * 12;
            
            const mgmtFee = egi * (s.managementFee / 100);
            const opex = s.propertyTax + s.insurance + s.maintenance + s.utilities + s.otherExpenses + s.hoa + mgmtFee;
            
            const noi = Finance.noi(egi, opex);

            const monthlyDebt = Finance.mortgagePayment(s.loanAmount, s.interestRate, s.termYears);
            const annualDebt = monthlyDebt * 12;
            const cashFlow = noi - annualDebt;

            const capRate = s.purchasePrice > 0 ? (noi / s.purchasePrice) * 100 : 0;
            const dscr = annualDebt > 0 ? noi / annualDebt : 0;

            totalValue += s.purchasePrice;
            totalNoi += noi;
            totalCashFlow += cashFlow;
            totalDebt += s.loanAmount;

            return {
                id: s.id,
                name: s.name,
                address: s.propertyAddress,
                value: s.purchasePrice,
                noi,
                cashFlow,
                capRate,
                dscr
            };
        });

        const avgCapRate = totalValue > 0 ? (totalNoi / totalValue) * 100 : 0;
        const avgDscr = (totalNoi > 0 && totalDebt > 0) ? totalNoi / ( (totalDebt / allScenarios.length * 12) / 12 * 12) : 0;
        const portfolioLtv = totalValue > 0 ? (totalDebt / totalValue) * 100 : 0;
        const debtYield = totalDebt > 0 ? (totalNoi / totalDebt) * 100 : 0;

        return {
            totalValue,
            totalNoi,
            totalCashFlow,
            avgCapRate,
            avgDscr,
            portfolioLtv,
            debtYield,
            assets: assetDetails
        };
    }, [allScenarios]);

    const handleExecuteAiAudit = async () => {
        setLoadingAi(true);
        setAiRiskResult(null);
        const result = await analyzePortfolioRisk({
            portfolioSummary: "This is an aggregate portfolio of multiple real estate scenarios.",
            ...aggregates
        });
        setAiRiskResult(result);
        setLoadingAi(false);
    };

    const StatCard = ({ label, value, sub, icon: Icon, colorClass = "text-brand-gold" }: any) => (
        <div className="bg-brand-950 border border-brand-gold/10 p-8 rounded-[2.5rem] relative overflow-hidden group hover:border-brand-gold transition-all duration-500 shadow-2xl">
            <div className="absolute right-[-20px] top-[-20px] opacity-5 group-hover:opacity-10 transition-opacity">
                <Icon size={120} />
            </div>
            <div className="flex justify-between items-start mb-6">
                <div className={`p-3 bg-brand-900 rounded-2xl ${colorClass} border border-white/5 shadow-inner`}>
                    <Icon size={20} />
                </div>
            </div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-2">{label}</p>
            <h3 className="text-3xl font-heading font-black text-white mb-2 tracking-tighter uppercase">{value}</h3>
            <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest">{sub}</p>
        </div>
    );

    return (
        <div className="animate-fade-in space-y-16">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 border-b border-white/5 pb-12">
                <div className="max-w-3xl">
                    <div className="flex items-center gap-4 mb-3">
                         <div className="w-2 h-2 rounded-full bg-brand-gold animate-pulse"></div>
                         <span className="text-[10px] font-black text-brand-gold uppercase tracking-[0.5em]">Portfolio Intelligence Node</span>
                    </div>
                    <h2 className="text-5xl md:text-6xl font-heading font-black text-white tracking-tighter uppercase leading-none mb-4">Performance Ledger.</h2>
                    <p className="text-white/40 text-lg font-medium leading-relaxed italic">
                        Aggregated analytical matrix for the current sovereign capital deployment across {allScenarios.length} asset scenarios.
                    </p>
                </div>
                <button 
                    onClick={handleExecuteAiAudit}
                    disabled={loadingAi}
                    className="group flex-1 w-full md:w-auto md:flex-none flex items-center justify-center gap-5 bg-brand-gold text-brand-950 font-heading font-black px-10 md:px-12 py-5 rounded-2xl md:rounded-[2.5rem] transition-all shadow-[0_20px_60px_rgba(212,175,55,0.4)] hover:bg-white active:scale-95 disabled:opacity-50"
                >
                    {loadingAi ? <Loader2 className="animate-spin" size={24}/> : <BrainCircuit size={24} />}
                    <span className="text-xs uppercase tracking-[0.4em]">Portfolio AI Audit</span>
                </button>
            </header>
            
            {loadingAi && (
                <div className="bg-brand-950 border border-brand-gold/20 p-12 md:p-20 rounded-3xl md:rounded-[4rem] animate-pulse flex flex-col items-center justify-center text-center space-y-8 shadow-[0_50px_120px_-20px_rgba(0,0,0,1)] relative overflow-hidden">
                    <div className="scanline-overlay"></div>
                    <PantherLogo className="h-16 md:h-20 w-auto brightness-0 invert opacity-10 animate-bounce" />
                    <div className="space-y-4">
                        <p className="text-brand-gold font-mono text-xs md:text-sm font-black uppercase tracking-[0.5em]">Synchronizing Strategic Reasoning Core...</p>
                        <div className="w-48 md:w-64 h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/10 mx-auto">
                            <div className="h-full bg-brand-gold animate-shimmer shadow-[0_0_20px_#d4af37]"></div>
                        </div>
                    </div>
                </div>
            )}

            {aiRiskResult && !loadingAi && (
                <div className="bg-brand-950 border border-brand-gold/40 p-8 md:p-16 rounded-3xl md:rounded-[4.5rem] shadow-[0_80px_160px_-40px_rgba(0,0,0,1)] animate-fade-up relative overflow-hidden group/audit">
                    <div className="scanline-overlay opacity-5 pointer-events-none"></div>
                    <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-gold/5 rounded-full blur-[200px] pointer-events-none -translate-y-1/2 translate-x-1/2 group-hover/audit:bg-brand-gold/10 transition-all duration-1000"></div>
                    
                    <div className="flex flex-col lg:flex-row justify-between items-start gap-12 xl:gap-20 relative z-10">
                        <div className="flex-1 space-y-10">
                            <div className="flex items-center gap-6 md:gap-8">
                                <div className="p-4 md:p-6 bg-brand-gold/10 rounded-2xl md:rounded-[2.5rem] text-brand-gold border border-brand-gold/30 shadow-xl group-hover/audit:scale-110 transition-transform duration-700">
                                    <ShieldCheck size={40} />
                                </div>
                                <div>
                                    <h4 className="text-3xl md:text-5xl font-heading font-black text-white tracking-tighter uppercase leading-none">Strategic Verdict.</h4>
                                    <p className="text-brand-gold/50 font-mono text-[10px] md:text-[11px] font-black uppercase tracking-[0.4em] mt-3 flex items-center gap-3">
                                        <Cpu size={12}/> Kernel: GEMINI_3_PRO_AUDIT_V4
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="bg-brand-900 border border-white/5 p-8 rounded-3xl shadow-inner relative overflow-hidden group/sub">
                                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover/sub:opacity-100 transition-opacity"></div>
                                    <div className="flex justify-between items-center mb-6">
                                        <p className="text-[9px] font-heading font-black text-white/30 uppercase tracking-[0.4em]">Sentiment Pulse</p>
                                        <div className={`px-4 py-1.5 rounded-full text-[9px] font-heading font-black uppercase tracking-widest shadow-2xl ${aiRiskResult.sentiment.rating === 'Bullish' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
                                            {aiRiskResult.sentiment.rating}
                                        </div>
                                    </div>
                                    <p className="text-base md:text-lg text-white/70 leading-relaxed italic font-medium">"{aiRiskResult.sentiment.logic}"</p>
                                </div>

                                <div className="bg-brand-900 border border-white/5 p-8 rounded-3xl shadow-inner flex flex-col justify-center relative overflow-hidden group/sub">
                                     <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover/sub:opacity-100 transition-opacity"></div>
                                     <p className="text-[9px] font-heading font-black text-white/30 uppercase tracking-[0.4em] mb-6">Strategic Moat Rating</p>
                                     <div className="flex items-end gap-4">
                                         <span className="text-6xl md:text-8xl font-heading font-black text-brand-gold tracking-tighter leading-none">{aiRiskResult.moatRating}</span>
                                         <span className="text-xl font-black text-white/10 mb-2">/ 10</span>
                                     </div>
                                     <div className="w-full h-2 bg-white/5 rounded-full mt-6 overflow-hidden border border-white/5 p-0.5">
                                         <div className="h-full bg-brand-gold shadow-[0_0_15px_#d4af37]" style={{ width: `${aiRiskResult.moatRating * 10}%` }}></div>
                                     </div>
                                </div>
                            </div>
                        </div>

                        <div className="w-full lg:w-[400px] space-y-8">
                            <div className="text-center p-10 md:p-12 bg-brand-gold/5 border border-brand-gold/20 rounded-[3rem] md:rounded-[4rem] shadow-2xl relative overflow-hidden">
                                <div className="scanline-overlay opacity-[0.03] pointer-events-none"></div>
                                <p className="text-[10px] md:text-[11px] font-mono font-black text-brand-gold/50 uppercase tracking-[0.5em] mb-4">Aggregate Risk Score</p>
                                <div className="text-8xl md:text-[10rem] font-heading font-black text-white tracking-tighter leading-none">{aiRiskResult.riskScore}</div>
                                <p className={`mt-8 text-[10px] font-heading font-black uppercase tracking-[0.5em] py-3 rounded-2xl border ${aiRiskResult.riskScore > 50 ? 'text-red-400 border-red-500/20 bg-red-500/5' : 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5'}`}>
                                    {aiRiskResult.riskScore > 50 ? 'Critical Vulnerability Detected' : 'Operational Parameters Normal'}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mt-12 relative z-10">
                        {aiRiskResult.vulnerabilities.map((v: any, i: number) => (
                            <div key={i} className="p-8 bg-brand-950 border border-white/5 rounded-3xl group/node hover:border-brand-gold/30 transition-all shadow-xl">
                                <div className="flex justify-between items-center mb-4">
                                    <h5 className="text-white font-heading font-black text-xs md:text-sm tracking-widest uppercase">{v.node}</h5>
                                    <span className={`text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg border ${v.impact === 'High' ? 'bg-red-500/20 text-red-400 border-red-500/30' : 'bg-amber-500/20 text-amber-400 border-amber-500/30'}`}>
                                        {v.impact} Impact
                                    </span>
                                </div>
                                <p className="text-xs md:text-[13px] text-white/50 leading-relaxed font-medium">{v.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* KPI Aggregates */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <StatCard 
                    label="Portfolio Value" 
                    value={`$${(aggregates.totalValue / 1000000).toFixed(1)}M`} 
                    sub="Aggregate Acquisition Cost" 
                    icon={Building2} 
                />
                <StatCard 
                    label="Net Cash Flow" 
                    value={`$${(aggregates.totalCashFlow / 1000).toFixed(0)}K`} 
                    sub="Annual Liquid Surplus" 
                    icon={DollarSign} 
                    colorClass="text-emerald-400"
                />
                <StatCard 
                    label="Portfolio LTV" 
                    value={`${aggregates.portfolioLtv.toFixed(1)}%`}
                    sub="Leverage Exposure"
                    icon={Shield}
                    colorClass="text-amber-400"
                />
                 <StatCard 
                    label="Debt Yield" 
                    value={`${aggregates.debtYield.toFixed(2)}%`}
                    sub="Lender's Return Metric"
                    icon={TrendingUp}
                />
            </div>

            {/* Asset Breakdown Ledger */}
            <div className="bg-brand-950 border border-brand-gold/10 rounded-[3.5rem] p-10 md:p-12 shadow-2xl relative overflow-hidden">
                <div className="scanline-overlay opacity-[0.03] pointer-events-none"></div>
                <h3 className="text-3xl font-heading font-black text-white uppercase tracking-tighter mb-12 flex items-center gap-5">
                    <Layers size={32} className="text-brand-gold" />
                    Asset Ledger.
                </h3>
                
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="border-b border-white/5">
                                <th className="text-left py-6 text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">Asset Node</th>
                                <th className="text-right py-6 text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">Value</th>
                                <th className="text-right py-6 text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">Cap Rate</th>
                                <th className="text-right py-6 text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">Cash Flow</th>
                                <th className="text-right py-6 text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">DSCR</th>
                                <th className="py-6 w-20"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {aggregates.assets.map((asset, i) => (
                                <tr key={asset.id} className="border-b border-white/5 group hover:bg-brand-gold/[0.02] transition-colors">
                                    <td className="py-8 pr-6">
                                        <p className="text-white font-heading font-black text-lg tracking-tight uppercase group-hover:text-brand-gold transition-colors">{asset.name}</p>
                                        <p className="text-[10px] text-white/30 font-mono mt-1 truncate max-w-[240px] uppercase">{asset.address}</p>
                                    </td>
                                    <td className="py-8 text-right font-mono text-sm text-white/80">
                                        ${(asset.value / 1000).toLocaleString()}K
                                    </td>
                                    <td className="py-8 text-right">
                                        <span className={`text-sm font-black px-3 py-1 rounded-lg border ${asset.capRate > 6 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-brand-gold/10 text-brand-gold border-brand-gold/20'}`}>
                                            {asset.capRate.toFixed(2)}%
                                        </span>
                                    </td>
                                    <td className="py-8 text-right font-mono text-sm text-white/80">
                                        ${(asset.cashFlow / 1000).toLocaleString()}K
                                    </td>
                                    <td className="py-8 text-right font-mono text-sm text-white/80">
                                        <span className={asset.dscr >= 1.25 ? 'text-emerald-400' : 'text-red-400'}>
                                            {asset.dscr.toFixed(2)}x
                                        </span>
                                    </td>
                                    <td className="py-8 text-right">
                                        <button 
                                            onClick={() => onNavigate(`/data-tools/portfolio/leverage-analysis`)}
                                            className="p-3 bg-white/5 rounded-xl text-white/20 hover:text-brand-gold hover:bg-brand-gold/10 transition-all opacity-0 group-hover:opacity-100"
                                        >
                                            <ArrowRight size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Diversity & Risk Matrix Visualization */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="bg-brand-950 border border-brand-gold/10 rounded-[3.5rem] p-12 shadow-2xl relative overflow-hidden group">
                    <h3 className="text-2xl font-heading font-black text-white uppercase tracking-tighter mb-10 flex items-center gap-5">
                        <PieChart size={24} className="text-brand-gold" />
                        Allocation Node.
                    </h3>
                    <div className="flex items-center gap-12">
                        <div className="flex-1 space-y-6">
                            {aggregates.assets.slice(0, 5).map((asset, i) => (
                                <div key={asset.id} className="space-y-2">
                                    <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-white/30">
                                        <span>{asset.name}</span>
                                        <span>{((asset.value / aggregates.totalValue) * 100).toFixed(1)}%</span>
                                    </div>
                                    <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                                        <div 
                                            className="h-full bg-brand-gold shadow-[0_0_10px_#d4af37] transition-all duration-1000" 
                                            style={{ width: `${(asset.value / aggregates.totalValue) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="hidden sm:flex w-40 h-40 rounded-full border-[15px] border-white/5 relative items-center justify-center group-hover:scale-105 transition-transform duration-700">
                             <LayoutDashboard className="text-brand-gold/20" size={40} />
                             <div className="absolute inset-0 rounded-full border-[15px] border-brand-gold border-t-transparent animate-spin opacity-40"></div>
                        </div>
                    </div>
                </div>

                <div className="bg-brand-950 border border-brand-gold/10 rounded-[3.5rem] p-12 shadow-2xl relative overflow-hidden group">
                    <h3 className="text-2xl font-heading font-black text-white uppercase tracking-tighter mb-10 flex items-center gap-5">
                        <ShieldCheck size={24} className="text-brand-gold" />
                        Liquidity Pulse.
                    </h3>
                    <div className="space-y-8">
                        <div className="p-8 bg-brand-gold/5 border border-brand-gold/20 rounded-[2.5rem] shadow-xl">
                            <div className="flex justify-between items-end mb-6">
                                <p className="text-[10px] font-black text-brand-gold/60 uppercase tracking-widest">Aggregate DSCR Index</p>
                                <p className="text-3xl font-heading font-black text-white">{aggregates.avgDscr.toFixed(2)}x</p>
                            </div>
                            <div className="h-2 w-full bg-brand-950 rounded-full overflow-hidden border border-brand-gold/10">
                                <div 
                                    className={`h-full shadow-[0_0_15px_currentColor] transition-all duration-1000 ${aggregates.avgDscr >= 1.25 ? 'bg-emerald-400 text-emerald-400' : 'bg-red-400 text-red-400'}`}
                                    style={{ width: `${Math.min(100, (aggregates.avgDscr / 2) * 100)}%` }}
                                ></div>
                            </div>
                            <p className="text-[9px] text-white/30 font-bold uppercase tracking-[0.2em] mt-6 italic">
                                Threshold Stability: {aggregates.avgDscr >= 1.25 ? 'INSTITUTIONAL_SAFE' : 'RE-LEVERAGE_REQUIRED'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PortfolioPerformance;