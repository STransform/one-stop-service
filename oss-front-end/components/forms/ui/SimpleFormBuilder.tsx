'use client';
import React, { useState, useEffect } from 'react';

interface FormField {
    id: string;
    type: 'text' | 'email' | 'number' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'date' | 'time' | 'datetime-local' | 'file' | 'url' | 'tel' | 'color';
    label: string;
    placeholder?: string;
    required: boolean;
    options?: string[];
}

interface SimpleFormBuilderProps {
    onChange?: (fields: FormField[]) => void;
    fieldKeyInfo?: string;
    initialFields?: FormField[];
}

const SimpleFormBuilder: React.FC<SimpleFormBuilderProps> = ({ onChange, fieldKeyInfo, initialFields }) => {
    const [fields, setFields] = useState<FormField[]>([]);
    const [editingField, setEditingField] = useState<FormField | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [showAdvanced, setShowAdvanced] = useState(false);

    // Load initial fields when provided (for editing existing forms)
    useEffect(() => {
        if (initialFields && initialFields.length > 0) {
            setFields(initialFields);
            if (onChange) onChange(initialFields);
        }
    }, [initialFields]);

    const addField = (type: FormField['type']) => {
        const newField: FormField = {
            id: `field_${Date.now()}`,
            type,
            label: `New ${type} field`,
            placeholder: '',
            required: false,
            options: type === 'select' || type === 'radio' ? ['Option 1', 'Option 2'] : undefined,
        };
        setEditingField(newField);
        setShowModal(true);
        setShowAdvanced(false);
    };

    const saveField = () => {
        if (!editingField) return;

        const existingIndex = fields.findIndex(f => f.id === editingField.id);
        let updatedFields;

        if (existingIndex >= 0) {
            updatedFields = [...fields];
            updatedFields[existingIndex] = editingField;
        } else {
            updatedFields = [...fields, editingField];
        }

        setFields(updatedFields);
        if (onChange) onChange(updatedFields);
        setShowModal(false);
        setEditingField(null);
    };

    const editField = (field: FormField) => {
        setEditingField({ ...field });
        setShowModal(true);
        setShowAdvanced(false);
    };

    const deleteField = (id: string) => {
        const updatedFields = fields.filter(f => f.id !== id);
        setFields(updatedFields);
        if (onChange) onChange(updatedFields);
    };

    const moveField = (index: number, direction: 'up' | 'down') => {
        const newFields = [...fields];
        const newIndex = direction === 'up' ? index - 1 : index + 1;
        if (newIndex < 0 || newIndex >= fields.length) return;
        [newFields[index], newFields[newIndex]] = [newFields[newIndex], newFields[index]];
        setFields(newFields);
        if (onChange) onChange(newFields);
    };

    const fieldTypes = [
        { type: 'text', label: 'Text', icon: '📝', color: 'from-blue-500 to-blue-600' },
        { type: 'number', label: 'Number', icon: '🔢', color: 'from-green-500 to-green-600' },
        { type: 'email', label: 'Email', icon: '📧', color: 'from-purple-500 to-purple-600' },
        { type: 'textarea', label: 'Text Area', icon: '📄', color: 'from-indigo-500 to-indigo-600' },
        { type: 'select', label: 'Select', icon: '📋', color: 'from-pink-500 to-pink-600' },
        { type: 'checkbox', label: 'Checkbox', icon: '☑️', color: 'from-teal-500 to-teal-600' },
        { type: 'radio', label: 'Radio', icon: '🔘', color: 'from-orange-500 to-orange-600' },
        { type: 'date', label: 'Date', icon: '📅', color: 'from-red-500 to-red-600' },
        { type: 'time', label: 'Time', icon: '⏰', color: 'from-yellow-500 to-yellow-600' },
        { type: 'datetime-local', label: 'Date & Time', icon: '📆', color: 'from-cyan-500 to-cyan-600' },
        { type: 'file', label: 'File', icon: '📎', color: 'from-violet-500 to-violet-600' },
        { type: 'url', label: 'URL', icon: '🔗', color: 'from-lime-500 to-lime-600' },
        { type: 'tel', label: 'Phone', icon: '📞', color: 'from-emerald-500 to-emerald-600' },
        { type: 'color', label: 'Color', icon: '🎨', color: 'from-rose-500 to-rose-600' },
    ];

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            {/* Field Type Selector */}
            <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Form Fields</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
                    {fieldTypes.map(({ type, label, icon, color }) => (
                        <button
                            key={type}
                            onClick={() => addField(type as FormField['type'])}
                            className={`group relative px-4 py-3 bg-gradient-to-br ${color} text-white rounded-lg hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5`}
                        >
                            <div className="text-2xl mb-1">{icon}</div>
                            <div className="text-xs font-medium">{label}</div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Fields List */}
            <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Form Fields ({fields.length})</h3>
                <div className="space-y-3">
                    {fields.length === 0 ? (
                        <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                            <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
                                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                            </div>
                            <p className="text-gray-600 font-medium">No fields added yet</p>
                            <p className="text-gray-500 text-sm mt-1">Click a field type above to get started</p>
                        </div>
                    ) : (
                        fields.map((field, index) => (
                            <div key={field.id} className="group flex items-center gap-3 p-4 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h4 className="font-semibold text-gray-900">{field.label}</h4>
                                        {field.required && (
                                            <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-medium rounded">Required</span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-gray-600">
                                        <span className="inline-flex items-center gap-1">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                            </svg>
                                            {field.type}
                                        </span>
                                        <span className="text-gray-400">•</span>
                                        <span className="font-mono text-xs text-gray-500">{field.id}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1">
                                    <button
                                        onClick={() => moveField(index, 'up')}
                                        disabled={index === 0}
                                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                        title="Move Up"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={() => moveField(index, 'down')}
                                        disabled={index === fields.length - 1}
                                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                        title="Move Down"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={() => editField(field)}
                                        className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                        title="Edit Field"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={() => deleteField(field.id)}
                                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Delete Field"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Edit Modal */}
            {showModal && editingField && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 rounded-t-2xl">
                            <h3 className="text-xl font-bold text-white">Edit Field Properties</h3>
                        </div>

                        <div className="p-6 space-y-5">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Field Label *</label>
                                <input
                                    type="text"
                                    value={editingField.label}
                                    onChange={(e) => setEditingField({ ...editingField, label: e.target.value })}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    placeholder="Enter field label"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Placeholder Text</label>
                                <input
                                    type="text"
                                    value={editingField.placeholder || ''}
                                    onChange={(e) => setEditingField({ ...editingField, placeholder: e.target.value })}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    placeholder="Enter placeholder text"
                                />
                            </div>

                            {(editingField.type === 'select' || editingField.type === 'radio') && (
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Options (one per line)</label>
                                    <textarea
                                        value={editingField.options?.join('\n') || ''}
                                        onChange={(e) => setEditingField({ ...editingField, options: e.target.value.split('\n') })}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        rows={4}
                                        placeholder="Option 1&#10;Option 2&#10;Option 3"
                                    />
                                </div>
                            )}

                            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                                <input
                                    type="checkbox"
                                    id="required"
                                    checked={editingField.required}
                                    onChange={(e) => setEditingField({ ...editingField, required: e.target.checked })}
                                    className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <label htmlFor="required" className="text-sm font-medium text-gray-700 cursor-pointer">
                                    This field is required
                                </label>
                            </div>

                            <div className="pt-4 border-t border-gray-200">
                                <button
                                    onClick={() => setShowAdvanced(!showAdvanced)}
                                    className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
                                >
                                    {showAdvanced ? (
                                        <>
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                            </svg>
                                            Hide Advanced Settings
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                            Show Advanced Settings
                                        </>
                                    )}
                                </button>
                                {showAdvanced && (
                                    <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                                        <label className="block text-xs font-semibold text-gray-700 mb-2">Field Key (ID)</label>
                                        <input
                                            type="text"
                                            value={editingField.id}
                                            onChange={(e) => setEditingField({ ...editingField, id: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono"
                                        />
                                        <p className="text-xs text-gray-600 mt-2">Unique identifier used by the backend to map form data.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="sticky bottom-0 bg-gray-50 px-6 py-4 rounded-b-2xl flex gap-3 justify-end border-t border-gray-200">
                            <button
                                onClick={() => {
                                    setShowModal(false);
                                    setEditingField(null);
                                }}
                                className="px-6 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={saveField}
                                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all font-medium shadow-lg"
                            >
                                Save Field
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SimpleFormBuilder;
