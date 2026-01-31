import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import supabase from '../lib/supabase';
import { BadgeCheck, Check, Mail, Megaphone, X, Trash2, Search } from 'lucide-react';

const AdminDashboard = () => {
    const { user, role, loading: authLoading } = useAuth();
    const navigate = useNavigate();

    const [applications, setApplications] = useState([]);
    const [activeSellers, setActiveSellers] = useState([]);
    const [banners, setBanners] = useState([]);
    const [bannerText, setBannerText] = useState('');
    const [bannerButtonText, setBannerButtonText] = useState('');
    const [bannerButtonLink, setBannerButtonLink] = useState('');
    const [bannerImage, setBannerImage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [toast, setToast] = useState(null);
    const [totalUsers, setTotalUsers] = useState(0);
    const [reports, setReports] = useState([]);
    const [analytics, setAnalytics] = useState({ daily: 0, weekly: 0, monthly: 0, average: 0 });
    const [recentProducts, setRecentProducts] = useState([]);
    const [productSearch, setProductSearch] = useState('');

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
            .select('*, profiles(email, full_name, is_verified, id)')
            .eq('status', 'approved');
        setActiveSellers(sellers || []);

        // Fetch banners
        const { data: bannersData } = await supabase
            .from('banners')
            .select('*')
            .order('created_at', { ascending: false });
        setBanners(bannersData || []);

        // Fetch User Count
        const { count: userCount } = await supabase
            .from('profiles')
            .select('*', { count: 'exact', head: true });
        setTotalUsers(userCount || 0);

        // Fetch Reports
        const { data: reportsData } = await supabase
            .from('reports')
            .select(`
                *,
                reporter:profiles!reporter_id(full_name, email)
            `)
            .order('created_at', { ascending: false });

        let mergedReports = [];
        if (reportsData && reportsData.length > 0) {
            // Fetch target names
            const targetIds = reportsData.map(r => r.target_id);
            const { data: targets } = await supabase.from('profiles').select('id, full_name, email').in('id', targetIds);

            mergedReports = reportsData.map(r => ({
                ...r,
                target: targets?.find(t => t.id === r.target_id)
            }));
        }
        setReports(mergedReports);

        // Fetch Analytics (Visits)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const { data: visits } = await supabase
            .from('analytics_logs')
            .select('created_at')
            .gte('created_at', thirtyDaysAgo.toISOString());

        if (visits) {
            const now = new Date();
            const oneDay = 24 * 60 * 60 * 1000;

            const daily = visits.filter(v => (now - new Date(v.created_at)) < oneDay).length;
            const weekly = visits.filter(v => (now - new Date(v.created_at)) < 7 * oneDay).length;
            const monthly = visits.length; // since we fetched 30 days
            const average = Math.round(monthly / 30); // simplistic average

            setAnalytics({ daily, weekly, monthly, average });
        }

        // Fetch Recent Products for Moderation (with search)
        let productQuery = supabase
            .from('products')
            .select('*, seller:profiles(full_name, university, email)')
            .order('created_at', { ascending: false })
            .limit(50);

        if (productSearch) {
            productQuery = productQuery.ilike('name', `%${productSearch}%`);
        }

        const { data: productsData } = await productQuery;
        setRecentProducts(productsData || []);

        setLoading(false);
    };

    // Re-fetch when search changes (debounced ideally, but direct effect is okay for admin panel size)
    useEffect(() => {
        if (!loading) {
            loadData();
        }
    }, [productSearch]);

    const handleDeleteProduct = async (productId) => {
        if (!confirm('Are you sure you want to delete this product? This cannot be undone.')) return;

        const { error } = await supabase.from('products').delete().eq('id', productId);
        if (error) {
            alert('Error deleting product: ' + error.message);
        } else {
            showToast('Product deleted successfully', 'success');
            loadData();
        }
    };

    const sendEmail = (type, email, name) => {
        if (!email) return;

        const subject = type === 'approve'
            ? '🎉 Your SnapCart Seller Application is Approved!'
            : 'Update on your SnapCart Seller Application';

        const body = type === 'approve'
            ? `Hi ${name}, \n\nCongratulations! Your application to become a seller on SnapCart has been approved.\n\nYou can now log in to your dashboard and start listing your products to the university community.\n\nLogin here: https://snapcart.com/auth\n\nBest regards,\nThe SnapCart Team`
            : `Hi ${name},\n\nThank you for your interest in selling on SnapCart. After reviewing your application, we are unable to approve it at this time.\n\nPlease ensure your business details are complete and try again later.\n\nBest regards,\nThe SnapCart Team`;

        window.open(`mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
    };

    const handleApprove = async (appId, userId, email, name) => {
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

        // Open email client
        if (confirm('Open email client to notify user?')) {
            sendEmail('approve', email, name);
        }
    };

    const handleReject = async (appId, email, name) => {
        if (!confirm('Reject this application?')) return;
        await supabase.from('seller_applications').delete().eq('id', appId); // Delete so they can reapply
        loadData();
        showToast('Application rejected', 'warning');

        if (confirm('Open email client to notify user?')) {
            sendEmail('reject', email, name);
        }
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
            button_text: bannerButtonText,
            button_link: bannerButtonLink,
            is_active: true
        }]);

        setBannerText('');
        setBannerButtonText('');
        setBannerButtonLink('');
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

    const handleToggleVerification = async (userId, currentStatus) => {
        const { error } = await supabase
            .from('profiles')
            .update({ is_verified: !currentStatus })
            .eq('id', userId);

        if (error) {
            showToast('Error updating verification: ' + error.message, 'warning');
        } else {
            showToast(currentStatus ? 'Seller Unverified' : 'Seller Verified!');
            loadData();
        }
    };

    const handleEmailAllUsers = async () => {
        if (!confirm('This will open your email client with all user emails in BCC. Continue?')) return;

        const { data, error } = await supabase
            .from('profiles')
            .select('email');

        if (error) {
            alert('Error fetching emails: ' + error.message);
            return;
        }

        const emails = data.map(u => u.email).filter(Boolean);
        if (emails.length === 0) {
            alert('No emails found');
            return;
        }

        // Batching for safety (mailto limits around 2000 chars)
        // We'll just do the first 50 for now or copy to clipboard
        const emailString = emails.join(',');

        // Copy to clipboard fallback
        navigator.clipboard.writeText(emailString).then(() => {
            alert(`Copied ${emails.length} emails to clipboard! Opening mail client...`);
        });

        const mailtoLink = `mailto:?bcc=${emailString}`;
        window.open(mailtoLink, '_self');
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

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                <div className="flex gap-4">
                    <button
                        onClick={handleEmailAllUsers}
                        className="bg-gray-900 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-2 hover:bg-gray-800 transition-colors"
                    >
                        <Mail /> Email All Users
                    </button>
                    <div className="bg-blue-600 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-2">
                        <span className="text-2xl font-bold">{totalUsers}</span>
                        <span className="text-sm font-light opacity-90">Total Users</span>
                    </div>
                </div>
            </div>

            {/* Analytics Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-white p-4 rounded-xl border shadow-sm">
                    <p className="text-gray-500 text-xs uppercase font-bold tracking-wider">Today</p>
                    <p className="text-3xl font-bold text-gray-900">{analytics.daily}</p>
                </div>
                <div className="bg-white p-4 rounded-xl border shadow-sm">
                    <p className="text-gray-500 text-xs uppercase font-bold tracking-wider">This Week</p>
                    <p className="text-3xl font-bold text-blue-600">{analytics.weekly}</p>
                </div>
                <div className="bg-white p-4 rounded-xl border shadow-sm">
                    <p className="text-gray-500 text-xs uppercase font-bold tracking-wider">This Month</p>
                    <p className="text-3xl font-bold text-purple-600">{analytics.monthly}</p>
                </div>
                <div className="bg-white p-4 rounded-xl border shadow-sm">
                    <p className="text-gray-500 text-xs uppercase font-bold tracking-wider">Avg. Daily</p>
                    <p className="text-3xl font-bold text-green-600">{analytics.average}</p>
                </div>
            </div >

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
                            placeholder="Banner message..."
                            required
                        />
                        <div className="grid grid-cols-2 gap-3 mb-3">
                            <input
                                type="text"
                                value={bannerButtonText}
                                onChange={(e) => setBannerButtonText(e.target.value)}
                                className="w-full border rounded-lg p-3"
                                placeholder="Button Text (e.g. Shop Now)"
                            />
                            <input
                                type="text"
                                value={bannerButtonLink}
                                onChange={(e) => setBannerButtonLink(e.target.value)}
                                className="w-full border rounded-lg p-3"
                                placeholder="Link (e.g. /marketplace)"
                            />
                        </div>
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
                                                onClick={() => handleApprove(app.id, app.user_id, app.profiles?.email, app.profiles?.full_name)}
                                                className="bg-green-500 text-white px-3 py-1 rounded text-sm"
                                            >
                                                <Check size={16} className="inline" /> Approve
                                            </button>
                                            <button
                                                onClick={() => handleReject(app.id, app.profiles?.email, app.profiles?.full_name)}
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
                                            <p className="font-bold text-sm flex items-center gap-1">
                                                {seller.business_name}
                                                {seller.profiles?.is_verified && (
                                                    <BadgeCheck size={14} className="text-blue-500 fill-blue-100" />
                                                )}
                                            </p>
                                            <p className="text-xs text-gray-500">{seller.profiles?.email}</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleToggleVerification(seller.profiles?.id, seller.profiles?.is_verified)}
                                                className={`text-xs px-3 py-1 rounded border ${seller.profiles?.is_verified
                                                    ? 'text-blue-600 border-blue-200 bg-blue-50'
                                                    : 'text-gray-600 border-gray-200 hover:bg-gray-100'
                                                    }`}
                                            >
                                                {seller.profiles?.is_verified ? 'Unverify' : 'Verify'}
                                            </button>
                                            <button
                                                onClick={() => handleRevoke(seller.id, seller.user_id)}
                                                className="text-xs text-red-600 bg-red-50 px-3 py-1 rounded"
                                            >
                                                Revoke
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Recent Products Moderation */}
            <div className="bg-white border p-6 rounded-xl mt-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
                    <h2 className="text-xl font-bold text-gray-900">Content Moderation</h2>
                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={productSearch}
                            onChange={(e) => setProductSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                {recentProducts.length === 0 ? (
                    <p className="text-gray-400 text-sm">No products found</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="text-xs text-gray-500 border-b">
                                    <th className="py-2">Product</th>
                                    <th className="py-2">Price</th>
                                    <th className="py-2">Seller</th>
                                    <th className="py-2">University</th>
                                    <th className="py-2">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentProducts.map(product => (
                                    <tr key={product.id} className="border-b last:border-0 hover:bg-gray-50">
                                        <td className="py-3 pr-4">
                                            <div className="flex items-center gap-3">
                                                {product.image_url ? (
                                                    <img src={product.image_url} alt="" className="w-10 h-10 rounded object-cover" />
                                                ) : <div className="w-10 h-10 bg-gray-100 rounded" />}
                                                <span className="font-medium text-sm line-clamp-1">{product.name}</span>
                                            </div>
                                        </td>
                                        <td className="py-3 text-sm">{product.currency}{product.price.toLocaleString()}</td>
                                        <td className="py-3 text-sm text-gray-600">
                                            {product.seller?.full_name} <br />
                                            <span className="text-xs text-gray-400">{product.seller?.email}</span>
                                        </td>
                                        <td className="py-3 text-sm text-gray-500">{product.seller?.university}</td>
                                        <td className="py-3">
                                            <button
                                                onClick={() => handleDeleteProduct(product.id)}
                                                className="text-red-500 hover:bg-red-50 p-2 rounded transition-colors"
                                                title="Delete Product"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Reports Section */}
            <div className="bg-white border p-6 rounded-xl mt-8">
                <h2 className="text-xl font-bold mb-4 text-red-600">User Reports</h2>
                {reports.length === 0 ? (
                    <p className="text-gray-400 text-sm">No active reports</p>
                ) : (
                    <div className="space-y-3">
                        {reports.map(report => (
                            <div key={report.id} className="border border-red-100 bg-red-50 rounded-lg p-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="font-bold text-sm text-gray-900">
                                            Report against: <span className="text-red-700">{report.target?.full_name || 'Unknown User'}</span>
                                        </p>
                                        <p className="text-xs text-gray-500 mb-2">Reported by: {report.reporter?.full_name} ({report.reporter?.email})</p>
                                        <div className="bg-white p-2 rounded border border-red-100 text-sm text-gray-700">
                                            "{report.reason}"
                                        </div>
                                    </div>
                                    <div className="text-xs text-gray-400">
                                        {new Date(report.created_at).toLocaleDateString()}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div >
    );
};

export default AdminDashboard;
