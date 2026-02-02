
import React, { useState, useEffect } from 'react';
import { Save, Eye, Image as ImageIcon, Palette, Type, Link as LinkIcon, CheckCircle, Cpu } from 'lucide-react';
import { settingsService } from '../../services/settingsService';
import { SiteSettings } from '../../config/settingsModel';
import AdminTheme from './settings/AdminTheme';
import AdminTypography from './settings/AdminTypography';
import AdminNavigation from './settings/AdminNavigation';
import AdminBranding from './settings/AdminBranding';
import AdminEntitlements from './settings/AdminEntitlements';
import { hasPermission } from '../../lib/rbac';
import { adminAuthService } from '../../services/adminAuthService';


const AdminSettings: React.FC = () => {
    const [draftSettings, setDraftSettings] = useState<SiteSettings>(() => settingsService.getDraftSettings());
    const [isSaving, setIsSaving] = useState(false);
    const [isPublishing, setIsPublishing] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [activeTab, setActiveTab] = useState('theme');

    const currentUser = adminAuthService.getCurrentUser();

    useEffect(() => {
        const handler = setTimeout(() => {
            settingsService.saveDraftSettings(draftSettings);
            setIsSaving(false);
        }, 1000);

        setIsSaving(true);
        return () => clearTimeout(handler);
    }, [draftSettings]);

    const handlePublish = () => {
        setIsPublishing(true);
        settingsService.publishSettings();
        setTimeout(() => {
            setIsPublishing(false);
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 2000);
        }, 1000);
    };

    const tabs = [
        { id: 'theme', label: 'Theme & Colors', icon: Palette, permission: 'settings:manage' },
        { id: 'typography', label: 'Typography', icon: Type, permission: 'settings:manage' },
        { id: 'navigation', label: 'Navigation', icon: LinkIcon, permission: 'settings:manage' },
        { id: 'branding', label: 'Branding & Images', icon: ImageIcon, permission: 'settings:manage' },
        { id: 'entitlements', label: 'AI Entitlements', icon: Cpu, permission: 'entitlements:manage' },
    ].filter(tab => currentUser && hasPermission(currentUser.role, tab.permission as any));
    
    const renderTabContent = () => {
        switch (activeTab) {
            case 'typography':
                return <AdminTypography settings={draftSettings} onUpdate={setDraftSettings} />;
            case 'navigation':
                return <AdminNavigation settings={draftSettings} onUpdate={setDraftSettings} />;
            case 'branding':
                return <AdminBranding settings={draftSettings} onUpdate={setDraftSettings} />;
            case 'entitlements':
                return <AdminEntitlements />;
            case 'theme':
            default:
                return <AdminTheme settings={draftSettings} onUpdate={setDraftSettings} />;
        }
    };

    return (
        <div>
            <header className="flex justify-between items-center mb-8 pb-8 border-b border-slate-700/50">
                <div>
                    <h1 className="text-3xl font-black text-slate-100 tracking-tight uppercase">Site Configuration</h1>
                    <p className="mt-2 text-sm text-slate-400">Manage global theme, navigation, and content parameters.</p>
                </div>
                <div className="flex items-center gap-4">
                     <span className={`text-xs font-semibold uppercase transition-opacity ${isSaving ? 'opacity-100' : 'opacity-0'}`}>
                        Saving Draft...
                     </span>
                     <button 
                        onClick={() => window.location.hash = '/'}
                        className="px-6 py-3 bg-slate-700 text-slate-200 font-bold rounded-lg flex items-center gap-2 hover:bg-slate-600"
                    >
                        <Eye size={16} /> Preview Site
                    </button>
                    <button 
                        onClick={handlePublish}
                        disabled={isPublishing}
                        className={`px-6 py-3 font-bold rounded-lg flex items-center gap-2 disabled:opacity-50 transition-colors ${
                            showSuccess ? 'bg-emerald-500 text-white' : 'bg-brand-gold text-brand-950'
                        }`}
                    >
                        {showSuccess ? <CheckCircle size={16} /> : <Save size={16} />} 
                        {isPublishing ? 'Publishing...' : showSuccess ? 'Published!' : 'Publish Live'}
                    </button>
                </div>
            </header>

            <div className="flex border-b border-slate-700/50 mb-8">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-6 py-4 text-sm font-semibold border-b-2 transition-all ${
                            activeTab === tab.id
                                ? 'border-brand-gold text-brand-gold'
                                : 'border-transparent text-slate-400 hover:text-slate-100'
                        }`}
                    >
                        <tab.icon size={16} />
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="animate-fade-in">
                {renderTabContent()}
            </div>
        </div>
    );
};

export default AdminSettings;
