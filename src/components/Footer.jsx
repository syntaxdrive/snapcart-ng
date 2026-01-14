
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="border-t border-gray-200 bg-white pt-16 pb-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    {/* Brand */}
                    <div className="col-span-1 md:col-span-1">
                        <Link to="/" className="text-xl font-bold font-display tracking-tight text-black mb-4 block">
                            SnapCart<span className="text-[var(--color-accent)]">.</span>
                        </Link>
                        <p className="text-gray-500 text-sm leading-relaxed">
                            The simplest way to buy and sell online. Direct connections, no hidden fees.
                        </p>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 className="font-bold mb-4 text-black">Marketplace</h4>
                        <ul className="space-y-2 text-sm text-gray-500">
                            <li><Link to="/marketplace" className="hover:text-black transition-colors">All Products</Link></li>
                            <li><Link to="/stores" className="hover:text-black transition-colors">Browse Stores</Link></li>
                            <li><Link to="/marketplace?category=fashion" className="hover:text-black transition-colors">Fashion</Link></li>
                            <li><Link to="/marketplace?category=tech" className="hover:text-black transition-colors">Tech</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold mb-4 text-black">Sellers</h4>
                        <ul className="space-y-2 text-sm text-gray-500">
                            <li><Link to="/apply-seller" className="hover:text-black transition-colors">Become a Seller</Link></li>
                            <li><Link to="/auth" className="hover:text-black transition-colors">Seller Login</Link></li>
                            <li><Link to="/rules" className="hover:text-black transition-colors">Market Rules</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold mb-4 text-black">Support</h4>
                        <ul className="space-y-2 text-sm text-gray-500">
                            <li><a href="#" className="hover:text-black transition-colors">Help Center</a></li>
                            <li><a href="#" className="hover:text-black transition-colors">Safety Tips</a></li>
                            <li><a href="#" className="hover:text-black transition-colors">Contact Us</a></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
                    <p>© {new Date().getFullYear()} SnapCart Inc. All rights reserved.</p>
                    <div className="flex gap-6 mt-4 md:mt-0">
                        <a href="#" className="hover:text-black">Privacy</a>
                        <a href="#" className="hover:text-black">Terms</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
