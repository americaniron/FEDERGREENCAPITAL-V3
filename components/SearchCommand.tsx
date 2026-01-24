import React, { useState, useEffect, useRef } from 'react';
import { Search, Calculator, FileText, ArrowRight, X } from 'lucide-react';
import { NAVIGATION } from '../constants';
import { CALCULATORS } from '../constants/toolDefinitions';

interface SearchCommandProps {
    isOpen: boolean;
    onClose: () => void;
    onNavigate: (path: string) => void;
}

const SearchCommand: React.FC<SearchCommandProps> = ({ isOpen, onClose, onNavigate }) => {
    const [query, setQuery] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen]);

    // Flatten Navigation for Indexing
    const getNavItems = (items: any[], prefix = '') => {
        let results: any[] = [];
        items.forEach(item => {
            results.push({ ...item, type: 'Page' });
            if (item.subItems) {
                results = [...results, ...getNavItems(item.subItems)];
            }
        });
        return results;
    };

    const allPages = getNavItems(NAVIGATION);
    
    // Index Calculators
    const allTools = CALCULATORS.map(calc => ({
        label: calc.name,
        path: '/portal', // Directs to portal, ideally specific tool deep link
        description: calc.description,
        type: 'Tool'
    }));

    const filtered = [...allPages, ...allTools].filter(item => 
        item.label.toLowerCase().includes(query.toLowerCase()) || 
        (item.description && item.description.toLowerCase().includes(query.toLowerCase()))
    ).slice(0, 8);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-24 px-4">
            <div className="absolute inset-0 bg-brand-950/80 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
            
            <div className="relative w-full max-w-2xl bg-white dark:bg-brand-900 rounded-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-brand-700 animate-fade-in transform transition-all">
                <div className="flex items-center px-4 py-4 border-b border-slate-200 dark:border-brand-800">
                    <Search className="text-slate-400 w-6 h-6 mr-3" />
                    <input 
                        ref={inputRef}
                        type="text"
                        placeholder="Search pages, tools, or insights..."
                        className="flex-1 bg-transparent text-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Escape') onClose();
                        }}
                    />
                    <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white">
                        <X size={20} />
                    </button>
                </div>

                <div className="max-h-[60vh] overflow-y-auto p-2">
                    {filtered.length > 0 ? (
                        <div className="space-y-1">
                            {filtered.map((item, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => {
                                        onNavigate(item.path);
                                        onClose();
                                    }}
                                    className="w-full flex items-center p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-brand-800 transition-colors group text-left"
                                >
                                    <div className={`p-2 rounded-lg mr-4 ${item.type === 'Tool' ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'}`}>
                                        {item.type === 'Tool' ? <Calculator size={18} /> : <FileText size={18} />}
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-slate-900 dark:text-white group-hover:text-brand-gold transition-colors">{item.label}</h4>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-md">{item.description || item.path}</p>
                                    </div>
                                    <ArrowRight size={16} className="opacity-0 group-hover:opacity-100 text-brand-gold transition-opacity" />
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="p-8 text-center text-slate-500">
                            No results found for "{query}"
                        </div>
                    )}
                </div>
                
                <div className="bg-slate-50 dark:bg-brand-950 px-4 py-2 text-xs text-slate-400 flex justify-between items-center border-t border-slate-200 dark:border-brand-800">
                    <span><strong>Pro Tip:</strong> Search for "ROI" to find calculators.</span>
                    <span>ESC to close</span>
                </div>
            </div>
        </div>
    );
};

export default SearchCommand;