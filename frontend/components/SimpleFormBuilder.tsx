'use client';
import React, { useState } from 'react';

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
}

const SimpleFormBuilder: React.FC<SimpleFormBuilderProps> = ({ onChange, fieldKeyInfo }) => {
    const [fields, setFields] = useState<FormField[]>([]);
    const [editingField, setEditingField] = useState<FormField | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [showAdvanced, setShowAdvanced] = useState(false);

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

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="mb-6 flex gap-2 flex-wrap">
                <button onClick={() => addField('text')} className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm">Text</button>
                <button onClick={() => addField('number')} className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm">Number</button>
                <button onClick={() => addField('email')} className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm">Email</button>
                <button onClick={() => addField('textarea')} className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm">Text Area</button>
                <button onClick={() => addField('select')} className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm">Select</button>
                <button onClick={() => addField('checkbox')} className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm">Checkbox</button>
                <button onClick={() => addField('radio')} className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm">Radio</button>
                <button onClick={() => addField('date')} className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm">Date</button>
                <button onClick={() => addField('time')} className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm">Time</button>
                <button onClick={() => addField('datetime-local')} className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm">Date & Time</button>
                <button onClick={() => addField('file')} className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm">File</button>
                <button onClick={() => addField('url')} className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm">URL</button>
                <button onClick={() => addField('tel')} className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm">Phone</button>
                <button onClick={() => addField('color')} className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm">Color</button>
            </div>

            <div className="space-y-4">
                {fields.length === 0 ? (
                    <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                        No fields added yet. Click a button above to add a field.
                    </div>
                ) : (
                    fields.map((field, index) => (
                        <div key={field.id} className="flex items-start justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <div>
                                <h4 className="font-medium text-gray-900">{field.label}</h4>
                                <p className="text-sm text-gray-500">Type: {field.type} | Required: {field.required ? 'Yes' : 'No'}</p>
                                <p className="text-xs text-gray-400 font-mono mt-1">Key: {field.id}</p>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => moveField(index, 'up')} disabled={index === 0} className="p-1 hover:bg-gray-200 rounded disabled:opacity-50">⬆️</button>
                                <button onClick={() => moveField(index, 'down')} disabled={index === fields.length - 1} className="p-1 hover:bg-gray-200 rounded disabled:opacity-50">⬇️</button>
                                <button onClick={() => editField(field)} className="p-1 hover:bg-blue-100 text-blue-600 rounded">✏️</button>
                                <button onClick={() => deleteField(field.id)} className="p-1 hover:bg-red-100 text-red-600 rounded">🗑️</button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {showModal && editingField && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h3 className="text-lg font-bold mb-4">Edit Field</h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Label</label>
                                <input
                                    type="text"
                                    value={editingField.label}
                                    onChange={(e) => setEditingField({ ...editingField, label: e.target.value })}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Placeholder</label>
                                <input
                                    type="text"
                                    value={editingField.placeholder || ''}
                                    onChange={(e) => setEditingField({ ...editingField, placeholder: e.target.value })}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>

                            {(editingField.type === 'select' || editingField.type === 'radio') && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Options (one per line)</label>
                                    <textarea
                                        value={editingField.options?.join('\n') || ''}
                                        onChange={(e) => setEditingField({ ...editingField, options: e.target.value.split('\n') })}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        rows={3}
                                    />
                                </div>
                            )}

                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="required"
                                    checked={editingField.required}
                                    onChange={(e) => setEditingField({ ...editingField, required: e.target.checked })}
                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <label htmlFor="required" className="text-sm font-medium text-gray-700">Required</label>
                            </div>

                            <div className="pt-2 border-t border-gray-200">
                                <button
                                    onClick={() => setShowAdvanced(!showAdvanced)}
                                    className="text-sm text-blue-600 hover:text-blue-800"
                                >
                                    {showAdvanced ? 'Hide Advanced' : 'Show Advanced'}
                                </button>
                                {showAdvanced && (
                                    <div className="mt-2 p-2 bg-gray-50 rounded">
                                        <label className="block text-xs font-medium text-gray-700">Field Key (ID)</label>
                                        <input
                                            type="text"
                                            value={editingField.id}
                                            onChange={(e) => setEditingField({ ...editingField, id: e.target.value })}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-sm"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">Unique identifier for the backend.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="mt-6 flex gap-3 justify-end">
                            <button
                                onClick={() => {
                                    setShowModal(false);
                                    setEditingField(null);
                                }}
                                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={saveField}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SimpleFormBuilder;
