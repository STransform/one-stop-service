"use client";

import React from 'react';
import { CheckCircle2, Clock, ShieldCheck, AlertCircle, ArrowRight, FileText, Calendar } from 'lucide-react';

export type ApplicationStatus = "DRAFT" | "SUBMITTED" | "PENDING_VERIFICATION" | "APPROVED" | "REJECTED";

interface TrackingResultsProps {
    applicationId: string;
    status: ApplicationStatus;
    submittedAt?: string;
    serviceName?: string;
}

const steps = [
    { key: "SUBMITTED", label: "Submitted", icon: FileText },
    { key: "PENDING_VERIFICATION", label: "Verification", icon: ShieldCheck },
    { key: "APPROVED", label: "Approval", icon: CheckCircle2 },
    { key: "COMPLETED", label: "Completed", icon: Calendar },
];

export function TrackingResults({ applicationId, status, submittedAt, serviceName }: TrackingResultsProps) {
    const currentStepIndex = steps.findIndex(step => step.key === status) === -1
        ? (status === "REJECTED" ? 1 : 0) // Simplify for demo
        : steps.findIndex(step => step.key === status);

    const isRejected = status === "REJECTED";

    return (
        <div className="w-full max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Status Summary Card */}
            <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
                <div className="p-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <p className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-1">Application Tracking ID</p>
                            <h3 className="text-2xl font-bold text-slate-900">{applicationId}</h3>
                            {serviceName && (
                                <p className="text-slate-600 mt-2 flex items-center gap-2">
                                    <span className="font-semibold text-primary">{serviceName}</span>
                                </p>
                            )}
                        </div>
                        <div className={`px-6 py-3 rounded-full flex items-center gap-3 ${isRejected ? 'bg-red-50 text-red-700 border border-red-100' :
                                status === 'APPROVED' ? 'bg-green-50 text-green-700 border border-green-100' :
                                    'bg-blue-50 text-blue-700 border border-blue-100'
                            }`}>
                            {isRejected ? <AlertCircle size={20} /> : <Clock size={20} />}
                            <span className="font-bold">{status.replace('_', ' ')}</span>
                        </div>
                    </div>

                    <div className="mt-10 border-t border-slate-100 pt-8">
                        <div className="relative">
                            {/* Progress Line */}
                            <div className="absolute top-5 left-0 w-full h-0.5 bg-slate-100 -z-0"></div>
                            <div
                                className={`absolute top-5 left-0 h-0.5 bg-primary transition-all duration-1000 -z-0`}
                                style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
                            ></div>

                            {/* Steps */}
                            <div className="relative z-10 flex justify-between">
                                {steps.map((step, index) => {
                                    const Icon = step.icon;
                                    const isCompleted = index <= currentStepIndex;
                                    const isActive = index === currentStepIndex;

                                    return (
                                        <div key={step.key} className="flex flex-col items-center">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 border-2 ${isCompleted
                                                    ? 'bg-primary border-primary text-white'
                                                    : 'bg-white border-slate-200 text-slate-400'
                                                } ${isActive ? 'ring-4 ring-primary/20 scale-110' : ''}`}>
                                                {isCompleted ? <CheckCircle2 size={20} /> : <Icon size={20} />}
                                            </div>
                                            <span className={`mt-3 text-xs font-bold uppercase tracking-tight ${isCompleted ? 'text-primary' : 'text-slate-400'
                                                }`}>
                                                {step.label}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-50 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="p-2 bg-white rounded-lg border border-slate-200">
                            <Calendar className="text-slate-400" size={20} />
                        </div>
                        <div>
                            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Submitted Date</p>
                            <p className="text-sm font-semibold text-slate-700">{submittedAt || new Date().toLocaleDateString()}</p>
                        </div>
                    </div>
                    <button className="text-primary font-bold text-sm flex items-center gap-2 hover:underline">
                        View Full Details <ArrowRight size={16} />
                    </button>
                </div>
            </div>

            {/* Help Card */}
            <div className="bg-primary/5 rounded-2xl p-6 border border-primary/10 flex items-start gap-4">
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shrink-0">
                    <Clock size={20} />
                </div>
                <div>
                    <h4 className="font-bold text-slate-900">What happens next?</h4>
                    <p className="text-sm text-slate-600 mt-1">
                        Our officers are currently reviewing your documents. You will receive an SMS notification once the verification stage is complete.
                    </p>
                </div>
            </div>
        </div>
    );
}
