'use client';

import { useSession, signIn } from 'next-auth/react';
import AdminLayout from '@/components/AdminLayout';

export default function AdminLayoutWrapper({
    children,
}: {
    children: React.ReactNode;
}) {
    const { data: session, status } = useSession();

    if (status === 'loading') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    if (!session) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center p-8 bg-white rounded-xl shadow-lg border border-gray-200 max-w-md">
                    <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h2>
                    <p className="text-gray-600 mb-6">You must be logged in to access the admin panel.</p>
                    <div className="flex justify-center gap-4">
                        <button
                            onClick={() => signIn('keycloak', { callbackUrl: '/admin' })}
                            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-md transform hover:scale-105 transition-transform"
                        >
                            Sign In
                        </button>
                        <a href="/" className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                            Go Home
                        </a>
                    </div>
                </div>
            </div>
        );
    }

    const isAdmin = session.roles?.includes('admin') || session.roles?.includes('realm-admin');

    if (!isAdmin) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center p-8 bg-white rounded-xl shadow-lg border border-red-100 max-w-md">
                    <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Restricted Access</h2>
                    <p className="text-gray-600 mb-6">You do not have the required permissions (ADMIN role) to access this page.</p>
                    <a href="/" className="inline-block px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors">
                        Go Home
                    </a>
                </div>
            </div>
        );
    }

    return <AdminLayout>{children}</AdminLayout>;
}
