"use client";

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Save, Code, ArrowLeft, Loader2 } from 'lucide-react';
import { saveFormSchema, getFormByContext, updateFormSchema, FormSchema } from '@/lib/formApi';

// Dynamic import for the visual builder to avoid SSR issues
const SimpleFormBuilder = dynamic(() => import('@/components/forms/ui/SimpleFormBuilder'), {
    ssr: false,
    loading: () => <div className="p-12 text-center text-slate-400">Loading builder...</div>
});

interface FormBuilderProps {
    initialData?: any; // Keeping for compatibility
    formId?: string | number | null; // ID of form to edit
    onSave?: (schema: any) => void; // Optional callback after saving
}

export function FormBuilder({ initialData, formId, onSave }: FormBuilderProps) {
    const [schema, setSchema] = useState<any>(null);
    const [showJson, setShowJson] = useState(false);
    const [formTitle, setFormTitle] = useState('New Service Form');
    const [context, setContext] = useState('GENERAL');
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(false);
    const [existingFormId, setExistingFormId] = useState<number | null>(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [initialFields, setInitialFields] = useState<any>(null);

    // Initialize with provided data if any
    useEffect(() => {
        if (initialData) {
            setFormTitle(initialData.title);
            setSchema(initialData);
            if (initialData.fields) {
                setInitialFields(initialData.fields);
            }
            if (initialData.id) {
                setExistingFormId(initialData.id);
                setIsEditMode(true);
            }
        }
    }, [initialData]);

    // Fetch form by ID if provided
    useEffect(() => {
        if (!formId) return;

        const loadFormById = async () => {
            setLoading(true);
            try {
                // Import locally to avoid circular dependencies if any
                const { getFormById } = await import('@/lib/formApi');
                const form = await getFormById(Number(formId));

                if (form) {
                    setExistingFormId(form.id!);
                    setIsEditMode(true);
                    setFormTitle(form.title);
                    if (form.context) setContext(form.context);

                    try {
                        const parsedSchema = typeof form.schemaJson === 'string'
                            ? JSON.parse(form.schemaJson)
                            : form.schemaJson;

                        setSchema(parsedSchema);
                        setInitialFields(parsedSchema.fields || []);
                    } catch (e) {
                        console.error('Failed to parse schema JSON:', e);
                        setInitialFields([]);
                    }
                }
            } catch (error) {
                console.error("Error loading form by ID:", error);
                alert("Failed to load form. It may have been deleted.");
            } finally {
                setLoading(false);
            }
        };

        loadFormById();
    }, [formId]);

    // Auto-load using Singleton pattern when context changes (only if not editing specific ID)
    useEffect(() => {
        // Skip if we are editing a specific form (via ID or initialData)
        if (formId || (initialData && initialData.id)) return;

        const loadFormByContext = async () => {
            setLoading(true);
            try {
                const existingForm = await getFormByContext(context);
                if (existingForm) {
                    console.log("Found existing form for context:", context, existingForm);
                    setExistingFormId(existingForm.id!);
                    setIsEditMode(true);
                    setFormTitle(existingForm.title);

                    try {
                        const parsedSchema = typeof existingForm.schemaJson === 'string'
                            ? JSON.parse(existingForm.schemaJson)
                            : existingForm.schemaJson;

                        setSchema(parsedSchema);
                        setInitialFields(parsedSchema.fields || []);
                    } catch (e) {
                        console.error('Failed to parse schema JSON:', e);
                        setInitialFields([]);
                    }
                } else {
                    // Reset for new form
                    setExistingFormId(null);
                    setIsEditMode(false);
                    setSchema(null);
                    setInitialFields([]);
                    setFormTitle(`${context.charAt(0).toUpperCase() + context.slice(1).toLowerCase()} Form`);
                }
            } catch (error) {
                console.error("Error loading form context:", error);
            } finally {
                setLoading(false);
            }
        };

        loadFormByContext();
    }, [context, initialData]);

    const handleSchemaChange = (fields: any) => {
        const updatedSchema = {
            title: formTitle,
            fields: fields
        };
        setSchema(updatedSchema);
    };

    const handleSaveToBackend = async () => {
        if (!schema || !schema.fields || schema.fields.length === 0) {
            alert('Please add at least one field to the form.');
            return;
        }

        setSaving(true);
        try {
            const schemaString = JSON.stringify(schema);
            let saved: FormSchema;

            if (isEditMode && existingFormId) {
                saved = await updateFormSchema(existingFormId, formTitle, schemaString, context);
            } else {
                saved = await saveFormSchema(formTitle, schemaString, context);
            }

            setExistingFormId(saved.id!);
            setIsEditMode(true);

            alert(`Form ${isEditMode ? 'updated' : 'created'} successfully!`);

            if (onSave) {
                onSave(saved);
            }
        } catch (error) {
            console.error('Error saving form:', error);
            alert('Failed to save form. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="flex flex-col gap-6">
            {/* Control Bar */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-xs font-medium text-slate-500 mb-1">Form Context</label>
                        <select
                            value={context}
                            onChange={(e) => setContext(e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg text-sm bg-slate-50 focus:ring-2 focus:ring-primary/20 outline-none"
                            disabled={!!initialData} // Lock context if editing specific ID
                        >
                            <option value="GENERAL">General</option>
                            <option value="PRODUCT">Product</option>
                            <option value="BOOK">Book</option>
                            <option value="ORDER">Order</option>
                            <option value="INVENTORY">Inventory</option>
                        </select>
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-xs font-medium text-slate-500 mb-1">Form Title</label>
                        <input
                            value={formTitle}
                            onChange={(e) => {
                                setFormTitle(e.target.value);
                                if (schema) setSchema({ ...schema, title: e.target.value });
                            }}
                            className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                            placeholder="Enter form title..."
                        />
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setShowJson(!showJson)}
                        className="px-4 py-2 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                    >
                        <Code size={18} />
                        {showJson ? 'Hide JSON' : 'View JSON'}
                    </button>
                    <button
                        onClick={handleSaveToBackend}
                        disabled={saving || loading}
                        className="px-6 py-2 bg-primary text-white rounded-lg text-sm font-bold shadow-md hover:bg-primary/90 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {saving ? (
                            <>
                                <Loader2 size={18} className="animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save size={18} />
                                {isEditMode ? 'Update Form' : 'Save Form'}
                            </>
                        )}
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center p-12 bg-white rounded-xl border border-slate-200">
                    <div className="text-center">
                        <Loader2 size={32} className="animate-spin text-primary mx-auto mb-4" />
                        <p className="text-slate-500">Loading form configuration...</p>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Main Builder Area */}
                    <div className={showJson ? "lg:w-2/3" : "w-full"}>
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                            <div className="bg-slate-50 border-b border-slate-200 px-6 py-3 flex items-center justify-between">
                                <h3 className="font-semibold text-slate-700 flex items-center gap-2">
                                    Canvas
                                </h3>
                                <div className="text-xs text-slate-500">
                                    {isEditMode ? `Editing ID: ${existingFormId}` : 'Creating New Form'}
                                </div>
                            </div>
                            <div className="p-6">
                                <SimpleFormBuilder
                                    onChange={handleSchemaChange}
                                    initialFields={initialFields}
                                    // Add key to force re-render when context changes
                                    key={context + (existingFormId || 'new')}
                                />
                            </div>
                        </div>
                    </div>

                    {/* JSON Preview Sidebar */}
                    {showJson && (
                        <div className="lg:w-1/3">
                            <div className="bg-slate-900 text-slate-300 rounded-xl overflow-hidden sticky top-6 shadow-lg">
                                <div className="bg-slate-800 px-4 py-3 border-b border-slate-700 flex justify-between items-center">
                                    <h3 className="font-mono text-sm font-bold text-white">Schema Preview</h3>
                                    <button
                                        onClick={() => {
                                            navigator.clipboard.writeText(JSON.stringify(schema, null, 2));
                                            alert('Copied to clipboard!');
                                        }}
                                        className="text-xs bg-white/10 hover:bg-white/20 px-2 py-1 rounded transition-colors"
                                    >
                                        Copy
                                    </button>
                                </div>
                                <div className="p-4 max-h-[600px] overflow-auto scrollbar-thin scrollbar-thumb-slate-700">
                                    <pre className="font-mono text-xs whitespace-pre-wrap">
                                        {schema
                                            ? JSON.stringify(schema, null, 2)
                                            : '// Add fields to generate schema'}
                                    </pre>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

