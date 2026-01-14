import React, { useState, useEffect } from 'react';
import supabase from '../lib/supabase';
import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';

const Marketplace = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        if (!supabase) return;

        try {
            console.log("Fetching products...");
            const { data, error } = await supabase
                .from('products')
                .select('*, seller:profiles!seller_id(full_name)')
                .order('created_at', { ascending: false });

            if (error) {
                console.error("Supabase Error:", error);
                alert("Error fetching products: " + error.message);
            }

            if (data) {
                console.log("Products loaded:", data.length);
                setProducts(data);
                setFilteredProducts(data);

                // Extract Categories (assuming 'category' column exists, else use hardcoded fallback or create it)
                // If 'category' column is missing in DB, we rely on manual list or add column. 
                // For now, let's assume loose schema or add 'category' to products table if needed.
                // Since I can't check schema perfectly, I'll allow "All" only if column missing.
                const cats = ['All', ...new Set(data.map(p => p.category).filter(Boolean))];
                setCategories(cats);
            }
        } catch (err) {
            console.error("Catch Error:", err);
        } finally {
            setLoading(false);
        }
    };

    const filterProducts = (category) => {
        setSelectedCategory(category);
        if (category === 'All') {
            setFilteredProducts(products);
        } else {
            setFilteredProducts(products.filter(p => p.category === category));
        }
    };

    const handleBuyNow = async (product) => {
        // Fetch seller's whatsapp
        const { data } = await supabase
            .from('seller_applications')
            .select('whatsapp_number')
            .eq('user_id', product.seller_id)
            .eq('status', 'approved')
            .single();

        const phone = data?.whatsapp_number;

        if (phone) {
            const message = `Hi, I'm interested in your ${product.name} listed on SnapCart for ${product.currency}${product.price}. Is it available?`;
            const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
            window.open(url, '_blank');
        } else {
            alert("Could not connect to seller.");
        }
    };

    if (loading) return <div className="pt-32 text-center text-gray-400">Loading Marketplace...</div>;

    return (
        <div className="pt-24 pb-12 px-4 container mx-auto fade-in">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                <div>
                    <h1 className="text-4xl font-display font-medium mb-3 tracking-tight">Marketplace</h1>
                    <p className="text-[var(--color-text-muted)] font-light text-lg">Curated essentials from our best sellers.</p>
                </div>

                {/* Category Filter */}
                <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar w-full md:w-auto">
                    {categories.length > 0 ? categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => filterProducts(cat)}
                            className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${selectedCategory === cat
                                ? 'bg-black text-white shadow-lg'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            {cat}
                        </button>
                    )) : (
                        <button className="px-5 py-2 rounded-full text-sm font-medium bg-black text-white">All Items</button>
                    )}
                </div>
            </div>

            {filteredProducts.length === 0 ? (
                <div className="text-center py-24 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                    <p className="text-gray-400 font-light text-lg">No products found in this category.</p>
                    <button onClick={() => filterProducts('All')} className="mt-4 text-sm font-medium underline">View all products</button>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {filteredProducts.map((product) => (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="group bg-white rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all duration-500"
                        >
                            {/* Image Container */}
                            <div className="aspect-[4/5] bg-gray-100 relative overflow-hidden">
                                {product.image_url ? (
                                    <img
                                        src={product.image_url}
                                        alt={product.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-300 bg-gray-50">No Image</div>
                                )}

                                {/* Desktop Hover Action (Hidden on Mobile) */}
                                <div className="hidden md:flex absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 justify-between items-center bg-gradient-to-t from-black/60 to-transparent pt-12">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleBuyNow(product); }}
                                        className="w-full bg-white text-black font-semibold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors shadow-lg"
                                    >
                                        <MessageCircle size={18} /> Buy on WhatsApp
                                    </button>
                                </div>
                            </div>

                            {/* Info */}
                            <div className="p-5">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-medium text-lg text-gray-900 line-clamp-1">{product.name}</h3>
                                </div>

                                <div className="flex justify-between items-center mt-3">
                                    <div className="flex flex-col">
                                        <span className="text-xs text-gray-500 mb-0.5">{product.seller?.full_name || 'Verified Seller'}</span>
                                        <span className="font-bold text-lg text-[var(--color-accent)]">
                                            {product.currency}{product.price.toLocaleString()}
                                        </span>
                                    </div>

                                    {/* Mobile/Always Visible Buy Button */}
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleBuyNow(product); }}
                                        className="md:hidden bg-black text-white p-3 rounded-full hover:bg-gray-800 transition-colors shadow-md active:scale-95"
                                        aria-label="Buy on WhatsApp"
                                    >
                                        <MessageCircle size={20} />
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

export default Marketplace;
