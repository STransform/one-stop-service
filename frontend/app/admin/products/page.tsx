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

    // Derived state for pagination
    const totalPages = Math.ceil(products.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentProducts = products.slice(startIndex, startIndex + itemsPerPage);

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
        <div className="animate-fade-in max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="md:flex md:items-center md:justify-between mb-8">
                <div className="min-w-0 flex-1">
                    <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                        Product Management
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">Manage your product inventory and catalog</p>
                </div>
                <div className="mt-4 flex md:ml-4 md:mt-0">
                    {/* Action buttons moved below analytics */}
                </div>
            </div>

            {/* Analytics Cards */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6 border border-gray-200">
                    <dt className="truncate text-sm font-medium text-gray-500">Total Products</dt>
                    <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">{products.length}</dd>
                </div>
                <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6 border border-gray-200">
                    <dt className="truncate text-sm font-medium text-gray-500">Total Inventory</dt>
                    <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">{totalInventory}</dd>
                </div>
                <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6 border border-gray-200">
                    <dt className="truncate text-sm font-medium text-gray-500">Low Stock Items</dt>
                    <dd className={`mt-1 text-3xl font-semibold tracking-tight ${lowStockCount > 0 ? 'text-red-600' : 'text-green-600'}`}>{lowStockCount}</dd>
                </div>
                <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6 border border-gray-200">
                    <dt className="truncate text-sm font-medium text-gray-500">Total Asset Value</dt>
                    <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">${totalValue.toFixed(2)}</dd>
                </div>
            </div>

            {/* Actions Bar */}
            <div className="mb-6 flex justify-end">
                <button
                    onClick={() => { resetForm(); setIsModalOpen(true); }}
                    className="inline-flex items-center rounded-md bg-gray-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600 transition-colors"
                >
                    <svg className="-ml-0.5 mr-1.5 h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
                    </svg>
                    Add Product
                </button>
            </div>

            {/* Products Table */}
            <div className="flow-root">
                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                            <table className="min-w-full divide-y divide-gray-300">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Product</th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Brand</th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Category</th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Price</th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Stock</th>
                                        <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                            <span className="sr-only">Actions</span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {(() => {
                                        const totalPages = Math.ceil(products.length / itemsPerPage);
                                        const startIndex = (currentPage - 1) * itemsPerPage;
                                        const endIndex = startIndex + itemsPerPage;
                                        const currentProducts = products.slice(startIndex, endIndex);
                                        return currentProducts.map((product) => (
                                            <tr key={product.id}>
                                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                                    <div className="flex items-center">
                                                        <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold">
                                                            {product.name.charAt(0)}
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="font-medium text-gray-900">{product.name}</div>
                                                            <div className="text-gray-500">{product.sku}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{product.brand}</td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                    <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                                                        {product.category}
                                                    </span>
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">${product.price}</td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                    <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${(product.stock || 0) < 5
                                                        ? 'bg-red-50 text-red-700 ring-red-600/10'
                                                        : 'bg-green-50 text-green-700 ring-green-600/20'
                                                        }`}>
                                                        {product.stock} left
                                                    </span>
                                                </td>
                                                <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                                    <button onClick={() => handleEdit(product)} className="text-gray-600 hover:text-gray-900 mr-4">Edit</button>
                                                    <button onClick={() => handleDelete(product.id!)} className="text-red-600 hover:text-red-900">Delete</button>
                                                </td>
                                            </tr>
                                        ));
                                    })()}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 mt-4">
                        <div>
                            <p className="text-sm text-gray-700">
                                Showing <span className="font-medium">{((currentPage - 1) * itemsPerPage) + 1}</span> to <span className="font-medium">{Math.min(currentPage * itemsPerPage, products.length)}</span> of <span className="font-medium">{products.length}</span> results
                            </p>
                        </div>
                        <div>
                            <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                                <button
                                    type="button"
                                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                    disabled={currentPage === 1}
                                    className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                                >
                                    <span className="text-sm font-medium text-gray-700 mx-1">Prev</span>
                                </button>
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                    <button
                                        key={page}
                                        type="button"
                                        onClick={() => setCurrentPage(page)}
                                        className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${currentPage === page
                                            ? 'z-10 bg-gray-900 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600'
                                            : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                                            }`}
                                    >
                                        {page}
                                    </button>
                                ))}
                                <button
                                    type="button"
                                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                    disabled={currentPage === totalPages}
                                    className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                                >
                                    <span className="text-sm font-medium text-gray-700 mx-1">Next</span>
                                </button>
                            </nav>
                        </div>
                    </div>
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl overflow-hidden transform transition-all">
                        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                            <h3 className="text-lg font-medium leading-6 text-gray-900">
                                {editingId ? 'Edit Product' : 'Add New Product'}
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-500 focus:outline-none">
                                <span className="sr-only">Close</span>
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="px-6 py-6">
                            {/* Dynamic Form Auto-Selection */}
                            {availableForms.length > 0 ? (
                                <>
                                    {availableForms.length > 1 && (
                                        <div className="mb-6">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Select Template</label>
                                            <select
                                                value={selectedFormId || ''}
                                                onChange={(e) => setSelectedFormId(Number(e.target.value))}
                                                className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-gray-600 sm:text-sm sm:leading-6"
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
                                            submitButtonText={editingId ? 'Update Product' : 'Create Product'}
                                        />
                                    ) : (
                                        <div className="text-center py-8 text-gray-500">
                                            Loading form schema...
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="text-center py-12">
                                    <h3 className="mt-2 text-sm font-semibold text-gray-900">No forms available</h3>
                                    <p className="mt-1 text-sm text-gray-500">Get started by creating a new form in the builder.</p>
                                    <div className="mt-6">
                                        <a
                                            href="/forms/builder"
                                            className="inline-flex items-center rounded-md bg-gray-900 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
                                        >
                                            Go to Form Builder
                                        </a>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
