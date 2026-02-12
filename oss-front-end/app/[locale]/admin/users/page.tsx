"use client";

import React, { useState } from "react";
import { UserPlus, Search, MoreVertical, Shield, UserCheck, ShieldAlert, Mail } from "lucide-react";

const MOCK_USERS = [
    { id: "1", name: "Abebe Bekele", email: "abebe.b@asta.gov.et", role: "Super Admin", status: "Active", lastLogin: "2026-01-26 10:20" },
    { id: "2", name: "Chala Tolosa", email: "chala.t@asta.gov.et", role: "Bureau Admin", status: "Active", lastLogin: "2026-01-25 15:45" },
    { id: "3", name: "Madiha Ahmed", email: "madiha.a@asta.gov.et", role: "Agent", status: "Active", lastLogin: "2026-01-26 09:12" },
    { id: "4", name: "Tizita Girma", email: "tizita.g@asta.gov.et", role: "Citizen", status: "Inactive", lastLogin: "2026-01-10 11:30" },
    { id: "5", name: "Desta Kassaye", email: "desta.k@asta.gov.et", role: "Bureau Admin", status: "Active", lastLogin: "2026-01-24 14:00" },
];

export default function UserManagementPage() {
    const [searchTerm, setSearchTerm] = useState("");

    const filteredUsers = MOCK_USERS.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">User Management</h1>
                    <p className="text-slate-500 text-sm">Manage administrative access and bureau roles.</p>
                </div>
                <button className="bg-primary text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-primary/90 transition-all shadow-sm">
                    <UserPlus size={18} />
                    Invite Staff Member
                </button>
            </div>

            {/* Filters and Search */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-2">
                    <select className="px-3 py-2 border rounded-lg bg-white text-sm focus:ring-2 focus:ring-primary/20 outline-none">
                        <option value="">All Roles</option>
                        <option value="super_admin">Super Admin</option>
                        <option value="bureau_admin">Bureau Admin</option>
                        <option value="citizen">Citizen</option>
                        <option value="agent">Agent</option>
                    </select>
                    <select className="px-3 py-2 border rounded-lg bg-white text-sm focus:ring-2 focus:ring-primary/20 outline-none">
                        <option value="">All Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4 font-semibold text-slate-700 text-sm">Name & Email</th>
                                <th className="px-6 py-4 font-semibold text-slate-700 text-sm">Role</th>
                                <th className="px-6 py-4 font-semibold text-slate-700 text-sm">Status</th>
                                <th className="px-6 py-4 font-semibold text-slate-700 text-sm">Last Login</th>
                                <th className="px-6 py-4 font-semibold text-slate-700 text-sm text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600">
                                                {user.name.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="font-bold text-slate-900">{user.name}</div>
                                                <div className="text-xs text-slate-500 flex items-center gap-1">
                                                    <Mail size={12} /> {user.email}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            {user.role === "Super Admin" ? (
                                                <ShieldAlert className="text-red-500" size={16} />
                                            ) : user.role === "Bureau Admin" ? (
                                                <Shield className="text-blue-500" size={16} />
                                            ) : (
                                                <UserCheck className="text-slate-400" size={16} />
                                            )}
                                            <span className="text-sm text-slate-700">{user.role}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${user.status === "Active"
                                            ? "bg-green-100 text-green-700"
                                            : "bg-slate-100 text-slate-600"
                                            }`}>
                                            {user.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-500">
                                        {user.lastLogin}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                                            <MoreVertical size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
