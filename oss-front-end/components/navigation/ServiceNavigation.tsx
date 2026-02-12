"use client";

import React, { useState } from 'react';
import { useLocale } from 'next-intl';
import { ChevronRight, ChevronDown, Folder, FileText, Loader2 } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { api } from '@/lib/api-client';
import { ServiceNode } from '@/lib/service-hierarchy';

export function ServiceNavigation() {
    const locale = useLocale();
    const [hierarchy, setHierarchy] = useState<ServiceNode[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    React.useEffect(() => {
        api.getServiceHierarchy().then((data) => {
            setHierarchy(data);
            setIsLoading(false);
        });
    }, []);

    return (
        <div className="w-full max-w-sm border-r bg-slate-50 min-h-[calc(100vh-4rem)] p-4 hidden lg:block">
            <h3 className="font-bold text-lg mb-4 text-primary px-2">Service Directory</h3>
            <div className="flex flex-col gap-1">
                {isLoading ? (
                    <div className="flex items-center justify-center py-8">
                        <Loader2 className="animate-spin text-primary" size={24} />
                    </div>
                ) : (
                    hierarchy.map((node) => (
                        <ServiceTreeItem key={node.id} node={node} locale={locale} level={0} />
                    ))
                )}
            </div>
        </div>
    );
}

function ServiceTreeItem({ node, locale, level }: { node: ServiceNode; locale: string; level: number }) {
    const [isOpen, setIsOpen] = useState(level === 0); // Open top level by default
    const hasChildren = node.children && node.children.length > 0;
    const title = node.title[locale] || node.title['en'];

    if (node.type === 'service') {
        return (
            <Link
                href={node.link || '#'}
                className={`flex items-center gap-2 py-1.5 px-2 rounded-md hover:bg-slate-200 text-sm text-slate-700 hover:text-primary transition-colors ${level > 0 ? 'ml-4' : ''
                    }`}
            >
                <FileText size={16} className="text-slate-400" />
                <span>{title}</span>
            </Link>
        );
    }

    return (
        <div className="flex flex-col">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center justify-between py-1.5 px-2 rounded-md hover:bg-slate-200 text-sm font-medium text-slate-800 transition-colors ${level > 0 ? 'ml-4' : ''
                    }`}
            >
                <div className="flex items-center gap-2">
                    <Folder size={16} className={`text-slate-500 ${isOpen ? 'text-primary' : ''}`} />
                    <span>{title}</span>
                </div>
                {hasChildren && (
                    isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />
                )}
            </button>

            {isOpen && hasChildren && (
                <div className="flex flex-col gap-1 mt-1 border-l ml-3 pl-1 border-slate-200">
                    {node.children!.map((child) => (
                        <ServiceTreeItem key={child.id} node={child} locale={locale} level={level + 1} />
                    ))}
                </div>
            )}
        </div>
    );
}
