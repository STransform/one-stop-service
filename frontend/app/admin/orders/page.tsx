'use client';

import { useEffect, useState } from 'react';
import { orderService } from '@/lib/api';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';

interface Order {
    id: number;
    bookId: number;
    bookTitle?: string;
    bookAuthor?: string;
    bookPrice?: number;
    quantity: number;
    orderDate: string;
    status: string;
    userId?: number; // Maybe admin sees user ID?
    username?: string; // Maybe backend sends username?
}

export default function AdminOrdersPage() {
    const { data: session } = useSession();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    useEffect(() => {
        if (session) {
            fetchOrders();
        }
    }, [session]);

    const getAuthConfig = () => ({
        headers: { Authorization: `Bearer ${session?.accessToken}` }
    });

    const fetchOrders = async () => {
        if (!session?.accessToken) return;
        try {
            // specialized admin endpoint or just /orders
            const response = await orderService.get('/orders', getAuthConfig());
            setOrders(response.data);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load orders");
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'CONFIRMED': return 'bg-green-100 text-green-800 border-green-200';
            case 'PENDING': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'SHIPPED': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'DELIVERED': return 'bg-purple-100 text-purple-800 border-purple-200';
            case 'CANCELLED': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const totalRevenue = orders.reduce((sum, o) => sum + (o.bookPrice || 0), 0);
    const pendingOrders = orders.filter(o => o.status === 'PENDING').length;

    return (
        <div className="animate-fade-in">
            <div className="mb-8">
                <h1 className="text-4xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                    📦 Order Management
                </h1>
                <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>Track and manage customer orders</p>
            </div>

            {/* Analytics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-blue-500" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Total Orders</p>
                            <p className="text-3xl font-bold mt-2" style={{ color: 'var(--text-primary)' }}>{orders.length}</p>
                        </div>
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-yellow-500" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Pending Orders</p>
                            <p className="text-3xl font-bold mt-2 text-yellow-600">{pendingOrders}</p>
                        </div>
                        <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                            <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-green-500" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Total Revenue</p>
                            <p className="text-3xl font-bold mt-2 text-green-600">${totalRevenue.toFixed(2)}</p>
                        </div>
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-2xl shadow-lg border overflow-hidden" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y" style={{ borderColor: 'var(--border-color)' }}>
                        <thead style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Order ID</th>
                                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Date</th>
                                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Book</th>
                                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Amount</th>
                                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y" style={{ borderColor: 'var(--border-color)' }}>
                            {(() => {
                                const totalPages = Math.ceil(orders.length / itemsPerPage);
                                const startIndex = (currentPage - 1) * itemsPerPage;
                                const endIndex = startIndex + itemsPerPage;
                                const currentOrders = orders.slice(startIndex, endIndex);
                                return currentOrders.map((order) => (
                                    <tr key={order.id} className="hover:bg-indigo-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <span className="font-mono text-sm" style={{ color: 'var(--text-primary)' }}>#{order.id}</span>
                                        </td>
                                        <td className="px-6 py-4" style={{ color: 'var(--text-secondary)' }}>
                                            {new Date(order.orderDate).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium" style={{ color: 'var(--text-primary)' }}>{order.bookTitle || `Book ID: ${order.bookId}`}</div>
                                            <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>{order.bookAuthor}</div>
                                        </td>
                                        <td className="px-6 py-4 font-bold text-green-600">
                                            ${order.bookPrice?.toFixed(2) || '0.00'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                    </tr>
                                ));
                            })()}
                            {orders.length === 0 && !loading && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                        No orders found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Controls */}
                {orders.length > itemsPerPage && (() => {
                    const totalPages = Math.ceil(orders.length / itemsPerPage);
                    return (
                        <div className="px-6 py-4 border-t flex items-center justify-between" style={{ borderColor: 'var(--border-color)' }}>
                            <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                                Showing <span className="font-semibold">{((currentPage - 1) * itemsPerPage) + 1}</span> to{' '}
                                <span className="font-semibold">{Math.min(currentPage * itemsPerPage, orders.length)}</span> of{' '}
                                <span className="font-semibold">{orders.length}</span> orders
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                    disabled={currentPage === 1}
                                    className="px-4 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-sm"
                                    style={{ borderColor: 'var(--border-color)' }}
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>
                                <div className="flex gap-1">
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                        <button
                                            key={page}
                                            onClick={() => setCurrentPage(page)}
                                            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${currentPage === page
                                                    ? 'bg-red-600 text-white'
                                                    : 'border hover:bg-gray-50'
                                                }`}
                                            style={currentPage !== page ? { borderColor: 'var(--border-color)' } : {}}
                                        >
                                            {page}
                                        </button>
                                    ))}
                                </div>
                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                    disabled={currentPage === totalPages}
                                    className="px-4 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-sm"
                                    style={{ borderColor: 'var(--border-color)' }}
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    );
                })()}
            </div>
        </div>
    );
}
