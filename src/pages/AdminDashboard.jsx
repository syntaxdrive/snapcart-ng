import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import supabase from '../lib/supabase';
import { Check, X, Megaphone } from 'lucide-react';

const AdminDashboard = () => {
    const { user, role, loading: authLoading } = useAuth();
    const navigate = useNavigate();

    const [applications, setApplications] = useState([]);
    const [activeSellers, setActiveSellers] = useState([]);
    const [banners, setBanners] = useState([]);
    const [bannerText, setBannerText] = useState('');
    const [bannerImage, setBannerImage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [toast, setToast] = useState(null);

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000); // Auto dismiss after 3 seconds
    };

    useEffect(() => {
        if (!authLoading) {
            if (!user) {
                navigate('/auth');
            } else if (role !== 'admin') {
                alert('Admin access only');
                navigate('/');
            } else {
                loadData();
            }
        }
    }, [user, role, authLoading]);

    const loadData = async () => {
        setLoading(true);

        // Fetch pending applications
        const { data: apps } = await supabase
            .from('seller_applications')
            .select('*, profiles(email, full_name)')
            .eq('status', 'pending');
        setApplications(apps || []);

        // Fetch active sellers
        const { data: sellers } = await supabase
            .from('seller_applications')
            .select('*, profiles(email, full_name)')
            .eq('status', 'approved');
        setActiveSellers(sellers || []);

        // Fetch banners
        const { data: bannersData } = await supabase
            .from('banners')
            .select('*')
            .order('created_at', { ascending: false });
        setBanners(bannersData || []);

        setLoading(false);
    };

    const handleApprove = async (appId, userId) => {
        // Update application status
        const { error: appError } = await supabase
            .from('seller_applications')
            .update({ status: 'approved' })
            .eq('id', appId);

        if (appError) {
            showToast('Error approving application: ' + appError.message, 'warning');
            return;
        }

        // Update user role
        const { error: roleError } = await supabase
            .from('profiles')
            .update({ role: 'seller' })
            .eq('id', userId);

        if (roleError) {
            showToast('Error updating user role: ' + roleError.message, 'warning');
            return;
        }

        loadData();
        showToast('✅ Seller approved successfully!');
    };

    const handleReject = async (appId) => {
        await supabase.from('seller_applications').update({ status: 'rejected' }).eq('id', appId);
        loadData();
        showToast('Application rejected', 'warning');
    };

    const handleRevoke = async (appId, userId) => {
        if (!confirm('Remove seller privileges?')) return;
        await supabase.from('seller_applications').update({ status: 'rejected' }).eq('id', appId);
        await supabase.from('profiles').update({ role: 'user' }).eq('id', userId);
        loadData();
        showToast('Seller privileges revoked', 'warning');
    };

    const handlePostBanner = async (e) => {
        e.preventDefault();
        setUploading(true);

        let imageUrl = null;
        if (bannerImage) {
            const fileName = `${Date.now()}.${bannerImage.name.split('.').pop()}`;
            const { error: uploadError } = await supabase.storage
                .from('banners')
                .upload(fileName, bannerImage);

            if (!uploadError) {
                const { data } = supabase.storage.from('banners').getPublicUrl(fileName);
                imageUrl = data.publicUrl;
            }
        }

        await supabase.from('banners').insert([{
            title: bannerText,
            image_url: imageUrl,
            is_active: true
        }]);

        setBannerText('');
        setBannerImage(null);
        setUploading(false);
        loadData();
        alert('Banner posted!');
    };

    const handleDeleteBanner = async (id) => {
        if (!confirm('Delete banner?')) return;
        await supabase.from('banners').delete().eq('id', id);
        loadData();
    };

    const handleToggleBanner = async (id, currentStatus) => {
        await supabase.from('banners').update({ is_active: !currentStatus }).eq('id', id);
        loadData();
    };

    if (authLoading || loading) {
        return <div className="pt-32 text-center">Loading...</div>;
    }

    return (
        <div className="pt-24 px-4 container mx-auto pb-12">
            {/* Toast Notification */}
            {toast && (
                <div className={`fixed top-20 right-4 z-50 px-6 py-3 rounded-lg shadow-lg animate-fade-in ${toast.type === 'success' ? 'bg-green-500 text-white' : 'bg-yellow-500 text-white'
                    }`}>
                    {toast.message}
                </div>
            )}

            <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Banners */}
                <div className="bg-white border p-6 rounded-xl">
                    <div className="flex items-center gap-2 mb-4">
                        <Megaphone className="text-blue-600" />
                        <h2 className="text-xl font-bold">Banners</h2>
                    </div>

                    <form onSubmit={handlePostBanner} className="mb-6 pb-6 border-b">
                        <input
                            type="text"
                            value={bannerText}
                            onChange={(e) => setBannerText(e.target.value)}
                            className="w-full border rounded-lg p-3 mb-3"
                            placeholder="Banner text..."
                            required
                        />
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setBannerImage(e.target.files[0])}
                            className="w-full mb-3"
                        />
                        <button
                            type="submit"
                            disabled={uploading}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg w-full"
                        >
                            {uploading ? 'Uploading...' : 'Post Banner'}
                        </button>
                    </form>

                    <div className="space-y-3">
                        {banners.map(banner => (
                            <div key={banner.id} className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                                {banner.image_url && <img src={banner.image_url} alt="" className="w-16 h-16 object-cover rounded" />}
                                <div className="flex-1">
                                    <p className="font-medium text-sm">{banner.title}</p>
                                    <p className={`text-xs ${banner.is_active ? 'text-green-600' : 'text-gray-400'}`}>
                                        {banner.is_active ? 'Active' : 'Inactive'}
                                    </p>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <button onClick={() => handleToggleBanner(banner.id, banner.is_active)} className="text-xs text-blue-600">
                                        {banner.is_active ? 'Hide' : 'Show'}
                                    </button>
                                    <button onClick={() => handleDeleteBanner(banner.id)} className="text-xs text-red-600">
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Applications & Sellers */}
                <div className="space-y-8">
                    {/* Pending Applications */}
                    <div className="bg-white border p-6 rounded-xl">
                        <h2 className="text-xl font-bold mb-4">Pending Applications</h2>
                        {applications.length === 0 ? (
                            <p className="text-gray-400 text-sm">No pending applications</p>
                        ) : (
                            <div className="space-y-3">
                                {applications.map(app => (
                                    <div key={app.id} className="border rounded-lg p-4">
                                        <h3 className="font-bold">{app.business_name}</h3>
                                        <p className="text-sm text-gray-600 mb-2">{app.business_description}</p>
                                        <p className="text-xs text-gray-400 mb-3">{app.profiles?.email}</p>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleApprove(app.id, app.user_id)}
                                                className="bg-green-500 text-white px-3 py-1 rounded text-sm"
                                            >
                                                <Check size={16} className="inline" /> Approve
                                            </button>
                                            <button
                                                onClick={() => handleReject(app.id)}
                                                className="bg-gray-200 text-gray-700 px-3 py-1 rounded text-sm"
                                            >
                                                <X size={16} className="inline" /> Reject
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Active Sellers */}
                    <div className="bg-white border p-6 rounded-xl">
                        <h2 className="text-xl font-bold mb-4">Active Sellers</h2>
                        {activeSellers.length === 0 ? (
                            <p className="text-gray-400 text-sm">No active sellers</p>
                        ) : (
                            <div className="space-y-2">
                                {activeSellers.map(seller => (
                                    <div key={seller.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                        <div>
                                            <p className="font-bold text-sm">{seller.business_name}</p>
                                            <p className="text-xs text-gray-500">{seller.profiles?.email}</p>
                                        </div>
                                        <button
                                            onClick={() => handleRevoke(seller.id, seller.user_id)}
                                            className="text-xs text-red-600 bg-red-50 px-3 py-1 rounded"
                                        >
                                            Revoke
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
