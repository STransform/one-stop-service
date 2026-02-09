'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getAllForms, FormSchema, deleteForm } from '@/lib/formApi';
import toast from 'react-hot-toast';

export default function FormListPage() {
    const [forms, setForms] = useState<FormSchema[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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
            loadForms(); // Refresh list
        } catch (error) {
            console.error('Delete failed:', error);
            toast.error('Failed to delete form', { id: toastId });
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading forms...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-1">My Forms</h1>
                            <p className="text-gray-600">Manage and view all your created forms</p>
                        </div>
                        <Link
                            href="/forms/builder"
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
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
                    <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                        <div className="flex items-center gap-2 text-red-800">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{error}</span>
                        </div>
                    </div>
                )}

                {forms.length === 0 && !error ? (
                    <div className="text-center py-16 bg-white rounded-xl shadow-sm">
                        <svg className="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">No forms yet</h3>
                        <p className="text-gray-500 mb-6">Create your first form to get started</p>
                        <Link
                            href="/forms/builder"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Create Your First Form
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {forms.map(form => (
                            <div key={form.id} className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow border border-gray-200 overflow-hidden flex flex-col">
                                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
                                    <h3 className="text-xl font-semibold text-white truncate">{form.title}</h3>
                                </div>
                                <div className="p-6 flex-1">
                                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <span>Created: {form.createdAt ? new Date(form.createdAt).toLocaleDateString() : 'N/A'}</span>
                                    </div>
                                    <div className="flex gap-3">
                                        <Link
                                            href={`/forms/view/${form.id}`}
                                            className="flex-1 text-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                                        >
                                            📝 Fill
                                        </Link>
                                        <Link
                                            href={`/forms/builder?edit=${form.id}`}
                                            className="flex-1 text-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                                        >
                                            ✏️ Edit
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(form.id!)}
                                            className="px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
                                            title="Delete Form"
                                        >
                                            🗑️ Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
