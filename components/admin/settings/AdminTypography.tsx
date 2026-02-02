
import React from 'react';
import { SiteSettings } from '../../../config/settingsModel';

interface AdminTypographyProps {
    settings: SiteSettings;
    onUpdate: (settings: SiteSettings) => void;
}

const AdminTypography: React.FC<AdminTypographyProps> = ({ settings, onUpdate }) => {
    
    const handleFontChange = (key: 'sans' | 'heading' | 'mono', value: string) => {
        onUpdate({
            ...settings,
            typography: {
                ...settings.typography,
                fontFamily: {
                    ...settings.typography.fontFamily,
                    [key]: value,
                }
            }
        });
    };

    return (
        <div className="p-4 max-w-2xl">
            <h2 className="text-xl font-bold text-slate-100 mb-6">Global Font Families</h2>
            <div className="space-y-6">
                {/* FIX: Replaced Object.keys with a typed array to ensure type safety for the 'key' variable. */}
                {(['sans', 'heading', 'mono'] as const).map(key => (
                     <div key={key} className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                        <label className="block text-xs font-semibold text-slate-400 mb-2 capitalize">
                            {key} Font
                        </label>
                        <input
                            type="text"
                            value={settings.typography.fontFamily[key]}
                            onChange={(e) => handleFontChange(key, e.target.value)}
                            placeholder="e.g., 'Inter', sans-serif"
                            className="w-full bg-slate-900 border border-slate-600 rounded-md p-2 text-sm text-slate-300"
                        />
                        <p className="text-xs text-slate-500 mt-2">
                            Preview: <span style={{ fontFamily: settings.typography.fontFamily[key] }}>The quick brown fox jumps over the lazy dog.</span>
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminTypography;