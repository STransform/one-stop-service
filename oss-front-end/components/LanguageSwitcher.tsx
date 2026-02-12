"use client";

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/routing';
import { Languages, Check } from 'lucide-react';
import * as React from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

const languages = [
    { code: 'en', label: 'English' },
    { code: 'om', label: 'Afaan Oromoo' },
    { code: 'am', label: 'Amharic (አማርኛ)' },
];

export default function LanguageSwitcher() {
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();

    const handleLanguageChange = (newLocale: string) => {
        router.replace(pathname, { locale: newLocale });
    };

    return (
        <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
                <button className="flex items-center gap-2 bg-secondary text-secondary-foreground px-3 py-2 rounded-md hover:bg-secondary/80 transition-colors outline-none focus:ring-2 focus:ring-primary/20">
                    <Languages size={18} />
                    <span className="text-sm font-medium uppercase">{locale}</span>
                </button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Portal>
                <DropdownMenu.Content
                    className="min-w-[160px] bg-white rounded-md shadow-lg p-1 border animate-in fade-in-0 zoom-in-95 data-[side=bottom]:slide-in-from-top-2 z-[200]"
                    sideOffset={5}
                >
                    {languages.map((lang) => (
                        <DropdownMenu.Item
                            key={lang.code}
                            onClick={() => handleLanguageChange(lang.code)}
                            className="flex items-center justify-between px-3 py-2 text-sm rounded-sm outline-none cursor-pointer hover:bg-slate-100 focus:bg-slate-100 text-slate-700 data-[highlighted]:bg-slate-100"
                        >
                            <span>{lang.label}</span>
                            {locale === lang.code && <Check size={14} className="text-primary" />}
                        </DropdownMenu.Item>
                    ))}
                </DropdownMenu.Content>
            </DropdownMenu.Portal>
        </DropdownMenu.Root>
    );
}
