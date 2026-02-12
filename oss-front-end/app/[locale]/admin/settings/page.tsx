"use client";

import React, { useState } from "react";
import { Settings, Globe, Shield, Braces, Palette, Save, AlertCircle } from "lucide-react";

export default function AdminSettingsPage() {
    const [activeTab, setActiveTab] = useState("general");

    const tabs = [
        { id: "general", label: "General", icon: Settings },
        { id: "branding", label: "Branding", icon: Palette },
        { id: "integrations", label: "Integrations", icon: Braces },
        { id: "security", label: "Security", icon: Shield },
    ];

    return (
        <div className="max-w-4xl space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">System Settings</h1>
                <p className="text-slate-500 text-sm">Configure global platform behavior and identity integrations.</p>
            </div>

            <div className="flex flex-col md:flex-row gap-8">
                {/* Tabs Sidebar */}
                <div className="w-full md:w-64 flex flex-col gap-1">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === tab.id
                                    ? "bg-white text-primary shadow-sm border border-slate-200"
                                    : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
                                }`}
                        >
                            <tab.icon size={18} />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-6 md:p-8 space-y-8">
                        {activeTab === "general" && (
                            <section className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                <div className="border-b border-slate-100 pb-4">
                                    <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                        <Globe className="text-primary" size={20} />
                                        Regional Identity
                                    </h2>
                                </div>
                                <div className="grid grid-cols-1 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Platform Name</label>
                                        <input type="text" defaultValue="Oromia One-Stop Service" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Region Name</label>
                                            <input type="text" defaultValue="Oromia Regional Government" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Default Locale</label>
                                            <select className="w-full px-4 py-2 border rounded-lg bg-white focus:ring-2 focus:ring-primary/20 outline-none">
                                                <option value="en">English (US)</option>
                                                <option value="om">Afaan Oromo (OM)</option>
                                                <option value="am">Amharic (AM)</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        )}

                        {activeTab === "branding" && (
                            <section className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                <div className="border-b border-slate-100 pb-4">
                                    <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                        <Palette className="text-primary" size={20} />
                                        Visual Identity
                                    </h2>
                                </div>
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-3">Primary Action Color</label>
                                        <div className="flex gap-4">
                                            {["#1a237e", "#b91c1c", "#15803d", "#7c3aed"].map(color => (
                                                <button
                                                    key={color}
                                                    style={{ backgroundColor: color }}
                                                    className={`w-10 h-10 rounded-full cursor-pointer ring-offset-2 transition-all ${color === "#1a237e" ? "ring-2 ring-primary" : "hover:scale-110"}`}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                    <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                                        <div className="flex items-center gap-4">
                                            <div className="w-16 h-16 bg-white border border-dashed rounded-lg flex items-center justify-center text-slate-400">
                                                LOGO
                                            </div>
                                            <div>
                                                <button className="text-sm font-bold text-primary hover:underline">Upload Custom Logo</button>
                                                <p className="text-xs text-slate-500 mt-1">Recommended size: 512x512px (PNG/SVG)</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        )}

                        {activeTab === "integrations" && (
                            <section className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                <div className="border-b border-slate-100 pb-4">
                                    <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                        <Braces className="text-primary" size={20} />
                                        External Systems
                                    </h2>
                                </div>
                                <div className="space-y-6">
                                    <div className="p-4 bg-amber-50 border border-amber-100 rounded-lg flex gap-3 text-amber-800">
                                        <AlertCircle className="shrink-0" size={20} />
                                        <p className="text-sm">API keys are encrypted and stored securely in the system vault.</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Fayda National ID Secret</label>
                                        <input type="password" value="************************" readOnly className="w-full px-4 py-2 border rounded-lg bg-slate-50 font-mono text-xs" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Camunda Workflow Engine URL</label>
                                        <input type="text" defaultValue="https://bpm.oromia.gov.et/engine-rest" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none" />
                                    </div>
                                </div>
                            </section>
                        )}

                        <div className="pt-8 border-t border-slate-100 flex justify-end">
                            <button className="bg-primary text-white px-8 py-3 rounded-lg font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 active:scale-95">
                                <Save size={18} />
                                Save Workspace Settings
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
