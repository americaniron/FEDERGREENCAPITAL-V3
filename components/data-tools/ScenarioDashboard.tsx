
import React, { useMemo, useState } from 'react';
import { FinancialScenario } from '../../types';
import { Finance } from '../../lib/finance-engine';
import { analyzePortfolioRisk } from '../../services/geminiService';
import { 
    TrendingUp, ShieldAlert, DollarSign, BarChart3, 
    ArrowUpRight, ArrowDownRight, Activity, Percent, Clock, Zap,
    BrainCircuit, Loader2, ShieldCheck, Fingerprint, Eye, Sparkles,
    AlertTriangle, Globe, Shield, Search, Cpu, Landmark
} from 'lucide-react';
import { PantherLogo } from '../PantherLogo';

interface ScenarioDashboardProps {
    scenario: FinancialScenario;
}

const ScenarioDashboard: React.FC<ScenarioDashboardProps> = ({ scenario }) => {
    const [aiRiskResult, setAiRiskResult] = useState<any>(null);
    const [loadingAi, setLoadingAi] = useState(false);
    
    const stats = useMemo(() => {
        // Base Income
        const monthlyRent = (scenario.grossPotentialRent || 0) + (scenario.otherIncome || 0);
        const vacancyLoss = (monthlyRent * ((scenario.vacancyRate || 0) / 100));
        const effectiveGrossIncome = (monthlyRent - vacancyLoss) * 12;
        
        // Base Expenses
        const mgmtFee = effectiveGrossIncome * ((scenario.managementFee || 0) / 100);
        const annualOpEx = (scenario.propertyTax || 0) + (scenario.insurance || 0) + (scenario.maintenance || 0) + 
                           (scenario.utilities || 0) + (scenario.otherExpenses || 0) + (scenario.hoa || 0) + mgmtFee;
        
        const noi = Finance.noi(effectiveGrossIncome, annualOpEx);
        const capRate = Finance.capRate(noi, scenario.purchasePrice);
        
        const monthlyDebt = Finance.mortgagePayment(scenario.loanAmount, scenario.interestRate, scenario.termYears);
        const annualDebt = monthlyDebt * 12;
        
        const cashFlow = noi - annualDebt;
        const totalInvestment = (scenario.purchasePrice - scenario.loanAmount) + 
                                (scenario.rehabBudget || 0) + (scenario.closingCosts || 0);
                                
        const coc = Finance.cashOnCash(cashFlow, totalInvestment);
        const dscr = Finance.dscr(noi, annualDebt);

        // Advanced Multi-Year Modeling
        const annualCashFlows: number[] = [];
        const fullCashFlows: number[] = [-totalInvestment];
        
        for (let y = 1; y <= (scenario.holdingPeriod || 1); y++) {
            const yrIncome = Finance.compoundGrowth(effectiveGrossIncome, scenario.rentGrowthRate || 0, y - 1);
            const yrExpenses = Finance.compoundGrowth(annualOpEx, scenario.expenseGrowthRate || 0, y - 1);
            const yrNoi = yrIncome - yrExpenses;
            const yrCashFlow = yrNoi - annualDebt;
            annualCashFlows.push(yrCashFlow);
            
            if (y === (scenario.holdingPeriod || 1)) {
                const terminalValue = Finance.compoundGrowth(scenario.purchasePrice, scenario.appreciationRate || 0, y);
                const salesCosts = terminalValue * ((scenario.sellingCosts || 0) / 100);
                const netProceeds = terminalValue - salesCosts - scenario.loanAmount;
                fullCashFlows.push(yrCashFlow + netProceeds);
            } else {
                fullCashFlows.push(yrCashFlow);
            }
        }

        const npv = Finance.npv(scenario.discountRate || 0, fullCashFlows);
        const irr = Finance.irr(fullCashFlows);
        const payback = Finance.paybackPeriod(totalInvestment, annualCashFlows);

        return {
            noi, capRate, coc, dscr, cashFlow, payback, irr, npv, annualOpEx, effectiveGrossIncome, totalInvestment
        };
    }, [scenario]);

    const handleExecuteAiAudit = async () => {
        setLoadingAi(true);
        const result = await analyzePortfolioRisk({
            ...scenario,
            calculatedStats: stats
        });
        setAiRiskResult(result);
        setLoadingAi(false);
    };

    const StatCard = ({ label, value, sub, icon: Icon, colorClass = "text-brand-gold" }: any) => (
        <div className="bg-brand-900 border border-brand-gold/10 p-8 rounded-[2rem] relative overflow-hidden group hover:border-brand-gold transition-all duration-500 shadow-2xl">
            <div className="absolute right-[-10px] top-[-10px] opacity-5 group-hover:opacity-10 transition-opacity">
                <Icon size={120} />
            </div>
            <div className="flex justify-between items-start mb-6">
                <div className={`p-3 bg-brand-950 rounded-2xl ${colorClass} border border-white/5 shadow-inner group-hover:scale-110 transition-transform`}>
                    <Icon size={20} />
                </div>
            </div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-2">{label}</p>
            <h3 className="text-2xl md:text-3xl font-heading font-black text-white mb-2 tracking-tighter uppercase">{value}</h3>
            <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest">{sub}</p>
        </div>
    );

    return (
        <div className="space-y-12 md:space-y-16 animate-fade-in pb-12">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 border-b border-white/5 pb-10">
                <div className="text-left">
                    <div className="flex items-center gap-4 mb-3">
                         <div className="w-2 h-2 rounded-full bg-brand-gold animate-pulse"></div>
                         <span className="text-[10px] font-black text-brand-gold uppercase tracking-[0.5em]">Executive Summary Node</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-black text-white tracking-tighter uppercase mb-2 leading-none">Diagnostic Dashboard.</h2>
                    <p className="text-white/40 text-base md:text-lg font-medium">Financial health analysis for <span className="text-brand-gold font-black uppercase tracking-tight">{scenario.name}</span></p>
                </div>
                <div className="flex gap-4 w-full md:w-auto">
                    <button 
                        onClick={handleExecuteAiAudit}
                        disabled={loadingAi}
                        className="group flex-1 md:flex-none flex items-center justify-center gap-5 bg-brand-gold text-brand-950 font-heading font-black px-10 md:px-12 py-5 rounded-2xl md:rounded-[2.5rem] transition-all shadow-[0_20px_60px_rgba(212,175,55,0.4)] hover:bg-white active:scale-95 disabled:opacity-50"
                    >
                        {loadingAi ? <Loader2 className="animate-spin" size={24}/> : <BrainCircuit size={24} />}
                        <span className="text-xs uppercase tracking-[0.4em]">Initialize AI Audit</span>
                    </button>
                </div>
            </header>

            {/* AI Risk Output Node */}
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

            {/* KPI Grid - Top Tier */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                <StatCard label="Net Operating Income" value={`$${stats.noi.toLocaleString(undefined, {maximumFractionDigits:0})}`} sub="Annual Levered Profit" icon={DollarSign} />
                <StatCard label="Cap Rate" value={`${stats.capRate.toFixed(2)}%`} sub="Unleveraged Purchase Yield" icon={Percent} />
                <StatCard label="Cash-on-Cash" value={`${stats.coc.toFixed(2)}%`} sub="Pre-Tax Equity Return" icon={TrendingUp} colorClass="text-emerald-400" />
                <StatCard label="DSCR" value={stats.dscr.toFixed(2)} sub="Debt Coverage Threshold" icon={Activity} colorClass={stats.dscr > 1.25 ? "text-emerald-400" : "text-amber-400"} />
            </div>

            {/* Visual Analytics Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
                <div className="lg:col-span-8 bg-brand-900 border border-brand-gold/10 rounded-[2.5rem] md:rounded-[3.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden group">
                    <div className="scanline-overlay opacity-[0.03] pointer-events-none"></div>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 md:mb-16 relative z-10 gap-6">
                        <div>
                            <h3 className="text-2xl md:text-3xl font-heading font-black text-white uppercase tracking-tighter flex items-center gap-4">
                                <BarChart3 className="text-brand-gold" size={28} />
                                Operating Leverage.
                            </h3>
                            <p className="text-white/30 text-[10px] font-bold uppercase tracking-widest mt-2">Sensitivity analysis across multi-variant market conditions.</p>
                        </div>
                        <div className="flex gap-6 text-[9px] font-black uppercase tracking-[0.3em] text-white/40">
                            <div className="flex items-center gap-2.5"><span className="w-2.5 h-2.5 rounded bg-brand-gold shadow-[0_0_10px_#d4af37]"></span> Income</div>
                            <div className="flex items-center gap-2.5"><span className="w-2.5 h-2.5 rounded bg-slate-700"></span> Expenses</div>
                        </div>
                    </div>
                    
                    <div className="h-64 md:h-80 flex items-end justify-between gap-4 md:gap-8 px-2 md:px-6 relative z-10">
                        {[0.8, 0.9, 1.0, 1.1, 1.2].map((m, i) => {
                            const income = stats.effectiveGrossIncome * m;
                            const expense = stats.annualOpEx;
                            const maxVal = stats.effectiveGrossIncome * 1.5;
                            return (
                                <div key={i} className="flex-1 flex flex-col justify-end gap-1.5 md:gap-2 group/bar relative cursor-crosshair h-full">
                                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white text-brand-950 text-[9px] font-black px-3 py-1.5 rounded-lg opacity-0 group-hover/bar:opacity-100 transition-all shadow-2xl z-40 pointer-events-none uppercase tracking-widest">
                                        {((m-1)*100).toFixed(0)}% Var
                                    </div>
                                    <div className="w-full bg-brand-gold/30 group-hover/bar:bg-brand-gold/70 transition-all rounded-t-xl border-t border-brand-gold/50" style={{ height: `${(income/maxVal)*100}%` }}></div>
                                    <div className="w-full bg-slate-800 rounded-t-xl border-t border-slate-700" style={{ height: `${(expense/maxVal)*100}%` }}></div>
                                    <div className="text-[8px] text-white/20 font-black font-mono text-center mt-4 md:mt-6 uppercase tracking-widest">S_{i+1}</div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="lg:col-span-4 bg-brand-900 border border-brand-gold/10 rounded-[2.5rem] md:rounded-[3.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden group">
                    <div className="scanline-overlay opacity-[0.03] pointer-events-none"></div>
                    <h3 className="text-2xl md:text-3xl font-heading font-black text-white uppercase tracking-tighter flex items-center gap-4 mb-10 md:mb-12">
                        <ShieldAlert className="text-brand-gold" size={28} />
                        Risk Pulse.
                    </h3>
                    <div className="space-y-6 md:space-y-8 relative z-10">
                        {stats.dscr < 1.25 && (
                            <div className="flex items-start gap-5 p-6 bg-red-900/10 border border-red-900/30 rounded-3xl animate-pulse shadow-xl">
                                <ShieldAlert className="text-red-400 shrink-0 mt-1" size={20} />
                                <div>
                                    <h4 className="text-red-400 font-black text-[11px] uppercase tracking-widest">Underwriting Alert</h4>
                                    <p className="text-[10px] text-red-300/60 mt-2 leading-relaxed font-medium">Debt coverage ratio ({stats.dscr.toFixed(2)}) is below 1.25x.</p>
                                </div>
                            </div>
                        )}
                        {stats.cashFlow < 0 && (
                            <div className="flex items-start gap-5 p-6 bg-amber-900/10 border border-amber-900/30 rounded-3xl shadow-xl">
                                <Activity className="text-amber-400 shrink-0 mt-1" size={20} />
                                <div>
                                    <h4 className="text-amber-400 font-black text-[11px] uppercase tracking-widest">Liquidity Shortfall</h4>
                                    <p className="text-[10px] text-amber-300/60 mt-2 leading-relaxed font-medium">Operating projections indicate negative annual liquidity.</p>
                                </div>
                            </div>
                        )}
                        <div className="flex items-start gap-5 p-6 bg-brand-gold/5 border border-brand-gold/20 rounded-3xl shadow-xl group-hover:bg-brand-gold/10 transition-all">
                            <TrendingUp className="text-brand-gold shrink-0 mt-1" size={20} />
                            <div>
                                <h4 className="text-brand-gold font-black text-[11px] uppercase tracking-widest">Growth Elasticity</h4>
                                <p className="text-[10px] text-white/40 mt-2 leading-relaxed font-medium">Market appreciation rate optimized for prime asset classes.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* KPI Grid - Advanced Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                <StatCard label="Internal Rate of Return (IRR)" value={`${(stats.irr || 0).toFixed(2)}%`} sub={`${scenario.holdingPeriod}-Year Projected Yield`} icon={Zap} colorClass="text-indigo-400" />
                <StatCard label="Net Present Value (NPV)" value={`$${(stats.npv || 0).toLocaleString(undefined, {maximumFractionDigits:0})}`} sub={`Value at ${scenario.discountRate}% Discount`} icon={BarChart3} />
                <StatCard label="Payback Window" value={`${(stats.payback || 0).toFixed(1)} Yrs`} sub="Capital Recovery Lifecycle" icon={Clock} />
            </div>
        </div>
    );
};

export default ScenarioDashboard;
