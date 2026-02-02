
import React, { useState } from 'react';
import { Eye, Save, X, CheckCircle } from 'lucide-react';
import { settingsService } from '../../services/settingsService';

interface AdminPreviewBarProps {
    onPublish: () => void;
}

const AdminPreviewBar: React.FC<AdminPreviewBarProps> = ({ onPublish }) => {
    const [isPublishing, setIsPublishing] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const handlePublish = () => {
        setIsPublishing(true);
        settingsService.publishSettings();
        setTimeout(() => {
            setIsPublishing(false);
            setShowSuccess(true);
            onPublish(); // Notify App to reload settings state
            setTimeout(() => setShowSuccess(false), 2000);
        }, 1000);
    };

    const handleExit = () => {
        window.location.hash = '/admin/settings';
    };

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-slate-900/80 backdrop-blur-md border-t-2 border-brand-gold z-[200] flex items-center justify-between px-8 py-4 shadow-[0_-20px_50px_rgba(0,0,0,0.5)] animate-fade-up">
            <div className="flex items-center gap-4">
                <Eye className="text-brand-gold animate-pulse" />
                <div className="text-white font-bold">
                    Preview Mode Active
                    <p className="text-xs text-slate-400 font-normal">You are viewing draft settings.</p>
                </div>
            </div>
            <div className="flex items-center gap-4">
                <button
                    onClick={handlePublish}
                    disabled={isPublishing}
                    className={`px-6 py-3 font-bold rounded-lg flex items-center gap-2 disabled:opacity-50 transition-colors ${
                        showSuccess ? 'bg-emerald-500 text-white' : 'bg-brand-gold text-brand-950'
                    }`}
                >
                    {showSuccess ? <CheckCircle size={16} /> : <Save size={16} />}
                    {isPublishing ? 'Publishing...' : showSuccess ? 'Published!' : 'Publish Changes'}
                </button>
                <button
                    onClick={handleExit}
                    className="p-3 bg-slate-700/50 text-slate-300 rounded-lg hover:bg-slate-600"
                    title="Exit Preview"
                >
                    <X size={20} />
                </button>
            </div>
        </div>
    );
};

export default AdminPreviewBar;
