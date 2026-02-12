"use client";

import React from "react";
import { Link } from "@/i18n/routing";
import { Plus, Edit2, Trash2, Loader2 } from "lucide-react";
import { useLocale } from "next-intl";
import { api } from "@/lib/api-client";
import { Sector, ServiceDefinition } from "@/types/data-model";

export default function ServicesListPage() {
    const locale = useLocale();
    const [services, setServices] = React.useState<ServiceDefinition[]>([]);
    const [sectors, setSectors] = React.useState<Sector[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        const loadData = async () => {
            try {
                const [servicesData, sectorsData] = await Promise.all([
                    api.getServices(),
                    api.getSectors()
                ]);
                setServices(servicesData);
                setSectors(sectorsData);
            } catch (err) {
                console.error("Failed to load services", err);
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, []);

    const handleDelete = async (id: string, title: string) => {
        if (confirm(`Are you sure you want to delete ${title}?`)) {
            try {
                await api.deleteService(id);
                setServices(services.filter(s => s.id !== id));
            } catch (err) {
                console.error("Delete error:", err);
                alert("Failed to delete service.");
            }
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Service Registry</h1>
                    <p className="text-slate-500 text-sm">Manage all government services and their configurations.</p>
                </div>
                <Link
                    href="/admin/services/new"
                    className="bg-primary text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-primary/90 transition-colors"
                >
                    <Plus size={18} />
                    Register New Service
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-4 font-semibold text-slate-700 text-sm">Service Name</th>
                            <th className="px-6 py-4 font-semibold text-slate-700 text-sm">Sector / Bureau</th>
                            <th className="px-6 py-4 font-semibold text-slate-700 text-sm">SLA & Fee</th>
                            <th className="px-6 py-4 font-semibold text-slate-700 text-sm">Status</th>
                            <th className="px-6 py-4 font-semibold text-slate-700 text-sm text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {isLoading ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-slate-500 italic">
                                    <div className="flex flex-col items-center gap-2">
                                        <Loader2 className="animate-spin text-primary" size={32} />
                                        <span>Syncing with Service Catalog...</span>
                                    </div>
                                </td>
                            </tr>
                        ) : services.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-slate-500 italic">
                                    No services registered in this regional registry.
                                </td>
                            </tr>
                        ) : (
                            services.map((service) => {
                                const sector = sectors.find(s => s.id === service.sector_id);
                                return (
                                    <tr key={service.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-slate-900">{service.title['en']}</div>
                                            <div className="text-xs text-slate-400">{service.id}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600">
                                            {sector?.name['en'] || service.sector_id}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600">
                                            <div>{service.attributes.sla_hours} hrs</div>
                                            <div className="text-slate-400 text-xs">{service.attributes.fee} {service.attributes.currency}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${service.enabled
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-slate-100 text-slate-600'
                                                }`}>
                                                {service.enabled ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={`/admin/services/new?edit=${service.id}`}
                                                    className="p-2 text-slate-400 hover:text-primary hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="Edit Service"
                                                >
                                                    <Edit2 size={16} />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(service.id, service.title['en'])}
                                                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Delete Service"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
