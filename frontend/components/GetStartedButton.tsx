'use client';

import { signIn } from 'next-auth/react';

export default function GetStartedButton() {
    return (
        <button
            onClick={() => signIn('keycloak', { callbackUrl: '/admin', redirect: true })}
            className="group flex items-center space-x-3 px-8 py-4 bg-black text-white rounded-full font-bold text-lg shadow-xl hover:shadow-2xl hover:bg-gray-900 transform hover:-translate-y-1 transition-all duration-200"
        >
            <span>Get Started</span>
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
        </button>
    );
}
