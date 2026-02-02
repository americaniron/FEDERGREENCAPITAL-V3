
import React from 'react';
import { SiteSettings } from '../../../config/settingsModel';

interface AdminThemeProps {
    settings: SiteSettings;
    onUpdate: (settings: SiteSettings) => void;
}

const AdminTheme: React.FC<AdminThemeProps> = ({ settings, onUpdate }) => {
    
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
        <div className="p-4">
            <h2 className="text-xl font-bold text-slate-100 mb-6">Brand Color Palette</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {Object.entries(settings.theme.colors.brand).map(([key, value]) => (
                    <div key={key} className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                        <label className="block text-xs font-semibold text-slate-400 mb-2 capitalize">{key.replace('_', ' ')}</label>
                        <div className="flex items-center gap-2">
                            <input 
                                type="color"
                                value={value}
                                onChange={(e) => handleColorChange(key, e.target.value)}
                                className="w-10 h-10 p-0 border-none rounded cursor-pointer bg-transparent"
                            />
                            <input
                                type="text"
                                value={value}
                                onChange={(e) => handleColorChange(key, e.target.value)}
                                className="flex-1 bg-slate-900 border border-slate-600 rounded-md p-2 text-sm text-slate-300 font-mono"
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminTheme;
