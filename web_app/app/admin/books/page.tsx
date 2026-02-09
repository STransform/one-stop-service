'use client';

import { useEffect, useState } from 'react';
import { bookService } from '@/lib/api';
import { getAllForms, FormSchema } from '@/lib/formApi';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import DynamicFormRenderer from '@/components/DynamicFormRenderer';

interface Book {
    id?: number;
    title: string;
    author: string;
    price: number | '';
    stock: number | '';
    isbn: string;
}

export default function AdminBooksPage() {
    const { data: session } = useSession();
    const [books, setBooks] = useState<Book[]>([]);
    const [form, setForm] = useState<Book>({ title: '', author: '', price: '', stock: '', isbn: '' });
    const [editingId, setEditingId] = useState<number | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Dynamic form state
    const [useDynamicForm, setUseDynamicForm] = useState(false);
    const [availableForms, setAvailableForms] = useState<FormSchema[]>([]);
    const [selectedFormId, setSelectedFormId] = useState<number | null>(null);
    const [selectedFormSchema, setSelectedFormSchema] = useState<any>(null);

    useEffect(() => {
        if (session) {
            fetchBooks();
            fetchAvailableForms();
        }
    }, [session]);

    const fetchBooks = async () => {
        try {
            const response = await bookService.get('/books');
            setBooks(response.data);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load books");
        }
    };

    const fetchAvailableForms = async () => {
        try {
            const forms = await getAllForms();
            setAvailableForms(forms);
            // Auto-select first form if available
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
        const payload = { ...form, price: Number(form.price), stock: Number(form.stock) };
        try {
            if (editingId) {
                await bookService.put(`/books/${editingId}`, payload);
                toast.success("Book updated!");
            } else {
                await bookService.post('/books', payload);
                toast.success("Book created!");
            }
            resetForm();
            fetchBooks();
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

        const loadingToast = toast.loading('Creating book...');
        console.log('DEBUG: Submitting form...', { selectedFormId, formData });
        try {
            const url = `/books/from-form?formId=${selectedFormId}`;
            console.log('DEBUG: Request URL:', url);

            // Inject schema JSON into the payload so backend doesn't need to fetch it
            const payload = {
                ...formData,
                _schemaJson: JSON.stringify(selectedFormSchema)
            };

            await bookService.post(url, payload);
            toast.success('Book created successfully!', { id: loadingToast });
            resetForm();
            fetchBooks();
            setIsModalOpen(false);
        } catch (error: any) {
            console.error("DEBUG: Submission failed", error);
            if (error.response) {
                console.error("DEBUG: Server Response:", error.response.data);
                console.error("DEBUG: Status:", error.response.status);
            }

            const errorMsg = error.response?.data?.error || 'Failed to create book';
            toast.error(errorMsg, { id: loadingToast, duration: 5000 });
        }
    };

    const resetForm = () => {
        setForm({ title: '', author: '', price: '', stock: '', isbn: '' });
        setEditingId(null);
        setUseDynamicForm(false);
    };

    const openEdit = (book: Book) => {
        setForm(book);
        setEditingId(book.id || null);
        setUseDynamicForm(false); // Editing uses hardcoded form
        setIsModalOpen(true);
    };

    const openAddNew = () => {
        resetForm();
        setIsModalOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this book?')) return;
        try {
            await bookService.delete(`/books/${id}`);
            toast.success("Book deleted");
            fetchBooks();
        } catch (error) {
            toast.error('Failed to delete');
        }
    };

    // Analytics Helpers
    const totalBooks = books.length;
    const totalStock = books.reduce((acc, b) => acc + (Number(b.stock) || 0), 0);
    const lowStockCount = books.filter(b => (Number(b.stock) || 0) < 5).length;
    const potentialRevenue = books.reduce((acc, b) => acc + (Number(b.stock) * Number(b.price)), 0);

    if (!session) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h2>
                    <p className="text-gray-600">You must be logged in to view this page.</p>
                </div>
            </div>
        );
    }

    const isAdmin = session.roles?.includes('admin') || session.roles?.includes('realm-admin');

    if (!isAdmin) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center p-8 bg-white rounded-xl shadow-lg border border-red-100 max-w-md">
                    <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Restricted Access</h2>
                    <p className="text-gray-600 mb-6">You do not have the required permissions (ADMIN role) to access this page.</p>
                    <a href="/" className="inline-block px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors">
                        Go Home
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="mb-10">
                    <h1 className="text-5xl font-extrabold bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent mb-2">
                        📚 Admin Dashboard
                    </h1>
                    <p className="text-gray-600 text-lg">Manage your book inventory and catalog</p>
                </div>

                {/* Analytics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-indigo-500 hover:shadow-lg transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm font-medium">Total Books</p>
                                <p className="text-3xl font-bold text-gray-800 mt-2">{totalBooks}</p>
                            </div>
                            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-blue-500 hover:shadow-lg transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm font-medium">Total Inventory</p>
                                <p className="text-3xl font-bold text-blue-600 mt-2">{totalStock}</p>
                            </div>
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                </svg>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-orange-500 hover:shadow-lg transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm font-medium">Low Stock Alerts</p>
                                <p className={`text-3xl font-bold mt-2 ${lowStockCount > 0 ? 'text-orange-600' : 'text-green-600'}`}>{lowStockCount}</p>
                            </div>
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${lowStockCount > 0 ? 'bg-orange-100' : 'bg-green-100'}`}>
                                <svg className={`w-6 h-6 ${lowStockCount > 0 ? 'text-orange-600' : 'text-green-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-green-500 hover:shadow-lg transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm font-medium">Asset Value</p>
                                <p className="text-3xl font-bold text-green-600 mt-2">${potentialRevenue.toLocaleString()}</p>
                            </div>
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Inventory Management</h2>
                    <button
                        onClick={openAddNew}
                        className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105 flex items-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Add New Book
                    </button>
                </div>

                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Book</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Price / Stock</th>
                                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {books.map((book) => (
                                    <tr key={book.id} className="hover:bg-indigo-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-lg flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                                                    {book.title.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-gray-900">{book.title}</div>
                                                    <div className="text-sm text-gray-500 flex items-center">
                                                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                        </svg>
                                                        {book.author}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-lg font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                                                ${Number(book.price).toFixed(2)}
                                            </div>
                                            <span className={`inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full border-2 ${Number(book.stock) < 5 ? 'bg-red-50 text-red-700 border-red-200' : 'bg-green-50 text-green-700 border-green-200'}`}>
                                                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                                </svg>
                                                {book.stock} left
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right space-x-2">
                                            <button
                                                onClick={() => openEdit(book)}
                                                className="inline-flex items-center px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg font-medium transition-colors"
                                            >
                                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(book.id!)}
                                                className="inline-flex items-center px-3 py-1.5 bg-red-50 text-red-700 hover:bg-red-100 rounded-lg font-medium transition-colors"
                                            >
                                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden max-h-[90vh] overflow-y-auto transform transition-all">
                        <div className="px-6 py-5 bg-gradient-to-r from-indigo-600 to-purple-600 border-b border-indigo-700 flex justify-between items-center sticky top-0">
                            <h3 className="text-xl font-bold text-white flex items-center">
                                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                                {editingId ? 'Edit Book' : 'Add New Book'}
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-white hover:text-gray-200 transition-colors">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {!editingId && (
                            <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        checked={useDynamicForm}
                                        onChange={(e) => setUseDynamicForm(e.target.checked)}
                                        className="w-5 h-5 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500"
                                    />
                                    <span className="text-sm font-semibold text-gray-700 group-hover:text-indigo-700 transition-colors">
                                        🎨 Use Dynamic Form Builder
                                    </span>
                                </label>

                                {useDynamicForm && availableForms.length > 0 && (
                                    <div className="mt-4">
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Select Form:</label>
                                        <select
                                            value={selectedFormId || ''}
                                            onChange={(e) => setSelectedFormId(Number(e.target.value))}
                                            className="w-full border-2 border-indigo-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                        >
                                            {availableForms.map(form => (
                                                <option key={form.id} value={form.id}>{form.title}</option>
                                            ))}
                                        </select>
                                    </div>
                                )}

                                {useDynamicForm && availableForms.length === 0 && (
                                    <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                                        <p className="text-sm text-red-700 flex items-center">
                                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                            </svg>
                                            No forms available. Create one in the Form Builder first.
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="p-6">
                            {useDynamicForm && !editingId && selectedFormSchema ? (
                                <DynamicFormRenderer
                                    schema={selectedFormSchema}
                                    onSubmit={handleDynamicFormSubmit}
                                    submitButtonText="Create Book"
                                />
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-5">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Book Title</label>
                                        <input
                                            className="w-full border-2 border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                            placeholder="Enter book title"
                                            value={form.title}
                                            onChange={e => setForm({ ...form, title: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Author</label>
                                        <input
                                            className="w-full border-2 border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                            placeholder="Enter author name"
                                            value={form.author}
                                            onChange={e => setForm({ ...form, author: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Price ($)</label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                className="w-full border-2 border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                                placeholder="0.00"
                                                value={form.price}
                                                onChange={e => setForm({ ...form, price: e.target.value === '' ? '' : Number(e.target.value) })}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Stock Quantity</label>
                                            <input
                                                type="number"
                                                className="w-full border-2 border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                                placeholder="0"
                                                value={form.stock}
                                                onChange={e => setForm({ ...form, stock: e.target.value === '' ? '' : Number(e.target.value) })}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">ISBN</label>
                                        <input
                                            className="w-full border-2 border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                            placeholder="Enter ISBN"
                                            value={form.isbn}
                                            onChange={e => setForm({ ...form, isbn: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                                        <button
                                            type="button"
                                            onClick={() => setIsModalOpen(false)}
                                            className="px-6 py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg font-semibold shadow-lg transition-all transform hover:scale-105"
                                        >
                                            Save Book
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
