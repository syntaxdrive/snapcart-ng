import React, { useEffect, useState } from 'react';
import { ArrowRight, ShoppingBag, Star, TrendingUp, ChevronLeft, ChevronRight, GraduationCap, X, ShieldAlert } from 'lucide-react';
import { Link } from 'react-router-dom';
import supabase from '../lib/supabase';

const Home = () => {
    const [banners, setBanners] = useState([]);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [showSafetyToast, setShowSafetyToast] = useState(true);

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
                                                {banner.button_text ? (
                                                    <Link to={banner.button_link || '/marketplace'} className="inline-flex items-center justify-center gap-2 bg-white text-black px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg">
                                                        {banner.button_text} <ArrowRight size={20} />
                                                    </Link>
                                                ) : (
                                                    <>
                                                        <Link to="/marketplace" className="inline-flex items-center justify-center gap-2 bg-white text-black px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg">
                                                            <ShoppingBag size={20} /> Marketplace
                                                        </Link>
                                                        <Link to="/apply-seller" className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm border border-white/30 text-white px-8 py-3 rounded-full font-semibold hover:bg-white/20 transition-all">
                                                            Start Selling
                                                        </Link>
                                                    </>
                                                )}
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
                            src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
                            alt="University Campus Life"
                            className="absolute inset-0 w-full h-full object-cover opacity-60 scale-105 group-hover:scale-110 transition-transform duration-[2s]"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent" />

                        <div className="absolute inset-0 flex items-center justify-center text-center px-4 pt-12">
                            <div className="max-w-4xl animate-fade-in-up">
                                <span className="inline-flex items-center gap-2 py-1 px-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-medium tracking-wider mb-6 uppercase">
                                    <GraduationCap size={14} /> University Marketplace
                                </span>
                                <h1 className="text-5xl md:text-7xl font-display font-medium text-white mb-6 tracking-tight leading-tight">
                                    Your Campus. <span className="italic font-light">Your Marketplace.</span>
                                </h1>
                                <p className="text-lg text-gray-300 mb-10 max-w-xl mx-auto font-light leading-relaxed">
                                    Buy and sell directly with students on your campus. Connect, trade, and hustle within your university community.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-5 justify-center">
                                    <Link to="/marketplace" className="inline-flex items-center justify-center gap-2 bg-white text-black px-8 py-3.5 rounded-full text-sm font-medium hover:bg-gray-100 transition-all hover:shadow-lg hover:-translate-y-0.5">
                                        Marketplace
                                    </Link>
                                    <Link to="/apply-seller" className="inline-flex items-center justify-center gap-2 bg-white/5 backdrop-blur-sm border border-white/20 text-white px-8 py-3.5 rounded-full text-sm font-medium hover:bg-white/10 transition-all hover:-translate-y-0.5">
                                        Start Selling
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Features Section */}
            <div className="container mx-auto px-4 py-20">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold mb-3">Why SnapCart for Students?</h2>
                    <p className="text-gray-600">The #1 marketplace for Nigerian students</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-white border border-blue-100 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white mb-6 shadow-md">
                            <GraduationCap className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold mb-3">Campus Focused</h3>
                        <p className="text-gray-600">See products from students in your university first. Easy meetups on campus.</p>
                    </div>
                    <div className="p-8 rounded-2xl bg-gradient-to-br from-purple-50 to-white border border-purple-100 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white mb-6 shadow-md">
                            <Star className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold mb-3">Verified Student Sellers</h3>
                        <p className="text-gray-600">All sellers are vetted students or businesses. Shop with confidence.</p>
                    </div>
                    <div className="p-8 rounded-2xl bg-gradient-to-br from-pink-50 to-white border border-pink-100 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1">
                        <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-pink-600 rounded-full flex items-center justify-center text-white mb-6 shadow-md">
                            <TrendingUp className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold mb-3">Student Side Hustle</h3>
                        <p className="text-gray-600">Turn your skills into cash. Sell clothes, gadgets, food, or services to your peers.</p>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <section className="bg-gray-900 text-white py-24">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-4xl font-display font-bold mb-6">Want to make extra cash?</h2>
                    <p className="text-gray-400 mb-8 max-w-xl mx-auto">Start your own student business today. Zero fees for students.</p>
                    <Link to="/apply-seller" className="inline-flex items-center gap-2 bg-white text-black px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors">
                        Create Student Store <ArrowRight size={18} />
                    </Link>
                </div>
            </section>
            {/* Safety Toast */}
            {showSafetyToast && (
                <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-8 md:w-96 bg-white border border-l-4 border-l-orange-500 rounded-lg shadow-2xl p-4 z-50 animate-fade-in-up">
                    <div className="flex justify-between items-start gap-3">
                        <div className="flex-shrink-0 bg-orange-100 p-2 rounded-full">
                            <ShieldAlert className="text-orange-600 w-5 h-5" />
                        </div>
                        <div className="flex-1">
                            <h4 className="font-bold text-gray-900 text-sm mb-1">Stay Safe on SnapCart</h4>
                            <ul className="text-xs text-gray-600 space-y-1 list-disc pl-4">
                                <li>Meet in public places (Student Centre, etc).</li>
                                <li>Inspect items before paying.</li>
                                <li>Avoid transferring money before meeting.</li>
                            </ul>
                        </div>
                        <button
                            onClick={() => setShowSafetyToast(false)}
                            className="text-gray-400 hover:text-gray-600 p-1"
                        >
                            <X size={16} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;
