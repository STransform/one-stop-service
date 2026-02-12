"use client";

import React, { Suspense } from "react";
import { FormBuilder } from '@/components/admin/FormBuilder';
import { useSearchParams, useRouter } from "next/navigation";
import { getFormSchema } from "@/lib/mock-db";
import { Link } from "@/i18n/routing";
import { ArrowLeft } from "lucide-react";

function EditorContent() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const schemaId = searchParams.get("id");

    // Handle save completion
    const handleSaveComplete = (savedSchema: any) => {
        // Navigate back to list after successful save
        router.push("/admin/form-builder");
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/admin/form-builder" className="p-2 hover:bg-slate-100 rounded-full text-slate-500">
                    <ArrowLeft size={20} />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">
                        {schemaId ? `Edit Schema: ${schemaId}` : "Create New Schema"}
                    </h1>
                    <p className="text-slate-500 text-sm">
                        {schemaId ? "Modify existing form definition." : "Design a brand new application form from scratch."}
                    </p>
                </div>
            </div>

            <FormBuilder
                formId={schemaId}
                onSave={handleSaveComplete}
            />
        </div>
    );
}

export default function FormEditorPage() {
    return (
        <Suspense fallback={<div>Loading editor...</div>}>
            <EditorContent />
        </Suspense>
    );
}
