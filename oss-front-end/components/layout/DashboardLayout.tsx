"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { Link, usePathname, useRouter } from "@/i18n/routing";
import { MENU_ITEMS, Role } from "@/config/menu-config";
import { Menu, LogOut, X, User } from "lucide-react";
import { signOut } from "next-auth/react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { data: session } = useSession();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const pathname = usePathname();

    const userRole = (session?.user?.role as Role) || "CITIZEN";
    const menuItems = MENU_ITEMS[userRole] || MENU_ITEMS["CITIZEN"];

    return (
        <div className="flex h-screen bg-slate-50">
            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:relative md:translate-x-0`}
            >
                <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                    <h1 className="text-xl font-bold tracking-tight">OSS Center</h1>
                    <button onClick={() => setSidebarOpen(false)} className="md:hidden text-slate-400 hover:text-white">
                        <X size={24} />
                    </button>
                </div>

                <div className="p-4">
                    <div className="flex items-center gap-3 px-4 py-3 bg-slate-800/50 rounded-lg mb-6">
                        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                            {session?.user?.name?.[0] || <User size={20} />}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-semibold truncate">{session?.user?.name}</p>
                            <p className="text-xs text-slate-400 capitalize truncate">{userRole.replace('_', ' ').toLowerCase()}</p>
                        </div>
                    </div>

                    <nav className="space-y-1">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive ? "bg-primary text-white" : "text-slate-400 hover:bg-slate-800 hover:text-white"}`}
                                >
                                    {Icon && <Icon size={20} />}
                                    {item.title}
                                </Link>
                            )
                        })}
                    </nav>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-800">
                    <button
                        onClick={() => signOut({ callbackUrl: '/' })}
                        className="flex items-center gap-3 w-full px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg text-sm font-medium transition-colors"
                    >
                        <LogOut size={20} />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Mobile Header */}
                <header className="bg-white border-b border-slate-200 p-4 flex items-center md:hidden">
                    <button onClick={() => setSidebarOpen(true)} className="text-slate-600 hover:text-slate-900">
                        <Menu size={24} />
                    </button>
                    <span className="ml-4 font-bold text-slate-800">OSS Dashboard</span>
                </header>

                <main className="flex-1 overflow-auto p-4 md:p-8">
                    {children}
                </main>
            </div>

            {/* Overlay for mobile */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                ></div>
            )}
        </div>
    );
}
