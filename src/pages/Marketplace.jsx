import React, { useState, useEffect } from 'react';
import supabase from '../lib/supabase';
import { motion } from 'framer-motion';
import { MessageCircle, GraduationCap, Search, BadgeCheck, Flame } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';
import nigerianUniversities from '../data/universities';

const Marketplace = () => {
    const { user } = useAuth();
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedUniversity, setSelectedUniversity] = useState('All');
    const [userUniversity, setUserUniversity] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            fetchUserUniversity();
        }
        fetchProducts();
    }, [user]);

    const fetchUserUniversity = async () => {
        const { data } = await supabase
            .from('profiles')
            .select('university')
            .eq('id', user.id)
            .single();

        if (data?.university) {
            setUserUniversity(data.university);
            setSelectedUniversity(data.university);
        }
    };

    const fetchProducts = async () => {
        if (!supabase) return;

        try {
            const { data, error } = await supabase
                .from('products')
                .select(`
                    *,
                    seller:profiles!seller_id(
                        full_name,
                        university,
                        role,
                        is_verified
                    )
                `)
                .order('created_at', { ascending: false });

            if (error) {
                console.error("Supabase Error:", error);
            }

            if (data) {
                // Filter: Active sellers only
                const activeSellerProducts = data.filter(p => p.seller?.role === 'seller');

                // Sort: Verified -> SnapHeat (Algorithm) -> Same University -> Newest
                const sorted = activeSellerProducts.sort((a, b) => {
                    // 1. Verified First (The Trust Factor)
                    if (a.seller?.is_verified && !b.seller?.is_verified) return -1;
                    if (!a.seller?.is_verified && b.seller?.is_verified) return 1;

                    // 2. SnapHeat Algorithm (Hacker News Style Decay)
                    // Score = (Clicks + 1) / (AgeInHours + 2)^1.5
                    const getHeatScore = (item) => {
                        const ageInHours = (new Date() - new Date(item.created_at)) / (1000 * 60 * 60);
                        const clicks = item.clicks || 0;
                        return (clicks + 1) / Math.pow(ageInHours + 2, 1.5);
                    };

                    const scoreA = getHeatScore(a);
                    const scoreB = getHeatScore(b);

                    // If score difference is significant (> 0.1), use it
                    if (Math.abs(scoreA - scoreB) > 0.1) {
                        return scoreB - scoreA; // Higher score first
                    }

                    // 3. Same University Fallback
                    const aMatch = a.seller?.university === userUniversity;
                    const bMatch = b.seller?.university === userUniversity;
                    if (aMatch && !bMatch) return -1;
                    if (!aMatch && bMatch) return 1;

                    return 0;
                });

                setProducts(sorted);
                setFilteredProducts(sorted);

                // Extract categories
                const cats = ['All', ...new Set(sorted.map(p => p.category).filter(Boolean))];
                setCategories(cats);
            }
        } catch (err) {
            console.error("Catch Error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let filtered = products;

        // Filter by Search
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(p =>
                p.name?.toLowerCase().includes(query) ||
                p.description?.toLowerCase().includes(query) ||
                p.seller?.full_name?.toLowerCase().includes(query)
            );
        }

        // Filter by category
        if (selectedCategory !== 'All') {
            filtered = filtered.filter(p => p.category === selectedCategory);
        }

        // Filter by university
        if (selectedUniversity !== 'All') {
            filtered = filtered.filter(p => p.seller?.university === selectedUniversity);
        }

        setFilteredProducts(filtered);
    }, [selectedCategory, selectedUniversity, searchQuery, products]);

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
            // Increment clicks securely
            await supabase.rpc('increment_product_clicks', { product_id: product.id });

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
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
                <div>
                    <h1 className="text-4xl font-display font-medium mb-3 tracking-tight">Marketplace</h1>
                    <p className="text-gray-600 font-light text-lg">
                        {userUniversity && `Showing ${selectedUniversity === userUniversity ? 'your university' : 'all'} products`}
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                    {/* University Filter */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        {/* Search Bar */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 pr-4 py-2 rounded-full text-sm font-medium bg-white border-2 border-gray-200 hover:border-blue-400 focus:border-blue-500 focus:outline-none transition-colors w-full sm:w-64"
                            />
                        </div>

                        {/* University Filter */}
                        <div className="relative">
                            <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                            <select
                                value={selectedUniversity}
                                onChange={(e) => setSelectedUniversity(e.target.value)}
                                className="pl-10 pr-8 py-2 rounded-full text-sm font-medium bg-white border-2 border-gray-200 hover:border-blue-400 focus:border-blue-500 focus:outline-none transition-colors appearance-none cursor-pointer min-w-[200px]"
                            >
                                <option value="All">All Universities</option>
                                {nigerianUniversities.map(uni => (
                                    <option key={uni} value={uni}>{uni}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Category Filter */}
                    <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                        {categories.length > 0 ? categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
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
            </div>

            {filteredProducts.length === 0 ? (
                <div className="text-center py-24 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                    <p className="text-gray-400 font-light text-lg">No products found in this category.</p>
                    <button onClick={() => filterProducts('All')} className="mt-4 text-sm font-medium underline">View all products</button>
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-8">
                    {filteredProducts.map((product) => (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="group bg-white rounded-xl md:rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all duration-500"
                        >
                            {/* Image Container */}
                            <Link to={`/product/${product.id}`} className="block relative aspect-[4/5] bg-gray-100 overflow-hidden">
                                {product.image_url ? (
                                    <img
                                        src={product.image_url}
                                        alt={product.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-300 bg-gray-50">No Image</div>
                                )}

                                {/* Trending Badge (SnapHeat > 2.0 or lots of clicks) */}
                                {product.clicks > 15 && (
                                    <div className="absolute top-2 left-2 md:top-3 md:left-3 bg-orange-500 text-white text-[10px] md:text-xs font-semibold px-2 py-0.5 md:px-3 md:py-1 rounded-full flex items-center gap-1 shadow-lg z-10 animate-pulse">
                                        <Flame className="w-3 h-3 fill-white" />
                                        <span className="hidden md:inline">Hot</span>
                                    </div>
                                )}

                                {/* Same University Badge */}
                                {product.seller?.university === userUniversity && userUniversity && (
                                    <div className="absolute top-2 right-2 md:top-3 md:right-3 bg-blue-500 text-white text-[10px] md:text-xs font-semibold px-2 py-0.5 md:px-3 md:py-1 rounded-full flex items-center gap-1 shadow-lg z-10">
                                        <GraduationCap className="w-3 h-3" />
                                        <span className="hidden md:inline">Your Uni</span>
                                    </div>
                                )}

                                {/* Admin/Seller Analytics */}
                                {(user?.id === product.seller_id || user?.user_metadata?.role === 'admin') && (
                                    <div className="absolute top-2 left-2 md:top-3 md:left-3 bg-black/70 backdrop-blur-md text-white text-[10px] md:text-xs font-semibold px-2 py-1 rounded-md flex items-center gap-1 shadow-lg z-10">
                                        <span>👁️</span> {product.clicks || 0}
                                    </div>
                                )}

                                {/* Overlay Gradient */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                {/* Desktop Hover Action (Hidden on Mobile) */}
                                <div className="hidden md:flex absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 justify-between items-center bg-gradient-to-t from-black/60 to-transparent pt-12 pointer-events-none">
                                    <button
                                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleBuyNow(product); }}
                                        className="pointer-events-auto w-full bg-white text-black font-semibold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors shadow-lg"
                                    >
                                        <MessageCircle size={18} /> Buy on WhatsApp
                                    </button>
                                </div>
                            </Link>

                            {/* Info */}
                            <div className="p-3 md:p-5">
                                <Link to={`/product/${product.id}`} className="block">
                                    <div className="flex justify-between items-start mb-1 md:mb-2">
                                        <h3 className="font-medium text-sm md:text-lg text-gray-900 line-clamp-1 hover:underline">{product.name}</h3>
                                    </div>
                                </Link>

                                <div className="flex justify-between items-center mt-2 md:mt-3">
                                    <div className="flex flex-col">
                                        <div className="flex items-center gap-1">
                                            <span className="text-[10px] md:text-xs text-gray-500 mb-0.5">{product.seller?.full_name || 'Verified Seller'}</span>
                                            {product.seller?.is_verified && (
                                                <BadgeCheck size={14} className="text-blue-500 fill-blue-100" />
                                            )}
                                        </div>
                                        <span className="font-bold text-sm md:text-lg text-[var(--color-accent)]">
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
                    ))
                    }
                </div >
            )}
        </div >
    );
};

export default Marketplace;
