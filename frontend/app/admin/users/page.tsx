'use client';

import { useEffect, useState } from 'react';
import { userService } from '@/lib/api';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';

interface User {
    id: string; // Keycloak usually uses string UUIDs
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    roles?: string[];
    enabled?: boolean;
    createdTimestamp?: number;
}

export default function AdminUsersPage() {
    const { data: session } = useSession();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (session) {
            fetchUsers();
        }
    }, [session]);

    const getAuthConfig = () => ({
        headers: { Authorization: `Bearer ${session?.accessToken}` }
    });

    const fetchUsers = async () => {
        if (!session?.accessToken) return;
        try {
            const response = await userService.get('/users', getAuthConfig());
            setUsers(response.data);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load users");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this user?')) return;
        try {
            await userService.delete(`/users/${id}`, getAuthConfig());
            toast.success("User deleted");
            fetchUsers();
        } catch (error) {
            toast.error("Failed to delete user");
        }
    };

    return (
        <div className="animate-fade-in">
            <div className="mb-8">
                <h1 className="text-4xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                    👥 User Management
                </h1>
                <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>Manage system users and their access</p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-indigo-500" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Total Users</p>
                            <p className="text-3xl font-bold mt-2" style={{ color: 'var(--text-primary)' }}>{users.length}</p>
                        </div>
                        <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                            <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-2xl shadow-lg border overflow-hidden" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y" style={{ borderColor: 'var(--border-color)' }}>
                        <thead style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>User</th>
                                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Email</th>
                                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Roles</th>
                                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Status</th>
                                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y" style={{ borderColor: 'var(--border-color)' }}>
                            {users.map((user) => (
                                <tr key={user.id} className="hover:bg-indigo-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                                                {user.username?.charAt(0).toUpperCase() || '?'}
                                            </div>
                                            <div>
                                                <div className="font-semibold" style={{ color: 'var(--text-primary)' }}>{user.username}</div>
                                                <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                                                    {user.firstName} {user.lastName}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4" style={{ color: 'var(--text-primary)' }}>
                                        {user.email}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-wrap gap-1">
                                            {user.roles?.map(role => (
                                                <span key={role} className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                    {role}
                                                </span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.enabled !== false ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {user.enabled !== false ? 'Active' : 'Disabled'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => handleDelete(user.id)}
                                            className="text-red-600 hover:text-red-900 font-medium text-sm hover:underline"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {users.length === 0 && !loading && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                        No users found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
