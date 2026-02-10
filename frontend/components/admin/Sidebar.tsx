'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';

interface MenuItem {
    label: string;
    href?: string;
    icon: React.ReactNode;
    children?: MenuItem[];
}

interface SidebarProps {
    collapsed: boolean;
}

export default function Sidebar({ collapsed }: SidebarProps) {
    const pathname = usePathname();
    const [expandedMenus, setExpandedMenus] = useState<string[]>(['web-manager']);

    const toggleMenu = (label: string) => {
        setExpandedMenus(prev =>
            prev.includes(label)
                ? prev.filter(item => item !== label)
                : [...prev, label]
        );
    };

    const isActive = (href?: string) => {
        if (!href) return false;
        return pathname === href;
    };

    const isParentActive = (children?: MenuItem[]) => {
        if (!children) return false;
        return children.some(child => pathname === child.href);
    };

    const menuItems: MenuItem[] = [
        {
            label: 'Main Pages',
            icon: null,
            children: [
                {
                    label: 'Website',
                    href: '/',
                    icon: (
                        <svg className="sidebar-menu-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    ),
                },
                {
                    label: 'Dashboard',
                    href: '/admin',
                    icon: (
                        <svg className="sidebar-menu-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                    ),
                },
            ],
        },
        {
            label: 'Services',
            icon: (
                <svg className="sidebar-menu-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
            ),
            children: [
                {
                    label: 'Books',
                    href: '/admin/books',
                    icon: (
                        <svg className="sidebar-menu-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                    ),
                },
                {
                    label: 'Products',
                    href: '/admin/products',
                    icon: (
                        <svg className="sidebar-menu-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                    ),
                },
                {
                    label: 'Orders',
                    href: '/admin/orders',
                    icon: (
                        <svg className="sidebar-menu-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                    ),
                },
            ],
        },
        {
            label: 'Form Builder',
            icon: (
                <svg className="sidebar-menu-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
            ),
            children: [
                {
                    label: 'Form Builder',
                    href: '/forms/builder',
                    icon: (
                        <svg className="sidebar-menu-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                    ),
                },
                {
                    label: 'Form List',
                    href: '/forms/list',
                    icon: (
                        <svg className="sidebar-menu-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    ),
                },
            ],
        },
        {
            label: 'User Manager',
            icon: (
                <svg className="sidebar-menu-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
            ),
            children: [
                {
                    label: 'Users',
                    href: '/admin/users',
                    icon: (
                        <svg className="sidebar-menu-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    ),
                },
                {
                    label: 'Roles & Permissions',
                    href: '/admin/roles',
                    icon: (
                        <svg className="sidebar-menu-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                    ),
                },
            ],
        },
    ];

    const renderMenuItem = (item: MenuItem, isSubmenu = false) => {
        const hasChildren = item.children && item.children.length > 0;
        const isExpanded = expandedMenus.includes(item.label);
        const active = isActive(item.href) || (hasChildren && isParentActive(item.children));

        if (!item.icon && !isSubmenu) {
            // Category header
            return (
                <div key={item.label} className="sidebar-category">
                    {!collapsed && item.label}
                </div>
            );
        }

        if (hasChildren && !item.href) {
            // Parent menu item with children
            return (
                <li key={item.label} className="sidebar-menu-item">
                    <div
                        className={`sidebar-menu-link ${active ? 'active' : ''} ${isExpanded ? 'expanded' : ''}`}
                        onClick={() => toggleMenu(item.label)}
                    >
                        {item.icon}
                        <span className="sidebar-menu-label">{item.label}</span>
                        <svg className="sidebar-menu-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </div>
                    <ul className={`sidebar-submenu ${isExpanded ? 'expanded' : ''}`}>
                        {item.children?.map(child => renderMenuItem(child, true))}
                    </ul>
                </li>
            );
        }

        // Regular menu item or submenu item
        if (isSubmenu) {
            return (
                <li key={item.label} className="sidebar-submenu-item">
                    <Link
                        href={item.href!}
                        className={`sidebar-submenu-link ${active ? 'active' : ''}`}
                    >
                        {item.icon}
                        <span className="sidebar-menu-label">{item.label}</span>
                    </Link>
                </li>
            );
        }

        return (
            <li key={item.label} className="sidebar-menu-item">
                <Link
                    href={item.href!}
                    className={`sidebar-menu-link ${active ? 'active' : ''}`}
                >
                    {item.icon}
                    <span className="sidebar-menu-label">{item.label}</span>
                </Link>
            </li>
        );
    };

    return (
        <aside className={`admin-sidebar ${collapsed ? 'collapsed' : ''}`}>
            <div className="sidebar-header">
                <div className="sidebar-logo-icon">A</div>
                {!collapsed && <div className="sidebar-logo">Admin Panel</div>}
            </div>
            <nav className="sidebar-nav">
                <ul className="sidebar-menu">
                    {menuItems.map(item => renderMenuItem(item))}
                </ul>
            </nav>
        </aside>
    );
}
