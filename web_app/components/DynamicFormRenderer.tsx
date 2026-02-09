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
            alert(`Please fill in: ${missingFields.join(', ')}`);
            return;
        }

        onSubmit(formData);
    };

    const renderField = (field: FormField) => {
        const baseClass = "w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent";

        switch (field.type) {
            case 'textarea':
                return (
                    <textarea
                        value={formData[field.id] || ''}
                        onChange={(e) => handleChange(field.id, e.target.value)}
                        placeholder={field.placeholder}
                        required={field.required}
                        className={baseClass}
                        rows={4}
                    />
                );

            case 'select':
                return (
                    <select
                        value={formData[field.id] || ''}
                        onChange={(e) => handleChange(field.id, e.target.value)}
                        required={field.required}
                        className={baseClass}
                    >
                        <option value="">{field.placeholder || 'Select an option'}</option>
                        {field.options?.map((opt, i) => (
                            <option key={i} value={opt}>{opt}</option>
                        ))}
                    </select>
                );

            case 'checkbox':
                return (
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={formData[field.id] || false}
                            onChange={(e) => handleChange(field.id, e.target.checked)}
                            className="rounded"
                        />
                        <span className="text-sm text-gray-600">{field.placeholder || 'Check this box'}</span>
                    </div>
                );

            case 'radio':
                return (
                    <div className="space-y-2">
                        {field.options?.map((opt, i) => (
                            <div key={i} className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    name={field.id}
                                    value={opt}
                                    checked={formData[field.id] === opt}
                                    onChange={(e) => handleChange(field.id, e.target.value)}
                                    required={field.required}
                                />
                                <label className="text-sm">{opt}</label>
                            </div>
                        ))}
                    </div>
                );

            case 'file':
                return (
                    <input
                        type="file"
                        onChange={(e) => handleChange(field.id, e.target.files?.[0])}
                        required={field.required}
                        className={baseClass}
                    />
                );

            default:
                return (
                    <input
                        type={field.type}
                        value={formData[field.id] || ''}
                        onChange={(e) => handleChange(field.id, e.target.value)}
                        placeholder={field.placeholder}
                        required={field.required}
                        className={baseClass}
                    />
                );
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {fields.map(field => (
                <div key={field.id}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        {field.label} {field.required && <span className="text-red-500">*</span>}
                    </label>
                    {renderField(field)}
                </div>
            ))}

            <button
                type="submit"
                className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-lg"
            >
                {submitButtonText}
            </button>
        </form>
    );
};

export default DynamicFormRenderer;
