import React, { useState } from 'react';
import { Star, User, MessageSquare, CheckCircle, Send, ShieldCheck } from 'lucide-react';
import { TESTIMONIALS } from '../constants';
import { Input, TextArea } from './ui/FormElements';

const Testimonials: React.FC = () => {
    const [testimonials, setTestimonials] = useState(TESTIMONIALS);
    const [formData, setFormData] = useState({ name: '', email: '', role: '', rating: 5, text: '' });
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Simulate Admin Approval Process
        setSubmitted(true);
        setTimeout(() => {
            // In a real app, this would go to a DB. Here we simulate "Pending Approval"
            // For demo purposes, we won't add it to the list immediately to respect the "Admin Approval" requirement visual
            setFormData({ name: '', email: '', role: '', rating: 5, text: '' });
        }, 2000);
    };

    return (
        <div className="space-y-16">
            {/* Display Approved Testimonials */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {testimonials.map((t) => (
                    <div key={t.id} className="bg-brand-800/50 backdrop-blur-sm p-8 rounded-xl border border-brand-700 hover:border-brand-gold transition-all duration-300 group shadow-lg">
                        <div className="flex gap-1 mb-4">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} size={16} className={`${i < t.rating ? 'text-brand-gold fill-brand-gold' : 'text-brand-700'} transition-colors`} />
                            ))}
                        </div>
                        <p className="text-slate-300 mb-8 italic leading-relaxed min-h-[80px]">"{t.text}"</p>
                        <div className="flex items-center gap-4">
                            <img src={t.image} alt={t.name} className="w-12 h-12 rounded-full border-2 border-brand-gold object-cover" />
                            <div>
                                <h4 className="text-white font-bold text-sm">{t.name}</h4>
                                <p className="text-brand-gold text-xs uppercase tracking-wide">{t.role}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Submission Form */}
            <div className="bg-brand-900 border border-brand-700 rounded-2xl p-8 md:p-12 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-brand-gold/5 rounded-full filter blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                
                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div>
                        <h3 className="text-3xl font-heading font-bold text-white mb-4">Share Your Experience</h3>
                        <p className="text-slate-400 mb-8">
                            Your feedback shapes our future. Please share your experience working with Federgreen Capital. 
                            All testimonials are reviewed by our team before publication to ensure authenticity.
                        </p>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 text-slate-300">
                                <div className="w-8 h-8 rounded-full bg-brand-800 flex items-center justify-center text-brand-gold"><CheckCircle size={16}/></div>
                                <span>Verified Client Reviews</span>
                            </div>
                             <div className="flex items-center gap-3 text-slate-300">
                                <div className="w-8 h-8 rounded-full bg-brand-800 flex items-center justify-center text-brand-gold"><ShieldCheck size={16} /></div>
                                <span>Privacy Protected</span>
                            </div>
                        </div>
                    </div>

                    {!submitted ? (
                        <form onSubmit={handleSubmit} className="bg-brand-950/50 p-8 rounded-xl border border-brand-800">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input 
                                    label="Full Name" 
                                    value={formData.name} 
                                    onChange={e => setFormData({...formData, name: e.target.value})}
                                    required
                                />
                                <Input 
                                    label="Role / Company" 
                                    value={formData.role} 
                                    onChange={e => setFormData({...formData, role: e.target.value})}
                                    required
                                />
                            </div>
                            <Input 
                                label="Email Address (Private)" 
                                type="email"
                                value={formData.email} 
                                onChange={e => setFormData({...formData, email: e.target.value})}
                                required
                            />
                            <div className="mb-6">
                                <label className="block text-xs font-bold text-brand-gold tracking-widest uppercase mb-2">Rating</label>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button 
                                            key={star}
                                            type="button"
                                            onClick={() => setFormData({...formData, rating: star})}
                                            className="focus:outline-none"
                                        >
                                            <Star 
                                                size={24} 
                                                className={`${formData.rating >= star ? 'text-brand-gold fill-brand-gold' : 'text-brand-700'} hover:scale-110 transition-transform`} 
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <TextArea 
                                label="Your Testimonial" 
                                value={formData.text}
                                onChange={e => setFormData({...formData, text: e.target.value})}
                                required
                            />
                            <button className="w-full bg-brand-gold text-brand-900 font-bold py-4 rounded-lg hover:bg-white transition-colors flex justify-center items-center gap-2">
                                <Send size={18} />
                                Submit for Review
                            </button>
                        </form>
                    ) : (
                        <div className="bg-brand-950/50 p-8 rounded-xl border border-brand-800 flex flex-col items-center justify-center text-center h-full min-h-[400px]">
                            <div className="w-20 h-20 bg-brand-800 rounded-full flex items-center justify-center mb-6 text-brand-gold">
                                <CheckCircle size={40} />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">Thank You</h3>
                            <p className="text-slate-400">
                                Your testimonial has been submitted successfully. <br/>
                                It is currently pending administrative approval.
                            </p>
                            <button onClick={() => setSubmitted(false)} className="mt-8 text-brand-gold hover:underline text-sm">Submit another</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Testimonials;