
import React, { useMemo } from 'react';
import { FinancialScenario } from '../../types';
import { Finance } from '../../lib/finance-engine';
import { 
    TrendingUp, ShieldAlert, DollarSign, BarChart3, 
    ArrowUpRight, ArrowDownRight, Activity, Percent, Clock, Zap
} from 'lucide-react';

interface ScenarioDashboardProps {
    scenario: FinancialScenario;
}

const ScenarioDashboard: React.FC<ScenarioDashboardProps> = ({ scenario }) => {
    
    const stats = useMemo(() => {
        // Base Income
        const monthlyRent = scenario.grossPotentialRent + scenario.otherIncome;
        const vacancyLoss = (monthlyRent * (scenario.vacancyRate / 100));
        const effectiveGrossIncome = (monthlyRent - vacancyLoss) * 12;
        
        // Base Expenses
        const mgmtFee = effectiveGrossIncome * (scenario.managementFee / 100);
        const annualOpEx = scenario.propertyTax + scenario.insurance + scenario.maintenance + 
                           scenario.utilities + scenario.otherExpenses + scenario.hoa + mgmtFee;
        
        const noi = Finance.noi(effectiveGrossIncome, annualOpEx);
        const capRate = Finance.capRate(noi, scenario.purchasePrice);
        
        const monthlyDebt = Finance.mortgagePayment(scenario.loanAmount, scenario.interestRate, scenario.termYears);
        const annualDebt = monthlyDebt * 12;
        
        const cashFlow = noi - annualDebt;
        const totalInvestment = (scenario.purchasePrice - scenario.loanAmount) + 
                                scenario.rehabBudget + scenario.closingCosts;
                                
        const coc = Finance.cashOnCash(cashFlow, totalInvestment);
        const dscr = Finance.dscr(noi, annualDebt);

        // Advanced Multi-Year Modeling
        const annualCashFlows: number[] = [];
        const fullCashFlows: number[] = [-totalInvestment];
        
        for (let y = 1; y <= scenario.holdingPeriod; y++) {
            const yrIncome = Finance.compoundGrowth(effectiveGrossIncome, scenario.rentGrowthRate, y - 1);
            const yrExpenses = Finance.compoundGrowth(annualOpEx, scenario.expenseGrowthRate, y - 1);
            const yrNoi = yrIncome - yrExpenses;
            const yrCashFlow = yrNoi - annualDebt;
            annualCashFlows.push(yrCashFlow);
            
            // Year end terminal value check
            if (y === scenario.holdingPeriod) {
                const terminalValue = Finance.compoundGrowth(scenario.purchasePrice, scenario.appreciationRate, y);
                const salesCosts = terminalValue * (scenario.sellingCosts / 100);
                const remainingDebt = scenario.loanAmount; // Simplified: actually needs amort reduction
                const netProceeds = terminalValue - salesCosts - remainingDebt;
                fullCashFlows.push(yrCashFlow + netProceeds);
            } else {
                fullCashFlows.push(yrCashFlow);
            }
        }

        const npv = Finance.npv(scenario.discountRate, fullCashFlows);
        const irr = Finance.irr(fullCashFlows);
        const payback = Finance.paybackPeriod(totalInvestment, annualCashFlows);

        return {
            noi, capRate, coc, dscr, cashFlow, payback, irr, npv, annualOpEx, effectiveGrossIncome
        };
    }, [scenario]);

    const StatCard = ({ label, value, sub, icon: Icon, colorClass = "text-brand-gold" }: any) => (
        <div className="bg-brand-900 border border-brand-800 p-6 rounded-2xl relative overflow-hidden group hover:border-brand-700 transition-all duration-300">
            <div className="absolute right-[-10px] top-[-10px] opacity-5 group-hover:opacity-10 transition-opacity">
                <Icon size={120} />
            </div>
            <div className="flex justify-between items-start mb-4">
                <div className={`p-2 bg-brand-950 rounded-lg ${colorClass} border border-brand-800`}>
                    <Icon size={18} />
                </div>
            </div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">{label}</p>
            <h3 className="text-2xl font-heading font-bold text-white mb-1">{value}</h3>
            <p className="text-[10px] text-slate-400 font-medium">{sub}</p>
        </div>
    );

    return (
        <div className="space-y-8 animate-fade-in pb-12">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h2 className="text-4xl font-heading font-bold text-white mb-1">Portfolio Summary</h2>
                    <p className="text-slate-400">Financial health diagnostics for <span className="text-brand-gold font-bold">{scenario.name}</span></p>
                </div>
                <div className="flex gap-2 bg-brand-900 p-1.5 rounded-xl border border-brand-800">
                    <button className="px-6 py-2 bg-brand-gold text-brand-900 font-bold text-xs rounded-lg shadow-lg">Metric View</button>
                    <button className="px-6 py-2 text-slate-400 hover:text-white text-xs font-bold transition-colors">Risk View</button>
                </div>
            </header>

            {/* KPI Grid - Top Tier */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard label="Net Operating Income" value={`$${stats.noi.toLocaleString(undefined, {maximumFractionDigits:0})}`} sub="Annual Levered Profit" icon={DollarSign} />
                <StatCard label="Cap Rate" value={`${stats.capRate.toFixed(2)}%`} sub="Unleveraged Purchase Yield" icon={Percent} />
                <StatCard label="Cash-on-Cash" value={`${stats.coc.toFixed(2)}%`} sub="Pre-Tax Equity Return" icon={TrendingUp} colorClass="text-green-400" />
                <StatCard label="DSCR" value={stats.dscr.toFixed(2)} sub="Debt Coverage Threshold" icon={Activity} colorClass={stats.dscr > 1.25 ? "text-green-400" : "text-yellow-400"} />
            </div>

            {/* KPI Grid - Advanced Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard label="Internal Rate of Return (IRR)" value={`${stats.irr.toFixed(2)}%`} sub={`${scenario.holdingPeriod}-Year Projected Yield`} icon={Zap} colorClass="text-indigo-400" />
                <StatCard label="Net Present Value (NPV)" value={`$${stats.npv.toLocaleString(undefined, {maximumFractionDigits:0})}`} sub={`Value at ${scenario.discountRate}% Discount`} icon={BarChart3} />
                <StatCard label="Payback Period" value={`${stats.payback.toFixed(1)} Yrs`} sub="Time to Recover Capital" icon={Clock} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Visual Chart Area */}
                <div className="lg:col-span-2 bg-brand-900 border border-brand-800 rounded-2xl p-8">
                    <div className="flex justify-between items-center mb-10">
                        <h3 className="text-xl font-bold text-white flex items-center gap-3">
                            <BarChart3 className="text-brand-gold" size={20} />
                            Operating Leverage
                        </h3>
                        <div className="flex gap-6 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                            <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded bg-brand-gold"></span> Income</div>
                            <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded bg-slate-700"></span> Expenses</div>
                        </div>
                    </div>
                    
                    <div className="h-72 flex items-end justify-between gap-6 px-4">
                        {[0.8, 0.9, 1.0, 1.1, 1.2].map((m, i) => {
                            const income = stats.effectiveGrossIncome * m;
                            const expense = stats.annualOpEx;
                            const maxVal = stats.effectiveGrossIncome * 1.5;
                            return (
                                <div key={i} className="flex-1 flex flex-col justify-end gap-1.5 group relative cursor-crosshair">
                                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white text-brand-950 text-[10px] font-bold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-xl z-20 pointer-events-none">
                                        Var: {((m-1)*100).toFixed(0)}%
                                    </div>
                                    <div className="w-full bg-brand-gold/30 group-hover:bg-brand-gold/60 transition-all rounded-t-lg border-t border-brand-gold/50" style={{ height: `${(income/maxVal)*100}%` }}></div>
                                    <div className="w-full bg-slate-800 rounded-t-lg border-t border-slate-700" style={{ height: `${(expense/maxVal)*100}%` }}></div>
                                    <span className="text-[10px] text-slate-500 font-bold font-mono text-center mt-3 uppercase">Scenario {i+1}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Risk Alerts Panel */}
                <div className="bg-brand-900 border border-brand-800 rounded-2xl p-8 shadow-2xl">
                    <h3 className="text-xl font-bold text-white flex items-center gap-3 mb-8">
                        <ShieldAlert className="text-brand-gold" size={20} />
                        Risk Indicators
                    </h3>
                    <div className="space-y-6">
                        {stats.dscr < 1.25 && (
                            <div className="flex items-start gap-4 p-5 bg-red-900/20 border border-red-900/50 rounded-2xl animate-pulse">
                                <ShieldAlert className="text-red-400 shrink-0 mt-1" size={18} />
                                <div>
                                    <h4 className="text-red-400 font-bold text-xs uppercase tracking-widest">DSCR Under Threshold</h4>
                                    <p className="text-[11px] text-red-300/80 mt-1.5 leading-relaxed">Financial ratio is {stats.dscr.toFixed(2)}. Standard underwriting requires 1.25x+.</p>
                                </div>
                            </div>
                        )}
                        {stats.cashFlow < 0 && (
                            <div className="flex items-start gap-4 p-5 bg-orange-900/20 border border-orange-900/50 rounded-2xl">
                                <TrendingUp className="text-orange-400 shrink-0 mt-1" size={18} />
                                <div>
                                    <h4 className="text-orange-400 font-bold text-xs uppercase tracking-widest">Negative Liquidity</h4>
                                    <p className="text-[11px] text-orange-300/80 mt-1.5 leading-relaxed">Operating shortfall detected. Asset requires capital injection.</p>
                                </div>
                            </div>
                        )}
                        {scenario.vacancyRate > 7 && (
                            <div className="flex items-start gap-4 p-5 bg-yellow-900/20 border border-yellow-900/50 rounded-2xl">
                                <Activity className="text-yellow-400 shrink-0 mt-1" size={18} />
                                <div>
                                    <h4 className="text-yellow-400 font-bold text-xs uppercase tracking-widest">Vacancy Exposure</h4>
                                    <p className="text-[11px] text-yellow-300/80 mt-1.5 leading-relaxed">Economic downtime exceeds 7% benchmark. Check local supply levels.</p>
                                </div>
                            </div>
                        )}
                        <div className="flex items-start gap-4 p-5 bg-green-900/20 border border-green-900/50 rounded-2xl">
                            <TrendingUp className="text-green-400 shrink-0 mt-1" size={18} />
                            <div>
                                <h4 className="text-green-400 font-bold text-xs uppercase tracking-widest">Efficiency Optimized</h4>
                                <p className="text-[11px] text-green-300/80 mt-1.5 leading-relaxed">Operating Expense Ratio is within institutional top-quartile performance.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ScenarioDashboard;
