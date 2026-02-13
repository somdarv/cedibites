'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Button from '../base/Button';
import { HamburgerIcon, ListIcon, HouseIcon, PathIcon, ShoppingBagIcon, UserIcon, PhoneIcon } from "@phosphor-icons/react";
import Image from 'next/image';
import LocationBadge from '../ui/LocationBadge';
import { useBranch } from '../providers/BranchProvider';
import { useLocation } from '../providers/LocationProvider';
import { useModal } from '../providers/ModalProvider';




const App = () => {

};

interface NavItem {
    label: string;
    href: string;
    active?: boolean;
    icon: React.ReactNode;
}

interface NavbarProps {
    cartItemCount?: number;
    cartTotal?: number;
    userName?: string;
    userAvatar?: string;
    onCartClick?: () => void;
    onLocationClick?: () => void;
}

export default function Navbar({
    cartItemCount = 0,
    cartTotal = 0,
    userName,
    userAvatar,
    onCartClick = () => { },
    onLocationClick = () => { },
}: NavbarProps) {
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { selectedBranch, getBranchesWithDistance } = useBranch();
    const { openBranchSelector } = useModal();
    const { coordinates, permissionStatus } = useLocation();
    const [mounted, setMounted] = useState(false);


    const branchDistance = coordinates && selectedBranch
        ? getBranchesWithDistance(coordinates.latitude, coordinates.longitude)
            .find(b => b.id === selectedBranch.id)?.distance
        : null;

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isMobileMenuOpen]);

    // 👇 Check if location is being requested
    const isLocationLoading = permissionStatus === 'prompt' && !coordinates;

    const navItems: NavItem[] = [
        { label: 'Home', icon: <ListIcon weight='bold' size={32} />, href: '/' },
        { label: 'Our Menu', icon: <HamburgerIcon weight="fill" size={32} />, href: '/menu' },
        { label: 'Track Order', icon: <PathIcon weight="fill" size={32} />, href: '/orders' },
    ];

    const isActive = (href: string) => pathname === href;

    const phoneNumbers = [
        '+233 24 123 4567',
        '+233 50 987 6543',
    ];

    return (
        <>
            <nav>
                <div className={`fixed top-0 left-0 w-full z-10 transition-all duration-300 `}>
                    {/* NavRow1 */}
                    < div className='w-full bg-brown flex justify-between items-center ' >

                        {/* phone Numbers */}
                        < div className='w-full    flex' >
                            {/* {phoneNumbers.map((phone, index) => (
                                <div
                                    key={index}
                                    className=' group cursor-pointer flex items-center justify-start gap-2 py-3 px-4'
                                >
                                    <div className='w-6 h-6 flex group-hover:bg-primary items-center justify-center rounded-full bg-neutral-light'>
                                        <PhoneIcon weight="fill" className="" size={16} />
                                    </div>
                                    <p className='text-text-light group-hover:text-primary'>{phone}</p>
                                </div>
                            ))} */}
                        </div >
                    </div >

                    {/* NavRow 2 */}
                    < div className='w-full px-6 sm:px-12 py-6 mx-auto my- rounde bg-brand-darker dark:bg-brand-dark flex justify-between items-center  ' >
                        {/* left side */}
                        {/* Logo */}
                        <div className='flex shrink-0 bg-r items-center gap-x-2'>
                            <Link href="/" className='text-2xl font- flex items-center gap-2 text-primary'>
                                <Image src="/cblogo.webp" alt="CediBites Logo" width={44} height={44} className='object-contain' />
                                <p className='hidde uppercas md:flex text-3xl md:text-3xl font-bold font-body'>CediBites</p>
                            </Link>


                        </div>

                        {/* middle side */}
                        <div className='w-[50%] bg-re'>
                            <ul className='hidden md:flex items-center justify-center gap-6'>
                                {navItems.map((item, index) => (
                                    <li key={index}>
                                        <div className=''>
                                            <Link href={item.href} className={` hover:text-primary gap-2 flex md:text-base xl:text-lg items-center   ${pathname === item.href ? 'text-primary font-extrabold px-6 py-2 backdrop-blur-md bg-primary/25 rounded-full ' : 'text-text-light font-bold px-2 xl:px-6 rounded-full py-2 bg-transparent'}`}>
                                                <span className="hidden xl:inline-flex">{item.icon}</span>
                                                {item.label}
                                            </Link>
                                        </div>
                                    </li>
                                ))}
                            </ul>


                        </div>


                        {/* right side - COMBINED */}
                        <div className='flex justify-end items-center gap-3'>

                            <div>
                                <button className='w-9 h-9 relative flex items-center justify-center rounded-full cursor-pointer bg-neutral-gray'>
                                    <ShoppingBagIcon weight='bold' size={20} className='text-text-' />
                                    <span className='absolute text-xs top-0 right-[-4] bg-error rounded-full w-3 h-3 text-text-light'>

                                    </span>
                                </button>
                            </div>
                            <div>
                                <button className='w-9 h-9 relative flex items-center justify-center rounded-full cursor-pointer bg-neutral-gray'>
                                    <UserIcon weight='bold' size={20} className='text-text-' />
                                </button>
                            </div>
                            <div className='md:hidden flex'>
                                <button className='w-9 h-9 relative flex items-center justify-center rounded-full cursor-pointer bg-neutral-gray'>
                                    <ListIcon weight="bold" className="text-primar" size={24} />
                                </button>
                            </div>

                        </div>

                    </div >

                </div >
            </nav >
        </>
    );
}