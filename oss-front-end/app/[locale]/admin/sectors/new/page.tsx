"use client";

import React from "react";
import { Link } from "@/i18n/routing";
import { useForm } from "react-hook-form";
import { ArrowLeft, Save, Building2 } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { getSectorById } from "@/lib/mock-db";

function SectorForm() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const editId = searchParams.get("edit");
    const existingSector = editId ? getSectorById(editId) : null;

    const { register, handleSubmit, reset } = useForm({
        defaultValues: existingSector ? {
            name_en: existingSector.name.en,
            name_om: existingSector.name.om,
            name_am: existingSector.name.am,
            code: existingSector.code,
            description_en: existingSector.description?.en
        } : {}
    });

    const onSubmit = (data: any) => {
        const payload = {
            id: editId || `sector_${Date.now()}`,
            code: data.code,
            name: {
                en: data.name_en,
                om: data.name_om,
                am: data.name_am
            },
            description: {
                en: data.description_en
            }
        };

        console.log(editId ? "Mock API Call - Update Sector:" : "Mock API Call - Register Sector:", payload);
        alert(editId ? "Bureau Updated Successfully! (Check Console)" : "Bureau Registered Successfully! (Check Console)");
        router.push("/admin/sectors");
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/admin/sectors" className="p-2 hover:bg-slate-100 rounded-full text-slate-500">
                    <ArrowLeft size={20} />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">
                        {editId ? "Edit Bureau" : "Register New Bureau"}
                    </h1>
                    <p className="text-slate-500 text-sm">
                        {editId ? `Updating configuration for ${existingSector?.name.en}` : "Add a new government sector to the registry."}
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm space-y-6">
                    <div className="flex items-center gap-4 text-primary border-b pb-4 mb-4">
                        <div className="bg-blue-50 p-2 rounded-lg">
                            <Building2 size={24} />
                        </div>
                        <h2 className="text-lg font-bold text-slate-800">Bureau Details</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 mb-1">Bureau Name (English) <span className="text-red-500">*</span></label>
                            <input
                                {...register("name_en", { required: true })}
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                                placeholder="e.g. Transport Bureau"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Bureau Name (Afaan Oromo)</label>
                            <input
                                {...register("name_om")}
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                                placeholder="e.g. Biiroo Geejjibaa"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Bureau Name (Amharic)</label>
                            <input
                                {...register("name_am")}
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                                placeholder="e.g. ትራንስፖርት ቢሮ"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Bureau Code <span className="text-red-500">*</span></label>
                            <input
                                {...register("code", { required: true })}
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none uppercase font-mono"
                                placeholder="e.g. OTB"
                            />
                            <p className="text-xs text-slate-400 mt-1">Unique identifier (3-5 letters)</p>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                        <textarea
                            {...register("description_en")}
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none min-h-[100px]"
                            placeholder="Brief description of the bureau's mandate..."
                        />
                    </div>
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="bg-primary text-white px-8 py-3 rounded-lg font-bold hover:bg-primary/90 transition-all flex items-center gap-2 shadow-lg"
                    >
                        <Save size={20} />
                        {editId ? "Update Bureau" : "Register Bureau"}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default function NewSectorPage() {
    return (
        <React.Suspense fallback={<div className="p-8 text-center text-slate-500 italic">Loading form...</div>}>
            <SectorForm />
        </React.Suspense>
    );
}
