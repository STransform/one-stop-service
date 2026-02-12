"use client";

import React, { useState } from "react";
import { Link } from "@/i18n/routing";
import { api } from "@/lib/api-client";
import { Sector, ServiceDefinition } from "@/types/data-model";
import { useForm, useFieldArray, FormProvider } from "react-hook-form";
import { ArrowLeft, Save, Plus, Trash2 } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";

function ServiceForm() {
    const [sectors, setSectors] = useState<Sector[]>([]);
    const [availableSchemas, setAvailableSchemas] = useState<string[]>([]);
    const [existingService, setExistingService] = useState<ServiceDefinition | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const searchParams = useSearchParams();
    const router = useRouter();
    const editId = searchParams.get("edit");

    React.useEffect(() => {
        const loadInitialData = async () => {
            try {
                const [sectorsData, schemasData] = await Promise.all([
                    api.getSectors(),
                    api.getAllFormSchemas()
                ]);
                setSectors(sectorsData);
                setAvailableSchemas(Object.keys(schemasData));

                if (editId) {
                    const service = await api.getServiceById(editId);
                    if (service) setExistingService(service);
                }
            } catch (err) {
                console.error("Failed to load initial data", err);
            } finally {
                setIsLoading(false);
            }
        };
        loadInitialData();
    }, [editId]);

    // Using RHF for the complex wizard state
    const methods = useForm();
    const { register, control, handleSubmit, reset } = methods;

    // Reset form when existingService is loaded
    React.useEffect(() => {
        if (existingService) {
            reset({
                title_en: existingService.title.en,
                title_om: existingService.title.om,
                sector_id: existingService.sector_id,
                fee: existingService.attributes.fee,
                currency: existingService.attributes.currency,
                sla_hours: existingService.attributes.sla_hours,
                requirements: existingService.requirements,
                form_schema_id: existingService.form_schema_id,
                workflow_process_key: existingService.workflow_process_key
            });
        }
    }, [existingService, reset]);

    const { fields, append, remove } = useFieldArray({
        control,
        name: "requirements"
    });

    const onSubmit = async (data: any) => {
        const payload: Partial<ServiceDefinition> = {
            sector_id: data.sector_id,
            title: {
                en: data.title_en,
                om: data.title_om
            },
            attributes: {
                fee: parseFloat(data.fee),
                currency: data.currency,
                sla_hours: parseInt(data.sla_hours)
            },
            requirements: data.requirements,
            form_schema_id: data.form_schema_id,
            workflow_process_key: data.workflow_process_key,
            enabled: true
        };

        try {
            if (editId) {
                await api.updateService(editId, payload);
                alert("Service Updated Successfully!");
            } else {
                await api.createService(payload);
                alert("Service Registered Successfully!");
            }
            router.push("/admin/services");
        } catch (err) {
            console.error("Save error:", err);
            alert("Failed to save service.");
        }
    };

    if (isLoading) return <div className="p-8 text-center text-slate-500 italic">Connecting to Service Catalog...</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/admin/services" className="p-2 hover:bg-slate-100 rounded-full text-slate-500">
                    <ArrowLeft size={20} />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">
                        {editId ? "Edit Service" : "Register New Service"}
                    </h1>
                    <p className="text-slate-500 text-sm">
                        {editId ? `Updating configuration for ${existingService?.title.en}` : "Define metadata and requirements for a new government service."}
                    </p>
                </div>
            </div>

            <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                    {/* Section 1: Basic Info */}
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                        <h2 className="text-lg font-bold text-slate-800 border-b pb-2">1. Basic Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Service Title (English)</label>
                                <input {...register("title_en", { required: true })} className="w-full px-3 py-2 border rounded-lg" placeholder="e.g. Mining License" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Service Title (Afaan Oromo)</label>
                                <input {...register("title_om")} className="w-full px-3 py-2 border rounded-lg" placeholder="e.g. Hayyama Albuudaa" />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-slate-700 mb-1">Sector / Bureau</label>
                                <select {...register("sector_id", { required: true })} className="w-full px-3 py-2 border rounded-lg bg-white">
                                    <option value="">Select Sector...</option>
                                    {sectors.map(s => (
                                        <option key={s.id} value={s.id}>{s.name['en']}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Attributes */}
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                        <h2 className="text-lg font-bold text-slate-800 border-b pb-2">2. Service Attributes</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Service Fee</label>
                                <input type="number" {...register("fee", { required: true })} className="w-full px-3 py-2 border rounded-lg" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Currency</label>
                                <select {...register("currency")} className="w-full px-3 py-2 border rounded-lg bg-white">
                                    <option value="ETB">ETB</option>
                                    <option value="USD">USD</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">SLA (Hours)</label>
                                <input type="number" {...register("sla_hours", { required: true })} className="w-full px-3 py-2 border rounded-lg" />
                            </div>
                        </div>
                    </div>

                    {/* Section 3: Requirements */}
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                        <div className="flex items-center justify-between border-b pb-2">
                            <h2 className="text-lg font-bold text-slate-800">3. Document Requirements</h2>
                            <button type="button" onClick={() => append({ doc_type: "", mandatory: false })} className="text-sm text-primary font-bold flex items-center gap-1">
                                <Plus size={16} /> Add Document
                            </button>
                        </div>

                        <div className="space-y-3">
                            {fields.map((field, index) => (
                                <div key={field.id} className="flex gap-4 items-end bg-slate-50 p-3 rounded-lg">
                                    <div className="flex-1">
                                        <label className="text-xs font-semibold text-slate-500 uppercase">Document Type ID</label>
                                        <input
                                            {...register(`requirements.${index}.doc_type` as const, { required: true })}
                                            className="w-full px-2 py-1.5 border rounded"
                                            placeholder="e.g. passport_copy"
                                        />
                                    </div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <input
                                            type="checkbox"
                                            {...register(`requirements.${index}.mandatory` as const)}
                                            className="w-4 h-4 rounded text-primary"
                                        />
                                        <label className="text-sm">Mandatory</label>
                                    </div>
                                    <button type="button" onClick={() => remove(index)} className="p-2 text-red-500 hover:bg-red-50 rounded">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Section 4: Configuration */}
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                        <h2 className="text-lg font-bold text-slate-800 border-b pb-2">4. Configuration</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Form Schema</label>
                                <select {...register("form_schema_id", { required: true })} className="w-full px-3 py-2 border rounded-lg bg-white">
                                    <option value="">Select Schema...</option>
                                    {availableSchemas.map(id => (
                                        <option key={id} value={id}>{id}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Camunda Process Key</label>
                                <input {...register("workflow_process_key", { required: true })} className="w-full px-3 py-2 border rounded-lg" placeholder="PROCESS_KEY" />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <button
                            type="submit"
                            className="bg-primary text-white px-8 py-3 rounded-lg font-bold hover:bg-primary/90 transition-all flex items-center gap-2 shadow-lg"
                        >
                            <Save size={20} />
                            {editId ? "Update Service" : "Register Service"}
                        </button>
                    </div>
                </form>
            </FormProvider>
        </div>
    );
}

export default function NewServicePage() {
    return (
        <React.Suspense fallback={<div className="p-8 text-center text-slate-500 italic">Loading form...</div>}>
            <ServiceForm />
        </React.Suspense>
    );
}
