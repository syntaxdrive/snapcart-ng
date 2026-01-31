import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Search, MapPin } from 'lucide-react';

const NotFound = () => {
    return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 animate-fade-in">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                <MapPin className="text-gray-400 w-12 h-12" />
            </div>

            <h1 className="text-4xl font-display font-bold mb-2">Page Not Found</h1>
            <p className="text-gray-500 max-w-md mb-8">
                Oops! Looks like you've wandered off campus. The page you're looking for doesn't exist or has been moved.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
                <Link
                    to="/"
                    className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 rounded-full font-medium hover:bg-gray-800 transition-colors"
                >
                    <Home size={18} /> Go Home
                </Link>
                <Link
                    to="/marketplace"
                    className="inline-flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-6 py-3 rounded-full font-medium hover:bg-gray-50 transition-colors"
                >
                    <Search size={18} /> Browse Marketplace
                </Link>
            </div>
        </div>
    );
};

export default NotFound;
