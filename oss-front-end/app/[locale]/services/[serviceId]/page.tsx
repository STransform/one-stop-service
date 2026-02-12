"use client";

import React, { useState } from "react";
import { useLocale } from "next-intl";
import { notFound, useParams } from "next/navigation";
import { getServiceById, getFormSchema } from "@/lib/mock-db";
import { FormEngine } from "@/components/FormEngine";
import { useSession } from "next-auth/react";
import { Building2, Clock, Coins, FileText, CheckCircle, ArrowRight, Info, Copy } from "lucide-react";
import { LocalizedString } from "@/types/data-model";
import { Link, useRouter } from "@/i18n/routing";
import { registerApplication } from "@/app/[locale]/actions/application";

const getStr = (obj: LocalizedString | undefined, locale: string) => {
    if (!obj) return "";
    return obj[locale] || obj['en'] || "";
};

export default function ServicePage() {
    const params = useParams();
    const serviceId = params?.serviceId as string;
    const locale = useLocale();
    const { data: session } = useSession();
    const [isApplying, setIsApplying] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [regResult, setRegResult] = useState<{ id: string } | null>(null);
    const router = useRouter();

    const service = getServiceById(serviceId);

    if (!service) {
        notFound();
    }

    const schema = getFormSchema(service.form_schema_id);

    const handleSubmit = async (data: any) => {
        setSubmitting(true);
        try {
            const result = await registerApplication(serviceId, data);
            if (result.success && result.applicationId) {
                setRegResult({ id: result.applicationId });
            } else {
                alert(result.error || "Submission failed");
            }
        } catch (error) {
            console.error("Submission error:", error);
            alert("An unexpected error occurred.");
        } finally {
            setSubmitting(false);
        }
    };

    // View: Application Form
    if (isApplying && schema) {
        if (!session) {
            return (
                <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600 mb-6">
                        <Building2 size={32} />
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">Authentication Required</h1>
                    <p className="text-slate-600 max-w-md mb-8">
                        You need to be logged in with your Fayda ID to apply for <strong>{getStr(service.title, locale)}</strong>.
                    </p>
                    <Link href="/auth/login" className="bg-primary text-white px-8 py-3 rounded-full font-bold shadow-lg hover:shadow-xl hover:bg-primary/90 transition-all">
                        Login with Fayda
                    </Link>
                    <button onClick={() => setIsApplying(false)} className="mt-6 text-slate-500 hover:text-slate-800 font-medium">
                        &larr; Back to Service Details
                    </button>
                </div>
            )
        }

        if (regResult) {
            return (
                <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center text-center animate-in zoom-in-95 duration-500">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-8 shadow-inner shadow-green-200">
                        <CheckCircle size={40} />
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">Application Successful!</h1>
                    <p className="text-slate-600 max-w-md mb-10">
                        Your application for <strong>{getStr(service.title, locale)}</strong> has been submitted.
                        Please save your tracking ID below.
                    </p>

                    <div className="bg-slate-900 text-white p-6 rounded-2xl mb-10 w-full max-w-sm relative group">
                        <p className="text-xs text-slate-400 uppercase font-bold tracking-widest mb-2">Tracking ID</p>
                        <div className="text-2xl font-mono font-bold tracking-wider mb-2">{regResult.id}</div>
                        <button
                            onClick={() => {
                                navigator.clipboard.writeText(regResult.id);
                                alert("Tracking ID copied!");
                            }}
                            className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-lg transition-colors"
                        >
                            <Copy size={18} />
                        </button>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <Link href={`/track-request`} className="bg-primary text-white px-8 py-3 rounded-full font-bold shadow-lg hover:shadow-xl hover:bg-primary/90 transition-all flex items-center gap-2">
                            Track Status <ArrowRight size={18} />
                        </Link>
                        <Link href="/" className="bg-white text-slate-700 border border-slate-200 px-8 py-3 rounded-full font-bold hover:bg-slate-50 transition-all">
                            Back to Home
                        </Link>
                    </div>
                </div>
            )
        }

        return (
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                <button onClick={() => setIsApplying(false)} className="mb-6 text-slate-500 hover:text-slate-800 font-medium flex items-center gap-2">
                    &larr; Back to Service Details
                </button>
                <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg flex gap-3 text-blue-800 text-sm mb-6">
                    <Info className="shrink-0" size={20} />
                    <p>
                        You are applying for <strong>{getStr(service.title, locale)}</strong>.
                        Ensure all information provided is accurate. False declarations may lead to rejection.
                    </p>
                </div>
                <FormEngine schema={schema} onSubmit={handleSubmit} />
                {submitting && (
                    <div className="fixed inset-0 bg-white/60 backdrop-blur-sm z-50 flex items-center justify-center">
                        <div className="bg-white p-8 rounded-2xl shadow-2xl flex flex-col items-center gap-4">
                            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                            <p className="font-bold text-slate-800">Registering your application...</p>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    // View: Service Landing / Metadata
    return (
        <div className="container mx-auto px-4 py-12 max-w-6xl">
            {/* Header */}
            <div className="mb-12 text-center md:text-left">
                <div className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold mb-4 uppercase tracking-wider">
                    {service.sector_id}
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 leading-tight">
                    {getStr(service.title, locale)}
                </h1>
                <p className="text-lg text-slate-600 max-w-3xl leading-relaxed">
                    {getStr(service.description, locale)}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Main Content: Attributes & Requirements */}
                <div className="md:col-span-2 space-y-8">
                    {/* Key Attributes */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                            <div className="flex items-center gap-2 text-slate-500 mb-1 text-sm font-medium">
                                <Clock size={16} /> Processing Time
                            </div>
                            <div className="text-xl font-bold text-slate-800">{service.attributes.sla_hours} Hours</div>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                            <div className="flex items-center gap-2 text-slate-500 mb-1 text-sm font-medium">
                                <Coins size={16} /> Service Fee
                            </div>
                            <div className="text-xl font-bold text-slate-800">
                                {service.attributes.fee} {service.attributes.currency}
                            </div>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                            <div className="flex items-center gap-2 text-slate-500 mb-1 text-sm font-medium">
                                <CheckCircle size={16} /> Status
                            </div>
                            <div className="text-xl font-bold text-green-600">Active</div>
                        </div>
                    </div>

                    {/* Requirements List */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
                        <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                            <FileText size={24} className="text-primary" />
                            Required Documents
                        </h2>

                        {service.requirements.length > 0 ? (
                            <div className="space-y-4">
                                {service.requirements.map((req, idx) => (
                                    <div key={idx} className="flex items-start gap-4 p-4 rounded-lg bg-slate-50 border border-slate-100">
                                        <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${req.mandatory ? 'bg-red-500' : 'bg-green-500'}`}></div>
                                        <div>
                                            <h3 className="font-bold text-slate-800 capitalize">
                                                {req.doc_type.replace('_', ' ')}
                                                {!req.mandatory && <span className="text-xs font-normal text-slate-500 ml-2">(Optional)</span>}
                                            </h3>
                                            {req.description && (
                                                <p className="text-sm text-slate-600 mt-1">{getStr(req.description, locale)}</p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-slate-500 italic">No specific documents required for this service.</p>
                        )}
                    </div>
                </div>

                {/* Sidebar: Action Card */}
                <div className="md:col-span-1">
                    <div className="sticky top-24 bg-white p-6 rounded-2xl border border-slate-200 shadow-lg">
                        <h3 className="text-xl font-bold text-slate-800 mb-2">Ready to Apply?</h3>
                        <p className="text-slate-600 text-sm mb-6">
                            Make sure you have all required documents ready in digital format (PDF/JPG).
                        </p>

                        <button
                            onClick={() => setIsApplying(true)}
                            className="w-full bg-primary text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-transform active:scale-95 shadow-md shadow-primary/20"
                        >
                            Start Application <ArrowRight size={20} />
                        </button>

                        <div className="mt-6 pt-6 border-t border-slate-100">
                            <h4 className="font-bold text-slate-800 text-sm mb-2">Need Assistance?</h4>
                            <p className="text-xs text-slate-500 mb-3">
                                Contact our support center or visit the nearest OSS center.
                            </p>
                            <div className="text-primary text-sm font-bold">Call 9988 (Free)</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
