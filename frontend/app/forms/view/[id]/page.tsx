'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getFormById, submitFormData } from '@/lib/formApi';
import dynamic from 'next/dynamic';
import Link from 'next/link';

const DynamicFormRenderer = dynamic(() => import('@/components/DynamicFormRenderer'), { ssr: false });

export default function ViewFormPage() {
    const params = useParams();
    const router = useRouter();
    const [formSchema, setFormSchema] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        loadForm();
    }, []);

    const loadForm = async () => {
        try {
            const form = await getFormById(Number(params.id));
            const schema = JSON.parse(form.schemaJson);
            setFormSchema({ ...schema, formId: form.id, formTitle: form.title });
            setError(null);
        } catch (error) {
            console.error('Error loading form:', error);
            setError('Failed to load form. Make sure the backend is running.');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (data: any) => {
        setSubmitting(true);
        try {
            await submitFormData(Number(params.id), data);
            alert('✅ Form submitted successfully!');
            console.log('Submitted data:', data);
            // Optionally redirect to a success page or form list
            // router.push('/forms/list');
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('❌ Failed to submit form. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading form...</p>
                </div>
            </div>
        );
    }

    if (error || !formSchema) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
                <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
                    <svg className="w-16 h-16 mx-auto text-red-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Form Not Found</h2>
                    <p className="text-gray-600 mb-6">{error || 'The form you are looking for does not exist.'}</p>
                    <Link
                        href="/forms/list"
                        className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                        Back to Forms
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 shadow-sm">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <Link
                                href="/forms/list"
                                className="text-sm text-blue-600 hover:underline mb-2 inline-flex items-center gap-1"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                                Back to Forms
                            </Link>
                            <h1 className="text-3xl font-bold text-gray-900">{formSchema.formTitle || formSchema.title}</h1>
                        </div>
                    </div>
                </div>
            </div>

            {/* Form Content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6">
                        <h2 className="text-2xl font-semibold text-white">Fill Out This Form</h2>
                        <p className="text-blue-100 mt-1">Please complete all required fields marked with *</p>
                    </div>
                    <div className="p-8">
                        {submitting ? (
                            <div className="text-center py-12">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                                <p className="text-gray-600">Submitting your form...</p>
                            </div>
                        ) : (
                            <DynamicFormRenderer
                                schema={formSchema}
                                onSubmit={handleSubmit}
                            />
                        )}
                    </div>
                </div>

                {/* Info Box */}
                <div className="mt-6 bg-blue-50 rounded-xl border border-blue-200 p-6">
                    <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Information
                    </h3>
                    <p className="text-sm text-blue-800">
                        Your submission will be saved securely. All required fields must be filled before submitting.
                    </p>
                </div>
            </div>
        </div>
    );
}
