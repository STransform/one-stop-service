"use client";

import React, { useEffect, useState } from "react";
import { Link } from "@/i18n/routing";
import { ArrowLeft, Building2 } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { getFormByContext } from "@/lib/formApi";
import { createBureau, updateBureau, getBureauById, createBureauFromForm } from '@/lib/coreApi';
import DynamicFormRenderer from '@/components/forms/ui/DynamicFormRenderer';

function SectorForm() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const editId = searchParams.get("edit");

    const [formSchema, setFormSchema] = useState<any>(null);
    const [initialData, setInitialData] = useState<any>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadResources = async () => {
            setLoading(true);
            try {
                // 1. Fetch Form Definition using BUREAU_REGISTRY context
                const schema = await getFormByContext('BUREAU_REGISTRY');
                if (!schema) {
                    setError("Form definition 'BUREAU_REGISTRY' not found. Please create it in the Form Builder first.");
                    return;
                }

                // Parse schemaJson if it's a string
                let parsedSchema = schema.schemaJson;
                if (typeof parsedSchema === 'string') {
                    try {
                        parsedSchema = JSON.parse(parsedSchema);
                    } catch (e) {
                        console.error("Failed to parse form schema JSON", e);
                        setError("Invalid form schema definition.");
                        return;
                    }
                }
                setFormSchema(parsedSchema);

                // 2. Fetch Existing Data if Editing
                if (editId) {
                    const bureau = await getBureauById(editId);
                    setInitialData({
                        code: bureau.code,
                        name: bureau.name,
                        description: bureau.description || ''
                    });
                }
            } catch (err: any) {
                console.error("Error loading form resources:", err);
                setError(err.message || "Failed to load form resources");
            } finally {
                setLoading(false);
            }
        };

        loadResources();
    }, [editId]);

    const handleSubmit = async (formData: any) => {
        try {
            if (editId) {
                await updateBureau(editId as string, formData);
                alert('Bureau updated successfully');
            } else {
                // Use backend-driven form submission with field mapping
                await createBureauFromForm(formData, undefined, formSchema);
                alert('Bureau created successfully');
            }
            router.push("/admin/sectors");
        } catch (err: any) {
            console.error(err);
            alert("Failed to save bureau: " + err.message);
        }
    };

    if (loading) {
        return <div className="p-8 text-center text-slate-500">Loading form...</div>;
    }

    if (error) {
        return (
            <div className="p-8 text-center">
                <div className="text-red-500 font-bold mb-2">Error</div>
                <div className="text-slate-600">{error}</div>
                <Link href="/admin/sectors" className="text-primary hover:underline mt-4 inline-block">
                    Return to List
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/admin/sectors" className="p-2 hover:bg-slate-100 rounded-full text-slate-500">
                    <ArrowLeft size={20} />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">
                        {editId ? "Edit Bureau" : "Register New Bureau"}
                    </h1>
                    <p className="text-slate-500 text-sm">
                        {editId ? "Update bureau details" : "Add a new government bureau to the registry."}
                    </p>
                </div>
            </div>

            <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-4 text-primary border-b pb-4 mb-6">
                    <div className="bg-blue-50 p-2 rounded-lg">
                        <Building2 size={24} />
                    </div>
                    <h2 className="text-lg font-bold text-slate-800">Bureau Details</h2>
                </div>

                {formSchema && (
                    <DynamicFormRenderer
                        schema={formSchema}
                        initialData={initialData}
                        onSubmit={handleSubmit}
                    />
                )}
            </div>
        </div>
    );
}

export default function NewSectorPage() {
    return (
        <React.Suspense fallback={<div className="p-8 text-center text-slate-500 italic">Loading...</div>}>
            <SectorForm />
        </React.Suspense>
    );
}
