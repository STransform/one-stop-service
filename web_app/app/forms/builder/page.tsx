'use client';
import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { saveFormSchema } from '@/lib/formApi';

const SimpleFormBuilder = dynamic(() => import('@/components/SimpleFormBuilder'), { ssr: false });

export default function BuilderPage() {
    const [schema, setSchema] = useState<any>(null);
    const [showJson, setShowJson] = useState(true);
    const [formTitle, setFormTitle] = useState('My Custom Form');
    const [saving, setSaving] = useState(false);

    const handleSchemaChange = (fields: any) => {
        const formSchema = {
            title: 'Custom Form',
            fields: fields
        };
        setSchema(formSchema);
        console.log('Schema changed:', formSchema);
    };

    const handleSaveForm = () => {
        if (schema) {
            navigator.clipboard.writeText(JSON.stringify(schema, null, 2));
            alert('Form schema copied to clipboard!');
        }
    };

    const handleExportJSON = () => {
        if (schema) {
            const blob = new Blob([JSON.stringify(schema, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'form-schema.json';
            a.click();
            URL.revokeObjectURL(url);
        }
    };

    const handleSaveToBackend = async () => {
        if (!schema) {
            alert('Please create a form first!');
            return;
        }

        setSaving(true);
        try {
            const saved = await saveFormSchema(formTitle, JSON.stringify(schema));
            alert(`✅ Form saved successfully! ID: ${saved.id}`);
            console.log('Saved form:', saved);
        } catch (error) {
            console.error('Error saving form:', error);
            alert('❌ Failed to save form. Make sure your backend is running!');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-1">Dynamic Form Builder</h1>
                            <p className="text-gray-600">Click components to add them to your form, then customize each field</p>
                        </div>
                        <div className="flex gap-3 items-center">
                            <input
                                type="text"
                                value={formTitle}
                                onChange={(e) => setFormTitle(e.target.value)}
                                placeholder="Form Title"
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <Link
                                href="/forms/list"
                                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
                            >
                                📋 My Forms
                            </Link>
                            <button
                                onClick={handleSaveToBackend}
                                disabled={!schema || saving}
                                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {saving ? 'Saving...' : '💾 Save to Backend'}
                            </button>
                            <button
                                onClick={handleExportJSON}
                                disabled={!schema}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Export JSON
                            </button>
                            <button
                                onClick={handleSaveForm}
                                disabled={!schema}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Copy Schema
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    {/* Form Builder - Takes 2 columns */}
                    <div className="xl:col-span-2">
                        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
                                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                    Design Your Form
                                </h2>
                            </div>
                            <div className="p-6 bg-gray-50">
                                <SimpleFormBuilder onChange={handleSchemaChange} />
                            </div>
                        </div>
                    </div>

                    {/* JSON Schema Panel - Takes 1 column */}
                    <div className="xl:col-span-1">
                        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden sticky top-6">
                            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-4 flex justify-between items-center">
                                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                                    </svg>
                                    JSON Schema
                                </h2>
                                <button
                                    onClick={() => setShowJson(!showJson)}
                                    className="text-white hover:text-gray-200 transition-colors"
                                >
                                    {showJson ? (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    )}
                                </button>
                            </div>

                            {showJson && (
                                <div className="p-6 bg-gray-50 max-h-[600px] overflow-auto">
                                    {schema ? (
                                        <div className="relative">
                                            <button
                                                onClick={handleSaveForm}
                                                className="absolute top-2 right-2 px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors z-10"
                                            >
                                                Copy
                                            </button>
                                            <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-auto text-xs font-mono leading-relaxed">
                                                {JSON.stringify(schema, null, 2)}
                                            </pre>
                                        </div>
                                    ) : (
                                        <div className="text-center py-12">
                                            <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                            <p className="text-gray-500 italic">Add components to see the schema</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {!showJson && (
                                <div className="p-6 text-center">
                                    <p className="text-gray-500 text-sm">Click the arrow to view JSON schema</p>
                                </div>
                            )}
                        </div>

                        {/* Quick Tips */}
                        <div className="mt-6 bg-blue-50 rounded-xl border border-blue-200 p-6">
                            <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Quick Tips
                            </h3>
                            <ul className="space-y-2 text-sm text-blue-800">
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-600 mt-0.5">•</span>
                                    <span>Click any component button to add it to your form</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-600 mt-0.5">•</span>
                                    <span>Hover over fields to see edit/delete/reorder buttons</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-600 mt-0.5">•</span>
                                    <span>Click the edit icon to customize field properties</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-600 mt-0.5">•</span>
                                    <span>Use arrows to reorder fields up or down</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
