"use client";

import * as React from "react";
import { Search } from "lucide-react";
import { Command } from "cmdk";
import { useTranslations } from "next-intl";

export function CommandPalette() {
    const [open, setOpen] = React.useState(false);
    const t = useTranslations("Index");

    // Toggle the menu when ⌘K is pressed
    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };

        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, []);

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className="flex items-center gap-2 px-3 py-2 bg-white/30 text-primary-foreground rounded-md hover:bg-white/20 transition-colors border border-white/20"
            >
                <Search size={18} />
                <span className="text-sm hidden md:inline opacity-80">Search services...</span>
                <kbd className="hidden md:inline-flex h-5 select-none items-center gap-1 rounded border border-white/20 bg-black/20 px-1.5 font-mono text-[10px] font-medium text-white/70 opacity-100">
                    <span className="text-xs">⌘</span>K
                </kbd>
            </button>

            {open && (
                <div
                    className="fixed inset-0 z-[200] bg-black/50 flex justify-center items-start pt-[10vh]"
                    onClick={() => setOpen(false)}
                >
                    <div
                        className="w-full max-w-xl bg-white rounded-xl shadow-2xl overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Command className="p-4">
                            <div className="flex items-center border-b pb-2 mb-4">
                                <Search className="mr-2 text-slate-400" size={20} />
                                <Command.Input
                                    placeholder="Type a service name (e.g. Investment, Agriculture)..."
                                    className="w-full outline-none text-slate-700"
                                    autoFocus
                                />
                            </div>
                            <Command.List className="max-h-[300px] overflow-y-auto">
                                <Command.Empty>No results found.</Command.Empty>

                                <Command.Group heading="Frequently Used" className="text-xs text-slate-400 mb-2 uppercase">
                                    <Item label="Investment Permit" description="Apply for a new investment permit" />
                                    <Item label="Land Lease" description="Inquire about regional land leases" />
                                </Command.Group>

                                <Command.Group heading="Administrative" className="text-xs text-slate-400 mb-2 mt-4 uppercase">
                                    <Item label="Module: Wirtuu" description="Core region-wide services" />
                                    <Item label="Module: Damee" description="Branch-specific operations" />
                                </Command.Group>
                            </Command.List>
                        </Command>
                    </div>
                </div>
            )}
        </>
    );
}

function Item({ label, description, onSelect }: { label: string; description?: string; onSelect?: () => void }) {
    return (
        <Command.Item
            onSelect={onSelect}
            className="flex flex-col px-3 py-2 rounded-md hover:bg-slate-100 cursor-pointer transition-colors group"
        >
            <span className="text-sm font-semibold text-slate-700 group-hover:text-primary">{label}</span>
            {description && <span className="text-xs text-slate-400">{description}</span>}
        </Command.Item>
    );
}
