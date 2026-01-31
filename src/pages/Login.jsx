import React, { useState, useEffect } from 'react';
import supabase from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';
import nigerianUniversities from '../data/universities';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [university, setUniversity] = useState('');
    const [universitySearch, setUniversitySearch] = useState('');
    const [showUniversityDropdown, setShowUniversityDropdown] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const navigate = useNavigate();

    const filteredUniversities = nigerianUniversities.filter(uni =>
        uni.toLowerCase().includes(universitySearch.toLowerCase())
    );

    const handleAuth = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setMessage(null);

        if (!supabase) {
            setError("Supabase is not configured.");
            setLoading(false);
            return;
        }

        if (isSignUp && !agreedToTerms) {
            setError("You must agree to the Terms and Conditions to sign up.");
            setLoading(false);
            return;
        }

        try {
            if (isSignUp) {
                const { error, data } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            full_name: fullName,
                            university: university
                        }
                    }
                });
                if (error) throw error;

                // Update profile with university
                if (data.user) {
                    await supabase
                        .from('profiles')
                        .update({ university: university })
                        .eq('id', data.user.id);
                }

                // If email confirmation is enabled on Supabase, a session might not be returned immediately,
                // or if it is returned, the user might still need to verify.

                if (data.user && !data.session) {
                    // Email confirmation IS enabled and required
                    setMessage("Success! Please check your email to confirm your account before logging in.");
                    setIsSignUp(false); // Switch back to login view
                } else if (data.session) {
                    // Email confirmation might be off, or session created successfully
                    navigate('/');
                } else {
                    // Fallback
                    setMessage("Account created! Please check your email for a confirmation link.");
                    setIsSignUp(false);
                }
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
                navigate('/');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-24 pb-12 flex items-center justify-center px-4 bg-gray-50">
            <div className="w-full max-w-md bg-white border border-gray-200 p-8 rounded-2xl animate-fade-in shadow-sm">
                <h2 className="text-3xl font-display font-bold mb-2 text-center text-gray-900">
                    {isSignUp ? 'Join SnapCart' : 'Welcome Back'}
                </h2>
                <p className="text-center text-gray-500 mb-8">
                    {isSignUp ? 'Start your selling journey today' : 'Manage your store and purchases'}
                </p>

                {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4 border border-red-100">{error}</div>}
                {message && <div className="bg-green-50 text-green-600 p-3 rounded-lg text-sm mb-4 border border-green-100">{message}</div>}

                <form onSubmit={handleAuth} className="space-y-4">
                    {isSignUp && (
                        <>
                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-700">Full Name</label>
                                <input
                                    type="text"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:border-[var(--color-accent)] transition-colors"
                                    placeholder="John Doe"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-700">University</label>
                                <div className="relative">
                                    <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
                                    <input
                                        type="text"
                                        value={universitySearch || university}
                                        onChange={(e) => {
                                            setUniversitySearch(e.target.value);
                                            setShowUniversityDropdown(true);
                                        }}
                                        onFocus={() => setShowUniversityDropdown(true)}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-10 pr-4 py-3 text-gray-900 focus:outline-none focus:border-[var(--color-accent)] transition-colors"
                                        placeholder="Search for your university..."
                                        required
                                    />
                                    {showUniversityDropdown && filteredUniversities.length > 0 && (
                                        <div className="absolute z-20 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                            {filteredUniversities.map((uni) => (
                                                <button
                                                    key={uni}
                                                    type="button"
                                                    onClick={() => {
                                                        setUniversity(uni);
                                                        setUniversitySearch(uni);
                                                        setShowUniversityDropdown(false);
                                                    }}
                                                    className="w-full text-left px-4 py-2 hover:bg-blue-50 text-sm"
                                                >
                                                    {uni}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </>
                    )}

                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:border-[var(--color-accent)] transition-colors"
                            placeholder="you@example.com"
                            required
                        />
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <label className="block text-sm font-medium text-gray-700">Password</label>
                            {!isSignUp && (
                                <button
                                    type="button"
                                    onClick={async () => {
                                        if (!email) {
                                            setError('Please enter your email address first.');
                                            return;
                                        }
                                        setLoading(true);
                                        const { error } = await supabase.auth.resetPasswordForEmail(email, {
                                            redirectTo: `${window.location.origin}/update-password`,
                                        });
                                        setLoading(false);
                                        if (error) setError(error.message);
                                        else setMessage('Password reset instructions sent to your email.');
                                    }}
                                    className="text-xs text-blue-600 hover:underline"
                                >
                                    Forgot Password?
                                </button>
                            )}
                        </div>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:border-[var(--color-accent)] transition-colors"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    {isSignUp && (
                        <div className="flex items-start gap-3">
                            <input
                                type="checkbox"
                                id="terms"
                                checked={agreedToTerms}
                                onChange={(e) => setAgreedToTerms(e.target.checked)}
                                className="mt-1 w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                            />
                            <label htmlFor="terms" className="text-sm text-gray-600">
                                I agree to the <a href="/terms" target="_blank" className="font-medium text-blue-600 hover:underline">Terms of Service</a> and <a href="/privacy" target="_blank" className="font-medium text-blue-600 hover:underline">Privacy Policy</a>
                            </label>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[var(--color-text)] text-white font-semibold py-3 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Processing...' : (isSignUp ? 'Create Account' : 'Sign In')}
                    </button>

                </form>

                <div className="mt-6 text-center text-sm text-gray-500">
                    {isSignUp ? "Already have an account? " : "Don't have an account? "}
                    <button
                        onClick={() => setIsSignUp(!isSignUp)}
                        className="text-[var(--color-accent)] hover:underline font-medium"
                    >
                        {isSignUp ? 'Sign In' : 'Sign Up'}
                    </button>
                </div>
            </div >
        </div >
    );
};

export default Login;
