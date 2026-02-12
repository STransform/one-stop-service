"use client";

import React, { useEffect, useState } from "react";
import { Link } from "@/i18n/routing";
import { getAllForms, deleteForm, FormSchema } from "@/lib/formApi";
import { Plus, Edit2, Trash2, Loader2, FileText, Globe, Package, Book, ShoppingCart, Archive } from "lucide-react";

export default function FormBuilderListPage() {
    const [forms, setForms] = useState<FormSchema[]>([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<number | null>(null);

    const loadForms = async () => {
        setLoading(true);
        try {
            const data = await getAllForms();
            setForms(data);
        } catch (error) {
            console.error("Failed to load forms:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadForms();
    }, []);

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this form? This action cannot be undone.")) return;

        setDeletingId(id);
        try {
            await deleteForm(id);
            setForms(forms.filter(f => f.id !== id));
        } catch (error) {
            console.error("Failed to delete form:", error);
            alert("Failed to delete form. Please try again.");
        } finally {
            setDeletingId(null);
        }
    };

    const getContextIcon = (context: string) => {
        switch (context) {
            case 'GENERAL': return <Globe size={16} className="text-blue-500" />;
            case 'PRODUCT': return <Package size={16} className="text-emerald-500" />;
            case 'BOOK': return <Book size={16} className="text-purple-500" />;
            case 'ORDER': return <ShoppingCart size={16} className="text-amber-500" />;
            case 'INVENTORY': return <Archive size={16} className="text-slate-500" />;
            default: return <FileText size={16} className="text-slate-400" />;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Form Builder</h1>
                    <p className="text-slate-500 text-sm">Manage dynamic form schemas.</p>
                </div>
                <Link
                    href="/admin/form-builder/editor"
                    className="bg-primary text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-primary/90 transition-colors shadow-sm"
                >
                    <Plus size={18} />
                    Create New Schema
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                {loading ? (
                    <div className="p-12 flex justify-center items-center text-slate-400">
                        <Loader2 className="animate-spin mr-2" size={24} />
                        Loading forms...
                    </div>
                ) : forms.length === 0 ? (
                    <div className="p-12 text-center text-slate-500">
                        <FileText size={48} className="mx-auto mb-4 text-slate-300" />
                        <h3 className="text-lg font-medium text-slate-900 mb-1">No forms found</h3>
                        <p className="mb-6">Get started by creating your first form schema.</p>
                        <Link
                            href="/admin/form-builder/editor"
                            className="text-primary font-bold hover:underline"
                        >
                            Create New Schema
                        </Link>
                    </div>
                ) : (
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4 font-semibold text-slate-700 text-sm">Context</th>
                                <th className="px-6 py-4 font-semibold text-slate-700 text-sm">Form Title</th>
                                <th className="px-6 py-4 font-semibold text-slate-700 text-sm">Status</th>
                                <th className="px-6 py-4 font-semibold text-slate-700 text-sm text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {forms.map((schema) => (
                                <tr key={schema.id} className="hover:bg-slate-50 transition-colors group">
                                    <td className="px-6 py-4 text-sm font-medium text-slate-700">
                                        <div className="flex items-center gap-2">
                                            {getContextIcon(schema.context)}
                                            <span className="capitalize">{(schema.context || 'GENERAL').toLowerCase()}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-slate-900">{schema.title}</div>
                                        <div className="text-xs text-slate-400 font-mono">ID: {schema.id}</div>
                                    </td>
                                    <td className="px-6 py-4 text-sm">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${schema.isActive
                                            ? "bg-green-100 text-green-700"
                                            : "bg-slate-100 text-slate-600"
                                            }`}>
                                            {schema.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Link
                                                href={`/admin/form-builder/editor?id=${schema.id}`}
                                                className="p-2 text-slate-400 hover:text-primary hover:bg-blue-50 rounded-lg transition-colors"
                                                title="Edit Schema"
                                            >
                                                <Edit2 size={16} />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(schema.id!)}
                                                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                disabled={deletingId === schema.id}
                                                title="Delete Schema"
                                            >
                                                {deletingId === schema.id ? (
                                                    <Loader2 size={16} className="animate-spin" />
                                                ) : (
                                                    <Trash2 size={16} />
                                                )}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}

