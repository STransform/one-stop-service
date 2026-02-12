"use client";

import React from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useSession } from "next-auth/react";
import { FileText, Clock, AlertCircle } from "lucide-react";
import { Role } from "@/config/menu-config";

export default function DashboardPage() {
    const { data: session } = useSession();
    const role = (session?.user?.role as Role) || "CITIZEN";

    return (
        <DashboardLayout>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900">
                    Welcome back, {session?.user?.name}
                </h1>
                <p className="text-slate-500 mt-2">
                    Here is an overview of your {role.replace('_', ' ').toLowerCase()} dashboard.
                </p>
            </div>

            {/* Role-Specific Content Widget */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <DashboardStat
                    title={role === 'CITIZEN' ? "Active Requests" : "Pending Tasks"}
                    value="3"
                    icon={FileText}
                    color="text-blue-600 bg-blue-100"
                />
                <DashboardStat
                    title={role === 'CITIZEN' ? "Pending Actions" : "Urgent Cases"}
                    value="1"
                    icon={AlertCircle}
                    color="text-amber-600 bg-amber-100"
                />
                <DashboardStat
                    title="Last Login"
                    value="Today, 09:41 AM"
                    icon={Clock}
                    color="text-slate-600 bg-slate-100"
                />
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h2 className="text-xl font-bold mb-4 text-slate-800">Recent Activity</h2>
                <div className="space-y-4">
                    <p className="text-slate-500 italic">No recent activity to show.</p>
                </div>
            </div>
        </DashboardLayout>
    );
}

function DashboardStat({ title, value, icon: Icon, color }: any) {
    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${color}`}>
                <Icon size={24} />
            </div>
            <div>
                <p className="text-sm text-slate-500 font-medium">{title}</p>
                <div className="text-2xl font-bold text-slate-900">{value}</div>
            </div>
        </div>
    );
}
