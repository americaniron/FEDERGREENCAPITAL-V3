
import React, { useState, useEffect } from 'react';
import { 
    ShieldAlert, UserCheck, Search, Scale, FileCheck, 
    AlertTriangle, CheckCircle, Info, ExternalLink, 
    Globe, Lock, Database, Briefcase, Zap, History, Plus, User, Trash2, Printer
} from 'lucide-react';
import { Input, Select, TextArea } from '../ui/FormElements';
import { ComplianceManager, KycProfile } from '../../lib/compliance-manager';

const COMPLIANCE_DISCLAIMER = "This module supports compliance workflows only and is not legal advice or a substitute for regulated KYC/AML services. Use licensed providers and confirm jurisdictional requirements with counsel.";

const EMPTY_PROFILE_DATA = {
    fullName: '', dob: '', address: '', idType: 'passport', idNumber: '',
    wealthSource: 'business_income', expectedVolume: '1m_5m', consentGiven: false,
};

const EMPTY_RISK_CHECKS = {
    pep: false, high_risk_jurisdiction: false, sanctions_match: false,
    negative_media: false, shell_company: false, cash_intensive: false
};

const ComplianceHub: React.FC = () => {
    const [profiles, setProfiles] = useState<KycProfile[]>([]);
    const [activeProfile, setActiveProfile] = useState<Partial<KycProfile> | null>(null);
    
    useEffect(() => {
        setProfiles(ComplianceManager.getProfiles());
    }, []);

    const calculateRiskScore = (checks: Record<string, boolean>) => {
        const weights = { pep: 25, high_risk_jurisdiction: 20, sanctions_match: 40, negative_media: 10, shell_company: 15, cash_intensive: 5 };
        return Math.min(100, Object.entries(checks).reduce((score, [key, checked]) => score + (checked ? weights[key as keyof typeof weights] : 0), 0));
    };

    const handleSave = () => {
        if (!activeProfile || !activeProfile.consentGiven) return;
        const score = calculateRiskScore(activeProfile.riskChecklist || {});
        const profileToSave = { ...activeProfile, riskScore: score, riskChecklist: activeProfile.riskChecklist || {} };
        
        ComplianceManager.saveProfile(profileToSave as any);
        setProfiles(ComplianceManager.getProfiles());
        setActiveProfile(null);
    };

    const handleNewProfile = () => {
        setActiveProfile({ ...EMPTY_PROFILE_DATA, riskChecklist: { ...EMPTY_RISK_CHECKS } });
    };

    const handleDelete = (id: string) => {
        ComplianceManager.deleteProfile(id);
        setProfiles(ComplianceManager.getProfiles());
    };

    const handlePrint = () => window.print();

    if (activeProfile) {
        const score = calculateRiskScore(activeProfile.riskChecklist || {});
        return (
            <div className="max-w-7xl mx-auto space-y-8 pb-20 animate-fade-in">
                 <style>{`@media print { body * { visibility: hidden; } #print-area, #print-area * { visibility: visible; } #print-area { position: absolute; left: 0; top: 0; right: 0; } }`}</style>
                <div id="print-area">
                    <Disclaimer />
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 bg-brand-900 border border-brand-800 p-8 rounded-2xl">
                            <h4 className="font-bold text-white text-xl mb-6">KYC/AML Intake & Risk Assessment</h4>
                            <div className="space-y-4">
                               <Input label="Full Legal Name" value={activeProfile.fullName} onChange={e => setActiveProfile({...activeProfile, fullName: e.target.value})} />
                               <TextArea label="Address" value={activeProfile.address} onChange={e => setActiveProfile({...activeProfile, address: e.target.value})} />
                                {/* ... more inputs for all profile fields */}
                            </div>
                             <div className="mt-6 space-y-4">
                                {Object.keys(EMPTY_RISK_CHECKS).map(key => (
                                    <label key={key} className="flex items-center gap-3 p-3 bg-brand-950 rounded-lg border border-brand-800 cursor-pointer hover:border-brand-gold">
                                        <input type="checkbox" checked={activeProfile.riskChecklist?.[key]} onChange={e => setActiveProfile({...activeProfile, riskChecklist: {...activeProfile.riskChecklist, [key]: e.target.checked}})} className="h-4 w-4 rounded bg-brand-800 border-brand-700 text-brand-gold focus:ring-brand-gold"/>
                                        <span className="text-sm text-white font-medium capitalize">{key.replace(/_/g, ' ')}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                        <div className="space-y-8">
                            <div className="bg-brand-900 border border-brand-800 p-8 rounded-2xl text-center">
                                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Risk Score</h4>
                                <p className="text-6xl font-bold text-white">{score}</p>
                                <p className={`font-bold mt-2 ${score > 50 ? 'text-red-400' : 'text-green-400'}`}>{score > 50 ? 'High Risk' : 'Low Risk'}</p>
                            </div>
                             <div className="p-6 bg-brand-900 border border-brand-800 rounded-2xl">
                                <label className="flex items-start gap-3 cursor-pointer">
                                    <input type="checkbox" checked={activeProfile.consentGiven} onChange={e => setActiveProfile({...activeProfile, consentGiven: e.target.checked})} className="h-4 w-4 mt-1 rounded bg-brand-800 border-brand-700 text-brand-gold focus:ring-brand-gold"/>
                                    <span className="text-xs text-slate-400">I confirm the information is accurate and consent to verification procedures.</span>
                                </label>
                                <button onClick={handleSave} disabled={!activeProfile.consentGiven} className="w-full mt-4 bg-brand-gold text-brand-900 font-bold py-3 rounded-lg disabled:opacity-50 flex items-center justify-center gap-2">
                                    <FileCheck size={16}/> Save Profile
                                </button>
                                <button onClick={handlePrint} className="w-full mt-2 bg-brand-800 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2">
                                    <Printer size={16}/> Export PDF
                                </button>
                             </div>
                        </div>
                    </div>
                </div>
                <button onClick={() => setActiveProfile(null)} className="text-slate-400 hover:text-white">← Back to List</button>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-20">
            <Disclaimer />
            <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold text-white">Compliance Profiles</h3>
                <button onClick={handleNewProfile} className="flex items-center gap-2 bg-brand-gold text-brand-900 font-bold px-5 py-2 rounded-lg text-sm"><Plus size={16}/> New Profile</button>
            </div>
            <div className="space-y-4">
                {profiles.map(p => (
                    <div key={p.id} className="p-5 bg-brand-900 border border-brand-800 rounded-xl flex justify-between items-center">
                        <div onClick={() => setActiveProfile(p)} className="flex-1 cursor-pointer">
                            <p className="font-bold text-white">{p.fullName}</p>
                            <p className="text-xs text-slate-500">Last updated: {new Date(p.lastUpdated).toLocaleDateString()}</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className={`px-3 py-1 text-xs font-bold rounded-full ${p.riskScore > 50 ? 'bg-red-900/50 text-red-400' : 'bg-green-900/50 text-green-400'}`}>{p.riskScore}% Risk</div>
                            <button onClick={() => handleDelete(p.id)} className="text-slate-600 hover:text-red-500"><Trash2 size={16}/></button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const Disclaimer = () => (
    <div className="bg-amber-950/20 border border-amber-500/30 p-4 rounded-xl flex items-start gap-4 mb-8">
        <ShieldAlert className="text-amber-500 shrink-0 mt-0.5" size={20} />
        <p className="text-xs text-amber-200/70 leading-relaxed font-medium">
            {COMPLIANCE_DISCLAIMER}
        </p>
    </div>
);

export default ComplianceHub;
