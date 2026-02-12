"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Building2, Users, CheckCircle2, MapPin } from "lucide-react";

// Dynamically import Leaflet components to avoid SSR issues
const MapContainer = dynamic(
    () => import("react-leaflet").then((mod) => mod.MapContainer),
    { ssr: false }
);
const TileLayer = dynamic(
    () => import("react-leaflet").then((mod) => mod.TileLayer),
    { ssr: false }
);
const Marker = dynamic(
    () => import("react-leaflet").then((mod) => mod.Marker),
    { ssr: false }
);
const Popup = dynamic(
    () => import("react-leaflet").then((mod) => mod.Popup),
    { ssr: false }
);

export function MapSection() {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);

        (async () => {
            const L = (await import('leaflet')).default;
            // @ts-ignore
            delete L.Icon.Default.prototype._getIconUrl;

            L.Icon.Default.mergeOptions({
                iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
                iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
                shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
            });
        })();
    }, []);

    // Oromia center coordinates (approximate)
    const center: [number, number] = [8.5, 39.5];

    return (
        <section className="py-20 bg-white overflow-hidden relative min-h-screen">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    {/* Left Column: Content */}
                    <div className="space-y-8 z-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                            <MapPin size={16} />
                            <span>Regional Coverage</span>
                        </div>

                        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight">
                            Serving All of <br />
                            <span className="text-primary">Oromia Regional State</span>
                        </h2>

                        <p className="text-lg text-slate-600 leading-relaxed">
                            The Oromia One-Stop Service Portal allows citizens to access government services from anywhere. Whether you are in Adama, Jimma, or accessing services from abroad, our digital infrastructure keeps you connected.
                        </p>

                        <div className="grid grid-cols-2 gap-6 pt-4">
                            <StatCard
                                icon={<Users className="text-blue-500" size={24} />}
                                value="10M+"
                                label="Citizens Served"
                            />
                            <StatCard
                                icon={<Building2 className="text-orange-500" size={24} />}
                                value="21+"
                                label="Sectors Integrated"
                            />
                            <StatCard
                                icon={<CheckCircle2 className="text-green-500" size={24} />}
                                value="86+"
                                label="Active Services"
                            />
                            <StatCard
                                icon={<MapPin className="text-purple-500" size={24} />}
                                value="24/7"
                                label="Online Access"
                            />
                        </div>
                    </div>

                    {/* Right Column: Map */}
                    <div className="relative h-[500px] w-full bg-slate-100 rounded-3xl overflow-hidden shadow-2xl border border-slate-200">
                        {isMounted ? (
                            <MapContainer
                                center={center}
                                zoom={6}
                                className="h-full w-full z-0"
                                scrollWheelZoom={false}
                            >
                                <link
                                    rel="stylesheet"
                                    href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
                                    integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
                                    crossOrigin=""
                                />
                                <TileLayer
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />
                                <Marker position={[8.54, 39.27]}> {/* Adama approx */}
                                    <Popup>
                                        <div className="text-center">
                                            <strong className="block text-primary">Adama Service Center</strong>
                                            <span className="text-xs">Main Regional Office</span>
                                        </div>
                                    </Popup>
                                </Marker>
                                <Marker position={[9.03, 38.74]}> {/* Finfinne */}
                                    <Popup>
                                        <div className="text-center">
                                            <strong className="block text-primary">Finfinne HQ</strong>
                                            <span className="text-xs">Central Coordination</span>
                                        </div>
                                    </Popup>
                                </Marker>
                                <Marker position={[7.67, 36.83]}> {/* Jimma */}
                                    <Popup>
                                        <div className="text-center">
                                            <strong className="block text-primary">Jimma Branch</strong>
                                            <span className="text-xs">Western Region Hub</span>
                                        </div>
                                    </Popup>
                                </Marker>
                            </MapContainer>
                        ) : (
                            <div className="flex items-center justify-center h-full bg-slate-100 text-slate-400">
                                Loading Map...
                            </div>
                        )}

                        {/* Overlay Gradient for smooth integration */}
                        <div className="absolute inset-0 pointer-events-none border-4 border-white/50 rounded-3xl z-[400]"></div>
                    </div>
                </div>
            </div>
        </section>
    );
}

function StatCard({ icon, value, label }: { icon: React.ReactNode, value: string, label: string }) {
    return (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100 hover:shadow-lg transition-all hover:bg-white text-left">
            <div className="p-2 bg-white rounded-lg shadow-sm">{icon}</div>
            <div>
                <div className="text-2xl font-bold text-slate-900">{value}</div>
                <div className="text-sm text-slate-500 font-medium">{label}</div>
            </div>
        </div>
    );
}
