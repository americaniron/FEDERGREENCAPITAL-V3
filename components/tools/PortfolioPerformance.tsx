
import React, { useMemo } from 'react';
import { FinancialScenario } from '../../types';
import { Finance } from '../../lib/finance-engine';
import { 
    LayoutDashboard, TrendingUp, DollarSign, BarChart3, 
    Layers, PieChart, ShieldCheck, ArrowRight,
    Building2, Activity, Percent, Clock
} from 'lucide-react';

interface PortfolioPerformanceProps {
    allScenarios: FinancialScenario[];
    onNavigate: (path: string) => void;
}

const PortfolioPerformance: React.FC<PortfolioPerformanceProps> = ({ allScenarios, onNavigate }) => {
    
    const aggregates = useMemo(() => {
        let totalValue = 0;
        let totalNoi = 0;
        let totalCashFlow = 0;
        let weightedCapRateSum = 0;
        let weightedDscrSum = 0;
        let totalDebtService = 0;

        const assetDetails = allScenarios.map(s => {
            // Basic calculations per scenario
            const monthlyRent = s.grossPotentialRent + s.otherIncome;
            const vacancyLoss = monthlyRent * (s.vacancyRate / 100);
            const egi = (monthlyRent - vacancyLoss) * 12;
            
            const mgmtFee = egi * (s.managementFee / 100);
            const opex = s.propertyTax + s.insurance + s.maintenance + s.utilities + s.otherExpenses + s.hoa + mgmtFee;
            
            // Fix: Changed 'oopex' to 'opex' to resolve the undefined variable error
            const noi = Finance.noi(egi, opex);
            const noiFixed = egi - opex;

            const monthlyDebt = Finance.mortgagePayment(s.loanAmount, s.interestRate, s.termYears);
            const annualDebt = monthlyDebt * 12;
            const cashFlow = noiFixed - annualDebt;

            const capRate = s.purchasePrice > 0 ? (noiFixed / s.purchasePrice) * 100 : 0;
            const dscr = annualDebt > 0 ? noiFixed / annualDebt : 0;

            totalValue += s.purchasePrice;
            totalNoi += noiFixed;
            totalCashFlow += cashFlow;
            totalDebtService += annualDebt;

            return {
                id: s.id,
                name: s.name,
                address: s.propertyAddress,
                value: s.purchasePrice,
                noi: noiFixed,
                cashFlow,
                capRate,
                dscr
            };
        });

        const avgCapRate = totalValue > 0 ? (totalNoi / totalValue) * 100 : 0;
        const avgDscr = totalDebtService > 0 ? totalNoi / totalDebtService : 0;

        return {
            totalValue,
            totalNoi,
            totalCashFlow,
            avgCapRate,
            avgDscr,
            assets: assetDetails
        };
    }, [allScenarios]);

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
                <div className="hidden lg:flex gap-2">
                    {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className="w-1.5 h-10 bg-brand-gold rounded-full opacity-20 animate-pulse" style={{animationDelay: `${i*150}ms`}}></div>
                    ))}
                </div>
            </header>

            {/* KPI Aggregates */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <StatCard 
                    label="Portfolio Value" 
                    value={`$${(aggregates.totalValue / 1000000).toFixed(1)}M`} 
                    sub="Aggregate Acquisition Cost" 
                    icon={Building2} 
                />
                <StatCard 
                    label="Annual NOI" 
                    value={`$${(aggregates.totalNoi / 1000).toFixed(0)}K`} 
                    sub="Operating Profit Basis" 
                    icon={Activity} 
                    colorClass="text-emerald-400"
                />
                <StatCard 
                    label="Net Cash Flow" 
                    value={`$${(aggregates.totalCashFlow / 1000).toFixed(0)}K`} 
                    sub="Annual Liquid Surplus" 
                    icon={DollarSign} 
                    colorClass="text-indigo-400"
                />
                <StatCard 
                    label="Average Yield" 
                    value={`${aggregates.avgCapRate.toFixed(2)}%`} 
                    sub="Blended Cap Rate Index" 
                    icon={Percent} 
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
