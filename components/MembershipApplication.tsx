
import React, { useState } from 'react';
import { MEMBERSHIP_TIERS } from '../constants';
import { Input, Select, TextArea } from './ui/FormElements';
import { Check, ArrowRight, User, Briefcase, Target, CreditCard, Award } from 'lucide-react';

const MembershipApplication: React.FC = () => {
    const [step, setStep] = useState(1);
    const [selectedTier, setSelectedTier] = useState<string | null>(null);
    const [isYearly, setIsYearly] = useState(true);

    const nextStep = () => setStep(prev => prev + 1);
    const prevStep = () => setStep(prev => prev - 1);

    return (
        <div className="space-y-12">
            
            {/* Pricing Section (Transparency) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {MEMBERSHIP_TIERS.map((tier) => (
                    <div 
                        key={tier.name} 
                        onClick={() => setSelectedTier(tier.name)}
                        className={`relative p-8 rounded-xl border-2 transition-all duration-300 cursor-pointer group ${
                            selectedTier === tier.name 
                                ? 'bg-brand-800 border-brand-gold shadow-2xl scale-105 z-10' 
                                : 'bg-brand-900/50 border-brand-800 hover:border-brand-600'
                        }`}
                    >
                        {tier.highlight && (
                            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-brand-gold text-brand-900 text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wider">
                                Most Popular
                            </div>
                        )}
                        <h3 className="text-xl font-heading font-bold text-brand-gold mb-2">{tier.name}</h3>
                        <div className="mb-6">
                            <span className="text-3xl font-bold text-brand-gold">{tier.price}</span>
                            <span className="text-slate-500 text-sm"> / {tier.period}</span>
                        </div>
                        <div className="mb-6 p-3 bg-brand-950 rounded text-center">
                            <span className="text-brand-gold_light text-sm font-bold block mb-1">Limited Offer</span>
                            <span className="text-white text-sm">3 Months Complimentary</span>
                            <div className="text-xs text-slate-500 mt-1">Then standard billing</div>
                        </div>
                        <ul className="space-y-3 mb-8">
                            {tier.features.map((feat, i) => (
                                <li key={i} className="flex items-start gap-3 text-sm text-slate-300">
                                    <Check size={16} className="text-brand-gold shrink-0 mt-0.5" />
                                    <span>{feat}</span>
                                </li>
                            ))}
                        </ul>
                        <div className="border-t border-brand-800 pt-4 text-xs text-slate-500 text-center">
                            Initiation: {tier.initiation}
                        </div>
                    </div>
                ))}
            </div>

            {/* Application Form Wizard */}
            <div className="bg-brand-900 border border-brand-700 rounded-2xl overflow-hidden shadow-2xl">
                {/* Progress Bar */}
                <div className="bg-brand-950 p-6 border-b border-brand-800">
                    <div className="flex justify-between items-center max-w-2xl mx-auto">
                        <div className={`flex flex-col items-center ${step >= 1 ? 'text-brand-gold' : 'text-slate-600'}`}>
                            <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center mb-2 ${step >= 1 ? 'border-brand-gold bg-brand-gold/10' : 'border-slate-700'}`}>
                                <User size={20} />
                            </div>
                            <span className="text-xs uppercase tracking-wider font-bold">Contact</span>
                        </div>
                        <div className={`flex-1 h-0.5 mx-4 ${step >= 2 ? 'bg-brand-gold' : 'bg-brand-800'}`}></div>
                        <div className={`flex flex-col items-center ${step >= 2 ? 'text-brand-gold' : 'text-slate-600'}`}>
                            <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center mb-2 ${step >= 2 ? 'border-brand-gold bg-brand-gold/10' : 'border-slate-700'}`}>
                                <Briefcase size={20} />
                            </div>
                            <span className="text-xs uppercase tracking-wider font-bold">Company</span>
                        </div>
                        <div className={`flex-1 h-0.5 mx-4 ${step >= 3 ? 'bg-brand-gold' : 'bg-brand-800'}`}></div>
                        <div className={`flex flex-col items-center ${step >= 3 ? 'text-brand-gold' : 'text-slate-600'}`}>
                            <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center mb-2 ${step >= 3 ? 'border-brand-gold bg-brand-gold/10' : 'border-slate-700'}`}>
                                <Target size={20} />
                            </div>
                            <span className="text-xs uppercase tracking-wider font-bold">Goals</span>
                        </div>
                    </div>
                </div>

                <div className="p-8 md:p-12">
                    {step === 1 && (
                        <div className="animate-fade-in max-w-2xl mx-auto">
                            <h3 className="text-2xl font-bold text-white mb-6">Personal Details</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input label="First Name" />
                                <Input label="Last Name" />
                            </div>
                            <Input label="Direct Email" type="email" />
                            <Input label="Phone Number" type="tel" />
                            <div className="flex justify-end mt-8">
                                <button onClick={nextStep} className="bg-brand-gold text-brand-900 font-bold py-3 px-8 rounded flex items-center gap-2 hover:bg-white transition-colors">
                                    Next Step <ArrowRight size={18} />
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="animate-fade-in max-w-2xl mx-auto">
                            <h3 className="text-2xl font-bold text-white mb-6">Business Profile</h3>
                            <Input label="Company Name" />
                            <Input label="Role / Title" />
                            <Select 
                                label="Annual Revenue" 
                                options={[
                                    {label: '< $1M', value: 'tier1'},
                                    {label: '$1M - $10M', value: 'tier2'},
                                    {label: '$10M - $50M', value: 'tier3'},
                                    {label: '> $50M', value: 'tier4'},
                                ]} 
                            />
                            <Input label="Corporate Website" />
                            <div className="flex justify-between mt-8">
                                <button onClick={prevStep} className="text-slate-400 hover:text-white px-6">Back</button>
                                <button onClick={nextStep} className="bg-brand-gold text-brand-900 font-bold py-3 px-8 rounded flex items-center gap-2 hover:bg-white transition-colors">
                                    Next Step <ArrowRight size={18} />
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="animate-fade-in max-w-2xl mx-auto">
                            <h3 className="text-2xl font-bold text-white mb-6">Investment Goals</h3>
                            <TextArea label="Primary Investment Objectives" />
                            <Select 
                                label="Interested Sectors" 
                                options={[
                                    {label: 'Real Estate', value: 're'},
                                    {label: 'Technology', value: 'tech'},
                                    {label: 'Energy', value: 'energy'},
                                    {label: 'Multiple', value: 'multi'},
                                ]} 
                            />
                            <div className="bg-brand-800/50 p-6 rounded-lg border border-brand-700 mb-8">
                                <h4 className="text-brand-gold font-bold mb-2 text-sm uppercase">Selected Membership</h4>
                                <div className="flex justify-between items-center text-white">
                                    <span className="text-lg">{selectedTier || 'Please select a tier above'}</span>
                                    {selectedTier && <Award className="text-brand-gold" />}
                                </div>
                                {!selectedTier && <p className="text-red-400 text-xs mt-1">Required*</p>}
                            </div>

                            <div className="flex justify-between mt-8">
                                <button onClick={prevStep} className="text-slate-400 hover:text-white px-6">Back</button>
                                <button 
                                    disabled={!selectedTier}
                                    className="bg-brand-gold disabled:bg-slate-700 disabled:text-slate-500 text-brand-900 font-bold py-3 px-8 rounded flex items-center gap-2 hover:bg-white transition-colors"
                                >
                                    Submit Application <CreditCard size={18} />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MembershipApplication;
