import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { Inter, Noto_Sans_Ethiopic } from "next/font/google";
import "../globals.css";
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";

const inter = Inter({
    variable: "--font-inter",
    subsets: ["latin"],
});

const notoEthiopic = Noto_Sans_Ethiopic({
    variable: "--font-noto-ethiopia",
    subsets: ["ethiopic"],
});

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'Index' });

    return {
        title: t('title')
    };
}

export default async function RootLayout({
    children,
    params
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    const session = await auth();

    // Ensure that the incoming `locale` is valid
    if (!routing.locales.includes(locale as any)) {
        notFound();
    }

    // Providing all messages to the client
    // side is the easiest way to get started
    const messages = await getMessages();

    const isAmharic = locale === 'am';

    return (
        <html lang={locale}>
            <body
                className={`${inter.variable} ${notoEthiopic.variable} ${isAmharic ? 'font-amharic' : 'font-sans'} antialiased`}
                suppressHydrationWarning
            >
                <SessionProvider session={session}>
                    <NextIntlClientProvider messages={messages}>
                        <Navbar />
                        <div className="min-h-screen">
                            {children}
                        </div>
                    </NextIntlClientProvider>
                </SessionProvider>
            </body>
        </html>
    );
}
