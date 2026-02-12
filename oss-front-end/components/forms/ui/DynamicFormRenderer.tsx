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

    const getFieldIcon = (type: string) => {
        const icons: Record<string, string> = {
            'text': '📝',
            'email': '📧',
            'number': '🔢',
            'tel': '📞',
            'url': '🔗',
            'date': '📅',
            'time': '⏰',
            'datetime-local': '📆',
            'textarea': '📄',
            'select': '📋',
            'checkbox': '☑️',
            'radio': '🔘',
            'file': '📎',
            'color': '🎨',
        };
        return icons[type] || '📝';
    };

    const renderField = (field: FormField) => {
        const baseInputClass = "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white";
        const iconClass = "absolute left-3 top-1/2 transform -translate-y-1/2 text-xl pointer-events-none";

        switch (field.type) {
            case 'textarea':
                return (
                    <div className="relative">
                        <span className="absolute left-3 top-3 text-xl pointer-events-none">{getFieldIcon(field.type)}</span>
                        <textarea
                            value={formData[field.id] || ''}
                            onChange={(e) => handleChange(field.id, e.target.value)}
                            placeholder={field.placeholder}
                            required={field.required}
                            className={`${baseInputClass} pl-12 min-h-[120px] resize-y`}
                            rows={4}
                        />
                    </div>
                );

            case 'select':
                return (
                    <div className="relative">
                        <span className={iconClass}>{getFieldIcon(field.type)}</span>
                        <select
                            value={formData[field.id] || ''}
                            onChange={(e) => handleChange(field.id, e.target.value)}
                            required={field.required}
                            className={`${baseInputClass} pl-12 appearance-none cursor-pointer`}
                        >
                            <option value="">{field.placeholder || 'Select an option'}</option>
                            {field.options?.map((opt, i) => (
                                <option key={i} value={opt}>{opt}</option>
                            ))}
                        </select>
                        <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                );

            case 'checkbox':
                return (
                    <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors">
                        <input
                            type="checkbox"
                            checked={formData[field.id] || false}
                            onChange={(e) => handleChange(field.id, e.target.checked)}
                            className="mt-1 w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                            id={`checkbox-${field.id}`}
                        />
                        <label htmlFor={`checkbox-${field.id}`} className="text-sm text-gray-700 cursor-pointer flex-1">
                            {field.placeholder || field.label}
                        </label>
                    </div>
                );

            case 'radio':
                return (
                    <div className="space-y-2">
                        {field.options?.map((opt, i) => (
                            <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors">
                                <input
                                    type="radio"
                                    name={field.id}
                                    value={opt}
                                    checked={formData[field.id] === opt}
                                    onChange={(e) => handleChange(field.id, e.target.value)}
                                    required={field.required}
                                    className="w-5 h-5 border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                    id={`radio-${field.id}-${i}`}
                                />
                                <label htmlFor={`radio-${field.id}-${i}`} className="text-sm text-gray-700 cursor-pointer flex-1">
                                    {opt}
                                </label>
                            </div>
                        ))}
                    </div>
                );

            case 'file':
                return (
                    <div className="relative">
                        <input
                            type="file"
                            onChange={(e) => handleChange(field.id, e.target.files?.[0])}
                            required={field.required}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
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
                            className="h-12 w-20 rounded-lg border border-gray-300 cursor-pointer"
                        />
                        <input
                            type="text"
                            value={formData[field.id] || ''}
                            onChange={(e) => handleChange(field.id, e.target.value)}
                            placeholder="#000000"
                            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white font-mono"
                        />
                    </div>
                );

            default:
                return (
                    <div className="relative">
                        <span className={iconClass}>{getFieldIcon(field.type)}</span>
                        <input
                            type={field.type}
                            value={formData[field.id] || ''}
                            onChange={(e) => handleChange(field.id, e.target.value)}
                            placeholder={field.placeholder}
                            required={field.required}
                            className={`${baseInputClass} pl-12`}
                        />
                    </div>
                );
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {fields.map((field, index) => (
                <div key={field.id} className="group">
                    <label className="block mb-2">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-sm font-semibold text-gray-700">
                                {field.label}
                            </span>
                            {field.required && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-700">
                                    Required
                                </span>
                            )}
                        </div>
                    </label>
                    <div className="relative">
                        {renderField(field)}
                    </div>
                    {field.placeholder && field.type !== 'checkbox' && field.type !== 'radio' && (
                        <p className="mt-1.5 text-xs text-gray-500 ml-1">
                            {field.type === 'select' ? '' : `Hint: ${field.placeholder}`}
                        </p>
                    )}
                </div>
            ))}

            <div className="pt-4 border-t border-gray-200">
                <button
                    type="submit"
                    className="w-full px-6 py-4 bg-gradient-to-r from-red-600 to-black text-white rounded-lg hover:from-red-700 hover:to-gray-900 transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {submitButtonText}
                </button>
            </div>
        </form>
    );
};

export default DynamicFormRenderer;
