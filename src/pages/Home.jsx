import React, { useEffect, useState } from 'react';
import { ArrowRight, ShoppingBag, Star, TrendingUp, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import supabase from '../lib/supabase';

const Home = () => {
    const [banners, setBanners] = useState([]);
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const fetchBanners = async () => {
            if (!supabase) return;
            // We can only query if we have the table. 
            // If table empty or error, we default to empty array
            try {
                const { data, error } = await supabase
                    .from('banners')
                    .select('*')
                    .eq('is_active', true)
                    .order('created_at', { ascending: false });

                if (!error && data) {
                    setBanners(data);
                }
            } catch (err) {
                console.error("Error fetching banners:", err);
            }
        };
        fetchBanners();
    }, []);

    // Auto-slide effect
    useEffect(() => {
        if (banners.length <= 1) return;
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % banners.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [banners.length]);

    const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % banners.length);
    const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);

    return (
        <div className="pt-16 pb-20">
            {/* Hero Section / Banner Slider */}
            <div className="relative w-full h-[500px] bg-gray-900 overflow-hidden">
                {banners.length > 0 ? (
                    <>
                        {/* Slides Container */}
                        <div
                            className="flex h-full w-full transition-transform duration-700 ease-in-out"
                            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                        >
                            {banners.map((banner) => (
                                <div key={banner.id} className="w-full h-full flex-shrink-0 relative">
                                    {banner.image_url ? (
                                        <>
                                            <div className="absolute inset-0 bg-black/40 z-10" /> {/* Overlay */}
                                            <img
                                                src={banner.image_url}
                                                alt={banner.title}
                                                className="w-full h-full object-cover"
                                            />
                                        </>
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-gray-800 to-black" />
                                    )}

                                    <div className="absolute inset-0 z-20 flex items-center justify-center text-center px-4">
                                        <div className="max-w-4xl animate-fade-in-up">
                                            <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-6 drop-shadow-lg leading-tight">
                                                {banner.title}
                                            </h1>
                                            {/* We don't have a specific 'message' column in previous steps, mostly just title. 
                                                But if we added one, display it. For now using title as main hook. */}

                                            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                                                <Link to="/marketplace" className="inline-flex items-center justify-center gap-2 bg-white text-black px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg">
                                                    <ShoppingBag size={20} /> Start Shopping
                                                </Link>
                                                <Link to="/apply-seller" className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm border border-white/30 text-white px-8 py-3 rounded-full font-semibold hover:bg-white/20 transition-all">
                                                    Become a Seller
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Controls (Only if > 1 slide) */}
                        {banners.length > 1 && (
                            <>
                                <div className="absolute inset-0 flex items-center justify-between px-4 pointer-events-none">
                                    <button
                                        onClick={prevSlide}
                                        className="pointer-events-auto w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 text-white transition-all duration-300 group"
                                        aria-label="Previous slide"
                                    >
                                        <ChevronLeft size={20} className="group-hover:-translate-x-0.5 transition-transform" />
                                    </button>
                                    <button
                                        onClick={nextSlide}
                                        className="pointer-events-auto w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 text-white transition-all duration-300 group"
                                        aria-label="Next slide"
                                    >
                                        <ChevronRight size={20} className="group-hover:translate-x-0.5 transition-transform" />
                                    </button>
                                </div>

                                {/* Modern Line Indicators */}
                                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-3">
                                    {banners.map((_, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setCurrentSlide(idx)}
                                            className="group py-2" // Larger hit area
                                            aria-label={`Go to slide ${idx + 1}`}
                                        >
                                            <div className={`h-1 rounded-full transition-all duration-500 ${currentSlide === idx
                                                    ? 'bg-white w-8 shadow-[0_0_10px_rgba(255,255,255,0.5)]'
                                                    : 'bg-white/30 w-4 group-hover:bg-white/50'
                                                }`} />
                                        </button>
                                    ))}
                                </div>
                            </>
                        )}
                    </>
                ) : (
                    // Fallback Hero
                    <div className="w-full h-full bg-black relative group overflow-hidden">
                        <img
                            src="https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
                            alt="Fashion Hero"
                            className="absolute inset-0 w-full h-full object-cover opacity-60 scale-105 group-hover:scale-110 transition-transform duration-[2s]"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent" />

                        <div className="absolute inset-0 flex items-center justify-center text-center px-4 pt-12">
                            <div className="max-w-4xl animate-fade-in-up">
                                <span className="inline-block py-1 px-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-medium tracking-wider mb-6 uppercase">
                                    Premium Marketplace
                                </span>
                                <h1 className="text-5xl md:text-7xl font-display font-medium text-white mb-6 tracking-tight leading-tight">
                                    Discover <span className="italic font-light">Extraordinary</span>
                                </h1>
                                <p className="text-lg text-gray-300 mb-10 max-w-xl mx-auto font-light leading-relaxed">
                                    Curated collections from the city's best independent sellers. Shop unique pieces you won't find anywhere else.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-5 justify-center">
                                    <Link to="/marketplace" className="inline-flex items-center justify-center gap-2 bg-white text-black px-8 py-3.5 rounded-full text-sm font-medium hover:bg-gray-100 transition-all hover:shadow-lg hover:-translate-y-0.5">
                                        Shop Collection
                                    </Link>
                                    <Link to="/apply-seller" className="inline-flex items-center justify-center gap-2 bg-white/5 backdrop-blur-sm border border-white/20 text-white px-8 py-3.5 rounded-full text-sm font-medium hover:bg-white/10 transition-all hover:-translate-y-0.5">
                                        Apply as Seller
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Features Section */}
            <div className="container mx-auto px-4 py-20">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="p-8 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 mb-6">
                            <ShoppingBag className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold mb-3">Curated Marketplace</h3>
                        <p className="text-[var(--color-text-muted)]">Browse thousands of products from vetted local sellers.</p>
                    </div>
                    <div className="p-8 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center text-purple-600 mb-6">
                            <Star className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold mb-3">Verified Sellers</h3>
                        <p className="text-[var(--color-text-muted)]">Shop with confidence knowing all sellers are verified.</p>
                    </div>
                    <div className="p-8 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 bg-pink-50 rounded-full flex items-center justify-center text-pink-600 mb-6">
                            <TrendingUp className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold mb-3">Start Selling</h3>
                        <p className="text-[var(--color-text-muted)]">Join SnapCart and reach customers across the country.</p>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <section className="bg-gray-900 text-white py-24">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-4xl font-display font-bold mb-6">Ready to start selling?</h2>
                    <p className="text-gray-400 mb-8 max-w-xl mx-auto">Create your store today and join our growing community of successful entrepreneurs.</p>
                    <Link to="/apply-seller" className="inline-flex items-center gap-2 bg-white text-black px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors">
                        Create Seller Account <ArrowRight size={18} />
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default Home;
