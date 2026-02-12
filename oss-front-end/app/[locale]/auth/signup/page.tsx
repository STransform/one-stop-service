"use client";

import { Link } from '@/i18n/routing';
import { FaydaButton } from '@/components/auth/FaydaButton';
import { ArrowLeft } from 'lucide-react';

export default function SignupPage() {
    return (
        <div className="min-h-screen flex bg-slate-50">
            {/* Left Column: Branding / Info */}
            <div className="hidden lg:flex w-1/2 bg-[#008C45] text-white relative flex-col justify-between p-12 overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1534237710431-e2fc698436cd?q=80&w=2670&auto=format&fit=crop')] bg-cover bg-center opacity-20"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-[#008C45]/90 to-[#008C45]/60"></div>

                <div className="relative z-10">
                    <Link href="/" className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-8">
                        <ArrowLeft size={20} /> Back to Home
                    </Link>
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-[#008C45] font-bold text-xl mb-6">OM</div>
                    <h1 className="text-4xl font-bold mb-4">Join the Platform.</h1>
                    <p className="text-xl text-white/80 max-w-md">
                        Create a citizen account to access vital services, track your requests, and participate in the digital economy.
                    </p>
                </div>

                <div className="relative z-10 text-sm opacity-60">
                    &copy; {new Date().getFullYear()} Oromia Regional Government
                </div>
            </div>

            {/* Right Column: Signup Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center lg:text-left">
                        <div className="lg:hidden flex justify-center mb-6">
                            <div className="w-12 h-12 bg-[#008C45] rounded-full flex items-center justify-center text-white font-bold text-xl">OM</div>
                        </div>
                        <h2 className="text-3xl font-bold text-slate-900">Create your account</h2>
                        <p className="text-slate-500 mt-2">Get started with your National Digital ID.</p>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <div className="relative flex justify-center text-sm mb-6">
                                <span className="bg-slate-50 px-2 text-slate-500 font-medium">Fastest Way</span>
                            </div>
                            <FaydaButton mode="signup" />
                        </div>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-slate-200" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-slate-50 px-2 text-slate-500">Or register manually</span>
                            </div>
                        </div>

                        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label htmlFor="fname" className="text-sm font-medium text-slate-700">First Name</label>
                                    <input id="fname" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#008C45]/20 outline-none" />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="lname" className="text-sm font-medium text-slate-700">Last Name</label>
                                    <input id="lname" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#008C45]/20 outline-none" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="email" className="text-sm font-medium text-slate-700">Email Address</label>
                                <input id="email" type="email" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#008C45]/20 outline-none" />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="phone" className="text-sm font-medium text-slate-700">Phone Number</label>
                                <input id="phone" type="tel" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#008C45]/20 outline-none" />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="password" className="text-sm font-medium text-slate-700">Password</label>
                                <input id="password" type="password" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#008C45]/20 outline-none" />
                            </div>
                            <button className="w-full bg-slate-900 text-white font-bold py-3 px-4 rounded-lg hover:bg-slate-800 transition-colors">
                                Create Account
                            </button>
                        </form>

                        <p className="text-center text-sm text-slate-500">
                            Already have an account?{' '}
                            <Link href="/auth/login" className="font-bold text-[#008C45] hover:underline">
                                Log in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
