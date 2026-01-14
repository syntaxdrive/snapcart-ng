import React, { useEffect, useState } from 'react';
import supabase from '../lib/supabase';
import { Link } from 'react-router-dom';
import { Store as StoreIcon, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Stores = () => {
    const [stores, setStores] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStores = async () => {
            // Fetch approved sellers
            const { data } = await supabase
                .from('seller_applications')
                .select('*, profiles(full_name, email)')
                .eq('status', 'approved');

            setStores(data || []);
            setLoading(false);
        };
        fetchStores();
    }, []);

    if (loading) return (
        <div className="pt-32 text-center container mx-auto">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
            <p className="text-gray-500">Loading Stores...</p>
        </div>
    );

    return (
        <div className="bg-gray-50 min-h-screen pt-24 pb-20">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h1 className="text-4xl font-display font-bold mb-4">Discover Stores</h1>
                    <p className="text-gray-600 text-lg">
                        Explore unique collections from our verified sellers.
                    </p>
                </div>

                {stores.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
                        <StoreIcon className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                        <h2 className="text-xl font-bold text-gray-900">No Stores Yet</h2>
                        <p className="text-gray-500 mt-2">Check back soon for new sellers!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {stores.map((store, i) => (
                            <motion.div
                                key={store.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow duration-300 group flex flex-col h-full"
                            >
                                {/* Cover / Pattern */}
                                <div className="h-32 bg-gradient-to-r from-gray-900 to-gray-800 relative overflow-hidden">
                                    <div className="absolute inset-0 opacity-20 bg-black"></div>
                                    <div className="absolute bottom-0 left-6 translate-y-1/2 w-16 h-16 bg-white rounded-full p-1 shadow-md">
                                        <div className="w-full h-full bg-gray-100 rounded-full flex items-center justify-center text-xl font-bold text-gray-400">
                                            {store.business_name?.[0]?.toUpperCase() || 'S'}
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-10 px-6 pb-6 flex-1 flex flex-col">
                                    <div className="mb-4">
                                        <h2 className="text-2xl font-bold text-gray-900 mb-1">{store.business_name}</h2>
                                        <p className="text-sm text-gray-500 flex items-center gap-1">
                                            <span className="w-2 h-2 rounded-full bg-green-500 inline-block"></span>
                                            Verified Seller
                                        </p>
                                    </div>

                                    <p className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-3">
                                        {store.business_description || "Start browsing this store's collection today."}
                                    </p>

                                    <div className="mt-auto pt-6 border-t border-gray-50">
                                        <Link
                                            to={`/store/${store.user_id}`}
                                            className="flex items-center justify-between w-full text-sm font-bold text-gray-900 group-hover:text-[var(--color-accent)] transition-colors"
                                        >
                                            Visit Store
                                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                        </Link>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Stores;
