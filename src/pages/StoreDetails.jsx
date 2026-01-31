
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import supabase from '../lib/supabase';
import { Store, MessageCircle, Package, BadgeCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const StoreDetails = () => {
    const { sellerId } = useParams();
    const [storeInfo, setStoreInfo] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [rating, setRating] = useState(0);
    const [averageRating, setAverageRating] = useState(null);
    const [userRating, setUserRating] = useState(null);

    useEffect(() => {
        const fetchStoreData = async () => {
            if (!supabase || !sellerId) return;

            setLoading(true);

            // 1. Get Store Info
            const { data: storeData } = await supabase
                .from('seller_applications')
                .select('*, profile:profiles!user_id(full_name, qualifications, is_verified, id)')
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

            // 3. Get Ratings
            const { data: reviews } = await supabase
                .from('reviews')
                .select('rating, reviewer_id')
                .eq('seller_id', sellerId);

            if (reviews && reviews.length > 0) {
                const total = reviews.reduce((sum, r) => sum + r.rating, 0);
                setAverageRating((total / reviews.length).toFixed(1));
            }

            setLoading(false);
        };

        fetchStoreData();
    }, [sellerId]);

    const handleRate = async (score) => {
        const { error } = await supabase
            .from('reviews')
            .insert([{ seller_id: sellerId, rating: score }]);

        if (error) alert('Error submitting rating');
        else {
            alert('Rating submitted!');
            setUserRating(score);
        }
    };

    const handleReport = async () => {
        const reason = prompt("Why are you reporting this seller?");
        if (!reason) return;

        const { error } = await supabase
            .from('reports')
            .insert([{ target_id: sellerId, reason }]);

        if (error) alert('Error submitting report');
        else alert('Report submitted. We will review this seller.');
    };

    const handleBuyNow = (product) => {
        if (!storeInfo) return;
        supabase.rpc('increment_product_clicks', { product_id: product.id });
        const message = `Hi ${storeInfo.profile?.full_name}, I saw your ${product.name} on SnapCart for ${product.currency}${product.price}. Is it available?`;
        const url = `https://wa.me/${storeInfo.whatsapp_number}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    };

    if (loading) return <div className="pt-32 text-center text-gray-500">Loading store...</div>;
    if (!storeInfo && !loading) return <div className="pt-32 text-center text-gray-500">Store not found.</div>;

    return (
        <div className="pt-24 pb-12 container mx-auto px-4">
            {/* Store Header */}
            <div className="relative rounded-3xl overflow-hidden mb-12 min-h-[300px] flex items-end">
                {/* Background Image or Fallback */}
                {storeInfo.banner_url ? (
                    <div className="absolute inset-0">
                        <img src={storeInfo.banner_url} alt="Store Banner" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
                    </div>
                ) : (
                    <div className="absolute inset-0 bg-gray-900">
                        <div className="absolute top-0 right-0 p-32 bg-blue-500 rounded-full blur-3xl opacity-20 translate-x-12 -translate-y-12 pointer-events-none"></div>
                    </div>
                )}

                <div className="relative z-10 p-8 md:p-12 text-white w-full">
                    <div className="flex flex-col md:flex-row justify-between items-end gap-6">
                        <div>
                            <div className="flex items-center gap-4 mb-4">
                                <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-md border border-white/20">
                                    <Store className="w-8 h-8 text-blue-400" />
                                </div>
                                <div>
                                    <h1 className="text-3xl md:text-5xl font-display font-bold mb-2 shadow-black drop-shadow-lg flex items-center gap-2">
                                        {storeInfo.business_name}
                                        {storeInfo.profile?.is_verified && <BadgeCheck size={32} className="text-blue-500 fill-blue-100" />}
                                    </h1>
                                    <p className="text-gray-200 flex items-center gap-2 font-medium">
                                        Owned by {storeInfo.profile?.full_name}
                                    </p>
                                </div>
                            </div>
                            <p className="text-xl text-gray-200 max-w-2xl font-light leading-relaxed drop-shadow-md mb-4">
                                {storeInfo.business_description}
                            </p>
                            {storeInfo.profile?.qualifications && (
                                <div className="bg-white/10 backdrop-blur-sm p-3 rounded-lg border border-white/10 max-w-xl">
                                    <p className="text-xs text-blue-300 font-bold uppercase tracking-wider mb-1">Qualifications</p>
                                    <p className="text-sm text-white">{storeInfo.profile.qualifications}</p>
                                </div>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col items-end gap-3">
                            <div className="flex items-center gap-1 bg-black/40 backdrop-blur-md px-3 py-1 rounded-lg border border-white/10">
                                <span className="text-yellow-400">★</span>
                                <span className="font-bold">{averageRating || 'New'}</span>
                            </div>
                            <div className="flex gap-2">
                                {[1, 2, 3, 4, 5].map(star => (
                                    <button
                                        key={star}
                                        onClick={() => handleRate(star)}
                                        className={`text-xl ${userRating >= star ? 'text-yellow-400' : 'text-gray-400 opacity-50 hover:opacity-100'}`}
                                    >★</button>
                                ))}
                            </div>
                            <button onClick={handleReport} className="text-xs text-red-300 hover:text-red-100 underline">
                                Report Seller
                            </button>
                        </div>
                    </div>
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
