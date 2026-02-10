'use client';

import { useSession } from "next-auth/react";

export default function AdminRolesPage() {
    const { data: session } = useSession();

    return (
        <div className="animate-fade-in">
            <div className="mb-8">
                <h1 className="text-4xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                    🔐 Roles & Permissions
                </h1>
                <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>Manage system roles and access control</p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8 text-center border" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
                <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                </div>

                <h3 className="text-2xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Role Management via Keycloak</h3>

                <p className="text-gray-600 max-w-2xl mx-auto mb-8" style={{ color: 'var(--text-secondary)' }}>
                    Role management is currently handled directly through the Keycloak Administration Console.
                    Adding, removing, or modifying roles should be done within your Identity Provider settings to ensure security consistency across all microservices.
                </p>

                <div className="flex justify-center gap-4">
                    <a
                        href="http://localhost:8080/admin/master/console/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg flex items-center gap-2"
                    >
                        <span>Open Keycloak Console</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                    </a>
                </div>
            </div>
        </div>
    );
}
