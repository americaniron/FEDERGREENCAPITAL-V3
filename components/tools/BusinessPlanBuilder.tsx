
import React, { useState, useMemo } from 'react';
import { generatePlanDraft, suggestBusinessRisks, analyzeBusinessModel } from '../../services/geminiService';
import { 
    ChevronRight, ChevronLeft, Save, FileText, 
    PieChart, AlertTriangle, Wand2, Loader2, DollarSign, Target, Sparkles, TrendingUp,
    MapPin, Users, Zap, Briefcase, ListChecks, ArrowUpRight, ShieldCheck, BarChart3,
    Table as TableIcon, Layers, CreditCard, Rocket, Activity, Clock, Download
} from 'lucide-react';
import { Input, TextArea } from '../ui/FormElements';

const STEPS = [
    { id: 'exec_summary', title: 'Executive Summary', icon: Sparkles },
    { id: 'market_size', title: 'SAM / TAM / SOM', icon: Target, custom: true },
    { id: 'competitors', title: 'Competitor Analysis', icon: Users },
    { id: 'pricing', title: 'Pricing Research', icon: DollarSign },
    { id: 'costs', title: 'Startup & Monthly Costs', icon: TableIcon, custom: true },
    { id: 'trends', title: 'Market Trends', icon: TrendingUp },
    { id: 'traction', title: 'Traction KPI Tracker', icon: Activity, custom: true },
    { id: 'location_score', title: 'Location Likelihood', icon: MapPin, custom: true },
    { id: 'value_prop', title: 'Value Proposition', icon: ShieldCheck },
    { id: 'membership', title: 'Membership Calculator', icon: CreditCard, custom: true },
    { id: 'roadmap', title: 'Strategic Roadmap', icon: Rocket },
    { id: 'moat', title: 'Economic Moat', icon: Layers },
    { id: 'revenue_model', title: 'Revenue Streams', icon: Briefcase, custom: true },
    { id: 'risk', title: 'Risk Management', icon: AlertTriangle, custom: true },
    { id: 'final_draft', title: 'Review & Export', icon: ListChecks, custom: true },
];

const BusinessPlanBuilder: React.FC = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [planData, setPlanData] = useState<Record<string, any>>({
        exec_summary: { type: 'Private Equity', location: 'New York', notes: '' },
        market_size: { target_customers: 1000000, unit_price: 100, sam_pct: 15, som_pct: 2 },
        costs: { startup: [{name: 'Legal', val: 5000}], monthly: [{name: 'Marketing', val: 2000}] },
        traction: { kpis: [{ name: 'CAC', value: 50, target: 40 }, { name: 'LTV', value: 450, target: 500 }] },
        membership: { tiers: [{ name: 'Basic', price: 29, users: 100 }, { name: 'Pro', price: 99, users: 50 }] },
        revenue_model: { streams: [{ name: 'Subscription', annual: 120000 }, { name: 'Service Fee', annual: 45000 }] },
        risk: { items: [] },
        location: { score: 85, logic: 'Strong demographic match with low competitor density.' }
    });
    const [drafting, setDrafting] = useState(false);
    const [suggesting, setSuggesting] = useState(false);

    const activeStepDef = STEPS[currentStep];

    const handleInput = (stepId: string, key: string, value: any) => {
        setPlanData(prev => ({
            ...prev,
            [stepId]: { ...prev[stepId], [key]: value }
        }));
    };

    const handleDraft = async () => {
        setDrafting(true);
        const sectionInputs = planData[activeStepDef.id] || {};
        const globalContext = {
            business_type: planData.exec_summary?.type || 'Institution',
            location: planData.exec_summary?.location || 'Global'
        };
        const draft = await generatePlanDraft(activeStepDef.title, { ...sectionInputs, ...globalContext });
        handleInput(activeStepDef.id, 'draft', draft);
        setDrafting(false);
    };

    // --- CUSTOM MODULE RENDERS ---

    const MarketSizeModule = () => (
        <div className="space-y-8 animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-brand-900 border border-brand-800 p-8 rounded-3xl space-y-4 shadow-xl">
                    <h4 className="text-white font-bold mb-6 flex items-center gap-2"><Target size={18} className="text-brand-gold"/> Parametric Modeling</h4>
                    <Input label="TAM: Total Target Population" type="number" value={planData.market_size.target_customers} onChange={e => handleInput('market_size', 'target_customers', parseFloat(e.target.value))} />
                    <Input label="Average Transaction Value ($)" type="number" value={planData.market_size.unit_price} onChange={e => handleInput('market_size', 'unit_price', parseFloat(e.target.value))} />
                    <Input label="SAM: Serviceable Segment (%)" type="number" value={planData.market_size.sam_pct} onChange={e => handleInput('market_size', 'sam_pct', parseFloat(e.target.value))} />
                    <Input label="SOM: Year 1 Capture (%)" type="number" value={planData.market_size.som_pct} onChange={e => handleInput('market_size', 'som_pct', parseFloat(e.target.value))} />
                </div>
                <div className="grid grid-cols-1 gap-4">
                    {[
                        { label: 'TAM', val: planData.market_size.target_customers * planData.market_size.unit_price, desc: 'Total Market Opportunity', color: 'text-brand-gold' },
                        { label: 'SAM', val: (planData.market_size.target_customers * (planData.market_size.sam_pct / 100)) * planData.market_size.unit_price, desc: 'Reach within constraints', color: 'text-blue-400' },
                        { label: 'SOM', val: (planData.market_size.target_customers * (planData.market_size.som_pct / 100)) * planData.market_size.unit_price, desc: 'Realistic Target (Year 1)', color: 'text-green-400' },
                    ].map(m => (
                        <div key={m.label} className="bg-brand-950 border border-brand-800 p-8 rounded-3xl text-center shadow-inner group">
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-2">{m.label}</p>
                            <p className={`text-3xl font-heading font-bold ${m.color}`}>${m.val.toLocaleString()}</p>
                            <p className="text-[10px] text-slate-400 mt-2 italic">{m.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    const MembershipModule = () => {
        const totalMRR = (planData.membership.tiers || []).reduce((acc: number, t: any) => acc + (t.price * t.users), 0);
        return (
            <div className="space-y-8 animate-fade-in">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-4">
                        {(planData.membership.tiers || []).map((t: any, i: number) => (
                            <div key={i} className="bg-brand-900 border border-brand-800 p-6 rounded-2xl flex items-center justify-between gap-4">
                                <input className="bg-transparent text-white font-bold focus:outline-none flex-1" value={t.name} onChange={e => {
                                    const next = [...planData.membership.tiers]; next[i].name = e.target.value; handleInput('membership', 'tiers', next);
                                }} />
                                <div className="flex gap-4">
                                    <div className="text-right">
                                        <p className="text-[9px] text-slate-500 uppercase mb-1 font-bold">Price</p>
                                        <input className="bg-brand-950 border border-brand-800 rounded px-2 py-1 text-white text-xs w-20 text-right font-mono" type="number" value={t.price} onChange={e => {
                                            const next = [...planData.membership.tiers]; next[i].price = parseFloat(e.target.value) || 0; handleInput('membership', 'tiers', next);
                                        }} />
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[9px] text-slate-500 uppercase mb-1 font-bold">Qty</p>
                                        <input className="bg-brand-950 border border-brand-800 rounded px-2 py-1 text-white text-xs w-20 text-right font-mono" type="number" value={t.users} onChange={e => {
                                            const next = [...planData.membership.tiers]; next[i].users = parseFloat(e.target.value) || 0; handleInput('membership', 'tiers', next);
                                        }} />
                                    </div>
                                </div>
                            </div>
                        ))}
                        <button className="w-full py-4 border border-dashed border-brand-800 text-slate-500 rounded-xl hover:bg-brand-900 font-bold uppercase text-[10px] tracking-widest" onClick={() => handleInput('membership', 'tiers', [...planData.membership.tiers, {name: 'New Tier', price: 0, users: 0}])}>+ Add Subscription Tier</button>
                    </div>
                    <div className="bg-brand-gold p-10 rounded-[2.5rem] flex flex-col justify-center text-brand-900 shadow-2xl relative overflow-hidden">
                        <Zap className="absolute -right-4 -bottom-4 w-32 h-32 opacity-20" />
                        <p className="text-xs font-bold uppercase tracking-[0.2em] opacity-60 mb-2">Projected MRR</p>
                        <h3 className="text-5xl font-heading font-bold mb-4 tracking-tighter">${totalMRR.toLocaleString()}</h3>
                        <p className="text-[11px] font-medium opacity-80 leading-relaxed">Aggregated monthly recurring revenue based on institutional membership distribution.</p>
                    </div>
                </div>
            </div>
        );
    };

    const RiskModule = () => {
        const handleSuggest = async () => {
            setSuggesting(true);
            const res = await suggestBusinessRisks(planData.exec_summary.notes || 'Asset Management');
            if (res) {
                const parsed = JSON.parse(res.replace(/```json/g, '').replace(/```/g, '').trim());
                handleInput('risk', 'items', parsed);
            }
            setSuggesting(false);
        };
        return (
            <div className="space-y-8 animate-fade-in">
                <button onClick={handleSuggest} disabled={suggesting} className="w-full py-5 bg-brand-gold text-brand-900 font-bold rounded-2xl hover:bg-white transition-all shadow-xl shadow-brand-gold/10 flex items-center justify-center gap-3 uppercase tracking-widest text-xs">
                    {suggesting ? <Loader2 className="animate-spin" size={20} /> : <><Sparkles size={18}/> Generate AI Risk Matrix</>}
                </button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {(planData.risk.items || []).map((r: any, i: number) => (
                        <div key={i} className="p-8 bg-brand-900 border border-brand-800 rounded-3xl relative group overflow-hidden">
                            <div className={`absolute top-0 right-0 p-6 font-heading font-bold text-2xl opacity-10 ${r.impact > 70 ? 'text-red-500' : 'text-brand-gold'}`}>{r.impact}%</div>
                            <h4 className="text-white font-bold text-lg mb-4 pr-12">{r.name}</h4>
                            <div className="w-full h-1.5 bg-brand-950 rounded-full mt-6 overflow-hidden">
                                <div className={`h-full ${r.prob > 50 ? 'bg-red-500' : 'bg-brand-gold'}`} style={{ width: `${r.prob}%` }}></div>
                            </div>
                            <div className="flex justify-between mt-3 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                                <span>Likelihood: {r.prob}%</span>
                                <span>Risk: {r.impact > 70 ? 'Institutional Critical' : 'Managed'}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const renderContent = () => {
        if (activeStepDef.custom) {
            switch (activeStepDef.id) {
                case 'market_size': return <MarketSizeModule />;
                case 'membership': return <MembershipModule />;
                case 'risk': return <RiskModule />;
                case 'final_draft':
                    return (
                        <div className="bg-brand-900 border border-brand-800 p-12 rounded-[3rem] shadow-2xl relative overflow-hidden animate-fade-in">
                            <div className="absolute top-0 right-0 w-96 h-96 bg-brand-gold/5 rounded-full blur-[128px] pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
                            <h2 className="text-4xl font-heading font-bold text-white mb-12">Executive Snapshot</h2>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
                                <div className="p-6 bg-brand-950 border border-brand-800 rounded-2xl">
                                    <p className="text-[10px] text-slate-500 font-bold uppercase mb-2">Market Potential</p>
                                    <p className="text-2xl font-bold text-white">${(planData.market_size.target_customers * planData.market_size.unit_price).toLocaleString()}</p>
                                </div>
                                <div className="p-6 bg-brand-950 border border-brand-800 rounded-2xl">
                                    <p className="text-[10px] text-slate-500 font-bold uppercase mb-2">Readiness Score</p>
                                    <p className="text-2xl font-bold text-brand-gold">{planData.location.score}%</p>
                                </div>
                                <div className="p-6 bg-brand-950 border border-brand-800 rounded-2xl">
                                    <p className="text-[10px] text-slate-500 font-bold uppercase mb-2">Risks Identified</p>
                                    <p className="text-2xl font-bold text-red-400">{planData.risk.items.length}</p>
                                </div>
                                <div className="p-6 bg-brand-950 border border-brand-800 rounded-2xl">
                                    <p className="text-[10px] text-slate-500 font-bold uppercase mb-2">Structure</p>
                                    <p className="text-2xl font-bold text-white">Tiered</p>
                                </div>
                            </div>
                            <div className="space-y-12">
                                {STEPS.filter(s => !s.custom).map(s => (
                                    <div key={s.id} className="border-b border-brand-800 pb-12 last:border-0">
                                        <h3 className="text-brand-gold font-bold uppercase text-xs mb-4 flex items-center gap-2"><s.icon size={14}/> {s.title}</h3>
                                        <p className="text-slate-300 leading-relaxed font-serif text-lg whitespace-pre-wrap">{planData[s.id]?.draft || 'Awaiting draft...'}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                default: return <div className="text-slate-500 italic">Advanced analysis interface active. Data synchronized with scenario engine.</div>;
            }
        }

        return (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 animate-fade-in">
                <div className="lg:col-span-4">
                    <div className="bg-brand-900 border border-brand-800 p-8 rounded-[2rem] shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-brand-gold/5 rounded-full blur-2xl"></div>
                        <h3 className="text-white font-bold mb-8 text-xs uppercase tracking-[0.2em] flex items-center gap-3">
                            <span className="w-1.5 h-6 bg-brand-gold rounded-full"></span> Raw Context
                        </h3>
                        <TextArea 
                            label="Strategic Notes" 
                            placeholder="Input bullet points, proprietary insights, or data points..."
                            value={planData[activeStepDef.id]?.notes || ''}
                            onChange={e => handleInput(activeStepDef.id, 'notes', e.target.value)}
                            className="min-h-[350px]"
                        />
                        <button 
                            className="w-full bg-brand-gold text-brand-900 font-bold py-5 rounded-2xl hover:bg-white transition-all shadow-lg shadow-brand-gold/10 flex items-center justify-center gap-3 uppercase tracking-widest text-[10px]"
                            onClick={handleDraft}
                            disabled={drafting}
                        >
                            {drafting ? <Loader2 className="animate-spin" size={18}/> : <><Sparkles size={18}/> Draft Section</>}
                        </button>
                    </div>
                </div>

                <div className="lg:col-span-8">
                     <div className="bg-brand-950 border border-brand-800 p-12 rounded-[2.5rem] min-h-[500px] shadow-inner relative flex flex-col">
                        <h3 className="text-slate-500 font-bold mb-8 text-xs uppercase tracking-[0.2em] flex items-center justify-between">
                            AI Output Architecture
                            {planData[activeStepDef.id]?.draft && <span className="text-green-400 flex items-center gap-1"><ShieldCheck size={14}/> Verified Draft</span>}
                        </h3>
                        {planData[activeStepDef.id]?.draft ? (
                            <textarea 
                                className="w-full flex-1 bg-transparent text-slate-200 font-serif text-xl leading-relaxed focus:outline-none resize-none custom-scrollbar pr-4"
                                value={planData[activeStepDef.id].draft}
                                onChange={e => handleInput(activeStepDef.id, 'draft', e.target.value)}
                            />
                        ) : (
                            <div className="flex flex-col items-center justify-center flex-1 text-slate-700 opacity-30">
                                <Wand2 size={80} className="mb-6" />
                                <p className="text-center font-medium text-lg">Structure requires strategic inputs.<br/>Fill context panel to initialize drafting.</p>
                            </div>
                        )}
                     </div>
                </div>
            </div>
        );
    };

    return (
        <div className="flex h-screen bg-brand-950 pt-20 overflow-hidden">
            <aside className="w-80 bg-brand-900 border-r border-brand-800 flex-shrink-0 z-10 flex flex-col custom-scrollbar overflow-y-auto">
                <div className="p-8 border-b border-brand-800">
                    <h2 className="text-2xl font-heading font-bold text-white mb-1">Business AI</h2>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Strategy Architect v2.0</p>
                </div>
                <div className="p-4 space-y-1">
                    {STEPS.map((step, idx) => (
                        <button
                            key={step.id}
                            onClick={() => setCurrentStep(idx)}
                            className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl text-sm font-semibold transition-all text-left ${
                                currentStep === idx 
                                    ? 'bg-brand-gold text-brand-900 shadow-xl shadow-brand-gold/10' 
                                    : 'text-slate-400 hover:text-white hover:bg-brand-800'
                            }`}
                        >
                            <step.icon size={18} className={currentStep === idx ? 'text-brand-900' : 'text-slate-600'} />
                            <span className="flex-1 truncate">{idx + 1}. {step.title}</span>
                            {planData[step.id]?.draft && currentStep !== idx && <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>}
                        </button>
                    ))}
                </div>
            </aside>

            <main className="flex-grow overflow-y-auto custom-scrollbar p-12">
                <div className="max-w-6xl mx-auto space-y-12 pb-20">
                    <header className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-brand-800 pb-10">
                        <div>
                            <span className="text-[10px] font-bold text-brand-gold uppercase tracking-[0.3em] mb-4 block">Workspace / Step {currentStep + 1}</span>
                            <h1 className="text-6xl font-heading font-bold text-white tracking-tighter">{activeStepDef.title}</h1>
                        </div>
                        <div className="flex gap-3">
                            <button className="flex items-center gap-2 px-6 py-3 bg-brand-900 text-slate-400 font-bold rounded-xl border border-brand-800 hover:text-white transition-all text-[10px] uppercase tracking-widest"><Download size={14}/> Snapshot</button>
                            <button className="flex items-center gap-2 px-8 py-3 bg-brand-gold text-brand-900 font-bold rounded-xl hover:bg-white transition-all shadow-lg text-[10px] uppercase tracking-widest" onClick={() => setCurrentStep(prev => Math.min(STEPS.length - 1, prev + 1))}>Forward <ChevronRight size={14}/></button>
                        </div>
                    </header>
                    {renderContent()}
                </div>
            </main>
        </div>
    );
};

export default BusinessPlanBuilder;
