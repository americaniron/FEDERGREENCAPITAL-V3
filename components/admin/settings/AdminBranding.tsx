
import React from 'react';
import { Image as ImageIcon } from 'lucide-react';
import { SiteSettings } from '../../../config/settingsModel';
import { DEFAULT_SITE_SETTINGS } from '../../../config/defaultSettings';

interface AdminBrandingProps {
    settings: SiteSettings;
    onUpdate: (settings: SiteSettings) => void;
}

const AdminBranding: React.FC<AdminBrandingProps> = ({ settings, onUpdate }) => {
    const handleImageChange = (page: string, url: string) => {
        const newImages = { ...settings.images, [page]: url };
        onUpdate({ ...settings, images: newImages });
    };

    return (
        <div className="p-4">
            <header className="mb-8">
                <h2 className="text-xl font-bold text-slate-100 mb-2">Page Hero Asset Overrides</h2>
                <p className="text-sm text-slate-400">Specify external image URLs to override the default hero images for specific strategic nodes.</p>
            </header>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.keys(DEFAULT_SITE_SETTINGS.content.pages).map(pagePath => {
                    const pageInfo = DEFAULT_SITE_SETTINGS.content.pages[pagePath];
                    if (!pageInfo.image) return null;

                    return (
                        <div key={pagePath} className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 hover:border-brand-gold/30 transition-colors group">
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="font-bold text-slate-100 uppercase tracking-tight">{pageInfo.title}</h3>
                                <span className="text-[10px] text-slate-500 font-mono bg-slate-900 px-2 py-1 rounded">{pagePath}</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-slate-900 rounded border border-slate-700 text-slate-600 group-hover:text-brand-gold transition-colors">
                                    <ImageIcon size={18} />
                                </div>
                                <input
                                    type="text"
                                    value={settings.images[pagePath] || ''}
                                    onChange={(e) => handleImageChange(pagePath, e.target.value)}
                                    placeholder="Enter Image URL (HTTPS)..."
                                    className="flex-1 bg-slate-900 border border-slate-600 rounded-lg p-3 text-sm text-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-gold placeholder:text-slate-700"
                                />
                            </div>
                             <div className="mt-3 flex justify-between items-center">
                                <span className="text-[9px] text-slate-600 uppercase font-bold tracking-widest">Active Source: {settings.images[pagePath] ? 'Custom' : 'System Default'}</span>
                                {settings.images[pagePath] && (
                                    <button 
                                        onClick={() => handleImageChange(pagePath, '')}
                                        className="text-[9px] text-red-500/60 hover:text-red-400 uppercase font-black tracking-widest"
                                    >
                                        Clear Override
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default AdminBranding;
