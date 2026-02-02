
import React from 'react';
import { SiteSettings } from '../../../config/settingsModel';
import { NavItem } from '../../../types';
import { FooterLink, FooterLinkGroup } from '../../../config/settingsModel';
import { Plus, Trash2 } from 'lucide-react';

interface AdminNavigationProps {
    settings: SiteSettings;
    onUpdate: (settings: SiteSettings) => void;
}

const NavItemEditor: React.FC<{
    item: NavItem;
    path: number[];
    onUpdate: (path: number[], updatedItem: NavItem) => void;
    onAdd: (path: number[]) => void;
    onDelete: (path: number[]) => void;
}> = ({ item, path, onUpdate, onAdd, onDelete }) => {
    
    return (
        <div className="pl-6 border-l border-slate-700 space-y-4">
            <div className="bg-slate-800 p-4 rounded-lg flex items-center gap-4">
                <input
                    type="text"
                    value={item.label}
                    onChange={e => onUpdate(path, { ...item, label: e.target.value })}
                    placeholder="Label"
                    className="flex-1 bg-slate-900 border border-slate-600 rounded-md p-2 text-sm"
                />
                <input
                    type="text"
                    value={item.path}
                    onChange={e => onUpdate(path, { ...item, path: e.target.value })}
                    placeholder="Path (e.g., /about-us)"
                    className="flex-1 bg-slate-900 border border-slate-600 rounded-md p-2 text-sm"
                />
                <button onClick={() => onAdd(path)} className="p-2 text-slate-400 hover:text-emerald-400"><Plus size={16} /></button>
                <button onClick={() => onDelete(path)} className="p-2 text-slate-400 hover:text-red-400"><Trash2 size={16} /></button>
            </div>
            {item.subItems && item.subItems.map((sub, i) => (
                <NavItemEditor 
                    key={i}
                    item={sub} 
                    path={[...path, i]}
                    onUpdate={onUpdate}
                    onAdd={onAdd}
                    onDelete={onDelete}
                />
            ))}
        </div>
    );
};

const AdminNavigation: React.FC<AdminNavigationProps> = ({ settings, onUpdate }) => {
    
    const updateNested = (items: NavItem[], path: number[], value: NavItem | null): NavItem[] => {
        if (path.length === 0) return items;
        const [head, ...tail] = path;
        
        if (tail.length === 0) { // Target level
            if (value === null) { // Delete
                return items.filter((_, i) => i !== head);
            }
            return items.map((item, i) => i === head ? value : item);
        }

        return items.map((item, i) => {
            if (i === head) {
                return { ...item, subItems: updateNested(item.subItems || [], tail, value) };
            }
            return item;
        });
    };

    const addNested = (items: NavItem[], path: number[]): NavItem[] => {
        const newItem: NavItem = { label: 'New Link', path: '/' };
        if (path.length === 0) return [...items, newItem];
        
        const [head, ...tail] = path;
        return items.map((item, i) => {
            if (i === head) {
                if (tail.length === 0) {
                     return { ...item, subItems: [...(item.subItems || []), newItem] };
                }
                return { ...item, subItems: addNested(item.subItems || [], tail) };
            }
            return item;
        });
    };

    const handleUpdateNav = (path: number[], updatedItem: NavItem) => {
        const newNav = updateNested(settings.navigation, path, updatedItem);
        onUpdate({ ...settings, navigation: newNav });
    };

    const handleAddNav = (path: number[]) => {
        const newNav = addNested(settings.navigation, path);
        onUpdate({ ...settings, navigation: newNav });
    };
    
    const handleDeleteNav = (path: number[]) => {
        const newNav = updateNested(settings.navigation, path, null);
        onUpdate({ ...settings, navigation: newNav });
    };

    return (
        <div className="p-4 space-y-8">
            <div>
                <h2 className="text-xl font-bold text-slate-100 mb-4">Main Navigation</h2>
                <div className="space-y-4">
                     {settings.navigation.map((item, i) => (
                        <NavItemEditor 
                            key={i} 
                            item={item} 
                            path={[i]} 
                            onUpdate={handleUpdateNav}
                            onAdd={handleAddNav}
                            onDelete={handleDeleteNav}
                        />
                    ))}
                    <button onClick={() => handleAddNav([])} className="flex items-center gap-2 text-sm text-emerald-400 font-semibold mt-4">
                        <Plus size={16} /> Add Root Item
                    </button>
                </div>
            </div>
            
            <div>
                <h2 className="text-xl font-bold text-slate-100 mb-4">Footer Links</h2>
                {/* Simplified editor for footer for brevity */}
            </div>
        </div>
    );
};

export default AdminNavigation;
