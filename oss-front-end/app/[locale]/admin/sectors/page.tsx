"use client";

import React from "react";
import { Link } from "@/i18n/routing";
import { getSectors } from "@/lib/mock-db";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { useLocale } from "next-intl";

export default function SectorsListPage() {
    const locale = useLocale();
    const sectors = getSectors();

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
                        {sectors.map((sector) => (
                            <tr key={sector.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="font-medium text-slate-900">{sector.name['en']}</div>
                                    <div className="text-xs text-slate-400">{sector.id}</div>
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-600">
                                    <span className="bg-slate-100 px-2 py-1 rounded text-xs font-mono">{sector.code}</span>
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-600">
                                    {sector.description ? sector.description['en'] : '-'}
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
                                            onClick={() => {
                                                if (confirm(`Are you sure you want to delete ${sector.name['en']}?`)) {
                                                    console.log("Deleting Sector:", sector.id);
                                                    alert("Bureau deletion triggered (Mock)");
                                                }
                                            }}
                                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Delete Bureau"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
