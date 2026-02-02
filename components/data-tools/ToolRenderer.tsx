
import React, { useMemo } from 'react';
import { FinancialScenario } from '../../types';
import { TOOL_REGISTRY } from '../../lib/tool-registry';
import { CALCULATORS } from '../../constants/toolDefinitions';
import EntitlementGate from '../auth/EntitlementGate';
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
    
    const renderContent = () => {
        if (!toolId) return <InvestmentAnalyzer />; // Default view

        // 1. Specialty Modules
        if (toolId === 'market' || toolId === 'data-hub') return <MarketIntelligence onNavigate={onNavigate} />;
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
        return <InvestmentAnalyzer toolId={toolId} />;
    };

    return (
        <div className="glass rounded-[4rem] p-12 lg:p-16 border border-brand-gold/10 shadow-2xl relative overflow-hidden">
            <div className="scanline-overlay opacity-5"></div>
            <EntitlementGate toolId={toolId || ''}>
                {renderContent()}
            </EntitlementGate>
        </div>
    );
};

export default ToolRenderer;
