'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getAllForms, FormSchema, deleteForm } from '@/lib/formApi';
import toast from 'react-hot-toast';

export default function FormListPage() {
    const [forms, setForms] = useState<FormSchema[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterContext, setFilterContext] = useState<string>('ALL');
    const itemsPerPage = 5;

    useEffect(() => {
        loadForms();
    }, []);

    const loadForms = async () => {
        try {
            const data = await getAllForms();
            setForms(data);
            setError(null);
        } catch (error) {
            console.error('Error loading forms:', error);
            setError('Failed to load forms. Make sure the backend is running.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this form? This action cannot be undone.')) return;

        const toastId = toast.loading('Deleting form...');
        try {
            await deleteForm(id);
            toast.success('Form deleted successfully', { id: toastId });
            loadForms();
        } catch (error) {
            console.error('Delete failed:', error);
            toast.error('Failed to delete form', { id: toastId });
        }
    };

    // Filter and search logic
    const filteredForms = forms.filter(form => {
        const matchesSearch = form.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesContext = filterContext === 'ALL' || form.context === filterContext;
        return matchesSearch && matchesContext;
    });

    // Pagination logic
    const totalPages = Math.ceil(filteredForms.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentForms = filteredForms.slice(startIndex, endIndex);

    // Reset to page 1 when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, filterContext]);

    const getContextColor = (context: string) => {
        const colors: Record<string, string> = {
            'GENERAL': 'bg-gray-100 text-gray-800 border-gray-300',
            'PRODUCT': 'bg-blue-100 text-blue-800 border-blue-300',
            'BOOK': 'bg-purple-100 text-purple-800 border-purple-300',
            'ORDER': 'bg-green-100 text-green-800 border-green-300',
        };
        return colors[context] || 'bg-gray-100 text-gray-800 border-gray-300';
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
                    <p className="text-gray-600 font-medium">Loading forms...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <h1 className="text-4xl font-bold text-gray-900 mb-2">Form Library</h1>
                            <p className="text-gray-600">Manage and organize all your dynamic forms</p>
                        </div>
                        <Link
                            href="/forms/builder"
                            className="px-6 py-3 bg-gradient-to-r from-red-600 to-black text-white rounded-lg hover:from-red-700 hover:to-gray-900 transition-all duration-200 font-medium flex items-center gap-2 shadow-lg hover:shadow-xl"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Create New Form
                        </Link>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {error && (
                    <div className="mb-6 bg-red-50 border-l-4 border-red-500 rounded-lg p-4 shadow-sm">
                        <div className="flex items-center gap-3 text-red-800">
                            <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="font-medium">{error}</span>
                        </div>
                    </div>
                )}

                {/* Search and Filter Bar */}
                {forms.length > 0 && (
                    <div className="mb-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="flex-1">
                                <div className="relative">
                                    <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                    <input
                                        type="text"
                                        placeholder="Search forms by title..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    />
                                </div>
                            </div>
                            <div className="sm:w-48">
                                <select
                                    value={filterContext}
                                    onChange={(e) => setFilterContext(e.target.value)}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                >
                                    <option value="ALL">All Contexts</option>
                                    <option value="GENERAL">General</option>
                                    <option value="PRODUCT">Product</option>
                                    <option value="BOOK">Book</option>
                                    <option value="ORDER">Order</option>
                                </select>
                            </div>
                        </div>
                        <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
                            <span>
                                Showing <span className="font-semibold text-gray-900">{currentForms.length}</span> of{' '}
                                <span className="font-semibold text-gray-900">{filteredForms.length}</span> forms
                            </span>
                        </div>
                    </div>
                )}

                {forms.length === 0 && !error ? (
                    <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-200">
                        <div className="max-w-md mx-auto">
                            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
                                <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">No forms yet</h3>
                            <p className="text-gray-600 mb-8">Get started by creating your first dynamic form</p>
                            <Link
                                href="/forms/builder"
                                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-red-600 to-black text-white rounded-lg hover:from-red-700 hover:to-gray-900 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Create Your First Form
                            </Link>
                        </div>
                    </div>
                ) : filteredForms.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-200">
                        <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">No forms found</h3>
                        <p className="text-gray-500">Try adjusting your search or filter criteria</p>
                    </div>
                ) : (
                    <>
                        {/* Forms Table */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b border-gray-200">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Form Title</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Context</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Created</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Updated</th>
                                            <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {currentForms.map((form, index) => (
                                            <tr key={form.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center flex-shrink-0">
                                                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                            </svg>
                                                        </div>
                                                        <div>
                                                            <div className="font-semibold text-gray-900">{form.title}</div>
                                                            <div className="text-xs text-gray-500">ID: {form.id}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getContextColor(form.context)}`}>
                                                        {form.context}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-600">
                                                    {form.createdAt ? new Date(form.createdAt).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric'
                                                    }) : 'N/A'}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-600">
                                                    {form.updatedAt ? new Date(form.updatedAt).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric'
                                                    }) : 'N/A'}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Link
                                                            href={`/forms/view/${form.id}`}
                                                            className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium inline-flex items-center gap-1.5"
                                                            title="Fill Form"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                                            </svg>
                                                            Fill
                                                        </Link>
                                                        <Link
                                                            href={`/forms/builder?edit=${form.id}`}
                                                            className="px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium inline-flex items-center gap-1.5"
                                                            title="Edit Form"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                            </svg>
                                                            Edit
                                                        </Link>
                                                        <button
                                                            onClick={() => handleDelete(form.id!)}
                                                            className="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium inline-flex items-center gap-1.5"
                                                            title="Delete Form"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                            </svg>
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

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="mt-6 flex items-center justify-between bg-white rounded-xl shadow-sm border border-gray-200 px-6 py-4">
                                <div className="text-sm text-gray-600">
                                    Page <span className="font-semibold text-gray-900">{currentPage}</span> of{' '}
                                    <span className="font-semibold text-gray-900">{totalPages}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                        disabled={currentPage === 1}
                                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-sm"
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
                                                    ? 'bg-blue-600 text-white'
                                                    : 'border border-gray-300 hover:bg-gray-50'
                                                    }`}
                                            >
                                                {page}
                                            </button>
                                        ))}
                                    </div>
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                        disabled={currentPage === totalPages}
                                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-sm"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
