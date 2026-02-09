'use client';
import React from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';

const FormRendererComponent = dynamic(() => import('@/components/FormRendererComponent'), { ssr: false });

const sampleForm = {
    display: 'form',
    components: [
        {
            type: 'textfield',
            key: 'firstName',
            label: 'First Name',
            placeholder: 'Enter your first name',
            input: true,
            validate: { required: true }
        },
        {
            type: 'textfield',
            key: 'lastName',
            label: 'Last Name',
            placeholder: 'Enter your last name',
            input: true,
            validate: { required: true }
        },
        {
            type: 'email',
            key: 'email',
            label: 'Email',
            placeholder: 'Enter your email',
            input: true,
            validate: { required: true }
        },
        {
            type: 'select',
            key: 'department',
            label: 'Department',
            placeholder: 'Select your department',
            data: {
                values: [
                    { label: 'Engineering', value: 'engineering' },
                    { label: 'Marketing', value: 'marketing' },
                    { label: 'Sales', value: 'sales' },
                    { label: 'Support', value: 'support' }
                ]
            },
            input: true
        },
        {
            type: 'button',
            action: 'submit',
            label: 'Submit Form',
            theme: 'primary',
            input: true
        }
    ]
};

export default function RenderPage() {
    const handleSubmit = (submission: any) => {
        console.log('Form submitted:', submission);
        alert('Form submitted successfully! Check console for submission data.');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-1">Form Renderer Demo</h1>
                            <p className="text-gray-600">Preview how your forms will look and function</p>
                        </div>
                        <Link
                            href="/forms/builder"
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Go to Builder
                        </Link>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Info Alert */}
                <div className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
                    <div className="flex items-start gap-3">
                        <svg className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div>
                            <h3 className="font-semibold text-blue-900 mb-1">Sample Form Demo</h3>
                            <p className="text-sm text-blue-800">
                                This page renders a hardcoded sample schema. In a real application, you would fetch the schema from a database or API (like the one generated in the Builder).
                            </p>
                        </div>
                    </div>
                </div>

                {/* Form Card */}
                <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
                    <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-6">
                        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Contact Information Form
                        </h2>
                        <p className="text-purple-100 mt-2">Please fill out all required fields</p>
                    </div>

                    <div className="p-8 bg-gradient-to-b from-white to-gray-50">
                        <FormRendererComponent form={sampleForm} onSubmit={handleSubmit} />
                    </div>
                </div>

                {/* Features Grid */}
                <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2">Validation</h3>
                        <p className="text-sm text-gray-600">Built-in form validation ensures data quality</p>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2">Responsive</h3>
                        <p className="text-sm text-gray-600">Works perfectly on all device sizes</p>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
                        <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mb-4">
                            <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2">Dynamic</h3>
                        <p className="text-sm text-gray-600">Create any form structure you need</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
