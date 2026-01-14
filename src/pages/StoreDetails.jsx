
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import supabase from '../lib/supabase';
import { Store, MessageCircle, Package } from 'lucide-react';
import { motion } from 'framer-motion';

const StoreDetails = () => {
    const { sellerId } = useParams();
    const [storeInfo, setStoreInfo] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStoreData = async () => {
            if (!supabase || !sellerId) return;

            setLoading(true);

            // 1. Get Store Info
            const { data: storeData } = await supabase
                .from('seller_applications')
                .select('*, profile:profiles!user_id(full_name)')
                .eq('user_id', sellerId)
                .eq('status', 'approved')
                .single();

            setStoreInfo(storeData);

            // 2. Get Seller Products
            const { data: productsData } = await supabase
                .from('products')
                .select('*')
                .eq('seller_id', sellerId);

            setProducts(productsData || []);
            setLoading(false);
        };

        fetchStoreData();
    }, [sellerId]);

    const handleBuyNow = (product) => {
        if (!storeInfo) return;
        const message = `Hi ${storeInfo.profile?.full_name}, I saw your ${product.name} on SnapCart for ${product.currency}${product.price}. Is it available?`;
        const url = `https://wa.me/${storeInfo.whatsapp_number}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    };

    if (loading) return <div className="pt-32 text-center text-gray-500">Loading store...</div>;
    if (!storeInfo && !loading) return <div className="pt-32 text-center text-gray-500">Store not found.</div>;

    return (
        <div className="pt-24 pb-12 container mx-auto px-4">
            {/* Store Header */}
            <div className="bg-gray-900 text-white rounded-3xl p-8 md:p-12 mb-12 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-32 bg-blue-500 rounded-full blur-3xl opacity-20 translate-x-12 -translate-y-12 pointer-events-none"></div>
                <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-md">
                            <Store className="w-8 h-8 text-blue-400" />
                        </div>
                        <div>
                            <h1 className="text-3xl md:text-5xl font-display font-bold mb-2">{storeInfo.business_name}</h1>
                            <p className="text-gray-400 flex items-center gap-2">
                                Owned by {storeInfo.profile?.full_name}
                            </p>
                        </div>
                    </div>
                    <p className="text-xl text-gray-300 max-w-2xl font-light leading-relaxed">
                        {storeInfo.business_description}
                    </p>
                </div>
            </div>

            {/* Products Grid */}
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Package className="text-blue-500" /> Store Products
            </h2>

            {products.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                    <p className="text-gray-500">No products listed yet.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            className="bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-lg transition-all group"
                        >
                            <div className="aspect-square bg-gray-100 relative overflow-hidden">
                                {product.image_url ? (
                                    <img src={product.image_url} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                                )}
                            </div>
                            <div className="p-4">
                                <h3 className="font-semibold text-gray-900 mb-1">{product.name}</h3>
                                <div className="flex items-center justify-between mt-2">
                                    <span className="font-bold text-lg text-blue-600">
                                        {product.currency}{product.price.toLocaleString()}
                                    </span>
                                    <button
                                        onClick={() => handleBuyNow(product)}
                                        className="bg-green-500 text-white p-2 rounded-full hover:bg-green-600 transition-colors shadow-sm"
                                        title="Buy on WhatsApp"
                                    >
                                        <MessageCircle size={18} />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default StoreDetails;
