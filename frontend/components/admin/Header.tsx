'use client';

import { useSession, signOut } from 'next-auth/react';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

interface HeaderProps {
    onToggleSidebar: () => void;
    onToggleTheme: () => void;
    currentTheme: 'light' | 'dark';
}

export default function Header({ onToggleSidebar, onToggleTheme, currentTheme }: HeaderProps) {
    const { data: session } = useSession();
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = async () => {
        await signOut({ callbackUrl: '/' });
    };

    return (
        <header className="admin-header">
            <div className="header-left">
                <button
                    className="header-toggle"
                    onClick={onToggleSidebar}
                    aria-label="Toggle sidebar"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
            </div>

            <div className="header-right">
                {/* Theme Switcher */}
                <div className="theme-switcher">
                    <button
                        className="theme-switcher-btn"
                        onClick={onToggleTheme}
                        aria-label="Toggle theme"
                    >
                        {currentTheme === 'light' ? (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                            </svg>
                        ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                        )}
                    </button>
                </div>

                {/* User Profile */}
                {session && (
                    <div className="user-profile" ref={dropdownRef}>
                        <button
                            className="user-profile-btn"
                            onClick={() => setShowDropdown(!showDropdown)}
                            aria-label="User menu"
                        >
                            <img
                                src={session.user?.image || '/default-avatar.png'}
                                alt={session.user?.name || 'User'}
                                className="user-avatar"
                                onError={(e) => {
                                    e.currentTarget.src = '/default-avatar.png';
                                }}
                            />
                            <div className="user-info">
                                <div className="user-name">{session.user?.name || 'User'}</div>
                                <div className="user-role">
                                    {session.roles?.includes('admin') || session.roles?.includes('realm-admin') ? 'Admin' : 'User'}
                                </div>
                            </div>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        <div className={`dropdown-menu ${showDropdown ? 'show' : ''}`}>
                            <Link href="/profile" className="dropdown-item" onClick={() => setShowDropdown(false)}>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                Profile
                            </Link>
                            <div className="dropdown-divider"></div>
                            <button className="dropdown-item" onClick={handleLogout}>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                                Logout
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
}
