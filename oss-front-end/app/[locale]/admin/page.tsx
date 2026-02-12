"use client";

import React from "react";
import { Link } from "@/i18n/routing";
import { Building2, FileText, Landmark, ArrowRight, Plus, Activity, Loader2 } from "lucide-react";
import { api } from "@/lib/api-client";
import { ServiceDefinition } from "@/types/data-model";

export default function AdminDashboardPage() {
    const [stats, setStats] = React.useState<any[]>([]);
    const [recentServices, setRecentServices] = React.useState<ServiceDefinition[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        const loadDashboardData = async () => {
            try {
                const [services, sectors, schemas] = await Promise.all([
                    api.getServices(),
                    api.getSectors(),
                    api.getAllFormSchemas()
                ]);

                setRecentServices(services.slice(0, 3));
                setStats([
                    {
                        label: "Total Services",
                        value: services.length,
                        icon: Building2,
                        color: "text-blue-600",
                        bg: "bg-blue-50"
                    },
                    {
                        label: "Registered Bureaus",
                        value: sectors.length,
                        icon: Landmark,
                        color: "text-indigo-600",
                        bg: "bg-indigo-50"
                    },
                    {
                        label: "Form Schemas",
                        value: Object.keys(schemas).length,
                        icon: FileText,
                        color: "text-amber-600",
                        bg: "bg-amber-50"
                    },
                    {
                        label: "Active Applications",
                        value: 128, // Still mock for now
                        icon: Activity,
                        color: "text-emerald-600",
                        bg: "bg-emerald-50",
                        trend: "+12% this week"
                    },
                ]);
            } catch (err) {
                console.error("Dashboard load error:", err);
            } finally {
                setIsLoading(false);
            }
        };
        loadDashboardData();
    }, []);

    if (isLoading) return <div className="p-12 text-center"><Loader2 className="animate-spin inline-block text-primary" size={40} /></div>;

    return (
        <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <div key={stat.label} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`${stat.bg} p-3 rounded-lg`}>
                                <stat.icon className={stat.color} size={24} />
                            </div>
                            {stat.trend && (
                                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                                    {stat.trend}
                                </span>
                            )}
                        </div>
                        <h3 className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</h3>
                        <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Activity */}
                <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                        <h2 className="text-lg font-bold text-slate-900">Recent Services</h2>
                        <Link href="/admin/services" className="text-sm text-primary font-bold hover:underline">
                            View All
                        </Link>
                    </div>
                    <div className="divide-y divide-slate-100">
                        {recentServices.map((service) => (
                            <div key={service.id} className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between group">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 font-bold">
                                        {service.id.slice(-2)}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-800">{service.title['en']}</h4>
                                        <p className="text-xs text-slate-500">SLA: {service.attributes.sla_hours}h • Fee: {service.attributes.fee} ETB</p>
                                    </div>
                                </div>
                                <Link href={`/services/${service.id}`} className="opacity-0 group-hover:opacity-100 transition-opacity p-2 text-slate-400 hover:text-primary">
                                    <ArrowRight size={18} />
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                    <h2 className="text-lg font-bold text-slate-900 mb-6">Quick Actions</h2>
                    <div className="space-y-3">
                        <Link
                            href="/admin/services/new"
                            className="w-full flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:border-primary/50 hover:bg-blue-50 transition-all group"
                        >
                            <div className="bg-blue-100 text-blue-600 p-2 rounded-lg group-hover:bg-blue-200 transition-colors">
                                <Plus size={18} />
                            </div>
                            <span className="font-medium text-slate-700 group-hover:text-blue-700">Register New Service</span>
                        </Link>

                        <Link
                            href="/admin/sectors/new"
                            className="w-full flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:border-indigo-500/50 hover:bg-indigo-50 transition-all group"
                        >
                            <div className="bg-indigo-100 text-indigo-600 p-2 rounded-lg group-hover:bg-indigo-200 transition-colors">
                                <Landmark size={18} />
                            </div>
                            <span className="font-medium text-slate-700 group-hover:text-indigo-700">Add New Bureau</span>
                        </Link>

                        <Link
                            href="/admin/form-builder/editor"
                            className="w-full flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:border-amber-500/50 hover:bg-amber-50 transition-all group"
                        >
                            <div className="bg-amber-100 text-amber-600 p-2 rounded-lg group-hover:bg-amber-200 transition-colors">
                                <FileText size={18} />
                            </div>
                            <span className="font-medium text-slate-700 group-hover:text-amber-700">Design New Form</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
