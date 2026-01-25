
import React, { useState } from 'react';
import { TOOL_REGISTRY } from '../../lib/tool-registry';
import { ENTERPRISE_SECTIONS } from '../../constants';
import { ChevronRight, ChevronDown, Terminal as TerminalIcon, Search } from 'lucide-react';

interface DataToolsSidebarProps {
    currentPath: string;
    onNavigate: (path: string) => void;
}

const DataToolsSidebar: React.FC<DataToolsSidebarProps> = ({ currentPath, onNavigate }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedCategories, setExpandedCategories] = useState<string[]>(() => {
        // Expand the category that contains the current tool by default
        const pathParts = currentPath.split('/');
        return pathParts[2] ? [pathParts[2]] : [ENTERPRISE_SECTIONS[0].id];
    });

    const toggleCategory = (id: string) => {
        setExpandedCategories(prev => 
            prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
        );
    };

    const filteredSections = ENTERPRISE_SECTIONS.filter(section => {
        const toolsInSection = TOOL_REGISTRY.filter(t => t.category === section.id);
        const matchesSearch = toolsInSection.some(t => t.name.toLowerCase().includes(searchQuery.toLowerCase())) || 
                             section.label.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesSearch;
    });

    return (
        <aside className="w-full lg:w-80 flex-shrink-0 space-y-8 no-print">
            {/* Search / Filter Node */}
            <div className="relative group">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-brand-gold/40 group-focus-within:text-brand-gold transition-colors">
                    <Search size={16} />
                </div>
                <input 
                    type="text"
                    placeholder="Search Tools..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-brand-950/50 border border-brand-gold/10 rounded-2xl py-4 pl-12 pr-4 text-[10px] font-mono font-bold uppercase tracking-widest text-white placeholder:text-white/20 focus:outline-none focus:border-brand-gold/40 transition-all shadow-inner"
                />
            </div>

            {/* Navigation Registry */}
            <div className="bg-brand-950/40 border border-brand-gold/10 rounded-[2.5rem] overflow-hidden shadow-2xl backdrop-blur-md">
                <div className="p-6 border-b border-brand-gold/5 bg-brand-gold/5 flex items-center gap-3">
                    <TerminalIcon size={14} className="text-brand-gold" />
                    <span className="text-[10px] font-mono font-bold text-brand-gold uppercase tracking-[0.3em]">Tool Registry</span>
                </div>
                
                <div className="p-2 space-y-1 max-h-[calc(100vh-350px)] overflow-y-auto custom-scrollbar">
                    {filteredSections.map((section) => {
                        const isExpanded = expandedCategories.includes(section.id) || searchQuery.length > 0;
                        const tools = TOOL_REGISTRY.filter(t => t.category === section.id);
                        const Icon = section.icon;

                        return (
                            <div key={section.id} className="space-y-1">
                                <button 
                                    onClick={() => toggleCategory(section.id)}
                                    className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all group ${
                                        isExpanded ? 'bg-brand-gold/5' : 'hover:bg-white/5'
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-lg transition-colors ${isExpanded ? 'bg-brand-gold/20 text-brand-gold' : 'bg-white/5 text-white/40 group-hover:text-white'}`}>
                                            <Icon size={14} />
                                        </div>
                                        <span className={`text-[10px] font-extrabold uppercase tracking-widest transition-colors ${isExpanded ? 'text-white' : 'text-white/40 group-hover:text-white'}`}>
                                            {section.label}
                                        </span>
                                    </div>
                                    <ChevronDown size={14} className={`text-brand-gold/40 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                                </button>

                                {isExpanded && (
                                    <div className="space-y-1 pl-4 pr-2 pb-2 animate-fade-in">
                                        {tools
                                            .filter(t => t.name.toLowerCase().includes(searchQuery.toLowerCase()))
                                            .map((tool) => {
                                                const toolSlug = `/data-tools/${section.id}/${tool.id}`;
                                                const isActive = currentPath === toolSlug;
                                                
                                                return (
                                                    <button
                                                        key={tool.id}
                                                        onClick={() => onNavigate(toolSlug)}
                                                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all text-left group/tool ${
                                                            isActive 
                                                                ? 'bg-brand-gold text-brand-950 font-bold shadow-lg shadow-brand-gold/20' 
                                                                : 'text-white/30 hover:text-brand-gold hover:bg-brand-gold/5'
                                                        }`}
                                                    >
                                                        <span className="text-[10px] uppercase tracking-widest leading-none">
                                                            {tool.name}
                                                        </span>
                                                        <ChevronRight size={12} className={`transition-transform duration-300 ${isActive ? 'translate-x-0' : '-translate-x-2 opacity-0 group-hover/tool:translate-x-0 group-hover/tool:opacity-100'}`} />
                                                    </button>
                                                );
                                            })}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                <div className="p-6 bg-brand-gold/5 border-t border-brand-gold/5">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-brand-terminal animate-pulse"></div>
                        <span className="text-[9px] font-mono font-bold text-brand-terminal uppercase tracking-[0.2em]">Registry Synchronized</span>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default DataToolsSidebar;
