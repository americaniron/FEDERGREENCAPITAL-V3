

import React, { useState } from 'react';
// FIX: Added Users to the imports to resolve 'Cannot find name Users' error.
import { Key, Shield, Info, Save, Globe, Landmark, Wifi, Cloud, AlertCircle, Users } from 'lucide-react';

const ApiSettings: React.FC = () => {
    const [keys, setKeys] = useState({
        fcc: localStorage.getItem('api_key_fcc') || '',
        census: localStorage.getItem('api_key_census') || '',
        dot: localStorage.getItem('api_key_dot') || '',
        usda: localStorage.getItem('api_key_usda') || ''
    });

    const [saved, setSaved] = useState(false);

    const handleSave = () => {
        // FIX: Corrected template literal syntax and ensured 'val' is treated as a string.
        Object.entries(keys).forEach(([key, val]) => {
            // FIX: Explicitly convert `val` to a string to satisfy localStorage.setItem's signature.
            localStorage.setItem(`api_key_${key}`, String(val));
        });
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const KeyInput = ({ id, label, icon: Icon, description }: any) => (
        <div className="bg-brand-900 border border-brand-800 p-6 rounded-2xl">
            <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-brand-950 rounded text-brand-gold border border-brand-800">
                    <Icon size={18} />
                </div>
                <div>
                    <h4 className="text-white font-bold text-sm tracking-wide">{label}</h4>
                </div>
            </div>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">{description}</p>
            <div className="relative">
                <input 
                    type="password"
                    value={(keys as any)[id]}
                    onChange={(e) => setKeys({...keys, [id]: e.target.value})}
                    placeholder={`Enter ${label} Secret Key...`}
                    className="w-full bg-brand-950 border border-brand-700 rounded-lg py-3 px-4 text-white text-sm focus:border-brand-gold transition-all font-mono placeholder:text-slate-700"
                />
                <Key className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-700" size={14} />
            </div>
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto space-y-10 animate-fade-in pb-20">
            <header className="flex justify-between items-end border-b border-brand-800 pb-8">
                <div>
                    <h3 className="text-3xl font-heading font-bold text-white">API Configuration</h3>
                    <p className="text-slate-400 mt-2">Manage secure connections to institutional data providers.</p>
                </div>
                <button 
                    onClick={handleSave}
                    className="bg-brand-gold text-brand-900 font-bold px-8 py-3 rounded-xl hover:bg-white transition-all shadow-lg flex items-center gap-2 text-xs uppercase tracking-widest"
                >
                    {saved ? 'Settings Updated' : <><Save size={16}/> Save Keys</>}
                </button>
            </header>

            <div className="bg-brand-950 border border-brand-800 p-6 rounded-2xl flex items-start gap-4">
                <Shield className="text-brand-gold shrink-0 mt-1" size={20} />
                <div>
                    <p className="text-sm text-white font-bold mb-1">Security Standard</p>
                    <p className="text-xs text-slate-500 leading-relaxed">
                        API keys are stored in your browser's local session storage and are never transmitted to Federgreen Capital servers. 
                        They are used exclusively for client-side fetches to data providers.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <KeyInput 
                    id="census" 
                    label="US Census Bureau" 
                    icon={Users} 
                    description="Used for high-granularity demographic and socio-economic data at the block-group level."
                />
                <KeyInput 
                    id="fcc" 
                    label="FCC Broadband" 
                    icon={Wifi} 
                    description="Enables live coverage and speed maps for commercial and residential telecom due diligence."
                />
                <KeyInput 
                    id="usda" 
                    label="USDA NASS" 
                    icon={Landmark} 
                    description="Agricultural yields, soil classification, and land valuation indices for rural acquisitions."
                />
                <KeyInput 
                    id="dot" 
                    label="Department of Transportation" 
                    icon={Globe} 
                    description="Traffic flow (AADT) and commute pattern analytics for retail and residential sites."
                />
            </div>

            <div className="bg-brand-900/30 border border-brand-800 border-dashed p-10 rounded-3xl text-center">
                <AlertCircle className="mx-auto text-slate-500 mb-4" size={32} />
                <h4 className="text-slate-300 font-bold mb-2">Institutional Access</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                    Some providers (EPA, USGS) do not require authentication for public tier access. 
                    Institutional tier users should contact the IT concierge for backend proxy configuration.
                </p>
            </div>
        </div>
    );
};

export default ApiSettings;