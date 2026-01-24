import React, { InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({ label, icon, className, ...props }) => {
    return (
        <div className={`relative group mb-6 ${className}`}>
            {icon && (
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-brand-gold">
                    {icon}
                </div>
            )}
            <input 
                {...props}
                className={`w-full bg-brand-900 border border-brand-700 rounded-lg px-4 py-4 pt-5 pb-3 text-white placeholder-transparent focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-transparent transition-all duration-300 peer ${icon ? 'pl-12' : ''}`}
                placeholder={label} 
            />
            <label className={`absolute left-4 ${icon ? 'left-12' : ''} top-1 text-xs font-bold text-brand-gold tracking-widest uppercase transition-all duration-300 transform -translate-y-0 peer-placeholder-shown:translate-y-3 peer-placeholder-shown:text-slate-400 peer-placeholder-shown:text-base peer-placeholder-shown:normal-case peer-placeholder-shown:font-normal peer-focus:translate-y-0 peer-focus:text-xs peer-focus:text-brand-gold peer-focus:uppercase peer-focus:font-bold`}>
                {label}
            </label>
        </div>
    );
};

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    label: string;
}

export const TextArea: React.FC<TextAreaProps> = ({ label, className, ...props }) => {
    return (
        <div className={`relative group mb-6 ${className}`}>
            <textarea 
                {...props}
                className="w-full bg-brand-900 border border-brand-700 rounded-lg px-4 py-4 pt-6 text-white placeholder-transparent focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-transparent transition-all duration-300 peer min-h-[120px] resize-none"
                placeholder={label}
            />
            <label className="absolute left-4 top-2 text-xs font-bold text-brand-gold tracking-widest uppercase transition-all duration-300 transform peer-placeholder-shown:translate-y-3 peer-placeholder-shown:text-slate-400 peer-placeholder-shown:text-base peer-placeholder-shown:normal-case peer-placeholder-shown:font-normal peer-focus:translate-y-0 peer-focus:text-xs peer-focus:text-brand-gold peer-focus:uppercase peer-focus:font-bold">
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
        <div className={`relative group mb-6 ${className}`}>
             <label className="absolute -top-2 left-3 bg-brand-800 px-1 text-xs font-bold text-brand-gold tracking-widest uppercase z-10">
                {label}
            </label>
            <select 
                {...props}
                className="w-full bg-brand-900 border border-brand-700 rounded-lg px-4 py-4 text-white focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-transparent transition-all duration-300 appearance-none"
            >
                <option value="" disabled>Select an option</option>
                {options.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
            </select>
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none text-brand-gold">
                <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
        </div>
    );
};