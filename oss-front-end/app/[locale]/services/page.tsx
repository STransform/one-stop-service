"use client";

import React, { useState } from "react";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/routing";
import { getSectors, getServicesBySector } from "@/lib/mock-db";
import { Search, Building2, ArrowRight } from "lucide-react";
import { LocalizedString } from "@/types/data-model";

// Helper to get localized string
const getStr = (obj: LocalizedString | undefined, locale: string) => {
    if (!obj) return "";
    return obj[locale] || obj['en'] || "";
};

export default function ServiceCatalogPage() {
    const locale = useLocale();
    const [searchTerm, setSearchTerm] = useState("");
    const sectors = getSectors();

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-slate-900 mb-4">Service Catalog</h1>
                <p className="text-slate-600 max-w-2xl mx-auto mb-8">
                    Access all government services from one place. Browse by sector or search for specific services.
                </p>

                <div className="max-w-xl mx-auto relative">
                    <input
                        type="text"
                        placeholder="Search for a service..."
                        className="w-full pl-12 pr-4 py-4 rounded-full border border-slate-200 shadow-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Search className="absolute left-4 top-4 text-slate-400" size={20} />
                </div>
            </div>

            <div className="grid grid-cols-1 gap-12">
                {sectors.map(sector => {
                    const sectorServices = getServicesBySector(sector.id).filter(s =>
                        getStr(s.title, locale).toLowerCase().includes(searchTerm.toLowerCase())
                    );

                    if (sectorServices.length === 0 && searchTerm) return null;

                    return (
                        <div key={sector.id} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-3">
                                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-primary">
                                    <Building2 size={24} />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-800">{getStr(sector.name, locale)}</h2>
                                    {sector.description && (
                                        <p className="text-sm text-slate-500">{getStr(sector.description, locale)}</p>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {sectorServices.map(service => (
                                    <Link
                                        href={`/services/${service.id}`}
                                        key={service.id}
                                        className="group bg-white p-6 rounded-xl border border-slate-100 shadow-sm hover:shadow-md hover:border-primary/30 transition-all flex flex-col justify-between"
                                    >
                                        <div>
                                            <h3 className="font-bold text-lg text-slate-800 mb-2 group-hover:text-primary transition-colors">
                                                {getStr(service.title, locale)}
                                            </h3>
                                            <p className="text-slate-500 text-sm line-clamp-2">
                                                {getStr(service.description, locale)}
                                            </p>
                                        </div>

                                        <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between text-sm">
                                            <span className="text-slate-400">
                                                {service.attributes.sla_hours}h processing
                                            </span>
                                            <span className="flex items-center gap-1 text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity translate-x-[-10px] group-hover:translate-x-0">
                                                Apply <ArrowRight size={14} />
                                            </span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
