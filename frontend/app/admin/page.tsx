'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { bookService, productService, orderService, userService } from '@/lib/api';
import Link from 'next/link';

interface Stats {
    totalBooks: number;
    totalProducts: number;
    totalOrders: number;
    totalUsers: number;
}

export default function AdminDashboard() {
    const { data: session } = useSession();
    const [stats, setStats] = useState<Stats>({
        totalBooks: 0,
        totalProducts: 0,
        totalOrders: 0,
        totalUsers: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (session) {
            fetchStats();
        }
    }, [session]);

    const fetchStats = async () => {
        if (!session?.accessToken) return;

        try {
            const config = {
                headers: { Authorization: `Bearer ${session.accessToken}` }
            };

            const [booksRes, productsRes, ordersRes, usersRes] = await Promise.all([
                bookService.get('/books', config),
                productService.get('/products', config),
                orderService.get('/orders', config),
                userService.get('/users', config)
            ]);

            setStats(prev => ({
                ...prev,
                totalBooks: booksRes.data.length,
                totalProducts: productsRes.data.length,
                totalOrders: ordersRes.data.length,
                totalUsers: usersRes.data.length,
            }));
        } catch (error) {
            console.error('Failed to fetch stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const quickActions = [
        {
            title: 'Manage Books',
            description: 'Add, edit, or remove books from inventory',
            href: '/admin/books',
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
            ),
            color: 'from-blue-500 to-blue-600',
        },
        {
            title: 'Manage Products',
            description: 'View and manage product catalog',
            href: '/admin/products',
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
            ),
            color: 'from-purple-500 to-purple-600',
        },
        {
            title: 'Form Builder',
            description: 'Create and manage dynamic forms',
            href: '/forms/builder',
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
            ),
            color: 'from-green-500 to-green-600',
        },
        {
            title: 'User Management',
            description: 'Manage users and permissions',
            href: '/admin/users',
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
            ),
            color: 'from-orange-500 to-orange-600',
        },
    ];

    return (
        <div className="animate-fade-in">
            {/* Welcome Section */}
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-gray-800 mb-2" style={{ color: 'var(--text-primary)' }}>
                    Welcome back, {session?.user?.name || 'Admin'}! 👋
                </h1>
                <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
                    Here's what's happening with your system today.
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--admin-primary)' }}>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Total Books</p>
                            <p className="text-3xl font-bold mt-2" style={{ color: 'var(--text-primary)' }}>
                                {loading ? '...' : stats.totalBooks}
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Total Products</p>
                            <p className="text-3xl font-bold mt-2" style={{ color: 'var(--text-primary)' }}>
                                {loading ? '...' : stats.totalProducts}
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Total Orders</p>
                            <p className="text-3xl font-bold mt-2" style={{ color: 'var(--text-primary)' }}>
                                {loading ? '...' : stats.totalOrders}
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-orange-500" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Total Users</p>
                            <p className="text-3xl font-bold mt-2" style={{ color: 'var(--text-primary)' }}>
                                {loading ? '...' : stats.totalUsers}
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                            <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {quickActions.map((action) => (
                        <Link
                            key={action.title}
                            href={action.href}
                            className="group bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-all transform hover:scale-105"
                            style={{ backgroundColor: 'var(--bg-secondary)' }}
                        >
                            <div className={`w-16 h-16 bg-gradient-to-br ${action.color} rounded-xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}>
                                {action.icon}
                            </div>
                            <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                                {action.title}
                            </h3>
                            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                                {action.description}
                            </p>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-md p-6" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Recent Activity</h2>
                <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 rounded-lg" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                        </div>
                        <div className="flex-1">
                            <p className="font-medium" style={{ color: 'var(--text-primary)' }}>System initialized</p>
                            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Admin panel is ready to use</p>
                        </div>
                        <span className="text-sm" style={{ color: 'var(--text-tertiary)' }}>Just now</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
