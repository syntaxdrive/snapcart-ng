import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import supabase from '../lib/supabase';
import { Package, Plus, X } from 'lucide-react';

const SellerDashboard = () => {
    const { user, role, loading: authLoading } = useAuth();
    const navigate = useNavigate();

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('Fashion');
    const [imageFile, setImageFile] = useState(null);
    const [uploading, setUploading] = useState(false);

    const categories = ['Fashion', 'Electronics', 'Home', 'Beauty', 'Sports', 'Other'];

    useEffect(() => {
        if (!authLoading) {
            if (!user) {
                navigate('/auth');
            } else if (role !== 'seller') {
                alert('Seller access only');
                navigate('/');
            } else {
                loadProducts();
            }
        }
    }, [user, role, authLoading]);

    const loadProducts = async () => {
        setLoading(true);
        const { data } = await supabase
            .from('products')
            .select('*')
            .eq('seller_id', user.id)
            .order('created_at', { ascending: false });
        setProducts(data || []);
        setLoading(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUploading(true);

        let imageUrl = null;
        if (imageFile) {
            const fileName = `${Date.now()}.${imageFile.name.split('.').pop()}`;
            const { error: uploadError } = await supabase.storage
                .from('products')
                .upload(fileName, imageFile);

            if (!uploadError) {
                const { data } = supabase.storage.from('products').getPublicUrl(fileName);
                imageUrl = data.publicUrl;
            }
        }

        const productData = {
            name,
            description,
            price: parseFloat(price),
            category,
            currency: '₦',
            seller_id: user.id,
            ...(imageUrl && { image_url: imageUrl })
        };

        if (editingId) {
            // Update existing
            await supabase
                .from('products')
                .update(productData)
                .eq('id', editingId);
        } else {
            // Create new
            await supabase
                .from('products')
                .insert([{ ...productData, image_url: imageUrl }]);
        }

        // Reset form
        setName('');
        setDescription('');
        setPrice('');
        setCategory('Fashion');
        setImageFile(null);
        setEditingId(null);
        setShowForm(false);
        setUploading(false);
        loadProducts();
    };

    const handleEdit = (product) => {
        setName(product.name);
        setDescription(product.description);
        setPrice(product.price.toString());
        setCategory(product.category || 'Fashion');
        setEditingId(product.id);
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this product?')) return;
        await supabase.from('products').delete().eq('id', id);
        loadProducts();
    };

    const cancelEdit = () => {
        setName('');
        setDescription('');
        setPrice('');
        setCategory('Fashion');
        setImageFile(null);
        setEditingId(null);
        setShowForm(false);
    };

    if (authLoading || loading) {
        return <div className="pt-32 text-center">Loading...</div>;
    }

    return (
        <div className="pt-24 px-4 container mx-auto pb-12">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Seller Dashboard</h1>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                >
                    {showForm ? <X size={20} /> : <Plus size={20} />}
                    {showForm ? 'Cancel' : 'Add Product'}
                </button>
            </div>

            {/* Product Form */}
            {showForm && (
                <div className="bg-white border p-6 rounded-xl mb-8">
                    <h2 className="text-xl font-bold mb-4">{editingId ? 'Edit Product' : 'Add New Product'}</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full border rounded-lg p-3"
                            placeholder="Product name"
                            required
                        />
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full border rounded-lg p-3"
                            placeholder="Description"
                            rows="3"
                            required
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <input
                                type="number"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                className="border rounded-lg p-3"
                                placeholder="Price"
                                required
                            />
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="border rounded-lg p-3"
                            >
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setImageFile(e.target.files[0])}
                            className="w-full"
                        />
                        <div className="flex gap-2">
                            <button
                                type="submit"
                                disabled={uploading}
                                className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold disabled:opacity-50"
                            >
                                {uploading ? 'Saving...' : (editingId ? 'Update Product' : 'Add Product')}
                            </button>
                            {editingId && (
                                <button
                                    type="button"
                                    onClick={cancelEdit}
                                    className="px-6 bg-gray-200 text-gray-700 rounded-lg"
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            )}

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map(product => (
                    <div key={product.id} className="bg-white border rounded-xl overflow-hidden">
                        <div className="aspect-square bg-gray-100">
                            {product.image_url && (
                                <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                            )}
                        </div>
                        <div className="p-4">
                            <h3 className="font-bold truncate">{product.name}</h3>
                            <div className="flex justify-between items-center mt-2 mb-3">
                                <p className="text-blue-600 font-medium">₦{product.price.toLocaleString()}</p>
                                <span className="text-xs bg-gray-100 px-2 py-1 rounded">{product.category}</span>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleEdit(product)}
                                    className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg text-sm font-semibold"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(product.id)}
                                    className="flex-1 bg-red-50 text-red-600 py-2 rounded-lg text-sm font-semibold"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {products.length === 0 && (
                <div className="text-center py-12 text-gray-400">
                    <Package size={48} className="mx-auto mb-4 opacity-50" />
                    <p>No products yet. Click "Add Product" to get started!</p>
                </div>
            )}
        </div>
    );
};

export default SellerDashboard;
