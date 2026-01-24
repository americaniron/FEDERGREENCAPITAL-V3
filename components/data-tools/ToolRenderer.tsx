
import React, { useMemo, useState } from 'react';
import { FinancialScenario } from '../../types';
import { Finance } from '../../lib/finance-engine';
import { TOOL_REGISTRY, ToolDef } from '../../lib/tool-registry';
import MarketIntelligence from '../tools/MarketIntelligence';
import BusinessPlanBuilder from '../tools/BusinessPlanBuilder';
import BusinessIntelligence from '../tools/BusinessIntelligence';
import ApiSettings from '../tools/ApiSettings';
import ComplianceHub from '../tools/ComplianceHub';
import { ScenarioManager } from '../../lib/scenario-manager';
import { 
    Calculator, TrendingUp, Info, Download, Copy, FileSpreadsheet, 
    ArrowUpRight, DollarSign, Activity, Percent, Clock, 
    UserCheck, Table, History, Scale, Coins, Settings, Sparkles, Plus, Trash2,
    Layers, Briefcase, Globe, Shield, Users, PieChart, FileCheck, ShieldCheck,
    BarChart3, Zap, ToggleLeft, ToggleRight, ChevronDown, X
} from 'lucide-react';

interface ToolRendererProps {
    toolId: string | null;
    categoryId: string | null;
    scenario: FinancialScenario;
    allScenarios: FinancialScenario[];
    onUpdateScenario: (updates: Partial<FinancialScenario>) => void;
}

const ToolRenderer: React.FC<ToolRendererProps> = ({ toolId, categoryId, scenario, allScenarios, onUpdateScenario }) => {
    const [useNcfForDscr, setUseNcfForDscr] = useState(false);
    const [isScenarioManagerOpen, setIsScenarioManagerOpen] = useState(false);

    const tool = useMemo(() => TOOL_REGISTRY.find(t => t.id === toolId), [toolId]);
    
    const handleScenarioSelect = (id: string) => {
        ScenarioManager.setActiveScenarioId(id);
        const newActive = ScenarioManager.getActiveScenario();
        onUpdateScenario(newActive); // This triggers a state update in the parent
        setIsScenarioManagerOpen(false);
    };

    const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

    const sharedData = useMemo(() => {
        if (!scenario) return null;
        const monthlyRent = scenario.grossPotentialRent + scenario.otherIncome;
        const vacancyLoss = (monthlyRent * (scenario.vacancyRate / 100));
        const effectiveGrossIncome = (monthlyRent - vacancyLoss) * 12;
        const mgmtFee = effectiveGrossIncome * (scenario.managementFee / 100);
        const annualOpEx = scenario.propertyTax + scenario.insurance + scenario.maintenance + 
                           scenario.utilities + scenario.otherExpenses + scenario.hoa + mgmtFee;
        
        const noi = Finance.noi(effectiveGrossIncome, annualOpEx);
        const capRate = Finance.capRate(noi, scenario.purchasePrice);
        const monthlyDebt = Finance.mortgagePayment(scenario.loanAmount, scenario.interestRate, scenario.termYears, scenario.loanType);
        const annualDebt = monthlyDebt * 12;
        const cashFlow = noi - annualDebt;
        const totalInvestment = (scenario.purchasePrice - scenario.loanAmount) + scenario.rehabBudget + scenario.closingCosts;
        const coc = Finance.cashOnCash(cashFlow, totalInvestment);
        const dscr = Finance.dscr(useNcfForDscr ? cashFlow : noi, annualDebt);

        return { noi, capRate, coc, dscr, cashFlow, totalInvestment, annualDebt };
    }, [scenario, useNcfForDscr]);
    
    if (!tool || !scenario || !sharedData) {
        return (
            <div className="text-center py-20">
                <h2 className="text-2xl text-white">Loading Tool...</h2>
                <p className="text-slate-400">If this persists, the tool ID may be invalid.</p>
            </div>
        );
    }
    
    const renderModule = () => {
        // Here you would have specific layouts per tool
        // For brevity, we'll use a generic one
        return (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-4">
                    <div className="bg-brand-900 border border-brand-800 p-8 rounded-2xl">
                        <h3 className="font-bold text-white mb-6">Inputs</h3>
                        {/* Generic Inputs based on some logic */}
                    </div>
                </div>
                <div className="lg:col-span-8">
                    <div className="bg-brand-900 border border-brand-800 p-8 rounded-2xl">
                         <h3 className="font-bold text-white mb-2">{tool.name} Result</h3>
                         <p className="text-4xl font-bold text-brand-gold">
                            {/* Generic result */}
                         </p>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="animate-fade-in">
            {/* Hero Section */}
            <section className="relative bg-brand-900 py-24 px-4 border-b border-brand-800">
                <div className="max-w-7xl mx-auto">
                    <div className="flex justify-between items-end">
                        <div>
                            <p className="text-sm font-bold text-brand-gold uppercase tracking-widest">Data Tools / {tool.category.replace(/-/g, ' ')}</p>
                            <h1 className="text-5xl font-heading font-bold text-white mt-4">{tool.name}</h1>
                            <p className="text-slate-400 mt-4 max-w-2xl">{tool.description}</p>
                        </div>
                        <div className="relative">
                            <button onClick={() => setIsScenarioManagerOpen(true)} className="flex items-center gap-3 bg-brand-950 border border-brand-700 rounded-lg px-5 py-3 hover:border-brand-gold transition-all">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Scenario:</span>
                                <span className="text-sm font-bold truncate text-white">{scenario.name}</span>
                                <ChevronDown size={16} className="text-slate-500" />
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 py-16">
                {renderModule()}
            </div>
            
            {isScenarioManagerOpen && (
                 <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-brand-950/90 backdrop-blur-sm">
                    <div className="relative bg-brand-900 border border-brand-700 w-full max-w-xl rounded-3xl p-10 shadow-2xl animate-fade-in">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-2xl font-heading font-bold text-white">Select Scenario</h3>
                            <button onClick={() => setIsScenarioManagerOpen(false)} className="text-slate-500 hover:text-white"><X size={24} /></button>
                        </div>
                        <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                            {allScenarios.map(s => (
                                <div key={s.id} onClick={() => handleScenarioSelect(s.id)} className={`p-4 rounded-xl border cursor-pointer ${s.id === scenario.id ? 'bg-brand-gold/10 border-brand-gold' : 'bg-brand-950 border-brand-800 hover:border-brand-700'}`}>
                                    <p className="font-bold text-white">{s.name}</p>
                                    <p className="text-xs text-slate-500">{s.propertyAddress}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ToolRenderer;
