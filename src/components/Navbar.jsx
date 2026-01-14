import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Menu, X, LogOut } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import supabase from '../lib/supabase';

const Navbar = () => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
    const { user, role, loading } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/');
    };

    const firstName = user?.user_metadata?.full_name?.split(' ')[0] || 'Account';

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
            <div className="container mx-auto h-16 flex items-center justify-between px-4">
                <Link to="/" className="text-xl font-bold">
                    SnapCart<span className="text-blue-600">.</span>
                </Link>

                {/* Desktop Nav */}
                <div className="flex items-center gap-8">
                    <Link to="/" className="hover:text-blue-600">Home</Link>
                    <Link to="/marketplace" className="hover:text-blue-600">Marketplace</Link>
                    <Link to="/stores" className="hover:text-blue-600">Stores</Link>

                    {role === 'admin' && (
                        <Link to="/admin" className="text-purple-600 font-medium bg-purple-50 px-3 py-1 rounded">ADMIN</Link>
                    )}
                    {role === 'seller' && (
                        <Link to="/seller-dashboard" className="text-blue-600 font-medium">Sell</Link>
                    )}
                    {role === 'user' && user && (
                        <Link to="/apply-seller" className="hover:text-blue-600">Apply to Sell</Link>
                    )}
                </div>

                {/* User Menu */}
                <div className="hidden md:block">
                    {user ? (
                        <div className="relative">
                            <button
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full hover:bg-gray-200"
                            >
                                <User size={16} />
                                <span>{firstName}</span>
                            </button>

                            {isDropdownOpen && (
                                <div className="absolute right-0 top-full mt-2 w-48 bg-white border rounded-xl shadow-lg py-2">
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center gap-2 px-4 py-2 hover:bg-red-50 text-red-600 w-full text-left"
                                    >
                                        <LogOut size={16} /> Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Link to="/auth" className="bg-black text-white px-4 py-2 rounded-full">
                            Login
                        </Link>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-white border-t p-4">
                    <Link to="/" className="block py-2" onClick={() => setIsOpen(false)}>Home</Link>
                    <Link to="/marketplace" className="block py-2" onClick={() => setIsOpen(false)}>Marketplace</Link>
                    <Link to="/stores" className="block py-2" onClick={() => setIsOpen(false)}>Stores</Link>

                    {user ? (
                        <>
                            {role === 'admin' && <Link to="/admin" className="block py-2" onClick={() => setIsOpen(false)}>Admin</Link>}
                            {role === 'seller' && <Link to="/seller-dashboard" className="block py-2" onClick={() => setIsOpen(false)}>Sell</Link>}
                            {role === 'user' && <Link to="/apply-seller" className="block py-2" onClick={() => setIsOpen(false)}>Apply</Link>}
                            <button onClick={() => { handleLogout(); setIsOpen(false); }} className="block py-2 text-red-600 w-full text-left">Logout</button>
                        </>
                    ) : (
                        <Link to="/auth" className="block py-2" onClick={() => setIsOpen(false)}>Login</Link>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
