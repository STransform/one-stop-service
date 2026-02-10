'use client';

import Link from 'next/link';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useState } from 'react';

export default function Navbar() {
    const { data: session } = useSession();
    const [showAdminMenu, setShowAdminMenu] = useState(false);

    const isAdmin = session?.roles?.includes('admin') || session?.roles?.includes('realm-admin');

    return (
        <nav className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 shadow-lg">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2 group">
                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center transform group-hover:scale-110 transition-transform">
                            <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent">O</span>
                        </div>
                        <span className="text-xl font-bold text-white hidden sm:block">OSS Microservices</span>
                    </Link>

                    {/* Navigation Links */}
                    <div className="flex items-center space-x-1 md:space-x-2">
                        {/* Books Link */}
                        <Link
                            href="/books"
                            className="flex items-center space-x-1 px-3 py-2 rounded-lg text-white hover:bg-white/20 transition-all duration-200"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                            <span className="hidden sm:inline">Books</span>
                        </Link>

                        {/* Products Link */}
                        <Link
                            href="/products"
                            className="flex items-center space-x-1 px-3 py-2 rounded-lg text-white hover:bg-white/20 transition-all duration-200"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                            <span className="hidden sm:inline">Products</span>
                        </Link>

                        {session && (
                            <>
                                {/* Orders Link */}
                                <Link
                                    href="/orders"
                                    className="flex items-center space-x-1 px-3 py-2 rounded-lg text-white hover:bg-white/20 transition-all duration-200"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                    </svg>
                                    <span className="hidden sm:inline">Orders</span>
                                </Link>

                                {/* Profile Link */}
                                <Link
                                    href="/profile"
                                    className="flex items-center space-x-1 px-3 py-2 rounded-lg text-white hover:bg-white/20 transition-all duration-200"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    <span className="hidden sm:inline">Profile</span>
                                </Link>

                                {/* Admin Dropdown */}
                                {isAdmin && (
                                    <div className="relative">
                                        <button
                                            onClick={() => setShowAdminMenu(!showAdminMenu)}
                                            className="flex items-center space-x-1 px-3 py-2 rounded-lg text-white bg-white/10 hover:bg-white/20 transition-all duration-200"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            <span className="hidden sm:inline">Admin</span>
                                            <svg className={`w-4 h-4 transition-transform ${showAdminMenu ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </button>

                                        {showAdminMenu && (
                                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 z-50">
                                                <Link
                                                    href="/admin/books"
                                                    className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-indigo-50 transition-colors"
                                                    onClick={() => setShowAdminMenu(false)}
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                                    </svg>
                                                    <span>Manage Books</span>
                                                </Link>
                                                <Link
                                                    href="/admin/products"
                                                    className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-indigo-50 transition-colors"
                                                    onClick={() => setShowAdminMenu(false)}
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                                    </svg>
                                                    <span>Manage Products</span>
                                                </Link>
                                                <Link
                                                    href="/forms/builder"
                                                    className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-indigo-50 transition-colors"
                                                    onClick={() => setShowAdminMenu(false)}
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                    <span>Form Builder</span>
                                                </Link>
                                                <Link
                                                    href="/forms/list"
                                                    className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-indigo-50 transition-colors"
                                                    onClick={() => setShowAdminMenu(false)}
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                    </svg>
                                                    <span>My Forms</span>
                                                </Link>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </>
                        )}

                        {/* Auth Button */}
                        {session ? (
                            <button
                                onClick={() => signOut()}
                                className="flex items-center space-x-2 px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg text-white font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                                <span className="hidden sm:inline">Sign Out</span>
                            </button>
                        ) : (
                            <button
                                onClick={() => signIn('keycloak', { callbackUrl: '/admin' })}
                                className="flex items-center space-x-2 px-4 py-2 bg-white text-indigo-600 hover:bg-gray-100 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                </svg>
                                <span className="hidden sm:inline">Sign In</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
