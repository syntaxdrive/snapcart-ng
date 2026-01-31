import React, { useState, useEffect } from 'react';
import supabase from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

const UpdatePassword = () => {
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Check if we have a session (the email link logs them in automatically)
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                navigate('/auth'); // Redirect to login if link is invalid/expired
            }
        };
        checkSession();
    }, [navigate]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { error } = await supabase.auth.updateUser({ password: password });

        if (error) {
            setError(error.message);
        } else {
            setMessage('Password updated successfully! Redirecting...');
            setTimeout(() => navigate('/'), 2000);
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen pt-32 pb-12 flex items-center justify-center px-4 bg-gray-50">
            <div className="w-full max-w-md bg-white border border-gray-200 p-8 rounded-2xl shadow-sm">
                <h2 className="text-2xl font-bold mb-6 text-center">Set New Password</h2>

                {error && <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">{error}</div>}
                {message && <div className="bg-green-50 text-green-600 p-3 rounded mb-4 text-sm">{message}</div>}

                <form onSubmit={handleUpdate} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">New Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Min 6 characters"
                            required
                            minLength={6}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-black text-white font-bold py-3 rounded-lg hover:bg-gray-800 transition-colors"
                    >
                        {loading ? 'Updating...' : 'Update Password'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default UpdatePassword;
