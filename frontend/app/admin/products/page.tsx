'use client';

import { useEffect, useState } from 'react';
import { productService } from '@/lib/api';
import { getAllForms, FormSchema } from '@/lib/formApi';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import DynamicFormRenderer from '@/components/DynamicFormRenderer';

interface Product {
    id?: number;
    name: string;
    description: string;
    category: string;
    brand: string;
    sku: string;
    price: number | '';
    stock: number | '';
    imageUrl?: string;
    weight?: number | '';
    dimensions?: string;
}

export default function AdminProductsPage() {
    const { data: session } = useSession();
    const [products, setProducts] = useState<Product[]>([]);
    const [form, setForm] = useState<Product>({
        name: '',
        description: '',
        category: '',
        brand: '',
        sku: '',
        price: '',
        stock: '',
        imageUrl: '',
        weight: '',
        dimensions: ''
    });
    const [editingId, setEditingId] = useState<number | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Dynamic form state
    const [useDynamicForm, setUseDynamicForm] = useState(false);
    const [availableForms, setAvailableForms] = useState<FormSchema[]>([]);
    const [selectedFormId, setSelectedFormId] = useState<number | null>(null);
    const [selectedFormSchema, setSelectedFormSchema] = useState<any>(null);

    useEffect(() => {
        if (session) {
            fetchProducts();
            fetchAvailableForms();
        }
    }, [session]);

    const fetchProducts = async () => {
        try {
            const response = await productService.get('/products');
            setProducts(response.data);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load products");
        }
    };

    const fetchAvailableForms = async () => {
        try {
            const forms = await getAllForms();
            setAvailableForms(forms);
            if (forms.length > 0 && forms[0].id) {
                setSelectedFormId(forms[0].id);
            }
        } catch (error) {
            console.error('Failed to fetch forms:', error);
        }
    };

    useEffect(() => {
        if (selectedFormId) {
            const form = availableForms.find(f => f.id === selectedFormId);
            if (form) {
                try {
                    setSelectedFormSchema(JSON.parse(form.schemaJson));
                } catch (e) {
                    console.error('Failed to parse form schema:', e);
                }
            }
        }
    }, [selectedFormId, availableForms]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const payload = {
            ...form,
            price: Number(form.price),
            stock: Number(form.stock),
            weight: form.weight ? Number(form.weight) : undefined
        };
        try {
            if (editingId) {
                await productService.put(`/products/${editingId}`, payload);
                toast.success("Product updated!");
            } else {
                await productService.post('/products', payload);
                toast.success("Product created!");
            }
            resetForm();
            fetchProducts();
            setIsModalOpen(false);
        } catch (error) {
            console.error(error);
            toast.error('Operation failed. Check permissions.');
        }
    };

    const handleDynamicFormSubmit = async (formData: Record<string, any>) => {
        if (!selectedFormId) {
            toast.error('No form selected');
            return;
        }

        try {
            const payload = {
                ...formData,
                _schemaJson: JSON.stringify(selectedFormSchema)
            };

            await productService.post(`/products/from-form?formId=${selectedFormId}`, payload);
            toast.success('Product created from form!');
            resetForm();
            fetchProducts();
            setIsModalOpen(false);
        } catch (error: any) {
            console.error('Form submission error:', error);
            const errorMsg = error.response?.data?.error || 'Failed to create product from form';
            toast.error(errorMsg);
        }
    };

    const handleEdit = (product: any) => {
        setForm(product);
        setEditingId(product.id);
        setUseDynamicForm(false);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Delete this product?')) return;
        try {
            await productService.delete(`/products/${id}`);
            toast.success('Product deleted!');
            fetchProducts();
        } catch (error) {
            console.error(error);
            toast.error('Delete failed');
        }
    };

    const resetForm = () => {
        setForm({
            name: '',
            description: '',
            category: '',
            brand: '',
            sku: '',
            price: '',
            stock: '',
            imageUrl: '',
            weight: '',
            dimensions: ''
        });
        setEditingId(null);
        setUseDynamicForm(false);
    };

    const totalInventory = products.reduce((sum, p) => sum + (p.stock || 0), 0);
    const lowStockCount = products.filter(p => (p.stock || 0) < 5).length;
    const totalValue = products.reduce((sum, p) => sum + ((p.price || 0) * (p.stock || 0)), 0);

    if (!session) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
                <p className="text-xl text-gray-600">Please sign in to access admin panel</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 py-8">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-5xl font-extrabold bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent mb-2">
                        📦 Product Dashboard
                    </h1>
                    <p className="text-gray-600 text-lg">Manage your product inventory and catalog</p>
                </div>

                {/* Analytics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg p-6 text-white transform hover:scale-105 transition-all duration-300">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-sm font-medium opacity-90">Total Products</h3>
                            <svg className="w-8 h-8 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                        </div>
                        <p className="text-4xl font-bold">{products.length}</p>
                    </div>

                    <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-lg p-6 text-white transform hover:scale-105 transition-all duration-300">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-sm font-medium opacity-90">Total Inventory</h3>
                            <svg className="w-8 h-8 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                            </svg>
                        </div>
                        <p className="text-4xl font-bold">{totalInventory}</p>
                    </div>

                    <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl shadow-lg p-6 text-white transform hover:scale-105 transition-all duration-300">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-sm font-medium opacity-90">Low Stock Alerts</h3>
                            <svg className="w-8 h-8 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <p className="text-4xl font-bold">{lowStockCount}</p>
                    </div>

                    <div className="bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl shadow-lg p-6 text-white transform hover:scale-105 transition-all duration-300">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-sm font-medium opacity-90">Asset Value</h3>
                            <svg className="w-8 h-8 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <p className="text-4xl font-bold">${totalValue.toFixed(0)}</p>
                    </div>
                </div>

                {/* Add Product Button */}
                <div className="mb-6">
                    <button
                        onClick={() => { resetForm(); setIsModalOpen(true); }}
                        className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center space-x-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        <span>Add New Product</span>
                    </button>
                </div>

                {/* Products Table */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-semibold">Product</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold">Brand</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold">Category</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold">Price</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold">Stock</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {products.map((product) => (
                                    <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-lg flex items-center justify-center text-white font-bold">
                                                    {product.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-900">{product.name}</p>
                                                    <p className="text-sm text-gray-500">{product.sku}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-700">{product.brand}</td>
                                        <td className="px-6 py-4">
                                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                                                {product.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-lg font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                                                ${product.price}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-2">
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${(product.stock || 0) === 0
                                                        ? 'bg-red-100 text-red-800'
                                                        : (product.stock || 0) < 5
                                                            ? 'bg-orange-100 text-orange-800'
                                                            : 'bg-green-100 text-green-800'
                                                    }`}>
                                                    {product.stock || 0}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => handleEdit(product)}
                                                    className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(product.id!)}
                                                    className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                            {/* Modal Header */}
                            <div className="px-6 py-5 bg-gradient-to-r from-indigo-600 to-purple-600 border-b border-indigo-700 flex justify-between items-center sticky top-0">
                                <h3 className="text-xl font-bold text-white flex items-center">
                                    <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                    </svg>
                                    {editingId ? 'Edit Product' : 'Add New Product'}
                                </h3>
                                <button onClick={() => setIsModalOpen(false)} className="text-white hover:text-gray-200 transition-colors">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <div className="p-6">
                                {/* Dynamic Form Toggle */}
                                {!editingId && (
                                    <div className="mb-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border-2 border-indigo-200">
                                        <label className="flex items-center space-x-3 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={useDynamicForm}
                                                onChange={(e) => setUseDynamicForm(e.target.checked)}
                                                className="w-5 h-5 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500"
                                            />
                                            <span className="font-semibold text-gray-700 flex items-center">
                                                <svg className="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                                Use Dynamic Form Builder
                                            </span>
                                        </label>
                                        {useDynamicForm && availableForms.length > 0 && (
                                            <div className="mt-3">
                                                <select
                                                    value={selectedFormId || ''}
                                                    onChange={(e) => setSelectedFormId(Number(e.target.value))}
                                                    className="w-full border-2 border-indigo-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                                >
                                                    {availableForms.map(f => (
                                                        <option key={f.id} value={f.id}>{f.title}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Form Content */}
                                {useDynamicForm && selectedFormSchema ? (
                                    <DynamicFormRenderer
                                        schema={selectedFormSchema}
                                        onSubmit={handleDynamicFormSubmit}
                                    />
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Product Name *</label>
                                            <input
                                                className="w-full border-2 border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                                placeholder="Enter product name"
                                                value={form.name}
                                                onChange={e => setForm({ ...form, name: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                                            <textarea
                                                className="w-full border-2 border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                                placeholder="Enter product description"
                                                rows={3}
                                                value={form.description}
                                                onChange={e => setForm({ ...form, description: e.target.value })}
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">Category *</label>
                                                <input
                                                    className="w-full border-2 border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                                    placeholder="e.g., Electronics"
                                                    value={form.category}
                                                    onChange={e => setForm({ ...form, category: e.target.value })}
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">Brand *</label>
                                                <input
                                                    className="w-full border-2 border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                                    placeholder="Enter brand name"
                                                    value={form.brand}
                                                    onChange={e => setForm({ ...form, brand: e.target.value })}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">SKU *</label>
                                            <input
                                                className="w-full border-2 border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                                placeholder="Product code/SKU"
                                                value={form.sku}
                                                onChange={e => setForm({ ...form, sku: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">Price ($) *</label>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    className="w-full border-2 border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                                    placeholder="0.00"
                                                    value={form.price}
                                                    onChange={e => setForm({ ...form, price: e.target.value })}
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">Stock *</label>
                                                <input
                                                    type="number"
                                                    className="w-full border-2 border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                                    placeholder="0"
                                                    value={form.stock}
                                                    onChange={e => setForm({ ...form, stock: e.target.value })}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Image URL</label>
                                            <input
                                                className="w-full border-2 border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                                placeholder="https://..."
                                                value={form.imageUrl}
                                                onChange={e => setForm({ ...form, imageUrl: e.target.value })}
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">Weight (kg)</label>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    className="w-full border-2 border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                                    placeholder="0.00"
                                                    value={form.weight}
                                                    onChange={e => setForm({ ...form, weight: e.target.value })}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">Dimensions (L x W x H)</label>
                                                <input
                                                    className="w-full border-2 border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                                    placeholder="10 x 5 x 3 cm"
                                                    value={form.dimensions}
                                                    onChange={e => setForm({ ...form, dimensions: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                        <div className="flex space-x-3 pt-4">
                                            <button
                                                type="submit"
                                                className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                                            >
                                                {editingId ? 'Update Product' : 'Create Product'}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setIsModalOpen(false)}
                                                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </form>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
