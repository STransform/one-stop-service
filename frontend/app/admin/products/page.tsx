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
    const [availableForms, setAvailableForms] = useState<FormSchema[]>([]);
    const [selectedFormId, setSelectedFormId] = useState<number | null>(null);
    const [selectedFormSchema, setSelectedFormSchema] = useState<any>(null);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    useEffect(() => {
        if (session) {
            fetchProducts();
            fetchAvailableForms();
        }
    }, [session]);

    const getAuthConfig = () => ({
        headers: { Authorization: `Bearer ${session?.accessToken}` }
    });

    const fetchProducts = async () => {
        if (!session?.accessToken) return;
        try {
            const response = await productService.get('/products', getAuthConfig());
            setProducts(response.data);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load products");
        }
    };

    const fetchAvailableForms = async () => {
        try {
            const forms = await getAllForms('PRODUCT');
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
        const config = getAuthConfig();
        try {
            if (editingId) {
                await productService.put(`/products/${editingId}`, payload, config);
                toast.success("Product updated!");
            } else {
                await productService.post('/products', payload, config);
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

        if (!session?.accessToken) {
            toast.error('Session expired or invalid. Please login again.');
            return;
        }

        const loadingToast = toast.loading('Creating product...');
        try {
            const payload = {
                ...formData,
                _schemaJson: JSON.stringify(selectedFormSchema)
            };

            await productService.post(`/products/from-form?formId=${selectedFormId}`, payload, getAuthConfig());
            toast.success('Product created from form!', { id: loadingToast });
            resetForm();
            fetchProducts();
            setIsModalOpen(false);
        } catch (error: any) {
            console.error('Form submission error:', error);
            const errorMsg = error.response?.data?.error || 'Failed to create product from form';
            toast.error(errorMsg, { id: loadingToast });
        }
    };

    const handleEdit = (product: any) => {
        setForm(product);
        setEditingId(product.id);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Delete this product?')) return;
        try {
            await productService.delete(`/products/${id}`, getAuthConfig());
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
    };

    const totalInventory = products.reduce((sum, p) => sum + (p.stock || 0), 0);
    const lowStockCount = products.filter(p => (p.stock || 0) < 5).length;
    const totalValue = products.reduce((sum, p) => sum + ((p.price || 0) * (p.stock || 0)), 0);

    return (
        <div className="animate-fade-in">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-4xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                    📦 Product Management
                </h1>
                <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>Manage your product inventory and catalog</p>
            </div>

            {/* Analytics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-indigo-500" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Total Products</p>
                            <p className="text-3xl font-bold mt-2" style={{ color: 'var(--text-primary)' }}>{products.length}</p>
                        </div>
                        <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                            <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-emerald-500" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Total Inventory</p>
                            <p className="text-3xl font-bold mt-2" style={{ color: 'var(--text-primary)' }}>{totalInventory}</p>
                        </div>
                        <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                            <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-orange-500" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Low Stock Alerts</p>
                            <p className={`text-3xl font-bold mt-2 ${lowStockCount > 0 ? 'text-orange-600' : 'text-green-600'}`}>{lowStockCount}</p>
                        </div>
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${lowStockCount > 0 ? 'bg-orange-100' : 'bg-green-100'}`}>
                            <svg className={`w-6 h-6 ${lowStockCount > 0 ? 'text-orange-600' : 'text-green-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-rose-500" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Asset Value</p>
                            <p className="text-3xl font-bold mt-2" style={{ color: 'var(--text-primary)' }}>${totalValue.toFixed(0)}</p>
                        </div>
                        <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center">
                            <svg className="w-6 h-6 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>All Products</h2>
                <button
                    onClick={() => { resetForm(); setIsModalOpen(true); }}
                    className="bg-gradient-to-r from-red-600 to-black hover:from-red-700 hover:to-gray-900 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105 flex items-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add New Product
                </button>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-2xl shadow-lg border overflow-hidden" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y" style={{ borderColor: 'var(--border-color)' }}>
                        <thead style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Product</th>
                                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Brand</th>
                                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Category</th>
                                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Price</th>
                                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Stock</th>
                                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y" style={{ borderColor: 'var(--border-color)' }}>
                            {(() => {
                                const totalPages = Math.ceil(products.length / itemsPerPage);
                                const startIndex = (currentPage - 1) * itemsPerPage;
                                const endIndex = startIndex + itemsPerPage;
                                const currentProducts = products.slice(startIndex, endIndex);
                                return currentProducts.map((product) => (
                                    <tr key={product.id} className="hover:bg-indigo-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-lg flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                                                    {product.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="font-semibold" style={{ color: 'var(--text-primary)' }}>{product.name}</div>
                                                    <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>{product.sku}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4" style={{ color: 'var(--text-primary)' }}>{product.brand}</td>
                                        <td className="px-6 py-4">
                                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                                                {product.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-lg font-bold text-green-600">
                                                ${product.price}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full border-2 ${(product.stock || 0) < 5 ? 'bg-orange-50 text-orange-700 border-orange-200' : 'bg-green-50 text-green-700 border-green-200'}`}>
                                                {(product.stock || 0)} left
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 space-x-2">
                                            <button
                                                onClick={() => handleEdit(product)}
                                                className="px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg font-medium transition-colors text-sm"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(product.id!)}
                                                className="px-3 py-1.5 bg-red-50 text-red-700 hover:bg-red-100 rounded-lg font-medium transition-colors text-sm"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ));
                            })()}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Controls */}
                {products.length > itemsPerPage && (() => {
                    const totalPages = Math.ceil(products.length / itemsPerPage);
                    return (
                        <div className="px-6 py-4 border-t flex items-center justify-between" style={{ borderColor: 'var(--border-color)' }}>
                            <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                                Showing <span className="font-semibold">{((currentPage - 1) * itemsPerPage) + 1}</span> to{' '}
                                <span className="font-semibold">{Math.min(currentPage * itemsPerPage, products.length)}</span> of{' '}
                                <span className="font-semibold">{products.length}</span> products
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                    disabled={currentPage === 1}
                                    className="px-4 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-sm"
                                    style={{ borderColor: 'var(--border-color)' }}
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>
                                <div className="flex gap-1">
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                        <button
                                            key={page}
                                            onClick={() => setCurrentPage(page)}
                                            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${currentPage === page
                                                ? 'bg-red-600 text-white'
                                                : 'border hover:bg-gray-50'
                                                }`}
                                            style={currentPage !== page ? { borderColor: 'var(--border-color)' } : {}}
                                        >
                                            {page}
                                        </button>
                                    ))}
                                </div>
                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                    disabled={currentPage === totalPages}
                                    className="px-4 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-sm"
                                    style={{ borderColor: 'var(--border-color)' }}
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    );
                })()}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden max-h-[90vh] overflow-y-auto" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                        <div className="px-6 py-5 bg-gradient-to-r from-red-600 to-black border-b border-red-700 flex justify-between items-center sticky top-0">
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
                            {/* Dynamic Form Auto-Selection */}
                            {availableForms.length > 0 ? (
                                <>
                                    {availableForms.length > 1 && (
                                        <div className="mb-6">
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Select Form Template:</label>
                                            <select
                                                value={selectedFormId || ''}
                                                onChange={(e) => setSelectedFormId(Number(e.target.value))}
                                                className="w-full border-2 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                                style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
                                            >
                                                {availableForms.map(f => (
                                                    <option key={f.id} value={f.id}>{f.title}</option>
                                                ))}
                                            </select>
                                        </div>
                                    )}

                                    {selectedFormSchema ? (
                                        <DynamicFormRenderer
                                            schema={selectedFormSchema}
                                            onSubmit={handleDynamicFormSubmit}
                                            submitButtonText={editingId ? 'Update Product (Form)' : 'Create Product'}
                                        />
                                    ) : (
                                        <div className="text-center py-8 text-gray-500">
                                            Loading form schema...
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                                    <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                    <h3 className="text-lg font-medium text-gray-900">No Product Forms Found</h3>
                                    <p className="text-gray-500 mt-2 mb-6">Please create a form with "Product" context in the Form Builder.</p>
                                    <a
                                        href="/forms/builder"
                                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                    >
                                        Go to Form Builder
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
