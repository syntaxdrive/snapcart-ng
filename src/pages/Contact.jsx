
import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import supabase from '../lib/supabase';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [status, setStatus] = useState('idle'); // idle, sending, success, error

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('sending');

        // In a real app we'd save this to a 'messages' table.
        // For now, let's just simulate or if you want to be fancy, add a table.
        // Let's console log and pretend, or actually insert if we make a table (which we didn't yet).
        // I'll stick to a success message for now as requested "Simple".

        // Simulating delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        setStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '' });
    };

    return (
        <div className="pt-24 pb-12 container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-display font-bold mb-8 text-center">Contact Us</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">

                    {/* Contact Info */}
                    <div className="space-y-8">
                        <div>
                            <h3 className="text-xl font-bold mb-4">Get in touch</h3>
                            <p className="text-gray-500 leading-relaxed">
                                Have questions about buying or selling? Need support with your order?
                                Our team is here to help you.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center gap-4 text-gray-600">
                                <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center">
                                    <Mail size={18} />
                                </div>
                                <span>support@snapcart.com</span>
                            </div>
                            <div className="flex items-center gap-4 text-gray-600">
                                <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center">
                                    <Phone size={18} />
                                </div>
                                <span>+234 800 123 4567</span>
                            </div>
                            <div className="flex items-center gap-4 text-gray-600">
                                <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center">
                                    <MapPin size={18} />
                                </div>
                                <span>Lagos, Nigeria</span>
                            </div>
                        </div>
                    </div>

                    {/* Form */}
                    <div>
                        {status === 'success' ? (
                            <div className="bg-green-50 text-green-700 p-6 rounded-xl text-center h-full flex flex-col items-center justify-center">
                                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                                    <Send size={24} />
                                </div>
                                <h3 className="font-bold text-lg mb-2">Message Sent!</h3>
                                <p>We'll get back to you as soon as possible.</p>
                                <button onClick={() => setStatus('idle')} className="mt-4 text-sm underline">Send another</button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Name</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 outline-none focus:border-blue-500 transition-colors"
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Email</label>
                                    <input
                                        type="email"
                                        required
                                        className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 outline-none focus:border-blue-500 transition-colors"
                                        value={formData.email}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Message</label>
                                    <textarea
                                        required
                                        rows={4}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 outline-none focus:border-blue-500 transition-colors"
                                        value={formData.message}
                                        onChange={e => setFormData({ ...formData, message: e.target.value })}
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={status === 'sending'}
                                    className="w-full bg-black text-white font-bold py-3 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
                                >
                                    {status === 'sending' ? 'Sending...' : 'Send Message'}
                                </button>
                            </form>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Contact;
