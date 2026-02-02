
import React from 'react';
import { Image as ImageIcon, Trash2 } from 'lucide-react';
import { SiteSettings } from '../../../config/settingsModel';
import { DEFAULT_SITE_SETTINGS } from '../../../config/defaultSettings';
import { brandingService } from '../../../services/brandingService';

interface AdminBrandingProps {
    settings: SiteSettings;
    onUpdate: (settings: SiteSettings) => void;
}

const AdminBranding: React.FC<AdminBrandingProps> = ({ settings, onUpdate }) => {
    
    const [customLogo, setCustomLogo] = React.useState<string | null>(null);
    React.useEffect(() => {
        setCustomLogo(brandingService.getCustomLogo());
    }, []);

    const handleClearLogo = () => {
        brandingService.clearCustomLogo();
        setCustomLogo(null);
        alert('Custom logo cleared. The site will reflect the change on the next full page load.');
        window.location.reload();
    };

    const handleImageChange = (page: string, url: string) => {
        const newImages = { ...settings.images, [page]: url };
        onUpdate({ ...settings, images: newImages });
    };

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold text-slate-100 mb-6">Site Branding</h2>
            <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
                <h3 className="font-bold text-slate-100 mb-4">Custom Logo</h3>
                {customLogo ? (
                    <div className="flex items-center gap-6">
                        <img src={customLogo} alt="Custom Logo" className="h-16 w-auto bg-slate-900 p-2 rounded-lg" />
                        <div className="flex-1">
                            <p className="text-sm text-slate-300">A custom logo is currently active.</p>
                            <p className="text-xs text-slate-500">To upload a new one, use the "Upload Logo" button on the homepage while in Admin Preview mode.</p>
                        </div>
                        <button onClick={handleClearLogo} className="flex items-center gap-2 px-4 py-3 bg-red-900/30 text-red-400 rounded-lg text-xs font-semibold hover:bg-red-900/50">
                            <Trash2 size={14} /> Clear Logo
                        </button>
                    </div>
                ) : (
                    <p className="text-sm text-slate-400">No custom logo uploaded. The default site logo is being used.</p>
                )}
            </div>
            
            <h2 className="text-xl font-bold text-slate-100 mt-12 mb-6">Page Hero Images</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.keys(DEFAULT_SITE_SETTINGS.content.pages).map(pagePath => {
                    const pageInfo = DEFAULT_SITE_SETTINGS.content.pages[pagePath];
                    if (!pageInfo.image) return null;

                    return (
                        <div key={pagePath} className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
                            <h3 className="font-bold text-slate-100">{pageInfo.title} <span className="text-xs text-slate-500 font-mono">{pagePath}</span></h3>
                            <div className="mt-4 flex items-center gap-4">
                                <ImageIcon className="h-5 w-5 text-slate-500" />
                                <input
                                    type="text"
                                    value={settings.images[pagePath] || ''}
                                    onChange={(e) => handleImageChange(pagePath, e.target.value)}
                                    placeholder="Enter Hero Image URL to override..."
                                    className="flex-1 bg-slate-900 border border-slate-600 rounded-md p-2 text-sm text-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-gold"
                                />
                            </div>
                             <div className="mt-2 text-right">
                                <span className="text-[10px] text-slate-500 font-mono">Default: <code className="text-xs">{pageInfo.image.substring(0, 40)}...</code></span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default AdminBranding;
