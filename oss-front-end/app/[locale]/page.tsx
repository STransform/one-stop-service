"use client";

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Navbar } from '@/components/layout/Navbar';
import {
    ArrowRight, Star, ShieldCheck, Clock, TrendingUp, ChevronRight,
    Search, Building2, HelpCircle, Activity, PhoneCall, MessageSquare,
    CheckSquare, Newspaper, Mail, Phone, MapPin, Send, User, Check
} from 'lucide-react';
import { MapSection } from '@/components/home/MapSection';

export default function HomePage() {
    const t = useTranslations('Index');
    const [isSent, setIsSent] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [currentSlide, setCurrentSlide] = useState(0);

    const sliderImages = [
        {
            url: '/images/hero-slider-2.png',
            title: t('title'),
            subtitle: 'Serving Our Community with Excellence. Access 86+ integrated government services securely with your Digital ID.'
        },
        {
            url: '/images/hero-slider-1.png',
            title: 'Modern Digital Services',
            subtitle: 'Empowering Oromia through seamless, transparent, and tech-driven public service delivery.'
        },
        {
            url: '/images/hero-slider-3.png',
            title: 'Integrated Governance',
            subtitle: 'Connecting all regional bureaus into one digital platform for faster and more efficient citizens support.'
        }
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
        }, 6500);
        return () => clearInterval(timer);
    }, [sliderImages.length]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsSent(true);
        setIsLoading(false);
    };

    return (
        <div className="flex flex-col">
            <main className="flex-1">
                {/* Hero Section - Multi-Image Slider */}
                <section className="relative bg-black h-screen overflow-hidden flex items-center">
                    {/* Background Slider */}
                    {sliderImages.map((slide, index) => (
                        <div
                            key={index}
                            className={`absolute inset-0 transition-all duration-2000 ease-in-out ${index === currentSlide ? 'opacity-70 scale-100' : 'opacity-0 scale-110'
                                }`}
                        >
                            <div
                                className="absolute inset-0 bg-cover bg-center transition-transform duration-[10000ms] ease-linear"
                                style={{
                                    backgroundImage: `url('${slide.url}')`,
                                    transform: index === currentSlide ? 'scale(1.15)' : 'scale(1)'
                                }}
                            ></div>
                            <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/80"></div>
                        </div>
                    ))}

                    <div className="container mx-auto px-4 relative z-10 text-center">
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
                            <div className="inline-flex items-center gap-2 bg-primary/20 text-white px-5 py-2 rounded-full text-sm font-bold mb-8 border border-primary/30 backdrop-blur-md">
                                <ShieldCheck size={16} className="text-primary" />
                                <span className="tracking-widest uppercase text-[11px]">Official Oromia Digital Gateway</span>
                            </div>
                        </div>

                        <div className="min-h-[180px] md:min-h-[220px]">
                            <h1 className="text-5xl md:text-8xl font-black text-white mb-8 tracking-tighter leading-[0.9] animate-in fade-in slide-in-from-bottom-8 duration-1000">
                                {sliderImages[currentSlide].title}
                            </h1>

                            <div className="max-w-3xl mx-auto mb-12 text-xl md:text-2xl text-white/80 leading-relaxed font-medium transition-all duration-1000 animate-in fade-in slide-in-from-bottom-12 delay-300">
                                {sliderImages[currentSlide].subtitle}
                            </div>
                        </div>

                        {/* Search Bar */}
                        {/* <div className="max-w-2xl mx-auto relative mb-16 group animate-in fade-in slide-in-from-bottom-16 delay-500">
                            <div className="relative flex items-center bg-white/10 backdrop-blur-2xl border border-white/20 rounded-full p-1.5 pl-8 shadow-3xl focus-within:bg-white/20 focus-within:border-white/40 transition-all duration-500">
                                <Search className="text-white/60 mr-3" size={18} />
                                <input
                                    type="text"
                                    placeholder="Which service do you need today?"
                                    className="bg-transparent border-none focus:ring-0 text-white placeholder:text-white/40 w-full py-3.5 text-lg font-medium outline-none"
                                />
                                <button className="bg-primary hover:bg-primary/90 text-white px-8 py-3.5 rounded-full font-bold text-lg transition-all shadow-xl shadow-primary/20 active:scale-95">
                                    Search Services
                                </button>
                            </div>
                        </div> */}
                        {/* Compact Search Bar */}
                        <div className="max-w-2xl mx-auto relative mb-10 group">
                            <div className="relative flex items-center bg-white/10 backdrop-blur-xl border border-white/20 rounded-full px-4 py-1 shadow-2xl focus-within:bg-white/20 focus-within:border-white/40 transition-all duration-300">

                                <Search className="text-white/60 mr-2 shrink-0" size={18} />

                                <input
                                    type="text"
                                    placeholder="Which service do you need today?"
                                    className="bg-transparent border-none focus:ring-0 text-white placeholder:text-white/40 w-full py-2 text-sm font-medium outline-none"
                                />

                                <button className="ml-3 bg-primary hover:bg-primary/90 text-white px-5 py-2 rounded-full font-semibold text-sm transition-all shadow-md active:scale-95 whitespace-nowrap">
                                    Search
                                </button>
                            </div>
                        </div>


                        {/* Slide Indicators */}
                        <div className="flex justify-center gap-3 mt-12">
                            {sliderImages.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentSlide(index)}
                                    className={`h-1.5 transition-all duration-500 rounded-full ${index === currentSlide ? 'w-12 bg-primary' : 'w-4 bg-white/30 hover:bg-white/50'
                                        }`}
                                    aria-label={`Go to slide ${index + 1}`}
                                />
                            ))}
                        </div>

                        <div className="flex flex-wrap items-center justify-center gap-8 mt-16 animate-in fade-in zoom-in duration-1000 delay-1000">
                            <div className="flex items-center gap-3 text-white/60 text-xs font-black bg-white/5 px-6 py-3 rounded-full border border-white/10 backdrop-blur-sm">
                                <span className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_12px_rgba(34,197,94,0.8)] animate-pulse"></span>
                                86+ SERVICES ONLINE
                            </div>
                            <div className="flex items-center gap-3 text-white/60 text-xs font-black bg-white/5 px-6 py-3 rounded-full border border-white/10 backdrop-blur-sm">
                                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.8)] animate-pulse"></span>
                                FAYDA SECURED
                            </div>
                        </div>
                    </div>
                </section>

                {/* Map & About Section */}
                <div id="about" className="scroll-mt-20">
                    <MapSection />
                </div>

                {/* Services Section - Slideable Grid */}
                <section id="services" className="py-24 bg-white relative overflow-hidden min-h-screen flex items-center scroll-mt-20">
                    <div className="absolute inset-0 opacity-[0.05] bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:24px_24px]"></div>

                    <div className="container mx-auto px-4 relative z-10">
                        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                            <div className="max-w-2xl text-left">
                                <div className="inline-flex items-center gap-2 text-primary font-bold mb-3 uppercase tracking-wider text-sm">
                                    <div className="w-8 h-[2px] bg-primary"></div>
                                    <span>Available Services</span>
                                </div>
                                <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight mb-4">
                                    Our <span className="text-primary">Core Services</span>
                                </h2>
                                <p className="text-lg text-slate-600">
                                    Fast-track your applications with our integrated digital services.
                                </p>
                            </div>
                            <div className="flex gap-4">
                                <button className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center hover:bg-primary hover:text-white transition-all shadow-sm">
                                    <ArrowRight size={20} className="rotate-180" />
                                </button>
                                <button className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center hover:bg-primary hover:text-white transition-all shadow-sm">
                                    <ArrowRight size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Slideable Grid Container */}
                        <div className="overflow-x-auto pb-8 hide-scrollbar">
                            <div className="flex gap-8 min-w-max px-2">
                                <ServiceSliderCard
                                    name="Civil Status"
                                    count="12 Forms"
                                    icon="👶"
                                    description="Birth, marriage, and death registration services."
                                />
                                <ServiceSliderCard
                                    name="Driver Licensing"
                                    count="8 Services"
                                    icon="🚗"
                                    description="Apply for new licenses, renewals, and replacements."
                                />
                                <ServiceSliderCard
                                    name="Revenue & Tax"
                                    count="15 Services"
                                    icon="💰"
                                    description="Tax declarations, clearances, and payment history."
                                />
                                <ServiceSliderCard
                                    name="Health Permits"
                                    count="10 Services"
                                    icon="🏥"
                                    description="Professional licensing and health facility permits."
                                />
                                <ServiceSliderCard
                                    name="Land Services"
                                    count="6 Services"
                                    icon="🏘️"
                                    description="Title deeds, land use permits, and transfers."
                                />
                                <ServiceSliderCard
                                    name="Business Registry"
                                    count="9 Services"
                                    icon="🏢"
                                    description="Business registration, names, and licensing."
                                />
                            </div>
                        </div>

                        <div className="mt-16 text-center">
                            <Link href="/services" className="inline-flex items-center gap-3 font-bold text-primary hover:gap-5 transition-all group">
                                View all 86 Services <ArrowRight size={20} />
                            </Link>
                        </div>
                    </div>
                </section>

                {/* News Section */}
                <section id="news" className="py-24 bg-slate-50 min-h-screen flex items-center scroll-mt-20">
                    <div className="container mx-auto px-4">
                        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                            <div className="max-w-2xl">
                                <div className="inline-flex items-center gap-2 text-primary font-bold mb-3 uppercase tracking-wider text-sm">
                                    <Newspaper size={18} />
                                    <span>Latest Updates</span>
                                </div>
                                <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6">Regional News</h2>
                                <p className="text-lg text-slate-600">Stay informed about new services and government announcements.</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <NewsCard
                                date="Oct 24, 2023"
                                title="Digital ID Integration"
                                excerpt="Starting next month, all renewals will require Fayda Digital ID integration..."
                            />
                            <NewsCard
                                date="Oct 20, 2023"
                                title="OSS Users Milestone"
                                excerpt="The Oromia OSS platform reaches 10 million registered users milestone..."
                            />
                            <NewsCard
                                date="Oct 15, 2023"
                                title="New Service Locations"
                                excerpt="Five new One-Stop Service centers opened in Western Oromia zones..."
                            />
                        </div>
                    </div>
                </section>

                {/* Contact Section */}
                <section id="contact" className="py-24 bg-white min-h-screen flex items-center scroll-mt-20">
                    <div className="container mx-auto px-4">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                            <div>
                                <div className="inline-flex items-center gap-2 text-primary font-bold mb-4 uppercase tracking-wider text-sm">
                                    <div className="w-8 h-[2px] bg-primary"></div>
                                    <span>Contact Us</span>
                                </div>
                                <h1 className="text-5xl md:text-6xl font-extrabold mb-8 text-slate-900">Get in <span className="text-primary">Touch</span></h1>
                                <p className="text-xl text-slate-600 mb-12 leading-relaxed">
                                    Have questions? Our team is ready to assist you.
                                </p>
                                <div className="space-y-8">
                                    <div className="flex items-center gap-6 p-6 rounded-3xl bg-slate-50 border border-slate-100">
                                        <div className="w-14 h-14 bg-primary text-white rounded-2xl flex items-center justify-center shadow-lg"><Phone size={24} /></div>
                                        <div>
                                            <div className="text-slate-400 text-sm font-bold uppercase tracking-widest">Call Us</div>
                                            <div className="text-xl font-bold text-slate-900">+251 11-123-4567</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6 p-6 rounded-3xl bg-slate-50 border border-slate-100">
                                        <div className="w-14 h-14 bg-primary text-white rounded-2xl flex items-center justify-center shadow-lg"><Mail size={24} /></div>
                                        <div>
                                            <div className="text-slate-400 text-sm font-bold uppercase tracking-widest">Email Support</div>
                                            <div className="text-xl font-bold text-slate-900">support@oss.oromia.gov.et</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white rounded-[3rem] p-8 md:p-12 text-slate-900 shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-slate-100 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[5rem]"></div>

                                {isSent ? (
                                    <div className="flex flex-col items-center justify-center py-12 text-center animate-in fade-in zoom-in duration-500">
                                        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                                            <Check size={40} />
                                        </div>
                                        <h3 className="text-3xl font-bold mb-4">Message Sent!</h3>
                                        <p className="text-slate-600 mb-8 max-w-xs mx-auto text-lg font-medium">
                                            Thank you for reaching out. We've received your inquiry and will get back to you soon.
                                        </p>
                                        <button
                                            onClick={() => setIsSent(false)}
                                            className="text-primary font-bold hover:underline py-2"
                                        >
                                            Send another message
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <h3 className="text-3xl font-extrabold mb-8 flex items-center gap-4 text-slate-900">
                                            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                                                <MessageSquare size={24} />
                                            </div>
                                            Send a Message
                                        </h3>
                                        <form onSubmit={handleSubmit} className="space-y-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <label className="text-sm font-bold text-slate-500 uppercase tracking-widest pl-1">Full Name</label>
                                                    <div className="relative group">
                                                        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
                                                            <User size={18} />
                                                        </div>
                                                        <input
                                                            required
                                                            type="text"
                                                            placeholder="Abebe Balcha"
                                                            className="w-full pl-12 pr-6 py-4 rounded-2xl bg-slate-50 border border-slate-200 outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all font-medium text-slate-900 placeholder:text-slate-300"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-sm font-bold text-slate-500 uppercase tracking-widest pl-1">Email Address</label>
                                                    <div className="relative group">
                                                        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
                                                            <Mail size={18} />
                                                        </div>
                                                        <input
                                                            required
                                                            type="email"
                                                            placeholder="abebe@example.com"
                                                            className="w-full pl-12 pr-6 py-4 rounded-2xl bg-slate-50 border border-slate-200 outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all font-medium text-slate-900 placeholder:text-slate-300"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-bold text-slate-500 uppercase tracking-widest pl-1">Subject</label>
                                                <div className="relative group">
                                                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
                                                        <Star size={18} />
                                                    </div>
                                                    <input
                                                        required
                                                        type="text"
                                                        placeholder="Service Inquiry / Technical Issue"
                                                        className="w-full pl-12 pr-6 py-4 rounded-2xl bg-slate-50 border border-slate-200 outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all font-medium text-slate-900 placeholder:text-slate-300"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-bold text-slate-500 uppercase tracking-widest pl-1">Message</label>
                                                <textarea
                                                    required
                                                    rows={5}
                                                    placeholder="Tell us how we can assist you..."
                                                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-200 outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all font-medium text-slate-900 placeholder:text-slate-300 resize-none"
                                                />
                                            </div>
                                            <button
                                                type="submit"
                                                disabled={isLoading}
                                                className="w-full bg-primary text-white py-6 rounded-2xl font-bold text-xl hover:brightness-110 transition-all shadow-xl shadow-primary/30 flex items-center justify-center gap-4 group disabled:opacity-70 disabled:cursor-not-allowed"
                                            >
                                                {isLoading ? (
                                                    <span className="flex items-center gap-2">
                                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                        Sending...
                                                    </span>
                                                ) : (
                                                    <>
                                                        <span>Submit Message</span>
                                                        <Send size={22} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                                    </>
                                                )}
                                            </button>
                                        </form>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="bg-slate-950 text-slate-400 py-16 border-t border-white/5">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                        <div className="space-y-6">
                            <div className="font-bold text-white text-2xl flex items-center gap-2">
                                <div className="w-8 h-8 bg-primary rounded-lg"></div>
                                Oromia OSS
                            </div>
                            <p className="text-sm leading-relaxed">
                                The official integrated digital gateway for the Oromia Regional Government services.
                            </p>
                        </div>
                        <div>
                            <div className="font-bold text-white mb-6 uppercase tracking-widest text-sm">Quick Links</div>
                            <ul className="space-y-4 text-sm">
                                <li><Link href="/services" className="hover:text-primary transition-colors">Digital Services</Link></li>
                                <li><Link href="/track-request" className="hover:text-primary transition-colors">Track Request</Link></li>
                                <li><Link href="/support" className="hover:text-primary transition-colors">Help Center</Link></li>
                            </ul>
                        </div>
                        <div>
                            <div className="font-bold text-white mb-6 uppercase tracking-widest text-sm">Legal</div>
                            <ul className="space-y-4 text-sm">
                                <li><Link href="/" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                                <li><Link href="/" className="hover:text-primary transition-colors">Terms of Service</Link></li>
                            </ul>
                        </div>
                        <div>
                            <div className="font-bold text-white mb-6 uppercase tracking-widest text-sm">Connect</div>
                            <ul className="space-y-4 text-sm">
                                <li>Facebook</li>
                                <li>Twitter / X</li>
                                <li>Telegram</li>
                            </ul>
                        </div>
                    </div>
                    <div className="pt-8 border-t border-white/5 text-center text-xs opacity-50">
                        &copy; {new Date().getFullYear()} Oromia Regional Government. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
}

function ServiceSliderCard({ name, count, icon, description }: { name: string, count: string, icon: string, description: string }) {
    return (
        <div className="w-[350px] p-8 rounded-[2.5rem] border border-slate-100 bg-white shadow-sm hover:shadow-xl transition-all duration-500 group relative overflow-hidden flex flex-col">
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-[4rem] group-hover:w-32 group-hover:h-32 transition-all"></div>
            <div className="text-5xl mb-8 p-4 bg-slate-50 rounded-2xl w-fit group-hover:scale-110 group-hover:bg-primary/10 transition-all duration-500">{icon}</div>
            <div className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-[10px] font-bold mb-4 w-fit uppercase tracking-widest">{count}</div>
            <h3 className="text-2xl font-extrabold text-slate-900 mb-4 group-hover:text-primary transition-colors">{name}</h3>
            <p className="text-slate-600 leading-relaxed mb-8 text-sm">{description}</p>
            <Link href="/services" className="mt-auto inline-flex items-center gap-2 font-extrabold text-primary text-[10px] uppercase tracking-widest group-hover:gap-4 transition-all">
                Access services <ArrowRight size={14} />
            </Link>
        </div>
    );
}

function NewsCard({ date, title, excerpt }: { date: string, title: string, excerpt: string }) {
    return (
        <div className="p-10 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm hover:shadow-2xl transition-all h-full group flex flex-col items-start">
            <div className="text-xs font-bold text-primary mb-4 uppercase tracking-widest">{date}</div>
            <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-primary transition-colors">{title}</h3>
            <p className="text-slate-600 leading-relaxed mb-10">{excerpt}</p>
            <Link href="/" className="mt-auto inline-flex items-center gap-2 font-bold text-slate-300 group-hover:text-primary transition-colors">
                Read Story <ArrowRight size={18} />
            </Link>
        </div>
    );
}
