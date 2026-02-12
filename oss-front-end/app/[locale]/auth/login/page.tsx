"use client";

import { Link } from '@/i18n/routing';
import { FaydaButton } from '@/components/auth/FaydaButton';
import { ArrowLeft, ShieldCheck } from 'lucide-react'; // Added ShieldCheck icon
import Image from 'next/image';
import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';

export default function LoginPage() {
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get('callbackUrl') || '/admin';

    const handleKeycloakLogin = () => {
        signIn('keycloak', { callbackUrl });
    };

    return (
        <div className="min-h-screen flex bg-slate-50">
            {/* Left Column: Branding / Info */}
            <div className="hidden lg:flex w-1/2 bg-primary text-primary-foreground relative flex-col justify-between p-12 overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1575459958178-01188432360f?q=80&w=2574&auto=format&fit=crop')] bg-cover bg-center opacity-20"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-primary/90 to-primary/60"></div>

                <div className="relative z-10">
                    <Link href="/" className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-8">
                        <ArrowLeft size={20} /> Back to Home
                    </Link>
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-primary font-bold text-xl mb-6">
                        <Image
                            src="/images/logo.png"
                            alt="Logo"
                            width={50}
                            height={50}
                            className="w-full h-full object-contain"
                        />
                    </div>
                    <h1 className="text-4xl font-bold mb-4">Welcome Back.</h1>
                    <p className="text-xl text-primary-foreground/80 max-w-md">
                        Log in to access your dashboard, track applications, and manage your permits securely.
                    </p>
                </div>

                <div className="relative z-10 text-sm opacity-60">
                    &copy; {new Date().getFullYear()} Oromia Regional Government
                </div>
            </div>

            {/* Right Column: Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center lg:text-left">
                        <div className="lg:hidden flex justify-center mb-6">
                            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold text-xl">OM</div>
                        </div>
                        <h2 className="text-3xl font-bold text-slate-900">Sign in to your account</h2>
                        <p className="text-slate-500 mt-2">Use your Official ID for instant access.</p>
                    </div>

                    <div className="space-y-6">
                        {/* Keycloak Login Button */}
                        <button
                            onClick={handleKeycloakLogin}
                            className="w-full flex items-center justify-center gap-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-xl transition-all shadow-md group border border-transparent hover:border-indigo-500"
                        >
                            <div className="bg-white/20 p-1.5 rounded-lg group-hover:bg-white/30 transition-colors">
                                <ShieldCheck size={20} />
                            </div>
                            <span>Sign In with OSS Account</span>
                        </button>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-slate-200" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-slate-50 px-2 text-slate-500">Other Options</span>
                            </div>
                        </div>

                        <div>
                            <div className="relative flex justify-center text-sm mb-6">
                                <span className="bg-slate-50 px-2 text-slate-500 font-medium">Citizen ID</span>
                            </div>
                            <FaydaButton mode="signin" />
                        </div>


                        {/* Optional: Keep email login if needed, or comment it out if only Keycloak is used */}
                        {/* 
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-slate-200" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-slate-50 px-2 text-slate-500">Or continue with email</span>
                            </div>
                        </div>

                        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                           ...
                        </form> 
                        */}
                    </div>
                </div>
            </div>
        </div>
    );
}
