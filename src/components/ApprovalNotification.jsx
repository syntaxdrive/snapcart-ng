import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import supabase from '../lib/supabase';
import { CheckCircle } from 'lucide-react';

const ApprovalNotification = () => {
    const { user, role } = useAuth();
    const navigate = useNavigate();
    const [showNotification, setShowNotification] = useState(false);

    useEffect(() => {
        if (user && role === 'seller') {
            checkRecentApproval();
        }
    }, [user, role]);

    const checkRecentApproval = async () => {
        // Check if they were recently approved (within last 24 hours)
        const { data } = await supabase
            .from('seller_applications')
            .select('updated_at, status')
            .eq('user_id', user.id)
            .eq('status', 'approved')
            .single();

        if (data) {
            const approvedTime = new Date(data.updated_at);
            const now = new Date();
            const hoursSinceApproval = (now - approvedTime) / (1000 * 60 * 60);

            // Show notification if approved within last 24 hours and not dismissed
            const dismissed = localStorage.getItem(`approval_seen_${user.id}`);
            if (hoursSinceApproval < 24 && !dismissed) {
                setShowNotification(true);
            }
        }
    };

    const handleDismiss = () => {
        localStorage.setItem(`approval_seen_${user.id}`, 'true');
        setShowNotification(false);
    };

    const handleGoToDashboard = () => {
        handleDismiss();
        navigate('/seller-dashboard');
    };

    if (!showNotification) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center animate-fade-in">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2">🎉 Congratulations!</h2>
                <p className="text-gray-600 mb-6">
                    Your seller application has been approved! You can now start adding products and selling on SnapCart.
                </p>
                <div className="flex gap-3">
                    <button
                        onClick={handleDismiss}
                        className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200"
                    >
                        Later
                    </button>
                    <button
                        onClick={handleGoToDashboard}
                        className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700"
                    >
                        Go to Dashboard
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ApprovalNotification;
