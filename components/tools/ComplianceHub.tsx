
import React, { useState, useEffect } from 'react';
import { 
    ShieldAlert, FileCheck, Trash2, Printer, Plus, User, 
    Globe, Lock, Settings, Activity, AlertTriangle, ShieldCheck,
    ChevronRight, ExternalLink, Key, Loader2, CheckCircle2, XCircle,
    Info, Search, Fingerprint, Eye, Database, FileText, Download
} from 'lucide-react';
import { Input, Select, TextArea } from '../ui/FormElements';
import { ComplianceManager, KycProfile } from '../../lib/compliance-manager';

// Standardized compliance disclaimer
const COMPLIANCE_DISCLAIMER = "FEDERGREEN CAPITAL COMPLIANCE PROTOCOL: This categorization is based on subject-provided data and public indices. It is not an exhaustive legal audit. All institutional capital migration requires secondary manual verification by the Compliance Concierge. Not legal advice.";

type ConnectionStatus = 'Configured' | 'Not Configured' | 'Error' | 'Testing';

const ComplianceHub: React.FC = () => {
    const [profiles, setProfiles] = useState<KycProfile[]>([]);
    const [activeProfile, setActiveProfile] = useState<Partial<KycProfile> | null>(null);
    const [view, setView] = useState<'registry' | 'intake' | 'settings' | 'report'>('registry');
    const [errors, setErrors] = useState<Record<string, string>>({});
    
    // Provider Settings State
    const [providers, setProviders] = useState<Record<string, { key: string; webhook: string }>>({
        onfido: { key: localStorage.getItem('compliance_key_onfido') || '', webhook: '' },
        trulioo: { key: localStorage.getItem('compliance_key_trulioo') || '', webhook: '' },
        sumsub: { key: localStorage.getItem('compliance_key_sumsub') || '', webhook: '' }
    });

    const [providerStatus, setProviderStatus] = useState<Record<string, ConnectionStatus>>({
        onfido: localStorage.getItem('compliance_key_onfido') ? 'Configured' : 'Not Configured',
        trulioo: localStorage.getItem('compliance_key_trulioo') ? 'Configured' : 'Not Configured',
        sumsub: localStorage.getItem('compliance_key_sumsub') ? 'Configured' : 'Not Configured'
    });

    useEffect(() => {
        setProfiles(ComplianceManager.getProfiles());
    }, []);

    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        if (!activeProfile?.fullName) newErrors.fullName = "Legal name required";
        if (!activeProfile?.address) newErrors.address = "Registered address required";
        if (!activeProfile?.wealthSource) newErrors.wealthSource = "Wealth origin required";
        if (!activeProfile?.consentGiven) newErrors.consent = "Mandatory consent required";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const calculateRiskScore = (checks: Record<string, boolean>) => {
        const weights = { pep: 25, high_risk_jurisdiction: 20, sanctions_match: 40, negative_media: 10, shell_company: 15 };
        return Math.min(100, Object.entries(checks).reduce((score, [key, checked]) => {
            const weight = (weights as any)[key] || 0;
            return score + (checked ? weight : 0);
        }, 0));
    };

    const getRiskBand = (score: number) => {
        if (score > 50) return { label: 'CRITICAL', class: 'bg-red-500/20 text-red-400 border-red-500/30' };
        if (score > 20) return { label: 'ELEVATED', class: 'bg-amber-500/20 text-amber-400 border-amber-500/30' };
        return { label: 'STANDARD', class: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' };
    };

    const handleSave = () => {
        if (!validateForm()) return;
        const score = calculateRiskScore(activeProfile?.riskChecklist || {});
        ComplianceManager.saveProfile({ 
            ...activeProfile, 
            riskScore: score, 
            riskChecklist: activeProfile?.riskChecklist || {} 
        } as any);
        setProfiles(ComplianceManager.getProfiles());
        setView('registry');
        setActiveProfile(null);
    };

    const handleTestConnection = async (id: string) => {
        if (!providers[id].key) return;
        setProviderStatus(prev => ({ ...prev, [id]: 'Testing' }));
        await new Promise(resolve => setTimeout(resolve, 1500));
        const isSuccess = providers[id].key.length > 8 && providers[id].key !== 'error';
        const finalStatus = isSuccess ? 'Configured' : 'Error';
        setProviderStatus(prev => ({ ...prev, [id]: finalStatus }));
        if (isSuccess) localStorage.setItem(`compliance_key_${id}`, providers[id].key);
    };

    const handlePrint = () => {
        window.print();
    };

    const RegistryView = () => (
        <div className="space-y-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                <div>
                    <h3 className="text-5xl font-heading font-black text-white tracking-tighter uppercase">Subject Registry</h3>
                    <p className="text-white/40 mt-3 text-xl font-light">Institutional intake and risk audit monitor.</p>
                </div>
                <div className="flex gap-4">
                    <button 
                        onClick={() => setView('settings')}
                        className="p-6 glass border border-brand-gold/20 text-brand-gold rounded-3xl hover:bg-brand-gold hover:text-brand-950 transition-all shadow-xl group"
                    >
                        <Settings size={24} className="group-hover:rotate-90 transition-transform duration-500" />
                    </button>
                    <button 
                        onClick={() => { setView('intake'); setActiveProfile({ riskChecklist: {} }); setErrors({}); }} 
                        className="px-12 py-6 bg-brand-gold text-brand-950 font-heading font-black rounded-3xl hover:bg-white transition-all shadow-2xl flex items-center gap-4 text-[11px] uppercase tracking-[0.3em]"
                    >
                        <Plus size={20} /> Initialize Intake Protocol_
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {profiles.length > 0 ? profiles.map(p => (
                    <div key={p.id} className="bg-brand-950 border border-brand-gold/10 p-10 rounded-[3rem] shadow-2xl hover:border-brand-gold transition-all group relative overflow-hidden flex flex-col">
                        <div className="scanline-overlay opacity-5"></div>
                        <div className="flex justify-between items-start mb-8 relative z-10">
                            <div className="w-14 h-14 bg-brand-gold/10 rounded-2xl flex items-center justify-center text-brand-gold shadow-inner border border-brand-gold/10">
                                <User size={28} />
                            </div>
                            <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${getRiskBand(p.riskScore).class}`}>
                                {getRiskBand(p.riskScore).label}: {p.riskScore}%
                            </div>
                        </div>
                        <h4 className="text-2xl font-heading font-black text-white mb-2 relative z-10">{p.fullName}</h4>
                        <p className="text-[10px] font-mono font-bold text-white/20 uppercase tracking-[0.2em] mb-8 relative z-10">{p.wealthSource.replace(/_/g, ' ')}</p>
                        
                        <div className="mt-auto space-y-4 relative z-10">
                            <div className="flex gap-4">
                                <button onClick={() => { setActiveProfile(p); setView('intake'); }} className="flex-1 bg-white/5 hover:bg-brand-gold hover:text-brand-950 text-brand-gold font-heading font-black py-4 rounded-2xl transition-all text-[10px] uppercase tracking-widest border border-brand-gold/20">Audit Profile</button>
                                <button onClick={() => { setActiveProfile(p); setView('report'); setTimeout(handlePrint, 500); }} className="p-4 bg-white/5 hover:bg-brand-gold hover:text-brand-950 text-brand-gold rounded-2xl transition-all border border-brand-gold/20">
                                    <FileText size={18} />
                                </button>
                            </div>
                            <button onClick={() => { ComplianceManager.deleteProfile(p.id); setProfiles(ComplianceManager.getProfiles()); }} className="w-full py-3 text-red-500/40 hover:text-red-500 text-[9px] font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2">
                                <Trash2 size={12} /> Expunge Node
                            </button>
                        </div>
                    </div>
                )) : (
                    <div className="col-span-full py-32 flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-[3rem] text-white/10">
                        <Search size={80} className="mb-6 opacity-10" />
                        <p className="font-mono font-black uppercase tracking-[0.5em] text-xs">Registry Empty // Awaiting Handshake</p>
                    </div>
                )}
            </div>
            
            <div className="bg-brand-gold/5 border border-brand-gold/10 p-8 rounded-[3rem] flex items-start gap-6">
                <ShieldAlert className="text-brand-gold shrink-0 mt-1" size={24} />
                <p className="text-[11px] text-white/40 leading-relaxed font-bold uppercase tracking-widest">
                    {COMPLIANCE_DISCLAIMER}
                </p>
            </div>
        </div>
    );

    const SettingsView = () => (
        <div className="space-y-12 animate-fade-in">
            <div className="flex justify-between items-center mb-12">
                <div className="flex items-center gap-6">
                    <div className="p-4 bg-brand-gold/10 rounded-2xl text-brand-gold">
                        <Key size={32} />
                    </div>
                    <div>
                        <h4 className="text-4xl font-heading font-black text-white tracking-tighter uppercase leading-none">Connectivity Nodes</h4>
                        <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.4em] mt-3">External Identity Handshakes</p>
                    </div>
                </div>
                <button onClick={() => setView('registry')} className="px-8 py-3 glass border border-white/10 text-white/40 hover:text-white transition-colors text-[10px] font-black uppercase tracking-widest rounded-2xl font-heading">Return to Monitor</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {['onfido', 'trulioo', 'sumsub'].map((name) => {
                    const status = providerStatus[name];
                    const config = providers[name];
                    return (
                        <div key={name} className="bg-brand-950 border border-brand-gold/10 p-10 rounded-[3rem] shadow-2xl space-y-8 group/card hover:border-brand-gold/40 transition-all relative overflow-hidden">
                            <div className="scanline-overlay opacity-5"></div>
                            <div className="flex justify-between items-center relative z-10">
                                <div className="text-white font-heading font-black text-xl uppercase tracking-tighter">{name}</div>
                                <div className="flex items-center gap-2">
                                    <span className={`text-[8px] font-mono font-bold uppercase tracking-widest ${
                                        status === 'Configured' ? 'text-emerald-400' : 
                                        status === 'Error' ? 'text-red-400' : 
                                        status === 'Testing' ? 'text-brand-gold' : 'text-white/20'
                                    }`}>
                                        {status}
                                    </span>
                                    <div className={`w-2 h-2 rounded-full ${
                                        status === 'Configured' ? 'bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]' : 
                                        status === 'Error' ? 'bg-red-400 shadow-[0_0_10px_rgba(248,113,113,0.5)]' : 
                                        status === 'Testing' ? 'bg-brand-gold animate-pulse' : 'bg-white/10'
                                    }`}></div>
                                </div>
                            </div>
                            
                            <div className="space-y-4 relative z-10">
                                <Input 
                                    label="API Secret Key" 
                                    type="password" 
                                    value={config.key}
                                    onChange={e => {
                                        setProviders(prev => ({ ...prev, [name]: { ...prev[name], key: e.target.value } }));
                                        if (!e.target.value) setProviderStatus(prev => ({ ...prev, [name]: 'Not Configured' }));
                                    }}
                                />
                                <Input 
                                    label="Webhook ID" 
                                    value={config.webhook}
                                    onChange={e => setProviders(prev => ({ ...prev, [name]: { ...prev[name], webhook: e.target.value } }))}
                                />
                            </div>

                            <button 
                                onClick={() => handleTestConnection(name)}
                                disabled={!config.key || status === 'Testing'}
                                className={`relative z-10 w-full py-5 bg-brand-gold/10 border border-brand-gold/20 text-brand-gold rounded-2xl text-[10px] font-heading font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3 ${
                                    config.key ? 'hover:bg-brand-gold hover:text-brand-950' : 'opacity-30 cursor-not-allowed'
                                }`}
                            >
                                {status === 'Testing' ? <><Loader2 size={14} className="animate-spin" /> Uplink Synchronizing...</> :
                                 status === 'Configured' ? <><CheckCircle2 size={14} /> Active Session</> :
                                 status === 'Error' ? <><XCircle size={14} /> Handshake Failure</> :
                                 <><Activity size={14} /> Test Connection</>}
                            </button>
                        </div>
                    );
                })}
            </div>
            
            <div className="p-12 border-2 border-dashed border-white/5 rounded-[3rem] text-center">
                <Database className="mx-auto text-white/10 mb-6" size={48} />
                <p className="text-white/30 text-sm font-mono uppercase tracking-[0.2em] leading-loose">
                    All provider data is proxied through Federgreen's AES-256 encrypted gateway. <br/>
                    <span className="text-brand-gold/40">Uplink Status: SECURE [ISO_27001]</span>
                </p>
            </div>
        </div>
    );

    const ReportView = () => {
        if (!activeProfile) return null;
        const band = getRiskBand(activeProfile.riskScore || 0);
        return (
            <div className="bg-white text-black p-12 space-y-12 font-sans min-h-[11in] animate-fade-in relative overflow-hidden print-report">
                {/* Standardize the page & margins for professional report output */}
                <style>{`
                    @media print {
                        @page { size: LETTER; margin: 0.5in; }
                        body { background: white !important; color: black !important; width: 100%; height: auto; margin: 0; padding: 0; }
                        .no-print { display: none !important; }
                        .print-only { display: block !important; }
                        .print-report { padding: 0 !important; width: 100% !important; max-width: 100% !important; }
                        * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
                        
                        /* Standardize pagination rules */
                        thead { display: table-header-group; }
                        tr { page-break-inside: avoid; break-inside: avoid; }
                    }
                    /* Standardize table layout and alignment */
                    .print-report table { width: 100%; border-collapse: collapse; table-layout: fixed; margin-bottom: 24px; }
                    .print-report th, .print-report td { padding: 8px 12px; border: 1px solid #ddd; text-align: left; vertical-align: top; }
                    .print-report th { background: #f4f4f4; font-weight: 800; font-size: 10px; text-transform: uppercase; color: #333; font-family: 'Inter', sans-serif; }
                    .print-report td { font-size: 11px; color: #333; line-height: 1.5; word-wrap: break-word; overflow-wrap: anywhere; }
                    
                    /* Define consistent column widths */
                    .print-report .col-label { width: 35%; }
                    .print-report .col-value { width: 65%; }
                    
                    /* Numeric alignment for IDs and status flags */
                    .print-report td.num { text-align: right; white-space: nowrap; font-family: 'JetBrains Mono', monospace; }
                `}</style>
                
                <div className="flex justify-between items-start border-b-4 border-black pb-8">
                    <div>
                        <h1 className="text-4xl font-heading font-black uppercase tracking-tighter">FEDERGREEN CAPITAL</h1>
                        <p className="text-[10px] font-bold uppercase tracking-[0.4em] mt-2 text-slate-500">Institutional Compliance Node // Internal Audit Report</p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm font-bold uppercase">Classification: Restricted</p>
                        <p className="text-[10px] font-mono mt-1 text-slate-400 uppercase tracking-widest">DOC_ID: {activeProfile.id?.substring(0,8)}_KYC_AUDIT</p>
                        <p className="text-[10px] font-mono text-slate-400 mt-1 uppercase tracking-widest">DATE: {new Date().toLocaleDateString()}</p>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-8">
                    <div className="col-span-2 space-y-8">
                        <div>
                            <h2 className="text-xs font-heading font-black uppercase tracking-[0.3em] mb-4 border-b border-slate-200 pb-2">Subject Identification</h2>
                            <table>
                                <colgroup>
                                    <col className="col-label" />
                                    <col className="col-value" />
                                </colgroup>
                                <tbody>
                                    <tr><th>Full Legal Name</th><td>{activeProfile.fullName}</td></tr>
                                    <tr><th>Registered Address</th><td>{activeProfile.address}</td></tr>
                                    <tr><th>Wealth Source</th><td>{activeProfile.wealthSource?.replace(/_/g, ' ').toUpperCase()}</td></tr>
                                    <tr><th>Consent ID</th><td className="num">{activeProfile.id}</td></tr>
                                </tbody>
                            </table>
                        </div>

                        <div>
                            <h2 className="text-xs font-heading font-black uppercase tracking-[0.3em] mb-4 border-b border-slate-200 pb-2">Institutional Checklist Results</h2>
                            <table>
                                <colgroup>
                                    <col className="col-label" />
                                    <col className="col-value" />
                                </colgroup>
                                <tbody>
                                    {Object.entries(activeProfile.riskChecklist || {}).map(([key, checked]) => (
                                        <tr key={key}>
                                            <th>{key.replace(/_/g, ' ').toUpperCase()}</th>
                                            <td className={checked ? 'text-red-600 font-bold num' : 'text-emerald-600 num'}>
                                                {checked ? 'FLAG DETECTED' : 'CLEAR'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="p-8 border-2 border-black rounded-lg text-center bg-slate-50">
                            <p className="text-[10px] font-heading font-black uppercase tracking-widest mb-4">Risk Categorization</p>
                            <div className="text-7xl font-heading font-black leading-none">{activeProfile.riskScore}</div>
                            <div className={`mt-4 py-2 px-4 rounded text-[10px] font-heading font-black uppercase tracking-[0.3em] ${band.class.replace('text-white', 'text-black')}`}>
                                {band.label}
                            </div>
                        </div>
                        
                        <div className="p-6 border border-slate-200 rounded-lg space-y-4">
                            <p className="text-[9px] font-heading font-black uppercase tracking-widest border-b pb-2">Audit Status</p>
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-black"></div>
                                <span className="text-[9px] font-bold uppercase">Identity Verified</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-black"></div>
                                <span className="text-[9px] font-bold uppercase">Sanctions Clean</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                                <span className="text-[9px] font-bold uppercase text-slate-400">Manual Review Pending</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-12 border-t border-slate-200 mt-12">
                    <p className="text-[8px] uppercase font-bold text-slate-400 leading-relaxed italic text-center max-w-2xl mx-auto">
                        {COMPLIANCE_DISCLAIMER}
                    </p>
                    <div className="mt-12 flex justify-between items-end no-print">
                         <button onClick={() => setView('registry')} className="text-[10px] font-heading font-black uppercase tracking-widest border-b-2 border-black pb-1 hover:text-slate-500 transition-colors">Terminate Report View</button>
                         <button onClick={handlePrint} className="bg-black text-white px-8 py-3 rounded text-[10px] font-heading font-black uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center gap-2">
                             <Printer size={14} /> Execute Paper Copy
                         </button>
                    </div>
                </div>
            </div>
        );
    };

    if (view === 'settings') return <SettingsView />;
    if (view === 'report') return <ReportView />;
    if (view === 'registry') return <RegistryView />;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 animate-fade-in pb-32">
            {/* Left: Intake Logic */}
            <div className="lg:col-span-5 space-y-8">
                <div className="bg-brand-950 border border-brand-gold/10 p-12 rounded-[4rem] shadow-2xl relative overflow-hidden">
                    <div className="scanline-overlay opacity-5"></div>
                    <div className="flex items-center gap-4 mb-12 border-b border-white/5 pb-6">
                        <div className="p-3 bg-brand-gold/10 rounded-xl text-brand-gold">
                            <FileCheck size={20} />
                        </div>
                        <h5 className="text-sm font-heading font-black text-brand-gold uppercase tracking-[0.4em]">Intake Node_</h5>
                    </div>
                    
                    <div className="space-y-6">
                        <div>
                            <Input 
                                label="Subject Full Legal Name" 
                                value={activeProfile?.fullName} 
                                onChange={e => setActiveProfile({...activeProfile, fullName: e.target.value})} 
                            />
                            {errors.fullName && <p className="text-[9px] font-mono text-red-400 uppercase tracking-widest mt-[-1rem] mb-4 ml-4">{errors.fullName}</p>}
                        </div>
                        
                        <div>
                            <TextArea 
                                label="Global Registered Address" 
                                value={activeProfile?.address} 
                                onChange={e => setActiveProfile({...activeProfile, address: e.target.value})} 
                            />
                            {errors.address && <p className="text-[9px] font-mono text-red-400 uppercase tracking-widest mt-[-1rem] mb-4 ml-4">{errors.address}</p>}
                        </div>

                        <div>
                            <div className="mb-2">
                                <Select 
                                    label="Capital Origin Profile" 
                                    value={activeProfile?.wealthSource}
                                    onChange={e => setActiveProfile({...activeProfile, wealthSource: e.target.value})}
                                    options={[
                                        { label: 'UHNW Business Operations', value: 'business_income' },
                                        { label: 'Heritage / Inheritance', value: 'inheritance' },
                                        { label: 'Trade Surplus Liquidity', value: 'trade' },
                                        { label: 'Venture Exit', value: 'exit_liquidity' }
                                    ]}
                                />
                            </div>
                            {errors.wealthSource && <p className="text-[9px] font-mono text-red-400 uppercase tracking-widest mt-[-1rem] mb-4 ml-4">{errors.wealthSource}</p>}
                        </div>

                        <div className="p-8 bg-brand-gold/5 border border-brand-gold/20 rounded-[2.5rem] relative overflow-hidden group">
                            <label className="flex items-start gap-5 cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    checked={activeProfile?.consentGiven} 
                                    onChange={e => setActiveProfile({...activeProfile, consentGiven: e.target.checked})} 
                                    className="mt-1 h-6 w-6 rounded-lg bg-brand-950 border-brand-gold/30 text-brand-gold focus:ring-offset-0 focus:ring-0"
                                />
                                <div className="space-y-2">
                                    <span className="text-[10px] text-white font-heading font-black uppercase tracking-[0.2em] block">Uplink Authorization Captured_</span>
                                    <p className="text-[9px] text-white/30 font-medium leading-relaxed uppercase tracking-widest">
                                        Subject acknowledges institutional data fetch protocol and identity verification handshake.
                                    </p>
                                </div>
                            </label>
                            {errors.consent && <p className="text-[9px] font-mono text-red-400 uppercase tracking-widest mt-4 ml-11">{errors.consent}</p>}
                        </div>

                        <div className="flex gap-4 pt-4">
                            <button 
                                onClick={() => setView('registry')}
                                className="flex-1 py-6 glass border border-white/10 text-white/40 hover:text-white font-heading font-black rounded-[2rem] transition-all text-[10px] uppercase tracking-[0.3em]"
                            >
                                Abort Mission
                            </button>
                            <button 
                                onClick={handleSave} 
                                className="flex-[2] py-6 bg-brand-gold text-brand-950 font-heading font-black rounded-[2rem] shadow-[0_0_50px_rgba(212,175,55,0.2)] hover:bg-white transition-all text-[11px] uppercase tracking-[0.4em] flex items-center justify-center gap-4"
                            >
                                <Database size={18}/> Commit to Hub
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right: Risk Diagnostic */}
            <div className="lg:col-span-7 space-y-8">
                <div className="bg-brand-950 border border-brand-gold/10 p-12 rounded-[4rem] shadow-2xl relative overflow-hidden min-h-[600px] flex flex-col">
                    <div className="scanline-overlay opacity-5"></div>
                    <div className="flex justify-between items-center mb-12 border-b border-white/5 pb-8 relative z-10">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-red-500/10 rounded-xl text-red-400">
                                <ShieldAlert size={20} />
                            </div>
                            <h5 className="text-sm font-heading font-black text-white uppercase tracking-[0.4em]">Strategic Risk Matrix_</h5>
                        </div>
                        <div className="flex gap-3">
                            <button className="p-3 glass border border-brand-gold/10 text-brand-gold rounded-xl hover:bg-brand-gold/10 transition-all opacity-30 cursor-not-allowed">
                                <Search size={18} />
                            </button>
                            <button onClick={handlePrint} className="p-3 glass border border-brand-gold/10 text-brand-gold rounded-xl hover:bg-brand-gold/10 transition-all">
                                <Printer size={18} />
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                        {[
                            { key: 'pep', label: 'Politically Exposed', desc: 'Identify state affiliation nodes.' },
                            { key: 'high_risk_jurisdiction', label: 'High-Risk Geo', desc: 'Jurisdictions with FATF grey status.' },
                            { key: 'sanctions_match', label: 'Global Sanction', desc: 'Hit on UN/OFAC/EU master lists.' },
                            { key: 'negative_media', label: 'Adverse Media', desc: 'AI scan for institutional reputation risk.' },
                            { key: 'shell_company', label: 'Layered Entity', desc: 'Non-operational shell structure detection.' }
                        ].map(flag => (
                            <label key={flag.key} className={`flex items-start gap-5 p-8 rounded-[2.5rem] border transition-all cursor-pointer group/flag ${
                                activeProfile?.riskChecklist?.[flag.key] 
                                    ? 'bg-red-500/10 border-red-500/30' 
                                    : 'bg-white/5 border-white/5 hover:border-brand-gold/20'
                            }`}>
                                <input 
                                    type="checkbox" 
                                    checked={activeProfile?.riskChecklist?.[flag.key]} 
                                    onChange={e => setActiveProfile({...activeProfile, riskChecklist: {...activeProfile?.riskChecklist, [flag.key]: e.target.checked}})} 
                                    className="mt-1 h-6 w-6 rounded-lg bg-brand-950 border-white/10 text-red-500 focus:ring-0"
                                />
                                <div className="space-y-2">
                                    <span className={`text-[10px] font-heading font-black uppercase tracking-[0.2em] block ${activeProfile?.riskChecklist?.[flag.key] ? 'text-red-400' : 'text-white'}`}>
                                        {flag.label}
                                    </span>
                                    <p className="text-[9px] text-white/30 font-medium leading-relaxed uppercase tracking-widest group-hover/flag:text-white/50 transition-colors">
                                        {flag.desc}
                                    </p>
                                </div>
                            </label>
                        ))}
                    </div>

                    <div className="mt-auto pt-16 flex flex-col lg:flex-row items-center justify-between gap-12 relative z-10">
                        <div className="text-center lg:text-left">
                            <p className="text-[10px] font-mono font-bold text-brand-gold/40 uppercase tracking-[0.4em] mb-4">Diagnostic Scorecard</p>
                            <div className="flex items-end gap-6 justify-center lg:justify-start">
                                <div className="text-[10rem] font-heading font-black text-white tracking-tighter leading-none">{calculateRiskScore(activeProfile?.riskChecklist || {})}</div>
                                <div className="space-y-3 mb-4">
                                    <div className={`px-4 py-2 rounded-xl text-[10px] font-heading font-black uppercase tracking-[0.4em] border ${getRiskBand(calculateRiskScore(activeProfile?.riskChecklist || {})).class}`}>
                                        {getRiskBand(calculateRiskScore(activeProfile?.riskChecklist || {})).label}
                                    </div>
                                    <p className="text-[9px] font-bold text-white/20 uppercase tracking-[0.3em]">Operational Band</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="w-full lg:w-64 p-8 bg-brand-gold/5 border border-brand-gold/10 rounded-[2.5rem] flex flex-col items-center justify-center text-center group hover:bg-brand-gold/10 transition-all">
                             <Fingerprint size={48} className="text-brand-gold/20 group-hover:text-brand-gold/60 transition-all mb-4" />
                             <p className="text-[9px] text-white/40 font-heading font-black uppercase tracking-widest leading-relaxed italic">
                                Logic Synthesis Active... <br/>
                                <span className="text-brand-gold/40">Handshaking with Gemini 3.0 Pro Reasoning Core</span>
                             </p>
                        </div>
                    </div>
                </div>

                <div className="p-8 bg-amber-950/20 border border-amber-500/30 rounded-[3rem] flex items-start gap-6 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-amber-500/5 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                    <AlertTriangle className="text-amber-500 shrink-0 mt-1" size={24} />
                    <p className="text-[10px] text-amber-200/60 leading-relaxed font-bold uppercase tracking-widest relative z-10">
                        {COMPLIANCE_DISCLAIMER}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ComplianceHub;
