"use client";

import React from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';
import { usePathname } from 'next/navigation';
import { Menu, X, LogIn, UserPlus, LogOut } from 'lucide-react';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { CommandPalette } from '@/components/CommandPalette';

import { useSession, signOut } from "next-auth/react";

export function Navbar() {
    const [isOpen, setIsOpen] = React.useState(false);
    const t = useTranslations('Index'); // Using Index for basic strings for now
    const locale = useLocale();
    const pathname = usePathname();
    const { data: session } = useSession();

    // Hide Navbar on Admin and Dashboard pages (they handle their own navigation)
    if (pathname.includes('/admin') || pathname.includes('/dashboard')) {
        return null;
    }

    // Navigation Links
    const navLinks = [
        { name: 'Home', href: '/' },
        { name: 'About', href: '/#about' },
        { name: 'Services', href: '/#services' },
        { name: 'Track Request', href: '/track-request' },
        { name: 'Help', href: '/support' },
        { name: 'News', href: '/#news' },
        { name: 'Contact', href: '/#contact' },
    ];

    return (
        <nav className="sticky top-0 z-50 w-full bg-primary/95 backdrop-blur supports-[backdrop-filter]:bg-primary/80 text-primary-foreground shadow-sm">
            <div className="container mx-auto px-4">
                <div className="flex justify-between h-20 items-center">
                    {/* Logo Section */}
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center gap-3">
                            <div className="relative w-16 h-16 bg-white rounded-full flex items-center justify-center p-1 shadow-sm border border-slate-100 overflow-hidden">
                                <img
                                    src="/images/logo.png"
                                    alt="Oromia OSS Logo"
                                    className="w-full h-full object-contain"
                                />
                            </div>
                            <div className="hidden md:flex flex-col leading-tight">
                                <span className="font-extrabold text-xl tracking-tight text-white">OROMIA</span>
                                <span className="text-[10px] font-bold text-white/90 uppercase tracking-[0.2em]">One Stop Service Center</span>
                            </div>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-8">
                        <div className="flex gap-6">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className="text-sm font-medium hover:opacity-80 transition-colors"
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>

                        <div className="h-6 w-px bg-primary-foreground/20"></div>

                        <div className="flex items-center gap-4">
                            <CommandPalette />
                            <LanguageSwitcher />

                            {session ? (
                                <div className="flex items-center gap-3">
                                    <div className="text-sm">
                                        <span className="opacity-70">Hi, </span>
                                        <span className="font-bold">{session.user?.name || 'User'}</span>
                                    </div>
                                    <button
                                        onClick={() => signOut()}
                                        className="flex items-center gap-2 bg-black/90 text-white px-4 py-2 rounded-md text-sm font-bold hover:bg-black/60 transition-colors"
                                    >
                                        <LogOut size={16} />
                                        Logout
                                    </button>
                                </div>
                            ) : (
                                <><Link href="/auth/login" className="flex items-center gap-2 bg-black/90 text-white px-4 py-2 rounded-md text-sm font-bold hover:bg-black/60 transition-colors">
                                    <LogIn size={16} />
                                    Login
                                </Link><Link href="/auth/signup" className="flex items-center gap-2 bg-black/90 text-white px-4 py-2 rounded-md text-sm font-bold hover:bg-black/60 transition-colors">
                                        <UserPlus size={16} />
                                        Register
                                    </Link></>
                            )}
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center gap-4">
                        <LanguageSwitcher />
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-primary-foreground hover:text-yellow-400 transition-colors"
                        >
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-primary border-t border-primary-foreground/10 absolute w-full">
                    <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                onClick={() => setIsOpen(false)}
                                className="py-2 text-base font-medium border-b border-primary-foreground/10"
                            >
                                {link.name}
                            </Link>
                        ))}

                        <div className="pt-2 flex flex-col gap-4">
                            <div className="flex items-center gap-4">
                                <span className="text-sm opacity-70">Search:</span>
                                <CommandPalette />
                            </div>

                            {session ? (
                                <button
                                    onClick={() => signOut()}
                                    className="flex items-center justify-center gap-2 bg-red-500/20 text-red-100 px-4 py-3 rounded-md text-sm font-bold"
                                >
                                    Logout
                                </button>
                            ) : (
                                <Link
                                    href="/auth/login"
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center justify-center gap-2 bg-yellow-400 text-primary px-4 py-3 rounded-md text-sm font-bold"
                                >
                                    <LogIn size={18} />
                                    Login with Fayda
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}
