"use client";

import React, { useEffect, useState } from "react";
import { Link } from "@/i18n/routing";
import { getAllBureaus, deleteBureau, BureauRegistry } from "@/lib/coreApi";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { useLocale } from "next-intl";

export default function SectorsListPage() {
    const locale = useLocale();
    const [sectors, setSectors] = useState<BureauRegistry[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadBureaus();
    }, []);

    const loadBureaus = async () => {
        try {
            setLoading(true);
            const data = await getAllBureaus();
            setSectors(data);
        } catch (err: any) {
            console.error("Failed to load bureaus:", err);
            setError("Failed to load bureaus. Please ensure backend services are running.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string, name: string) => {
        if (confirm(`Are you sure you want to delete ${name}?`)) {
            try {
                await deleteBureau(id);
                alert("Bureau deleted successfully");
                loadBureaus(); // Refresh list
            } catch (err: any) {
                alert("Failed to delete bureau: " + err.message);
            }
        }
    };

    if (loading) return <div className="p-8 text-center text-slate-500">Loading bureaus...</div>;
    if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Bureau Registry</h1>
                    <p className="text-slate-500 text-sm">Manage government bureaus and departments.</p>
                </div>
                <Link
                    href="/admin/sectors/new"
                    className="bg-primary text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-primary/90 transition-colors"
                >
                    <Plus size={18} />
                    Register New Bureau
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-4 font-semibold text-slate-700 text-sm">Bureau Name</th>
                            <th className="px-6 py-4 font-semibold text-slate-700 text-sm">Code</th>
                            <th className="px-6 py-4 font-semibold text-slate-700 text-sm">Description</th>
                            <th className="px-6 py-4 font-semibold text-slate-700 text-sm text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {sectors.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                                    No bureaus registered yet. Click "Register New Bureau" to add one.
                                </td>
                            </tr>
                        ) : (
                            sectors.map((sector) => (
                                <tr key={sector.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-slate-900">
                                            {sector.name}
                                        </div>
                                        {/* <div className="text-xs text-slate-400">{sector.id}</div> */}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600">
                                        <span className="bg-slate-100 px-2 py-1 rounded text-xs font-mono">{sector.code}</span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600">
                                        {sector.description || '-'}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link
                                                href={`/admin/sectors/new?edit=${sector.id}`}
                                                className="p-2 text-slate-400 hover:text-primary hover:bg-blue-50 rounded-lg transition-colors"
                                                title="Edit Bureau"
                                            >
                                                <Edit2 size={16} />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(sector.id, sector.name)}
                                                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Delete Bureau"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
