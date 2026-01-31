import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white border-t border-gray-800">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="col-span-1 md:col-span-1">
                        <Link to="/" className="flex items-center gap-2 font-display font-bold text-xl mb-4">
                            <div className="bg-[#FF6B00] p-1.5 rounded-lg text-white">
                                <ShoppingCart size={20} strokeWidth={2.5} />
                            </div>
                            SnapCart
                        </Link>
                        <p className="text-gray-400 text-sm">
                            The #1 marketplace for Nigerian students. Buy, sell, and connect on your campus.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-bold mb-4">Marketplace</h3>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li><Link to="/marketplace" className="hover:text-white transition-colors">All Products</Link></li>
                            <li><Link to="/marketplace?cat=Fashion" className="hover:text-white transition-colors">Fashion</Link></li>
                            <li><Link to="/marketplace?cat=Electronics" className="hover:text-white transition-colors">Electronics</Link></li>
                            <li><Link to="/apply-seller" className="hover:text-white transition-colors">Become a Seller</Link></li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h3 className="font-bold mb-4">Support</h3>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li><a href="mailto:snapcart882@gmail.com" className="hover:text-white transition-colors">Help Center</a></li>
                            <li><a href="mailto:snapcart882@gmail.com" className="hover:text-white transition-colors">Safety Tips</a></li>
                            <li><Link to="/admin" className="hover:text-white transition-colors">Admin Login</Link></li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h3 className="font-bold mb-4">Legal</h3>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                            <li><Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
                            <li><Link to="/terms" className="hover:text-white transition-colors">Cookie Policy</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-gray-800 text-center text-sm text-gray-400 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p>&copy; {new Date().getFullYear()} SnapCart Nigeria. All rights reserved.</p>
                    <div className="flex gap-4">
                        <Link to="/privacy" className="hover:text-white">Privacy</Link>
                        <Link to="/terms" className="hover:text-white">Terms</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
