'use client';

import { useState, useEffect } from 'react';
import Sidebar from './admin/Sidebar';
import Header from './admin/Header';

interface AdminLayoutProps {
    children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [theme, setTheme] = useState<'light' | 'dark'>('light');

    useEffect(() => {
        // Load theme from localStorage
        const savedTheme = localStorage.getItem('admin-theme') as 'light' | 'dark' | null;
        if (savedTheme) {
            setTheme(savedTheme);
            document.documentElement.setAttribute('data-theme', savedTheme);
        }
    }, []);

    const toggleSidebar = () => {
        if (window.innerWidth < 768) {
            setMobileOpen(!mobileOpen);
        } else {
            setSidebarCollapsed(!sidebarCollapsed);
        }
    };

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        localStorage.setItem('admin-theme', newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
    };

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setMobileOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="admin-page">
            <Sidebar collapsed={sidebarCollapsed} />
            <Header
                onToggleSidebar={toggleSidebar}
                onToggleTheme={toggleTheme}
                currentTheme={theme}
            />
            <main className="admin-main">
                {children}
            </main>

            {/* Mobile overlay */}
            {mobileOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            <style jsx global>{`
        .admin-sidebar.mobile-open {
          transform: translateX(0);
        }
        ${mobileOpen ? '.admin-sidebar { transform: translateX(0); }' : ''}
      `}</style>
        </div>
    );
}
