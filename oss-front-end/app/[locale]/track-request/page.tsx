"use client";

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Search, Loader2, ArrowLeft, HelpCircle, Clock } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { TrackingResults, ApplicationStatus } from '@/components/tracking/TrackingResults';
import { workflow } from '@/lib/workflow-engine';

export default function TrackRequestPage() {
    const t = useTranslations('Tracking');
    const [trackingId, setTrackingId] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<{ id: string; status: ApplicationStatus } | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleTrack = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!trackingId.trim()) return;

        setIsLoading(true);
        setError(null);
        setResult(null);

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            // In a real app, we would fetch from the workflow engine or a tracking service
            const status = await workflow.getProcessStatus(trackingId);

            // For demo purposes, we accept any ID that looks like a tracking ID
            if (trackingId.length > 5) {
                setResult({
                    id: trackingId,
                    status: status as ApplicationStatus
                });
            } else {
                setError(t('notFound'));
            }
        } catch (err) {
            setError('An error occurred while fetching the status.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Simple Header */}
            <div className="bg-primary text-white py-16 md:py-24 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <Link href="/" className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors mb-8 text-sm font-medium">
                        <ArrowLeft size={16} /> Back to Portal
                    </Link>
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">
                        {t('title')}
                    </h1>
                    <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto">
                        {t('description')}
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 -mt-12 md:-mt-16 pb-20 relative z-20">
                {/* Search Form Card */}
                <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-2xl p-2 mb-12 border border-slate-100 flex flex-col md:flex-row gap-2">
                    <div className="relative flex-1">
                        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400">
                            <Search size={24} />
                        </div>
                        <input
                            type="text"
                            value={trackingId}
                            onChange={(e) => setTrackingId(e.target.value)}
                            placeholder={t('inputPlaceholder')}
                            className="w-full pl-16 pr-6 py-6 md:py-7 bg-transparent text-xl font-medium outline-none placeholder:text-slate-300"
                        />
                    </div>
                    <button
                        onClick={handleTrack}
                        disabled={isLoading || !trackingId.trim()}
                        className="bg-primary text-white px-10 py-5 rounded-xl font-extrabold text-lg hover:brightness-110 transition-all shadow-lg flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group"
                    >
                        {isLoading ? (
                            <Loader2 className="animate-spin" size={24} />
                        ) : (
                            <>
                                <span>{t('buttonLabel')}</span>
                                <Search size={20} className="group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>
                </div>

                {/* Loading State Skeleton (Optional) */}
                {isLoading && (
                    <div className="max-w-4xl mx-auto space-y-4 animate-pulse">
                        <div className="h-64 bg-white rounded-2xl border border-slate-100"></div>
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="max-w-md mx-auto bg-red-50 border border-red-100 text-red-700 p-6 rounded-2xl text-center space-y-4 animate-in zoom-in-95 duration-300">
                        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                            <HelpCircle size={24} />
                        </div>
                        <p className="font-bold">{error}</p>
                    </div>
                )}

                {/* Success State */}
                {result && (
                    <TrackingResults
                        applicationId={result.id}
                        status={result.status}
                        serviceName="New Investment Permit Application"
                        submittedAt="Oct 24, 2025"
                    />
                )}

                {/* FAQ / Info Section */}
                {!result && !isLoading && !error && (
                    <div className="max-w-4xl mx-auto mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 opacity-60">
                        <div className="bg-white/50 p-6 rounded-2xl border border-slate-200">
                            <h3 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
                                <HelpCircle size={18} className="text-primary" />
                                Where is my ID?
                            </h3>
                            <p className="text-sm text-slate-600">
                                Your Tracking ID was sent to your registered phone number via SMS when you submitted your application. It also appears on your acknowledgement slip.
                            </p>
                        </div>
                        <div className="bg-white/50 p-6 rounded-2xl border border-slate-200">
                            <h3 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
                                <Clock size={18} className="text-primary" />
                                Processing Times
                            </h3>
                            <p className="text-sm text-slate-600">
                                Standard processing time varies by service. Most investment permits are processed within 48 business hours.
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Simple Footer */}
            <div className="container mx-auto px-4 py-8 text-center text-slate-400 text-sm border-t border-slate-200 mt-12">
                &copy; {new Date().getFullYear()} Oromia Regional Government. All rights reserved.
            </div>
        </div>
    );
}
