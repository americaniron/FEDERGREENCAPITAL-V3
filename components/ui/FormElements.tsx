
import React, { InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({ label, icon, className, ...props }) => {
    return (
        <div className={`relative group mb-8 ${className}`}>
            <input 
                {...props}
                placeholder=" " // Required for peer-placeholder-shown to work correctly with floating labels
                className={`w-full bg-brand-900 border-2 border-brand-700/50 rounded-2xl px-4 py-4 text-white placeholder-transparent focus:outline-none focus:ring-0 focus:border-brand-gold transition-all duration-300 peer ${icon ? 'pl-12' : ''}`}
            />
            <label className={`absolute left-4 ${icon ? 'left-12' : ''} top-4 text-base text-slate-400 transition-all duration-300 transform origin-[0] pointer-events-none
                peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0
                peer-focus:scale-75 peer-focus:-translate-y-7 peer-focus:text-brand-gold peer-focus:px-2 peer-focus:bg-brand-900
                peer-[:not(:placeholder-shown)]:scale-75 peer-[:not(:placeholder-shown)]:-translate-y-7 peer-[:not(:placeholder-shown)]:text-brand-gold peer-[:not(:placeholder-shown)]:px-2 peer-[:not(:placeholder-shown)]:bg-brand-900`}>
                {label}
            </label>
            {icon && (
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 peer-focus:text-brand-gold transition-colors duration-300">
                    {icon}
                </div>
            )}
        </div>
    );
};

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    label: string;
}

export const TextArea: React.FC<TextAreaProps> = ({ label, className, ...props }) => {
    return (
        <div className={`relative group mb-8 ${className}`}>
            <textarea 
                {...props}
                placeholder=" " // Required for floating labels
                className="w-full bg-brand-900 border-2 border-brand-700/50 rounded-2xl px-4 py-4 text-white placeholder-transparent focus:outline-none focus:ring-0 focus:border-brand-gold transition-all duration-300 peer min-h-[140px] resize-none"
            />
            <label className={`absolute left-4 top-5 text-base text-slate-400 transition-all duration-300 transform origin-[0] pointer-events-none
                peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0
                peer-focus:scale-75 peer-focus:-translate-y-8 peer-focus:text-brand-gold peer-focus:px-2 peer-focus:bg-brand-900
                peer-[:not(:placeholder-shown)]:scale-75 peer-[:not(:placeholder-shown)]:-translate-y-8 peer-[:not(:placeholder-shown)]:text-brand-gold peer-[:not(:placeholder-shown)]:px-2 peer-[:not(:placeholder-shown)]:bg-brand-900`}>
                {label}
            </label>
        </div>
    );
};

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    label: string;
    options: { value: string; label: string }[];
}

export const Select: React.FC<SelectProps> = ({ label, options, className, ...props }) => {
    return (
        <div className={`relative group mb-8 ${className}`}>
            <label className="absolute left-3 top-0 -translate-y-1/2 bg-brand-900 px-2 text-xs font-bold text-brand-gold tracking-widest uppercase z-10">
                {label}
            </label>
            <select 
                {...props}
                className="w-full bg-brand-900 border-2 border-brand-700/50 rounded-2xl px-4 py-4 text-white focus:outline-none focus:ring-0 focus:border-brand-gold transition-all duration-300 appearance-none"
            >
                {!props.value && <option value="" disabled>Select...</option>}
                {options.map(opt => (
                    <option key={opt.value} value={opt.value} className="bg-brand-950 text-white">{opt.label}</option>
                ))}
            </select>
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none text-brand-gold">
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
        </div>
    );
};
