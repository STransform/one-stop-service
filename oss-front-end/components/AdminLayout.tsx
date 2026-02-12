"use client";

import React, { useState } from 'react';
import { Link } from '@/i18n/routing';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, FileText, Settings, Users, Building2, LogOut, Landmark, Menu, X } from 'lucide-react';
import { signOut } from 'next-auth/react';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const menuItems = [
        { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
        { name: 'Bureau (Sector) Registry', href: '/admin/sectors', icon: Landmark },
        { name: 'Service Registry', href: '/admin/services', icon: Building2 },
        { name: 'Form Builder', href: '/admin/form-builder', icon: FileText },
        { name: 'User Management', href: '/admin/users', icon: Users },
        { name: 'Settings', href: '/admin/settings', icon: Settings },
    ];

    const handleLogout = async () => {
        await signOut({ callbackUrl: '/' });
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
            {/* Mobile Header */}
            <div className="md:hidden bg-slate-900 text-white p-4 flex items-center justify-between sticky top-0 z-20 shadow-md">
                <div className="font-bold text-lg">Oromia OSS Admin</div>
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                >
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Sidebar Overlay (Mobile) */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-20 md:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                w-64 bg-slate-900 text-white fixed h-full z-30 transition-transform duration-300 ease-in-out
                ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
                md:translate-x-0 md:sticky md:top-0 md:h-screen md:block md:shrink-0 md:overflow-y-auto
            `}>
                <div className="p-6 border-b border-slate-700 hidden md:block">
                    <h1 className="text-xl font-bold tracking-tight">Oromia OSS Admin</h1>
                    <p className="text-xs text-slate-400 mt-1">Service Delivery Engine</p>
                </div>

                <div className="flex flex-col h-[calc(100%-80px)] md:h-auto">
                    <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                        {menuItems.map((item) => {
                            const isActive = pathname.includes(item.href);
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive
                                        ? 'bg-primary text-primary-foreground'
                                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                                        }`}
                                >
                                    <item.icon size={18} />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="p-4 border-t border-slate-700">
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 px-4 py-3 w-full text-left text-sm font-medium text-red-300 hover:text-red-200 hover:bg-slate-800 rounded-lg transition-colors"
                        >
                            <LogOut size={18} />
                            Logout
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 w-full overflow-x-hidden flex flex-col">
                {/* Desktop Header */}
                <header className="hidden md:flex items-center justify-between bg-white border-b border-slate-200 px-8 py-4 sticky top-0 z-10">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 capitalize">
                            {pathname.split('/')[3]?.replace(/-/g, ' ') || 'Dashboard'}
                        </h2>
                        <p className="text-xs text-slate-500">Welcome back, Administrator</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="bg-slate-100 p-2 rounded-full text-slate-600">
                            <Users size={20} />
                        </div>
                        <div className="text-right hidden lg:block">
                            <div className="text-sm font-bold text-slate-900">Admin User</div>
                            <div className="text-xs text-slate-500">Super Admin</div>
                        </div>
                    </div>
                </header>

                <div className="p-4 md:p-8 flex-1">
                    {children}
                </div>
            </main>
        </div>
    );
}
