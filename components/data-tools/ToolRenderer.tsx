
import React, { useMemo } from 'react';
import { FinancialScenario } from '../../types';
import { TOOL_REGISTRY } from '../../lib/tool-registry';
import { CALCULATORS } from '../../constants/toolDefinitions';
import { 
    TrendingUp, Activity, BarChart3, 
    ArrowRight, Zap, Target, Terminal as TerminalIcon
} from 'lucide-react';
import MarketIntelligence from '../tools/MarketIntelligence';
import BusinessPlanBuilder from '../tools/BusinessPlanBuilder';
import BusinessIntelligence from '../tools/BusinessIntelligence';
import ApiSettings from '../tools/ApiSettings';
import ComplianceHub from '../tools/ComplianceHub';
import CalculatorEngine from '../tools/CalculatorEngine';
import InvestmentAnalyzer from '../InvestmentAnalyzer';
import PortfolioPerformance from '../tools/PortfolioPerformance';

interface ToolRendererProps {
    toolId: string | null;
    categoryId: string | null;
    scenario: FinancialScenario;
    allScenarios: FinancialScenario[];
    onUpdateScenario: (updates: Partial<FinancialScenario>) => void;
    onNavigate: (path: string) => void;
}

const ToolRenderer: React.FC<ToolRendererProps> = ({ toolId, categoryId, scenario, allScenarios, onUpdateScenario, onNavigate }) => {
    const tool = useMemo(() => TOOL_REGISTRY.find(t => t.id === toolId), [toolId]);
    
    // Core Logic: Map tool IDs to specific modules or generic engines
    const renderContent = () => {
        // 1. Specialty Modules
        if (toolId === 'market' || toolId === 'data-hub') return <MarketIntelligence />;
        if (toolId === 'business' || toolId === 'business-planner') return <BusinessPlanBuilder scenario={scenario} />;
        if (toolId === 'business-valuation-tool') return <BusinessIntelligence />;
        if (toolId === 'compliance' || toolId === 'kyc-aml' || toolId === 'risk-checklist') return <ComplianceHub />;
        if (toolId === 'api-settings') return <ApiSettings />;
        if (toolId === 'portfolio-performance') return <PortfolioPerformance allScenarios={allScenarios} onNavigate={onNavigate} />;

        // 2. Calculation Engines
        const calculatorDef = CALCULATORS.find(c => c.id === toolId);
        if (calculatorDef) {
            return <CalculatorEngine calculator={calculatorDef} />;
        }

        // 3. Fallback AI Strategic Audit (For all non-specific Analysis tools)
        return (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Left: Inputs / Parameters */}
                <div className="lg:col-span-4 space-y-8">
                    <div className="bg-brand-950 border border-brand-gold/10 p-10 rounded-[3rem] shadow-2xl relative overflow-hidden">
                        <div className="scanline-overlay opacity-5"></div>
                        <h4 className="text-xs font-bold text-brand-gold uppercase tracking-[0.4em] mb-10 border-b border-white/5 pb-4">Logic Parameters</h4>
                        <div className="space-y-6">
                            <div className="p-6 bg-brand-gold/5 rounded-2xl border border-brand-gold/10">
                                <p className="text-[10px] font-mono font-bold text-brand-gold/40 uppercase tracking-widest mb-3">Asset Target</p>
                                <p className="text-white font-bold text-sm truncate">{scenario.propertyAddress}</p>
                            </div>
                            <div className="p-6 bg-brand-gold/5 rounded-2xl border border-brand-gold/10">
                                <p className="text-[10px] font-mono font-bold text-brand-gold/40 uppercase tracking-widest mb-3">Valuation Basis</p>
                                <p className="text-white font-bold text-sm">${scenario.purchasePrice.toLocaleString()}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: Results / Analysis */}
                <div className="lg:col-span-8">
                    <InvestmentAnalyzer />
                </div>
            </div>
        );
    };

    return (
        <div className="glass rounded-[4rem] p-12 lg:p-16 border border-brand-gold/10 shadow-2xl relative overflow-hidden">
            <div className="scanline-overlay opacity-5"></div>
            {renderContent()}
        </div>
    );
};

export default ToolRenderer;
