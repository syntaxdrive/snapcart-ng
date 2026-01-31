import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import supabase from '../lib/supabase';
import { ArrowLeft, MessageCircle, MapPin, User, BadgeCheck } from 'lucide-react';

const ProductDetails = () => {
    const { productId } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            const { data, error } = await supabase
                .from('products')
                .select(`
                    *,
                    seller:profiles!seller_id(
                        full_name,
                        university,
                        role,
                        whatsapp_number,
                        is_verified
                    )
                `)
                .eq('id', productId)
                .single();

            if (error) console.error(error);
            if (data) setProduct(data);
            setLoading(false);
        };

        fetchProduct();
    }, [productId]);

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    if (!product) {
        return <div className="min-h-screen flex items-center justify-center">Product not found</div>;
    }

    const whatsappLink = `https://wa.me/${product.seller?.whatsapp_number}?text=Hi, I'm interested in your product: ${product.name} on SnapCart.`;

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            <Link to="/marketplace" className="inline-flex items-center text-gray-500 hover:text-black mb-6">
                <ArrowLeft size={20} className="mr-2" /> Back to Marketplace
            </Link>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                {/* Image Section */}
                <div className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden p-2">
                    <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-96 md:h-[500px] object-cover rounded-lg"
                    />
                </div>

                {/* Info Section */}
                <div className="space-y-6">
                    <div>
                        <span className="inline-block bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-medium mb-3 border border-gray-200">
                            {product.category || 'Item'}
                        </span>
                        <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-2">
                            {product.name}
                        </h1>
                        <p className="text-2xl font-bold text-[#FF6B00]">
                            ₦{product.price?.toLocaleString()}
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-xl border-2 border-gray-200 space-y-4">
                        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center border border-gray-200">
                                    <User size={24} className="text-gray-400" />
                                </div>
                                <div>
                                    <p className="font-bold text-gray-900 flex items-center gap-1">
                                        {product.seller?.full_name}
                                        {product.seller?.is_verified && <BadgeCheck size={18} className="text-blue-500 fill-blue-100" />}
                                    </p>
                                    <p className="text-sm text-gray-500 flex items-center gap-1">
                                        <MapPin size={12} /> {product.seller?.university}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="font-bold text-sm text-gray-900 mb-2">Description</h3>
                            <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                                {product.description}
                            </p>
                        </div>

                        <div className="pt-4">
                            <a
                                href={whatsappLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2 w-full bg-[#25D366] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#128C7E] transition-all transform hover:scale-[1.02] shadow-lg shadow-green-100"
                            >
                                <MessageCircle size={24} /> Chat on WhatsApp
                            </a>
                        </div>
                    </div>

                    {/* Safety Tip */}
                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-sm text-blue-800">
                        <p className="font-bold mb-1">Safety Tip:</p>
                        Always meet in a public place on campus. Never transfer money before inspecting the item.
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
