'use client';
import React, { useState } from 'react';

interface FormField {
    id: string;
    type: string;
    label: string;
    placeholder?: string;
    required: boolean;
    options?: string[];
}

interface FormSchema {
    title?: string;
    fields: FormField[];
}

interface DynamicFormRendererProps {
    schema: FormSchema;
    onSubmit: (data: Record<string, any>) => void;
    submitButtonText?: string;
}

const DynamicFormRenderer: React.FC<DynamicFormRendererProps> = ({
    schema,
    onSubmit,
    submitButtonText = 'Submit Form'
}) => {
    const [formData, setFormData] = useState<Record<string, any>>({});

    // Extract fields from schema
    const fields = schema?.fields || [];

    const handleChange = (fieldId: string, value: any) => {
        setFormData(prev => ({ ...prev, [fieldId]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validate required fields
        const missingFields = fields
            .filter(f => f.required && !formData[f.id])
            .map(f => f.label);

        if (missingFields.length > 0) {
            alert(`Please fill in the following required fields:\n• ${missingFields.join('\n• ')}`);
            return;
        }

        onSubmit(formData);
    };



    const renderField = (field: FormField) => {
        const baseLabelClass = "block text-sm font-medium text-gray-700 mb-1";
        const baseInputClass = "block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 sm:text-sm py-2 px-3";

        switch (field.type) {
            case 'textarea':
                return (
                    <div>
                        <textarea
                            value={formData[field.id] || ''}
                            onChange={(e) => handleChange(field.id, e.target.value)}
                            placeholder={field.placeholder}
                            required={field.required}
                            className={baseInputClass}
                            rows={4}
                        />
                    </div>
                );

            case 'select':
                return (
                    <div>
                        <select
                            value={formData[field.id] || ''}
                            onChange={(e) => handleChange(field.id, e.target.value)}
                            required={field.required}
                            className={baseInputClass}
                        >
                            <option value="">{field.placeholder || 'Select an option'}</option>
                            {field.options?.map((opt, i) => (
                                <option key={i} value={opt}>{opt}</option>
                            ))}
                        </select>
                    </div>
                );

            case 'checkbox':
                return (
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            checked={formData[field.id] || false}
                            onChange={(e) => handleChange(field.id, e.target.checked)}
                            className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-600"
                            id={`checkbox-${field.id}`}
                        />
                        <label htmlFor={`checkbox-${field.id}`} className="ml-2 block text-sm text-gray-900">
                            {field.placeholder || field.label}
                        </label>
                    </div>
                );

            case 'radio':
                return (
                    <div className="space-y-4 sm:flex sm:items-center sm:space-x-10 sm:space-y-0">
                        {field.options?.map((opt, i) => (
                            <div key={i} className="flex items-center">
                                <input
                                    type="radio"
                                    name={field.id}
                                    value={opt}
                                    checked={formData[field.id] === opt}
                                    onChange={(e) => handleChange(field.id, e.target.value)}
                                    required={field.required}
                                    className="h-4 w-4 border-gray-300 text-gray-900 focus:ring-gray-600"
                                    id={`radio-${field.id}-${i}`}
                                />
                                <label htmlFor={`radio-${field.id}-${i}`} className="ml-3 block text-sm font-medium text-gray-700">
                                    {opt}
                                </label>
                            </div>
                        ))}
                    </div>
                );

            case 'file':
                return (
                    <div>
                        <input
                            type="file"
                            onChange={(e) => handleChange(field.id, e.target.files?.[0])}
                            required={field.required}
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100"
                        />
                    </div>
                );

            case 'color':
                return (
                    <div className="flex items-center gap-3">
                        <input
                            type="color"
                            value={formData[field.id] || '#000000'}
                            onChange={(e) => handleChange(field.id, e.target.value)}
                            required={field.required}
                            className="h-9 w-9 rounded-md border border-gray-300 cursor-pointer p-1"
                        />
                        <input
                            type="text"
                            value={formData[field.id] || ''}
                            onChange={(e) => handleChange(field.id, e.target.value)}
                            placeholder="#000000"
                            className={baseInputClass}
                        />
                    </div>
                );

            default:
                return (
                    <div>
                        <input
                            type={field.type}
                            value={formData[field.id] || ''}
                            onChange={(e) => handleChange(field.id, e.target.value)}
                            placeholder={field.placeholder}
                            required={field.required}
                            className={baseInputClass}
                        />
                    </div>
                );
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {fields.map((field, index) => (
                <div key={field.id}>
                    {field.type !== 'checkbox' && (
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {field.label} {field.required && <span className="text-red-500">*</span>}
                        </label>
                    )}
                    {renderField(field)}
                    {field.placeholder && field.type !== 'checkbox' && field.type !== 'radio' && (
                        <p className="mt-1 text-xs text-gray-500">{field.placeholder}</p>
                    )}
                </div>
            ))}

            <div className="pt-5">
                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-gray-900 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-black focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
                    >
                        {submitButtonText}
                    </button>
                </div>
            </div>
        </form>
    );
};

export default DynamicFormRenderer;
