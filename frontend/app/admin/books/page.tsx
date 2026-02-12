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
    const [availableForms, setAvailableForms] = useState<FormSchema[]>([]);
    const [selectedFormId, setSelectedFormId] = useState<number | null>(null);
    const [selectedFormSchema, setSelectedFormSchema] = useState<any>(null);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    useEffect(() => {
        if (session) {
            fetchBooks();
            fetchAvailableForms();
        }
    }, [session]);

    const getAuthConfig = () => ({
        headers: { Authorization: `Bearer ${session?.accessToken}` }
    });

    const fetchBooks = async () => {
        if (!session?.accessToken) return;
        try {
            const response = await bookService.get('/books', getAuthConfig());
            setBooks(response.data);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load books");
        }
    };

    const fetchAvailableForms = async () => {
        try {
            const forms = await getAllForms('BOOK');
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
        const payload = { ...form, price: Number(form.price), stock: Number(form.stock) };
        const config = getAuthConfig();
        try {
            if (editingId) {
                await bookService.put(`/books/${editingId}`, payload, config);
                toast.success("Book updated!");
            } else {
                await bookService.post('/books', payload, config);
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
        try {
            const url = `/books/from-form?formId=${selectedFormId}`;
            const payload = {
                ...formData,
                _schemaJson: JSON.stringify(selectedFormSchema)
            };

            await bookService.post(url, payload, getAuthConfig());
            toast.success('Book created successfully!', { id: loadingToast });
            resetForm();
            fetchBooks();
            setIsModalOpen(false);
        } catch (error: any) {
            console.error("Submission failed", error);
            const errorMsg = error.response?.data?.error || 'Failed to create book';
            toast.error(errorMsg, { id: loadingToast, duration: 5000 });
        }
    };

    const resetForm = () => {
        setForm({ title: '', author: '', price: '', stock: '', isbn: '' });
        setEditingId(null);
    };

    const openEdit = (book: Book) => {
        setForm(book);
        setEditingId(book.id || null);
        setIsModalOpen(true);
    };

    const openAddNew = () => {
        resetForm();
        setIsModalOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this book?')) return;
        try {
            await bookService.delete(`/books/${id}`, getAuthConfig());
            toast.success("Book deleted");
            fetchBooks();
        } catch (error) {
            toast.error('Failed to delete');
        }
    };

    const totalBooks = books.length;
    const totalStock = books.reduce((acc, b) => acc + (Number(b.stock) || 0), 0);
    const lowStockCount = books.filter(b => (Number(b.stock) || 0) < 5).length;
    const potentialRevenue = books.reduce((acc, b) => acc + (Number(b.stock) * Number(b.price)), 0);

    return (
        <div className="animate-fade-in">
            <div className="mb-8">
                <h1 className="text-4xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                    📚 Book Management
                </h1>
                <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>Manage your book inventory and catalog</p>
            </div>

            {/* Analytics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-indigo-500" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Total Books</p>
                            <p className="text-3xl font-bold mt-2" style={{ color: 'var(--text-primary)' }}>{totalBooks}</p>
                        </div>
                        <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                            <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-blue-500" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Total Inventory</p>
                            <p className="text-3xl font-bold text-blue-600 mt-2">{totalStock}</p>
                        </div>
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-orange-500" style={{ backgroundColor: 'var(--bg-secondary)' }}>
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

                <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-green-500" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Asset Value</p>
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
                <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Inventory Management</h2>
                <button
                    onClick={openAddNew}
                    className="bg-gradient-to-r from-red-600 to-black hover:from-red-700 hover:to-gray-900 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105 flex items-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add New Book
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border overflow-hidden" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y" style={{ borderColor: 'var(--border-color)' }}>
                        <thead style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Book</th>
                                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Price / Stock</th>
                                <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y" style={{ borderColor: 'var(--border-color)' }}>
                            {(() => {
                                const totalPages = Math.ceil(books.length / itemsPerPage);
                                const startIndex = (currentPage - 1) * itemsPerPage;
                                const endIndex = startIndex + itemsPerPage;
                                const currentBooks = books.slice(startIndex, endIndex);
                                return currentBooks.map((book) => (
                                    <tr key={book.id} className="hover:bg-indigo-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-lg flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                                                    {book.title.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="font-semibold" style={{ color: 'var(--text-primary)' }}>{book.title}</div>
                                                    <div className="text-sm flex items-center" style={{ color: 'var(--text-secondary)' }}>
                                                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                        </svg>
                                                        {book.author}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-lg font-bold text-green-600">
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
                                ));
                            })()}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Controls */}
                {books.length > itemsPerPage && (() => {
                    const totalPages = Math.ceil(books.length / itemsPerPage);
                    return (
                        <div className="px-6 py-4 border-t flex items-center justify-between" style={{ borderColor: 'var(--border-color)' }}>
                            <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                                Showing <span className="font-semibold">{((currentPage - 1) * itemsPerPage) + 1}</span> to{' '}
                                <span className="font-semibold">{Math.min(currentPage * itemsPerPage, books.length)}</span> of{' '}
                                <span className="font-semibold">{books.length}</span> books
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
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden max-h-[90vh] flex flex-col" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                        {/* Modal Header */}
                        <div className="px-8 py-6 bg-gradient-to-r from-red-600 to-black border-b border-red-700 flex justify-between items-center flex-shrink-0">
                            <h3 className="text-2xl font-bold text-white flex items-center">
                                <svg className="w-7 h-7 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                                {editingId ? 'Edit Book' : 'Add New Book'}
                            </h3>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Modal Body - Scrollable */}
                        <div className="flex-1 overflow-y-auto">
                            <div className="px-8 py-6">
                                {/* Dynamic Form Auto-Selection */}
                                {availableForms.length > 0 ? (
                                    <>
                                        {availableForms.length > 1 && (
                                            <div className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
                                                <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                    </svg>
                                                    Select Form Template
                                                </label>
                                                <select
                                                    value={selectedFormId || ''}
                                                    onChange={(e) => setSelectedFormId(Number(e.target.value))}
                                                    className="w-full border-2 px-4 py-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-sm"
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
                                                submitButtonText={editingId ? 'Update Book' : 'Create Book'}
                                            />
                                        ) : (
                                            <div className="text-center py-12">
                                                <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent mx-auto mb-4"></div>
                                                <p className="text-gray-600 font-medium">Loading form schema...</p>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl border-2 border-dashed border-gray-300">
                                        <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center">
                                            <svg className="w-10 h-10 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                            </svg>
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">No Book Forms Found</h3>
                                        <p className="text-gray-600 mb-6 max-w-md mx-auto">Create a form with "BOOK" context in the Form Builder to start adding books dynamically.</p>
                                        <a
                                            href="/forms/builder"
                                            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-black text-white rounded-lg hover:from-red-700 hover:to-gray-900 transition-all shadow-lg hover:shadow-xl font-semibold"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                            </svg>
                                            Go to Form Builder
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
