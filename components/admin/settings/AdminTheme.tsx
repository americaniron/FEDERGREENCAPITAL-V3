
import React, { useRef, useState, useEffect } from 'react';
import { SiteSettings } from '../../../config/settingsModel';
import { Image as ImageIcon, Trash2, UploadCloud, ShieldCheck, Fingerprint } from 'lucide-react';
import { brandingService } from '../../../services/brandingService';

interface AdminThemeProps {
    settings: SiteSettings;
    onUpdate: (settings: SiteSettings) => void;
}

const AdminTheme: React.FC<AdminThemeProps> = ({ settings, onUpdate }) => {
    const [customLogo, setCustomLogo] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setCustomLogo(brandingService.getCustomLogo());
    }, []);

    const handleLogoUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result as string;
            brandingService.setCustomLogo(base64String);
            window.location.reload(); 
        };
        reader.readAsDataURL(file);
    };

    const handleClearLogo = () => {
        brandingService.clearCustomLogo();
        setCustomLogo(null);
        window.location.reload();
    };
    
    const handleColorChange = (key: string, value: string) => {
        onUpdate({
            ...settings,
            theme: {
                ...settings.theme,
                colors: {
                    ...settings.theme.colors,
                    brand: {
                        ...settings.theme.colors.brand,
                        [key]: value,
                    }
                }
            }
        });
    };

    return (
        <div className="p-4 space-y-12">
            {/* Logo & Identity Section - Moved to top for visibility */}
            <section>
                <h2 className="text-xl font-bold text-slate-100 mb-6 flex items-center gap-3">
                    <ShieldCheck className="text-brand-gold" size={20} />
                    Site Identity & Logo
                </h2>
                <div className="bg-slate-800/50 border border-slate-700 rounded-3xl p-8 shadow-xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Fingerprint size={120} />
                    </div>
                    
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                        accept="image/*"
                    />

                    <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
                        <div className="flex flex-col items-center gap-4">
                            <div className="text-[10px] font-mono font-black text-slate-500 uppercase tracking-widest">Active Render</div>
                            {customLogo ? (
                                <div className="p-6 bg-slate-900 rounded-2xl border border-slate-700 shadow-inner">
                                    <img src={customLogo} alt="Custom Logo" className="h-16 w-auto object-contain" />
                                </div>
                            ) : (
                                <div className="h-28 w-48 bg-slate-900/50 border border-dashed border-slate-600 rounded-2xl flex flex-col items-center justify-center gap-3 text-slate-500">
                                    <ImageIcon size={32} />
                                    <span className="text-[9px] font-bold uppercase tracking-widest">System Default</span>
                                </div>
                            )}
                        </div>

                        <div className="flex-1 text-center md:text-left">
                            <h3 className="text-white font-bold text-lg mb-2 uppercase tracking-tight">Institutional Branding</h3>
                            <p className="text-sm text-slate-400 max-w-md leading-relaxed">
                                {customLogo 
                                    ? 'A proprietary brand asset is currently active. This logo will be displayed across all global nodes including the navigation header, secure portal, and terminal overlays.'
                                    : 'No custom logo detected. The site is currently utilizing the system default Federgreen Panther SVG identity.'}
                            </p>
                            <div className="mt-8 flex flex-wrap justify-center md:justify-start gap-4">
                                <button 
                                    onClick={handleLogoUploadClick} 
                                    className="flex items-center gap-3 px-8 py-4 bg-brand-gold text-brand-950 rounded-xl text-xs font-black uppercase tracking-[0.2em] hover:bg-white transition-all shadow-lg active:scale-95"
                                >
                                    <UploadCloud size={16} /> Upload New Logo
                                </button>
                                {customLogo && (
                                    <button 
                                        onClick={handleClearLogo} 
                                        className="flex items-center gap-3 px-8 py-4 bg-slate-700 text-slate-300 rounded-xl text-xs font-black uppercase tracking-[0.2em] hover:bg-red-900/40 hover:text-red-400 transition-all border border-transparent hover:border-red-500/20"
                                    >
                                        <Trash2 size={16} /> Revert to Default
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Colors Section */}
            <section>
                <h2 className="text-xl font-bold text-slate-100 mb-6">Brand Color Palette</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {Object.entries(settings.theme.colors.brand).map(([key, value]) => (
                        <div key={key} className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 hover:border-slate-500 transition-colors">
                            <label className="block text-[10px] font-bold text-slate-500 mb-3 uppercase tracking-widest">{key.replace('_', ' ')}</label>
                            <div className="flex items-center gap-3">
                                <input 
                                    type="color"
                                    value={value}
                                    onChange={(e) => handleColorChange(key, e.target.value)}
                                    className="w-10 h-10 p-0 border-none rounded-lg cursor-pointer bg-transparent"
                                />
                                <input
                                    type="text"
                                    value={value}
                                    onChange={(e) => handleColorChange(key, e.target.value)}
                                    className="flex-1 bg-slate-900 border border-slate-600 rounded-md p-2 text-xs text-slate-300 font-mono focus:border-brand-gold outline-none"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default AdminTheme;
