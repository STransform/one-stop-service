"use client";

import React from "react";
import { useForm, FormProvider, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Calendar, Upload, MapPin, CheckCircle } from "lucide-react";

export type FieldType = "text" | "number" | "date" | "file" | "map" | "select" | "email" | "textarea";

export interface FormFieldSchema {
    id: string;
    name: string;
    label: string;
    type: FieldType;
    required?: boolean;
    placeholder?: string;
    options?: { label: string; value: string }[]; // For select
    conditional?: {
        field: string;
        value: any;
    };
    description?: string;
}

export interface FormSchema {
    title: string;
    description?: string;
    fields: FormFieldSchema[];
}

interface FormEngineProps {
    schema: FormSchema;
    onSubmit: (data: any) => void;
}

export function FormEngine({ schema, onSubmit }: FormEngineProps) {
    // Generate Zod schema dynamically
    const schemaShape: Record<string, any> = {};

    schema.fields.forEach((field) => {
        let validator: any = z.any();

        // Base validator based on type
        switch (field.type) {
            case "text":
            case "textarea":
            case "select":
                validator = z.string();
                if (field.required) validator = (validator as z.ZodString).min(1, `${field.label} is required`);
                break;
            case "email":
                validator = z.string().email("Invalid email address");
                if (field.required) validator = (validator as z.ZodString).min(1, `${field.label} is required`);
                break;
            case "number":
                validator = z.coerce.number();
                if (field.required) validator = (validator as z.ZodNumber).min(1, `${field.label} is required`);
                break;
            case "date":
                validator = z.string();
                if (field.required) validator = (validator as z.ZodString).min(1, `${field.label} is required`);
                break;
            case "file":
                // Basic validation for now - just check if something is there
                validator = z.any();
                break;
            case "map":
                validator = z.object({
                    lat: z.number(),
                    lng: z.number(),
                });
                break;
        }

        schemaShape[field.name] = field.required ? validator : validator.optional();
    });

    const dynamicSchema = z.object(schemaShape);

    const methods = useForm({
        resolver: zodResolver(dynamicSchema),
        mode: "onChange"
    });

    return (
        <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)} className="bg-white p-8 rounded-xl shadow-sm border border-slate-100">
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-primary border-b pb-2">{schema.title}</h2>
                    {schema.description && <p className="text-slate-500 mt-2">{schema.description}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {schema.fields.map((field) => (
                        <ConditionalField key={field.id} field={field} control={methods.control}>
                            <div className={`flex flex-col gap-1.5 ${['map', 'textarea', 'file'].includes(field.type) ? 'md:col-span-2' : ''}`}>
                                <label className="text-sm font-semibold text-slate-700 flex items-center justify-between">
                                    <span>
                                        {field.label} {field.required && <span className="text-destructive text-red-500">*</span>}
                                    </span>
                                </label>
                                {field.description && <span className="text-xs text-slate-500 mb-1">{field.description}</span>}

                                {renderField(field, methods)}

                                {methods.formState.errors[field.name] && (
                                    <span className="text-xs text-red-500 font-medium">
                                        {methods.formState.errors[field.name]?.message as string}
                                    </span>
                                )}
                            </div>
                        </ConditionalField>
                    ))}
                </div>

                <div className="mt-8 pt-6 border-t flex justify-end">
                    <button
                        type="submit"
                        disabled={methods.formState.isSubmitting}
                        className="bg-primary text-primary-foreground text-white px-8 py-3 rounded-lg font-bold hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {methods.formState.isSubmitting ? (
                            <span>Processing...</span>
                        ) : (
                            <>
                                <CheckCircle size={18} />
                                Submit Application
                            </>
                        )}
                    </button>
                </div>
            </form>
        </FormProvider>
    );
}

// Wrapper for conditional rendering
function ConditionalField({ field, control, children }: { field: FormFieldSchema, control: any, children: React.ReactNode }) {
    const formValues = useWatch({ control });

    if (!field.conditional) return <>{children}</>;

    const dependencyValue = formValues[field.conditional.field];
    if (dependencyValue !== field.conditional.value) {
        return null;
    }

    return <>{children}</>;
}


function renderField(field: FormFieldSchema, methods: any) {
    const { register, setValue, watch } = methods;

    const baseInputClass = "w-full px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-slate-400 text-sm";

    switch (field.type) {
        case "text":
        case "email":
        case "number":
            return (
                <input
                    type={field.type}
                    {...register(field.name)}
                    placeholder={field.placeholder}
                    className={baseInputClass}
                />
            );
        case "textarea":
            return (
                <textarea
                    {...register(field.name)}
                    placeholder={field.placeholder}
                    className={`${baseInputClass} min-h-[100px] resize-y`}
                />
            );
        case "select":
            return (
                <div className="relative">
                    <select
                        {...register(field.name)}
                        className={`${baseInputClass} appearance-none bg-white`}
                    >
                        <option value="">Select an option</option>
                        {field.options?.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                    <div className="absolute right-3 top-3 pointer-events-none text-slate-500">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                </div>
            )
        case "date":
            return (
                <div className="relative">
                    <input
                        type="date"
                        {...register(field.name)}
                        className={`${baseInputClass} pl-10`}
                    />
                    <Calendar className="absolute left-3 top-2.5 text-slate-400 pointer-events-none" size={18} />
                </div>
            );
        case "file":
            const fileName = watch(field.name);
            return (
                <div className="group relative">
                    <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-lg p-8 bg-slate-50 hover:bg-blue-50/50 hover:border-primary/50 transition-all cursor-pointer relative">
                        <Upload className="text-slate-400 mb-3 group-hover:text-primary transition-colors" size={32} />

                        {fileName ? (
                            <div className="text-center">
                                <p className="text-sm font-semibold text-primary">{fileName.name || fileName}</p>
                                <p className="text-xs text-green-600 mt-1">File selected</p>
                            </div>
                        ) : (
                            <div className="text-center">
                                <span className="text-sm text-slate-600 font-medium">Click to upload or drag and drop</span>
                                <p className="text-xs text-slate-400 mt-1">PDF, JPG, PNG up to 10MB</p>
                            </div>
                        )}

                        <input
                            type="file"
                            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) setValue(field.name, file.name); // Storing name for demo, normally file object
                            }}
                        />
                    </div>
                </div>
            );
        case "map":
            return (
                <div className="h-48 w-full bg-slate-100 rounded-lg border flex flex-col items-center justify-center relative overflow-hidden group">
                    <div className="absolute inset-0 bg-slate-200 bg-[linear-gradient(#e5e7eb_1px,transparent_1px),linear-gradient(90deg,#e5e7eb_1px,transparent_1px)] bg-[size:20px_20px]"></div>
                    <div className="relative z-10 flex flex-col items-center gap-2">
                        <MapPin className="text-primary animate-bounce shadow-xl" size={32} />
                        <button
                            type="button"
                            onClick={() => setValue(field.name, { lat: 8.54, lng: 39.27 })} // Mock location
                            className="bg-white px-4 py-2 rounded-full shadow-md text-sm font-bold text-primary hover:bg-primary hover:text-white transition-all ring-1 ring-primary/10"
                        >
                            Select Location on Map
                        </button>
                        {watch(field.name) && (
                            <span className="bg-primary/90 text-white px-3 py-1 rounded text-xs font-mono shadow-sm">
                                Lat: {watch(field.name).lat}, Lng: {watch(field.name).lng}
                            </span>
                        )}
                    </div>
                </div>
            );
        default:
            return null;
    }
}
