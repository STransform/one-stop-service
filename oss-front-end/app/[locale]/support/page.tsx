"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { HelpCircle, Mail, Phone, MessageSquare } from "lucide-react";
import { Link } from "@/i18n/routing";

export default function SupportPage() {
    const t = useTranslations("Index");

    return (
        <div className="flex flex-col min-h-screen bg-slate-50">
            <main className="flex-1">
                {/* Hero section */}
                <section className="bg-primary pt-32 pb-20 text-white">
                    <div className="container mx-auto px-4 text-center">
                        <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight">
                            Help & Support
                        </h1>
                        <p className="text-xl opacity-90 max-w-2xl mx-auto leading-relaxed">
                            Find answers to frequently asked questions or reach out to our support team for personalized assistance.
                        </p>
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="py-20 -mt-10 relative z-10">
                    <div className="container mx-auto px-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            <HelpCard
                                question="How do I register for Fayda?"
                                answer="You can register for Fayda at any regional registration center with your national ID or birth certificate."
                            />
                            <HelpCard
                                question="What is the processing time?"
                                answer="Most services are processed within 3-5 business days once all documents are verified."
                            />
                            <HelpCard
                                question="Is my data secure?"
                                answer="Yes, we use government-grade encryption and Fayda biometric authentication for all sensitive transactions."
                            />
                            <HelpCard
                                question="Can I pay fees online?"
                                answer="Online payment is coming soon via Telebirr and E-Birr. Currently, you can pay at designated bank branches."
                            />
                            <HelpCard
                                question="How do I track my ID?"
                                answer="Use the 'Track Request' page with the tracking ID provided in your confirmation SMS."
                            />
                            <HelpCard
                                question="Where are the physical centers?"
                                answer="We have One-Stop Service centers in all major zones. Check the home page map for hub locations."
                            />
                        </div>
                    </div>
                </section>

                {/* Contact support section */}
                <section className="py-20 bg-white">
                    <div className="container mx-auto px-4">
                        <div className="max-w-4xl mx-auto text-center">
                            <h2 className="text-3xl font-bold mb-12">Still need help?</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 flex flex-col items-center">
                                    <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6">
                                        <Phone size={32} />
                                    </div>
                                    <h3 className="text-xl font-bold mb-2">Call Our Hotline</h3>
                                    <p className="text-slate-600 mb-4">Monday - Friday, 8am - 5pm</p>
                                    <div className="text-2xl font-black text-primary">+251 11-123-4567</div>
                                </div>
                                <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 flex flex-col items-center">
                                    <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6">
                                        <Mail size={32} />
                                    </div>
                                    <h3 className="text-xl font-bold mb-2">Email Support</h3>
                                    <p className="text-slate-600 mb-4">Response within 24 hours</p>
                                    <div className="text-2xl font-black text-primary">support@oss.oromia.gov.et</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}

function HelpCard({ question, answer }: { question: string, answer: string }) {
    return (
        <div className="p-8 rounded-[2rem] border border-slate-100 bg-white shadow-lg hover:shadow-xl transition-all group">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                <HelpCircle size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-4">{question}</h3>
            <p className="text-slate-600 leading-relaxed">{answer}</p>
        </div>
    );
}
