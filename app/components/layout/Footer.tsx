'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
    MapPinIcon,
    PhoneIcon,
    EnvelopeIcon,
    InstagramLogoIcon,
    FacebookLogoIcon,
    WhatsappLogoIcon,
    ClockIcon,
} from '@phosphor-icons/react';

// ============================================
// DATA
// ============================================
const HOURS = [
    { days: 'Mon – Fri', time: '8:00 AM – 10:00 PM' },
    { days: 'Sat – Sun', time: '8:00 AM – 11:00 PM' },
    { days: 'Public Holidays', time: '9:00 AM – 9:00 PM' },
];

const BRANCHES = [
    { name: 'Osu', address: '123 Oxford Street, Osu' },
    { name: 'East Legon', address: '45 American House, East Legon' },
    { name: 'Spintex', address: '78 Spintex Road' },
    { name: 'Madina', address: 'Remy Junction, Madina' },
    { name: 'Tema', address: 'Community 1, Tema' },
];

const SOCIAL = [
    { icon: <InstagramLogoIcon weight="fill" size={20} />, label: 'Instagram', href: '#' },
    { icon: <FacebookLogoIcon weight="fill" size={20} />, label: 'Facebook', href: '#' },
    { icon: <WhatsappLogoIcon weight="fill" size={20} />, label: 'WhatsApp', href: '#' },
];

const QUICK_LINKS = [
    { label: 'Home', href: '/' },
    { label: 'Our Menu', href: '/menu' },
    { label: 'Track Order', href: '/orders' },
    { label: 'Find a Branch', href: '#' },
];

// ============================================
// COMPONENT
// ============================================
export default function Footer() {
    return (
        <footer className="bg-brand-darker border-t border-white/5 mt-8">

            {/* Main Footer Grid */}
            <div className="w-[95%] hidden md:w-[80%] xl:w-[70%] mx-auto py-12 md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

                {/* ── Col 1: Brand ── */}
                <div className="flex flex-col gap-4 sm:col-span-2 lg:col-span-1">
                    <Link href="/" className="flex items-center gap-2">
                        <Image src="/cblogo.webp" alt="CediBites" width={36} height={36} className="object-contain" />
                        <span className="text-xl font-bold text-primary font-body">CediBites</span>
                    </Link>
                    <p className="text-sm text-white/50 leading-relaxed max-w-[220px]">
                        Authentic Ghanaian flavours, delivered fresh to your door from our branches across Accra.
                    </p>

                    {/* Social */}
                    <div className="flex items-center gap-3 mt-1">
                        {SOCIAL.map((s) => (
                            <a
                                key={s.label}
                                href={s.href}
                                aria-label={s.label}
                                className="w-9 h-9 flex items-center justify-center rounded-full bg-white/5 hover:bg-primary/20 hover:text-primary text-white/50 transition-colors duration-150"
                            >
                                {s.icon}
                            </a>
                        ))}
                    </div>
                </div>

                {/* ── Col 2: Hours ── */}
                <div className="flex flex-col gap-4">
                    <h4 className="text-white font-semibold flex items-center gap-2">
                        <ClockIcon weight="fill" size={16} className="text-primary" />
                        Opening Hours
                    </h4>
                    <ul className="flex flex-col gap-3">
                        {HOURS.map((h) => (
                            <li key={h.days} className="flex flex-col gap-0.5">
                                <span className="text-xs text-white/40 uppercase tracking-wide">{h.days}</span>
                                <span className="text-sm text-white/80">{h.time}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* ── Col 3: Branches ── */}
                <div className="flex flex-col gap-4">
                    <h4 className="text-white font-semibold flex items-center gap-2">
                        <MapPinIcon weight="fill" size={16} className="text-primary" />
                        Our Branches
                    </h4>
                    <ul className="flex flex-col gap-2.5">
                        {BRANCHES.map((b) => (
                            <li key={b.name}>
                                <p className="text-sm font-medium text-white/80">{b.name}</p>
                                <p className="text-xs text-white/40">{b.address}</p>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* ── Col 4: Contact + Quick Links ── */}
                <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-4">
                        <h4 className="text-white font-semibold">Contact</h4>
                        <ul className="flex flex-col gap-3">
                            <li>
                                <a href="tel:+233241234567" className="flex items-center gap-2 text-sm text-white/60 hover:text-primary transition-colors">
                                    <PhoneIcon weight="fill" size={14} className="text-primary shrink-0" />
                                    +233 24 123 4567
                                </a>
                            </li>
                            <li>
                                <a href="mailto:hello@cedibites.com" className="flex items-center gap-2 text-sm text-white/60 hover:text-primary transition-colors">
                                    <EnvelopeIcon weight="fill" size={14} className="text-primary shrink-0" />
                                    hello@cedibites.com
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div className="flex flex-col gap-3">
                        <h4 className="text-white font-semibold">Quick Links</h4>
                        <ul className="flex flex-col gap-2">
                            {QUICK_LINKS.map((l) => (
                                <li key={l.label}>
                                    <Link href={l.href} className="text-sm text-white/50 hover:text-primary transition-colors">
                                        {l.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            {/* Divider */}
            <div className="w-[95%] md:w-[80%] xl:w-[70%] mx-auto border-t border-white/5" />

            {/* Bottom Bar */}
            <div className="w-[95%] md:w-[80%] xl:w-[70%] py-8 mx-auto md:py-5 flex flex-col sm:flex-row items-center justify-between gap-2">
                <p className="text-xs text-white/30">
                    © {new Date().getFullYear()} CediBites Restaurant. All rights reserved.
                </p>
                <p className="text-xs text-white/20">
                    Built by <span className="text-white/40">Saharabasetech</span>
                </p>
            </div>

        </footer>
    );
}