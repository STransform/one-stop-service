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

    // Derived state for pagination
    const totalPages = Math.ceil(books.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentBooks = books.slice(startIndex, startIndex + itemsPerPage);

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
        <div className="animate-fade-in max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="md:flex md:items-center md:justify-between mb-8">
                <div className="min-w-0 flex-1">
                    <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                        Book Management
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">Manage your book inventory and catalog</p>
                </div>
                <div className="mt-4 flex md:ml-4 md:mt-0">
                    {/* Action buttons moved below analytics */}
                </div>
            </div>

            {/* Analytics Cards */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6 border border-gray-200">
                    <dt className="truncate text-sm font-medium text-gray-500">Total Books</dt>
                    <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">{totalBooks}</dd>
                </div>
                <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6 border border-gray-200">
                    <dt className="truncate text-sm font-medium text-gray-500">Total Stock</dt>
                    <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">{totalStock}</dd>
                </div>
                <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6 border border-gray-200">
                    <dt className="truncate text-sm font-medium text-gray-500">Low Stock Alerts</dt>
                    <dd className={`mt-1 text-3xl font-semibold tracking-tight ${lowStockCount > 0 ? 'text-red-600' : 'text-green-600'}`}>{lowStockCount}</dd>
                </div>
                <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6 border border-gray-200">
                    <dt className="truncate text-sm font-medium text-gray-500">Potential Revenue</dt>
                    <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">${potentialRevenue.toLocaleString()}</dd>
                </div>
            </div>

            {/* Actions Bar */}
            <div className="mb-6 flex justify-end">
                <button
                    onClick={openAddNew}
                    className="inline-flex items-center rounded-md bg-gray-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600 transition-colors"
                >
                    <svg className="-ml-0.5 mr-1.5 h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
                    </svg>
                    Add Book
                </button>
            </div>

            {/* Books Table */}
            <div className="flow-root">
                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                            <table className="min-w-full divide-y divide-gray-300">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Title</th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Author</th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Price</th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Stock</th>
                                        <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                            <span className="sr-only">Actions</span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {currentBooks.map((book) => (
                                        <tr key={book.id}>
                                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                                <div className="flex items-center">
                                                    <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold">
                                                        {book.title.charAt(0)}
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="font-medium text-gray-900">{book.title}</div>
                                                        <div className="text-gray-500">{book.isbn}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{book.author}</td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">${Number(book.price).toFixed(2)}</td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${(Number(book.stock) || 0) < 5
                                                    ? 'bg-red-50 text-red-700 ring-red-600/10'
                                                    : 'bg-green-50 text-green-700 ring-green-600/20'
                                                    }`}>
                                                    {book.stock} left
                                                </span>
                                            </td>
                                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                                <button onClick={() => openEdit(book)} className="text-gray-600 hover:text-gray-900 mr-4">Edit</button>
                                                <button onClick={() => handleDelete(book.id!)} className="text-red-600 hover:text-red-900">Delete</button>
                                            </td>
                                        </tr>
                                    ))}
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
                                Showing <span className="font-medium">{((currentPage - 1) * itemsPerPage) + 1}</span> to <span className="font-medium">{Math.min(currentPage * itemsPerPage, books.length)}</span> of <span className="font-medium">{books.length}</span> results
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
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl overflow-hidden flex flex-col transform transition-all max-h-[90vh]">
                        {/* Modal Header */}
                        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-white">
                            <h3 className="text-lg font-medium leading-6 text-gray-900">
                                {editingId ? 'Edit Book' : 'Add New Book'}
                            </h3>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-gray-400 hover:text-gray-500 focus:outline-none"
                            >
                                <span className="sr-only">Close</span>
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Modal Body - Scrollable */}
                        <div className="overflow-y-auto px-6 py-6">
                            {/* Dynamic Form Auto-Selection */}
                            {availableForms.length > 0 ? (
                                <>
                                    {availableForms.length > 1 && (
                                        <div className="mb-6">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Select Template
                                            </label>
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
                                            submitButtonText={editingId ? 'Update Book' : 'Create Book'}
                                        />
                                    ) : (
                                        <div className="text-center py-8 text-gray-500">
                                            <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-900 border-t-transparent mx-auto mb-4"></div>
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
