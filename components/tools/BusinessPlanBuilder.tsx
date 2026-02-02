
import React, { useState, useRef, useMemo, useEffect } from 'react';
import { generatePlanDraft, suggestBusinessRisks } from '../../services/geminiService';
import { 
    ChevronRight, ChevronLeft, Download, 
    Target, Users, DollarSign, PieChart, 
    ShieldCheck, Rocket, Briefcase, AlertTriangle, 
    ListChecks, Loader2, Zap, LayoutDashboard, Calculator,
    Printer, Globe, Edit3, Wand2, Sparkles, Maximize2, Shield, BarChart3, TrendingUp, Cpu, Activity,
    Menu as MenuIcon
} from 'lucide-react';
import { Input, TextArea, Select } from '../ui/FormElements';
import { PantherLogo } from '../PantherLogo';
import { FinancialScenario } from '../../types';

const STEPS = [
    { id: '1', title: 'Step 1: Executive Summary', icon: Briefcase, desc: 'The strategic "Hook" for sovereign investors.' },
    { id: '2', title: 'Step 2: Company Overview', icon: Globe, desc: 'Mission, governance, and legal topology.' },
    { id: '3', title: 'Step 3: Value Proposition', icon: Target, desc: 'Economic pain points and the competitive moat.' },
    { id: '4', title: 'Step 4: Product / Service', icon: Zap, desc: 'Tiers, features, and user lifecycle mapping.' },
    { id: '5', title: 'Step 5: Market Intelligence', icon: PieChart, desc: 'TAM/SAM/SOM and demographic clusters.' },
    { id: '6', title: 'Step 6: Competitive Audit', icon: Users, desc: 'Positioning and the unfair strategic advantage.' },
    { id: '7', title: 'Step 7: Business Model', icon: Briefcase, desc: 'Revenue streams and unit economic modeling.' },
    { id: '8', title: 'Step 8: Go-To-Market', icon: Rocket, desc: 'Marketing channels and acquisition funnels.' },
    { id: '9', title: 'Step 9: Operations Node', icon: LayoutDashboard, desc: 'Execution protocol, tools, and quality control.' },
    { id: '10', title: 'Step 10: Human Capital', icon: Users, desc: 'Leadership, key hires, and organizational grid.' },
    { id: '11', title: 'Step 11: Financial Logic', icon: Calculator, desc: 'Startup costs, OPEX, and 5-year forecast.' },
    { id: '12', title: 'Step 12: Risk Contingency', icon: AlertTriangle, desc: 'Mitigation strategies for systemic risk.' },
    { id: '13', title: 'Step 13: Funding Ask', icon: DollarSign, desc: 'Capital requirements and use-of-funds.' },
    { id: '14', title: 'Step 14: Stress Testing', icon: ShieldCheck, desc: 'Downside cases and liquidity modeling.' },
    { id: '15', title: 'Step 15: Critical Path', icon: ListChecks, desc: '30/60/90 day execution milestones.' },
];

interface BusinessPlanBuilderProps {
    scenario?: FinancialScenario;
}

const BusinessPlanBuilder: React.FC<BusinessPlanBuilderProps> = ({ scenario }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [planData, setPlanData] = useState<any>({
        summary: { business: scenario?.propertyAddress || '', customer: '', sell: '', marketing: '', traction: '', raising: '' },
        risks: [],
        financials: { 
            baseRevenue: 1250000, 
            growthRate: 22, 
            grossMargin: 75,
            opexPercent: 18,
            cac: 450,
            ltv: 2400,
            churnRate: 15,
            initialCustomers: 500,
            marketingSpendY1: 250000,
        },
        drafts: {},
        tone: 'Institutional Boardroom',
        ambition: 75
    });
    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const workspaceRef = useRef<HTMLDivElement>(null);

    const activeStep = STEPS[currentStep];

    const forecast = useMemo(() => {
        const { 
            initialCustomers, marketingSpendY1, cac, ltv, churnRate, 
            grossMargin, opexPercent, growthRate 
        } = planData.financials;

        let customers = initialCustomers;
        let marketingSpend = marketingSpendY1;
        const results = [];

        for (let y = 1; y <= 5; y++) {
            const churnedCustomers = customers * (churnRate / 100);
            const newCustomers = marketingSpend / cac;
            const endingCustomers = customers - churnedCustomers + newCustomers;
            
            const revenue = endingCustomers * (ltv / (1 / (churnRate/100) || 1)); // Simplified LTV to annual revenue conversion
            const cogs = revenue * (1 - (grossMargin / 100));
            const fixedOpex = (planData.financials.baseRevenue * (opexPercent / 100)) * Math.pow(1.05, y - 1); // Fixed opex with inflation
            const opex = fixedOpex + marketingSpend;
            const net = revenue - cogs - opex;

            results.push({ year: y, revenue, cogs, opex, net, customers: endingCustomers });
            
            // For next year
            customers = endingCustomers;
            marketingSpend *= (1 + growthRate / 100); // Grow marketing spend
        }
        return results;
    }, [planData.financials]);

    const handleInput = (key: string, value: any, subkey?: string) => {
        setPlanData((prev: any) => {
            if (subkey) {
                return { ...prev, [key]: { ...prev[key], [subkey]: value } };
            }
            return { ...prev, [key]: value };
        });
    };

    const handleDraft = async () => {
        setLoading(true);
        const contextData = {
            ...planData,
            forecast,
            assetAddress: scenario?.propertyAddress,
            valuationBasis: scenario?.purchasePrice
        };
        const draft = await generatePlanDraft(`${activeStep.title} with a ${planData.tone} tone and ${planData.ambition}% aggression score.`, contextData);
        setPlanData((prev: any) => ({
            ...prev,
            drafts: { ...prev.drafts, [activeStep.id]: draft }
        }));
        setLoading(false);
        setIsEditing(false);
        
        if (workspaceRef.current) {
            workspaceRef.current.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const RangeSlider = ({ label, value, onChange, min = 0, max = 100, step = 1, prefix = "", suffix = "" }: any) => (
        <div className="space-y-3">
            <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-slate-500">
                <span>{label}</span>
                <span className="text-brand-gold font-mono">{prefix}{value}{suffix}</span>
            </div>
            <input 
                type="range" 
                min={min} 
                max={max} 
                step={step}
                value={value}
                onChange={onChange}
                className="w-full h-1.5 bg-brand-gold/10 rounded-full appearance-none cursor-pointer accent-brand-gold"
            />
        </div>
    );

    const FinancialModule = () => {
        const maxVal = Math.max(...forecast.map(f => f.revenue), 1000);

        return (
            <div className="space-y-6 md:space-y-8 animate-fade-in">
                <div className="bg-brand-950 p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border border-brand-gold/10">
                    <h4 className="text-[10px] font-bold text-brand-gold uppercase tracking-[0.3em] mb-6 md:mb-8 border-b border-white/5 pb-4 flex items-center gap-3">
                        <Maximize2 size={14} /> SaaS & Growth Logic
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input label="CAC Target" type="number" value={planData.financials.cac} onChange={e => handleInput('financials', parseFloat(e.target.value) || 0, 'cac')} />
                        <Input label="Customer LTV" type="number" value={planData.financials.ltv} onChange={e => handleInput('financials', parseFloat(e.target.value) || 0, 'ltv')} />
                        <Input label="Initial Customers" type="number" value={planData.financials.initialCustomers} onChange={e => handleInput('financials', parseFloat(e.target.value) || 0, 'initialCustomers')} />
                        <Input label="Marketing Spend Y1" type="number" value={planData.financials.marketingSpendY1} onChange={e => handleInput('financials', parseFloat(e.target.value) || 0, 'marketingSpendY1')} />
                        <RangeSlider label="Annual Churn %" value={planData.financials.churnRate} suffix="%" onChange={(e: any) => handleInput('financials', parseInt(e.target.value), 'churnRate')} />
                        <RangeSlider label="Gross Margin %" value={planData.financials.grossMargin} suffix="%" onChange={(e: any) => handleInput('financials', parseInt(e.target.value), 'grossMargin')} />
                        <RangeSlider label="Marketing Growth %" value={planData.financials.growthRate} suffix="%" onChange={(e: any) => handleInput('financials', parseInt(e.target.value), 'growthRate')} />
                        <RangeSlider label="Fixed OpEx % of Rev" value={planData.financials.opexPercent} suffix="%" onChange={(e: any) => handleInput('financials', parseInt(e.target.value), 'opexPercent')} />
                    </div>
                </div>

                <div className="bg-brand-900 border border-brand-gold/10 p-6 md:p-10 rounded-[2.5rem] md:rounded-[3rem] shadow-2xl relative overflow-hidden group">
                    <div className="scanline-overlay opacity-5 pointer-events-none"></div>
                    <h4 className="text-[10px] font-bold text-brand-gold uppercase tracking-[0.3em] mb-8 md:mb-10 border-b border-white/5 pb-4 flex items-center gap-3">
                        <BarChart3 size={14} /> Pro-Forma Diagnostics
                    </h4>
                    
                    <div className="space-y-6 mb-12">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center px-2 gap-4">
                            <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">Revenue vs. Costs</p>
                            <div className="flex gap-4">
                                 <div className="flex items-center gap-2"><div className="w-2 h-2 rounded bg-brand-gold"></div> <span className="text-[9px] text-white/50 uppercase font-bold">Revenue</span></div>
                                 <div className="flex items-center gap-2"><div className="w-2 h-2 rounded bg-slate-700"></div> <span className="text-[9px] text-white/50 uppercase font-bold">Costs</span></div>
                            </div>
                        </div>
                        <div className="h-40 md:h-56 flex items-end justify-between gap-2 md:gap-4 px-2 border-b border-white/5 pb-4">
                            {forecast.map((f, i) => {
                                const totalCosts = f.cogs + f.opex;
                                return (
                                    <div key={i} className="flex-1 flex justify-center gap-1 group relative h-full">
                                        <div className="w-full bg-brand-gold/30 rounded-t-lg transition-all group-hover:bg-brand-gold/60 border-t border-brand-gold/50" style={{ height: `${(f.revenue/maxVal)*100}%` }}></div>
                                        <div className="w-full bg-slate-700/30 rounded-t-lg transition-all group-hover:bg-slate-700/60 border-t border-slate-600/50" style={{ height: `${(totalCosts/maxVal)*100}%` }}></div>
                                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all bg-brand-950 border border-brand-gold/30 px-3 py-1.5 rounded-xl text-[9px] font-mono whitespace-nowrap z-30 shadow-2xl">
                                            ${(f.revenue/1000).toFixed(0)}k
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                        <div className="flex justify-between text-[8px] md:text-[9px] text-white/20 font-mono font-black uppercase px-2">
                            {forecast.map((_, i) => <span key={i}>YR {i+1}</span>)}
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="flex justify-between items-center px-2">
                            <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">Net Income Velocity</p>
                        </div>
                        <div className="h-24 md:h-40 w-full relative px-2">
                            <svg viewBox="0 0 500 100" className="w-full h-full" preserveAspectRatio="none">
                                <line x1="0" y1="50" x2="500" y2="50" stroke="white" strokeOpacity="0.05" strokeWidth="1" />
                                {(() => {
                                    const points = forecast.map((f, i) => {
                                        const y = 90 - ((f.net / maxVal) * 80); 
                                        const x = (i / (forecast.length - 1)) * 500;
                                        return `${x},${y}`;
                                    }).join(' ');
                                    return (
                                        <>
                                            <polyline 
                                                points={`0,100 ${points} 500,100`} 
                                                fill="url(#lineGradPlan)" 
                                                opacity="0.1" 
                                            />
                                            <polyline 
                                                points={points} 
                                                fill="none" 
                                                stroke="#00ff41" 
                                                strokeWidth="3" 
                                                strokeLinecap="round" 
                                                strokeLinejoin="round" 
                                                className="drop-shadow-[0_0_15px_rgba(0,255,65,0.4)]" 
                                            />
                                            {forecast.map((f, i) => {
                                                const y = 90 - ((f.net / maxVal) * 80); 
                                                const x = (i / (forecast.length - 1)) * 500;
                                                return <circle key={i} cx={x} cy={y} r="3.5" fill="#00ff41" className="animate-pulse" />;
                                            })}
                                        </>
                                    );
                                })()}
                                <defs>
                                    <linearGradient id="lineGradPlan" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#00ff41" />
                                        <stop offset="100%" stopColor="transparent" />
                                    </linearGradient>
                                </defs>
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        );
    };
    
    const RiskModule = () => {
        const handleGenRisks = async () => {
            setLoading(true);
            const res = await suggestBusinessRisks(planData.summary.business || 'New Enterprise');
            if (res) {
                try {
                    const parsed = JSON.parse(res.replace(/```json/g, '').replace(/```/g, '').trim());
                    handleInput('risks', parsed);
                } catch (e) { console.error(e); }
            }
            setLoading(false);
        };

        return (
            <div className="space-y-6 md:space-y-8 animate-fade-in">
                <button onClick={handleGenRisks} className="w-full py-5 md:py-7 bg-brand-gold text-brand-950 font-black rounded-2xl md:rounded-[2rem] flex items-center justify-center gap-4 md:gap-6 hover:bg-white transition-all shadow-[0_20px_50px_rgba(212,175,55,0.3)] text-[10px] md:text-xs uppercase tracking-[0.4em]">
                    <Shield size={20} /> BUILD RISK MATRIX
                </button>
                <div className="space-y-4 md:space-y-5">
                    {planData.risks.map((r: any, i: number) => (
                        <div key={i} className="bg-brand-950 p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border border-brand-gold/10 group/risk hover:border-brand-gold transition-all relative overflow-hidden">
                            <div className="scanline-overlay opacity-[0.03] pointer-events-none"></div>
                            <div className="flex justify-between items-start mb-4 md:mb-6">
                                <h5 className="text-white font-black text-base md:text-lg tracking-tight uppercase">{r.name}</h5>
                                <div className="text-[8px] md:text-[10px] font-mono text-brand-gold font-black bg-brand-gold/10 px-2 py-0.5 md:px-3 md:py-1 rounded-lg border border-brand-gold/20 tracking-widest">LVL_{r.impact}</div>
                            </div>
                            <p className="text-[11px] md:text-[12px] text-white/50 leading-relaxed italic font-medium">
                                <span className="text-brand-gold/60 mr-2 uppercase font-black tracking-widest">&gt; MITIGATION:</span>
                                {r.mitigation}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const handleStepChange = (idx: number) => {
        setCurrentStep(idx);
        setSidebarOpen(false);
        if (workspaceRef.current) {
            workspaceRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="flex flex-col lg:flex-row gap-8 md:gap-16 animate-fade-in no-print min-h-[600px] md:min-h-[900px] pb-16 md:pb-32">
            
            {/* Mobile Sidebar Toggle */}
            <div className="lg:hidden flex items-center justify-between p-6 glass rounded-3xl border-brand-gold/20 mb-4 sticky top-[80px] z-[40]">
                <div className="flex items-center gap-4">
                    <div className="p-2 bg-brand-gold/10 rounded-xl text-brand-gold">
                        <activeStep.icon size={18} />
                    </div>
                    <p className="text-[10px] font-black text-white uppercase tracking-widest truncate max-w-[150px]">{activeStep.title.split(': ')[1]}</p>
                </div>
                <button 
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="p-3 bg-brand-gold text-brand-950 rounded-xl shadow-lg"
                >
                    <MenuIcon size={20} />
                </button>
            </div>

            {/* Step Sidebar Node */}
            <aside className={`fixed inset-0 z-[100] lg:relative lg:z-0 w-full lg:w-80 flex-shrink-0 space-y-4 transition-all duration-500 transform ${
                sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0 pointer-events-none lg:pointer-events-auto'
            }`}>
                <div className="absolute inset-0 bg-brand-950/95 lg:hidden" onClick={() => setSidebarOpen(false)}></div>
                <div className="relative h-full bg-brand-950 p-8 lg:p-0 flex flex-col w-[85%] lg:w-full overflow-y-auto custom-scrollbar border-r border-brand-gold/10 lg:border-0">
                    <div className="p-8 bg-brand-gold/5 border border-brand-gold/20 rounded-[2rem] md:rounded-[3rem] mb-6 md:mb-10 shadow-inner">
                        <div className="flex items-center gap-4 mb-3">
                             <Cpu size={14} className="text-brand-gold" />
                             <h4 className="text-[10px] font-mono font-black text-brand-gold uppercase tracking-[0.4em]">Architect Node</h4>
                        </div>
                        <p className="text-[10px] md:text-[11px] text-white/30 font-bold uppercase tracking-widest leading-relaxed">Institutional drafting suite for sovereign capital deployment.</p>
                    </div>
                    <div className="space-y-1.5 flex-1 pr-2">
                        {STEPS.map((step, idx) => (
                            <button
                                key={step.id}
                                onClick={() => handleStepChange(idx)}
                                className={`w-full flex items-center gap-4 md:gap-5 px-5 md:px-6 py-4 md:py-5 rounded-[1.2rem] md:rounded-[1.5rem] text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] transition-all text-left group ${
                                    currentStep === idx 
                                        ? 'bg-brand-gold text-brand-950 shadow-[0_15px_40px_rgba(212,175,55,0.2)] scale-[1.02]' 
                                        : 'text-white/20 hover:text-white hover:bg-white/5'
                                }`}
                            >
                                <step.icon size={18} className={currentStep === idx ? 'text-brand-950' : 'text-brand-gold/30 group-hover:text-brand-gold transition-colors'} />
                                <span className="truncate">{step.title.split(': ')[1]}</span>
                                {planData.drafts[step.id] && <div className={`ml-auto w-2 h-2 rounded-full ${currentStep === idx ? 'bg-brand-950' : 'bg-brand-gold shadow-[0_0_10px_#d4af37]'} animate-pulse`}></div>}
                            </button>
                        ))}
                    </div>
                    <button onClick={() => setSidebarOpen(false)} className="lg:hidden mt-10 w-full py-4 glass border-brand-gold/20 text-brand-gold rounded-2xl text-[10px] font-black uppercase">Close Menu</button>
                </div>
            </aside>

            {/* Main Action Node */}
            <div className="flex-1 space-y-8 md:space-y-16" ref={workspaceRef}>
                 <header className="flex flex-col md:flex-row justify-between items-start gap-8 md:gap-12 border-b border-white/5 pb-8 md:pb-16">
                    <div className="max-w-2xl">
                        <div className="flex items-center gap-4 md:gap-5 mb-6 md:mb-8">
                            <span className="text-[9px] md:text-[11px] font-black text-brand-gold uppercase tracking-[0.6em]">System Workspace</span>
                            <div className="h-px w-12 md:w-16 bg-brand-gold/20"></div>
                            <span className="text-[9px] md:text-[11px] font-bold text-white/20 uppercase tracking-[0.6em]">{activeStep.title.split(':')[0]}</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-heading font-black text-white tracking-tighter leading-[0.9] uppercase mb-6 md:mb-10">{activeStep.title.split(': ')[1]}.</h1>
                        <p className="text-white/40 text-base md:text-xl font-medium leading-relaxed italic border-l-4 border-brand-gold/20 pl-6 md:pl-8">{activeStep.desc}</p>
                    </div>
                    <div className="flex gap-3 md:gap-4 w-full md:w-auto">
                         <button onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))} className="flex-1 md:flex-none p-4 md:p-5 border border-white/10 text-white font-bold rounded-[1.2rem] md:rounded-[1.5rem] hover:bg-white/5 transition-all shadow-xl active:scale-95 flex items-center justify-center"><ChevronLeft size={24}/></button>
                         <button onClick={() => setCurrentStep(prev => Math.min(STEPS.length - 1, prev + 1))} className="flex-1 md:flex-none p-4 md:p-5 bg-white/5 border border-white/10 text-brand-gold font-bold rounded-[1.2rem] md:rounded-[1.5rem] hover:bg-white/10 transition-all shadow-xl active:scale-95 flex items-center justify-center"><ChevronRight size={24}/></button>
                    </div>
                </header>

                <div className="grid grid-cols-1 xl:grid-cols-12 gap-12 xl:gap-16">
                    <div className="xl:col-span-5 space-y-8 md:space-y-10">
                        <div className="bg-brand-950 border border-brand-gold/20 p-8 md:p-12 rounded-[2.5rem] md:rounded-[4rem] relative overflow-hidden group shadow-[0_40px_100px_-20px_rgba(0,0,0,0.8)]">
                            <div className="scanline-overlay opacity-[0.03] pointer-events-none"></div>
                            <h3 className="text-[10px] md:text-[11px] font-black text-brand-gold uppercase tracking-[0.5em] mb-8 md:mb-12 border-b border-white/5 pb-6 md:pb-8 flex items-center gap-4">
                                <Activity size={16} /> Strategic Parameters
                            </h3>
                            
                            {activeStep.id === '1' && (
                                <div className="space-y-6 md:space-y-8">
                                    <TextArea label="Venture Essence" placeholder="Define the core logic..." value={planData.summary.business} onChange={e => handleInput('summary', e.target.value, 'business')} />
                                    <Input label="Target Capital Segment" placeholder="e.g., Sovereign Wealth" value={planData.summary.customer} onChange={e => handleInput('summary', e.target.value, 'customer')} />
                                    <TextArea label="Revenue Topology" value={planData.summary.sell} onChange={e => handleInput('summary', e.target.value, 'sell')} />
                                </div>
                            )}
                            {activeStep.id === '11' && <FinancialModule />}
                            {activeStep.id === '12' && <RiskModule />}

                            {activeStep.id !== '1' && activeStep.id !== '11' && activeStep.id !== '12' && (
                                <TextArea label="Proprietary Intel Node" placeholder="Input raw data points..." className="min-h-[300px] md:min-h-[400px]" />
                            )}
                        </div>
                        
                        <div className="bg-brand-950 border border-brand-gold/10 p-8 md:p-12 rounded-[2.5rem] md:rounded-[4rem] shadow-2xl space-y-10 md:space-y-12 relative overflow-hidden">
                            <h3 className="text-[10px] md:text-[11px] font-black text-white uppercase tracking-[0.5em] border-b border-white/5 pb-6 md:pb-8 flex items-center gap-4">
                                <Sparkles size={16} className="text-brand-gold animate-pulse" /> Reasoning Matrix
                            </h3>
                            <Select 
                                label="Analytical Profile"
                                value={planData.tone}
                                onChange={e => handleInput('tone', e.target.value)}
                                options={[
                                    { label: 'Institutional Boardroom', value: 'Institutional Boardroom'},
                                    { label: 'Hyper-Growth Disruptor', value: 'Hyper-Growth Disruptor'},
                                    { label: 'Sovereign Conservative', value: 'Sovereign Conservative'},
                                    { label: 'Technical Academic', value: 'Technical Academic'}
                                ]}
                            />
                            <RangeSlider 
                                label="Aggression Index" 
                                value={planData.ambition} 
                                onChange={(e: any) => handleInput('ambition', parseInt(e.target.value))}
                            />
                            <button 
                                onClick={handleDraft}
                                disabled={loading}
                                className="w-full bg-brand-gold text-brand-950 font-heading font-black py-6 md:py-8 rounded-[1.8rem] md:rounded-[2.5rem] hover:bg-white transition-all shadow-[0_20px_60px_-10px_rgba(212,175,55,0.4)] flex items-center justify-center gap-6 md:gap-8 uppercase tracking-[0.4em] text-xs md:text-sm disabled:opacity-50 group/btn"
                            >
                                {loading ? <Loader2 className="animate-spin" size={24}/> : <><PantherLogo className="h-6 md:h-8 w-auto brightness-0 transition-transform group-hover/btn:scale-110" /> Initialize Draft</>}
                            </button>
                        </div>
                    </div>

                    <div className="xl:col-span-7">
                        <div className="bg-brand-900 border border-brand-gold/20 p-8 md:p-16 rounded-[2.5rem] md:rounded-[4.5rem] min-h-[500px] md:min-h-[800px] shadow-[0_60px_120px_-30px_rgba(0,0,0,0.9)] relative flex flex-col group/paper overflow-hidden">
                            <div className="scanline-overlay opacity-5"></div>
                            <div className="absolute top-6 right-6 md:top-12 md:right-12 flex gap-3 no-print z-20">
                                <button onClick={() => setIsEditing(!isEditing)} className="p-3 md:p-5 bg-brand-950 border border-white/10 rounded-xl md:rounded-2xl text-white/40 hover:text-brand-gold hover:border-brand-gold transition-all shadow-xl"><Edit3 size={18}/></button>
                                <button className="p-3 md:p-5 bg-brand-950 border border-white/10 rounded-xl md:rounded-2xl text-white/40 hover:text-brand-gold hover:border-brand-gold transition-all shadow-xl"><Printer size={18}/></button>
                            </div>
                            
                            <div className="flex-1 font-sans relative z-10 custom-scrollbar mt-12 md:mt-0">
                                {planData.drafts[activeStep.id] ? (
                                    isEditing ? (
                                        <textarea 
                                            className="w-full h-full bg-transparent outline-none resize-none text-base md:text-xl text-white/90 leading-relaxed font-mono custom-scrollbar min-h-[400px]"
                                            value={planData.drafts[activeStep.id]}
                                            onChange={e => setPlanData(prev => ({...prev, drafts: {...prev.drafts, [activeStep.id]: e.target.value}}))}
                                        />
                                    ) : (
                                        <div 
                                            className="prose prose-invert prose-lg md:prose-2xl max-w-none prose-h1:font-heading prose-h1:tracking-tighter prose-h1:text-white prose-h2:tracking-tight prose-h2:font-heading prose-h2:text-brand-gold prose-h2:mt-8 md:prose-h2:mt-12 prose-strong:text-brand-gold prose-p:text-white/80 prose-p:text-base md:prose-p:text-xl prose-p:leading-relaxed animate-fade-in whitespace-pre-wrap"
                                            dangerouslySetInnerHTML={{ __html: planData.drafts[activeStep.id].replace(/\n/g, '<br/>') }}
                                        />
                                    )
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-full text-white/5 opacity-50 py-20">
                                        <div className="relative mb-8 md:mb-12">
                                            <div className="absolute inset-0 bg-brand-gold blur-[80px] md:blur-[100px] opacity-10 animate-pulse"></div>
                                            <Wand2 size={80} className="md:w-[120px] md:h-[120px] relative z-10 opacity-20 group-hover/paper:rotate-12 transition-transform duration-1000"/>
                                        </div>
                                        <div className="space-y-4 text-center">
                                            <p className="font-black uppercase tracking-[0.5em] md:tracking-[0.6em] text-[10px] md:text-[11px] max-w-sm leading-loose text-white px-4">
                                                Awaiting strategic handshake protocol...
                                            </p>
                                            <div className="h-0.5 w-16 md:w-24 bg-brand-gold/10 mx-auto rounded-full overflow-hidden">
                                                <div className="h-full bg-brand-gold/40 animate-shimmer"></div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                            
                            <div className="mt-12 md:mt-20 pt-8 md:pt-10 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center text-[8px] md:text-[10px] font-mono font-black text-white/10 uppercase tracking-[0.4em] no-print relative z-10 gap-4">
                                <span className="flex items-center gap-2 md:gap-3"><Shield size={12}/> Document: {activeStep.id}_SECURE_NODE</span>
                                <span className="bg-brand-gold/5 px-3 py-1 md:px-4 md:py-1.5 rounded-full border border-white/5">Access: Restricted</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BusinessPlanBuilder;
