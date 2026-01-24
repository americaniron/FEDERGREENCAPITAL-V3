import React, { useState } from 'react';
import { Input, TextArea, Select } from './ui/FormElements';
import { Calendar, Clock, Mail, MapPin, Phone } from 'lucide-react';

const ContactCenter: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'message' | 'meeting'>('message');

    return (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            
            {/* Contact Info Side */}
            <div className="lg:col-span-2 space-y-8">
                <div>
                    <h3 className="text-2xl font-bold text-white mb-4">Get in Touch</h3>
                    <p className="text-slate-400 leading-relaxed">
                        Our team of experts is ready to discuss your capital requirements and strategic goals. 
                        Reach out for a confidential consultation.
                    </p>
                </div>
                
                <div className="space-y-6">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-lg bg-brand-800 flex items-center justify-center text-brand-gold shrink-0">
                            <MapPin size={24} />
                        </div>
                        <div>
                            <h4 className="text-white font-bold">Global Headquarters</h4>
                            <p className="text-slate-400 text-sm">
                                100 Financial District Blvd, Suite 4500<br/>
                                New York, NY 10005, USA
                            </p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-brand-800 flex items-center justify-center text-brand-gold shrink-0">
                            <Mail size={24} />
                        </div>
                        <div>
                            <h4 className="text-white font-bold">Email Us</h4>
                            <p className="text-slate-400 text-sm">concierge@federgreencapital.com</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-brand-800 flex items-center justify-center text-brand-gold shrink-0">
                            <Phone size={24} />
                        </div>
                        <div>
                            <h4 className="text-white font-bold">Call Us</h4>
                            <p className="text-slate-400 text-sm">+1 (212) 555-0199</p>
                        </div>
                    </div>
                </div>

                <div className="bg-brand-900 p-6 rounded-xl border border-brand-800">
                    <h5 className="text-brand-gold font-bold mb-2">Office Hours</h5>
                    <p className="text-slate-400 text-sm">Monday - Friday: 08:00 AM - 08:00 PM EST</p>
                    <p className="text-slate-400 text-sm">Weekend: By Appointment Only</p>
                </div>
            </div>

            {/* Forms Side */}
            <div className="lg:col-span-3">
                <div className="bg-brand-900 border border-brand-700 rounded-2xl overflow-hidden shadow-2xl">
                    {/* Tabs */}
                    <div className="flex border-b border-brand-800">
                        <button 
                            onClick={() => setActiveTab('message')}
                            className={`flex-1 py-6 text-center font-bold uppercase tracking-wider text-sm transition-colors ${activeTab === 'message' ? 'bg-brand-800 text-brand-gold' : 'text-slate-500 hover:text-slate-300'}`}
                        >
                            General Inquiry
                        </button>
                        <button 
                            onClick={() => setActiveTab('meeting')}
                            className={`flex-1 py-6 text-center font-bold uppercase tracking-wider text-sm transition-colors ${activeTab === 'meeting' ? 'bg-brand-800 text-brand-gold' : 'text-slate-500 hover:text-slate-300'}`}
                        >
                            Schedule Meeting
                        </button>
                    </div>

                    <div className="p-8">
                        {activeTab === 'message' ? (
                            <form className="animate-fade-in">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Input label="First Name" />
                                    <Input label="Last Name" />
                                </div>
                                <Input label="Email Address" type="email" />
                                <Select 
                                    label="Topic" 
                                    options={[
                                        {label: 'Investment Opportunities', value: 'invest'},
                                        {label: 'Partnership Proposal', value: 'partner'},
                                        {label: 'Media Inquiry', value: 'media'},
                                        {label: 'Other', value: 'other'},
                                    ]} 
                                />
                                <TextArea label="Your Message" rows={4} />
                                <button className="w-full bg-brand-gold text-brand-900 font-bold py-4 rounded-lg hover:bg-white transition-colors">
                                    Send Message
                                </button>
                            </form>
                        ) : (
                            <form className="animate-fade-in">
                                <div className="mb-6 p-4 bg-brand-950 rounded-lg border border-brand-800 text-sm text-slate-300">
                                    Please select your preferred date and time. Our concierge will confirm availability within 2 hours.
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="bg-brand-950 p-4 rounded-lg border border-brand-800 mb-6">
                                        <label className="block text-brand-gold text-xs font-bold uppercase tracking-widest mb-3">Select Date</label>
                                        <input type="date" className="w-full bg-brand-900 text-white p-3 rounded border border-brand-700 focus:outline-none focus:border-brand-gold" />
                                    </div>
                                    <div className="bg-brand-950 p-4 rounded-lg border border-brand-800 mb-6">
                                        <label className="block text-brand-gold text-xs font-bold uppercase tracking-widest mb-3">Preferred Time (EST)</label>
                                        <select className="w-full bg-brand-900 text-white p-3 rounded border border-brand-700 focus:outline-none focus:border-brand-gold">
                                            <option>09:00 AM</option>
                                            <option>11:00 AM</option>
                                            <option>02:00 PM</option>
                                            <option>04:00 PM</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Input label="Name" />
                                    <Input label="Email" type="email" />
                                </div>
                                <TextArea label="Meeting Agenda / Notes" />
                                <button className="w-full bg-brand-gold text-brand-900 font-bold py-4 rounded-lg hover:bg-white transition-colors flex justify-center items-center gap-2">
                                    <Calendar size={18} /> Confirm Request
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactCenter;