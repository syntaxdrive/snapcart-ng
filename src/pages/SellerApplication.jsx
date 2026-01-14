import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import supabase from '../lib/supabase';
import { Store, Phone, FileText } from 'lucide-react';

const SellerApplication = () => {
    const { user, role, loading: authLoading } = useAuth();
    const navigate = useNavigate();

    const [businessName, setBusinessName] = useState('');
    const [description, setDescription] = useState('');
    const [whatsapp, setWhatsapp] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [applicationStatus, setApplicationStatus] = useState(null);

    useEffect(() => {
        if (!authLoading) {
            if (!user) {
                navigate('/auth');
            } else if (role === 'admin') {
                return;
            } else if (role === 'seller') {
                navigate('/seller-dashboard');
            } else {
                checkExistingApplication();
            }
        }
    }, [user, role, authLoading]);

    const checkExistingApplication = async () => {
        const { data } = await supabase
            .from('seller_applications')
            .select('status')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(1);

        if (data && data.length > 0) {
            const latestApp = data[0];
            setApplicationStatus(latestApp.status);
            if (latestApp.status === 'pending') {
                setMessage('Your application is pending review.');
            } else if (latestApp.status === 'rejected') {
                setMessage('Your previous application was rejected. You can submit a new application below.');
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Check if they already have a PENDING application
            const { data: pending } = await supabase
                .from('seller_applications')
                .select('id')
                .eq('user_id', user.id)
                .eq('status', 'pending')
                .limit(1);

            if (pending && pending.length > 0) {
                alert('You already have a pending application. Please wait for review.');
                setLoading(false);
                return;
            }

            // Insert new application
            const { error } = await supabase
                .from('seller_applications')
                .insert([{
                    user_id: user.id,
                    business_name: businessName,
                    business_description: description,
                    whatsapp_number: whatsapp,
                    status: 'pending'
                }]);

            if (error) {
                alert('Error: ' + error.message);
            } else {
                setMessage('✅ Application submitted successfully! Admins will review it soon.');
                setApplicationStatus('pending');
                setBusinessName('');
                setDescription('');
                setWhatsapp('');
            }
        } catch (error) {
            alert('Error submitting application. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (authLoading) {
        return <div className="pt-32 text-center">Loading...</div>;
    }

    if (role === 'admin') {
        return (
            <div className="pt-32 text-center container mx-auto">
                <p className="text-gray-600 mb-4">Administrators cannot apply to be sellers.</p>
                <button onClick={() => navigate('/admin')} className="bg-black text-white px-6 py-2 rounded-lg">
                    Go to Admin Dashboard
                </button>
            </div>
        );
    }

    const showForm = !applicationStatus || applicationStatus === 'rejected';

    return (
        <div className="pt-24 pb-12 px-4 container mx-auto flex justify-center">
            <div className="w-full max-w-lg bg-white border p-8 rounded-2xl">
                <h2 className="text-3xl font-bold mb-2">Become a Seller</h2>
                <p className="text-gray-500 mb-8">Join the marketplace and start selling.</p>

                {message && (
                    <div className={`p-4 rounded-lg text-center mb-6 ${applicationStatus === 'pending'
                        ? 'bg-green-50 text-green-700'
                        : 'bg-yellow-50 text-yellow-700'
                        }`}>
                        <p className="font-semibold">{message}</p>
                        {applicationStatus === 'pending' && (
                            <button onClick={() => navigate('/')} className="mt-2 text-sm underline">
                                Go Home
                            </button>
                        )}
                    </div>
                )}

                {showForm && (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium mb-1">Business Name</label>
                            <div className="relative">
                                <Store className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    value={businessName}
                                    onChange={(e) => setBusinessName(e.target.value)}
                                    className="w-full border rounded-lg py-3 pl-10 pr-4"
                                    placeholder="e.g. Urban Threads"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">WhatsApp Number</label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    value={whatsapp}
                                    onChange={(e) => setWhatsapp(e.target.value)}
                                    className="w-full border rounded-lg py-3 pl-10 pr-4"
                                    placeholder="e.g. 234800000000"
                                    required
                                />
                            </div>
                            <p className="text-xs text-gray-400 mt-1">Format: 234...</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Business Description</label>
                            <div className="relative">
                                <FileText className="absolute left-3 top-4 w-5 h-5 text-gray-400" />
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full border rounded-lg py-3 pl-10 pr-4 min-h-[120px]"
                                    placeholder="Tell us about what you sell..."
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-black text-white font-semibold py-3 rounded-lg hover:bg-gray-800 disabled:opacity-50"
                        >
                            {loading ? 'Submitting...' : 'Submit Application'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default SellerApplication;
