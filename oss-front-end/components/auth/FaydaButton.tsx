"use client";

import React from 'react';
import { Loader2 } from 'lucide-react';
import { useRouter } from '@/i18n/routing';
import { signIn } from 'next-auth/react';

interface FaydaButtonProps {
    mode?: 'signin' | 'signup';
}

export function FaydaButton({ mode = 'signin' }: FaydaButtonProps) {
    const [selectedRole, setSelectedRole] = React.useState("citizen");
    const [isLoading, setIsLoading] = React.useState(false);

    const handleFaydaLogin = async () => {
        setIsLoading(true);
        try {
            await signIn("credentials", {
                redirect: true,
                callbackUrl: "/en/dashboard", // Go to dashboard to see role-specific view
                username: selectedRole,
            });
        } catch (error) {
            console.error("Login error:", error);
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full space-y-4">
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Test as Role:</label>
                <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="w-full p-2 bg-white border border-slate-300 rounded-md text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                    <option value="citizen">Citizen</option>
                    <option value="officer">Front Desk Officer</option>
                    <option value="supervisor">Supervisor</option>
                    <option value="admin">System Admin</option>
                    <option value="super_admin">Super Admin</option>
                </select>
            </div>

            <button
                onClick={handleFaydaLogin}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-3 bg-[#003366] text-white py-3 px-4 rounded-lg font-bold hover:bg-[#002244] transition-all shadow-md group relative overflow-hidden disabled:opacity-70 disabled:pointer-events-none"
            >
                {/* Mock Fayda Logo */}
                <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center text-[#003366] font-bold text-xs ring-2 ring-white/20">
                    F
                </div>

                <span>{isLoading ? 'Connecting to Fayda...' : (mode === 'signup' ? 'Sign up with Fayda' : 'Log in with Fayda')}</span>

                {isLoading && <Loader2 className="animate-spin ml-2" size={18} />}

                {/* Glossy effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:animate-shimmer" />
            </button>
        </div>
    );
}
