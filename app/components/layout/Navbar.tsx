'use client';


import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HamburgerIcon, ListIcon, HouseIcon, PathIcon, ShoppingBagIcon, UserIcon } from "@phosphor-icons/react";
import Image from 'next/image';
import LocationBadge from '../ui/LocationBadge';
import { useBranch } from '../providers/BranchProvider';
import { useLocation } from '../providers/LocationProvider';
import { useModal } from '../providers/ModalProvider';
import { useCart } from '../providers/CartProvider';
import CartDrawer from '../ui/CartDrawer';




const App = () => {

};


interface NavItem {
    label: string;
    href: string;
    icon: React.ReactNode;
}

export default function Navbar() {
    const pathname = usePathname();
    const [isCartOpen, setIsCartOpen] = useState(false);
    const { selectedBranch, getBranchesWithDistance } = useBranch();
    const { openBranchSelector, openCart } = useModal();
    const { coordinates, permissionStatus } = useLocation();
    const { totalItems } = useCart();

    const branchDistance = coordinates && selectedBranch
        ? getBranchesWithDistance(coordinates.latitude, coordinates.longitude)
            .find(b => b.id === selectedBranch.id)?.distance
        : null;

    const isLocationLoading = permissionStatus === 'prompt' && !coordinates;

    const navItems: NavItem[] = [
        { label: 'Home', icon: <HouseIcon weight="fill" size={20} />, href: '/' },
        { label: 'Our Menu', icon: <HamburgerIcon weight="fill" size={20} />, href: '/menu' },
        { label: 'Track Order', icon: <PathIcon weight="fill" size={20} />, href: '/orders' },
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
                                <button
                                    onClick={openCart}
                                    className="relative w-10 h-10 flex items-center justify-center rounded-full cursor-pointer bg-neutral-light/80 hover:bg-neutral-light  transition-colors"
                                    aria-label="Open cart"
                                >
                                    <ShoppingBagIcon weight="bold" size={20} className="text-text-dark" />
                                    {totalItems > 0 && (
                                        <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center bg-error text-white text-[10px] font-bold rounded-full px-1 leading-none">
                                            {totalItems > 99 ? '99+' : totalItems}
                                        </span>
                                    )}
                                </button>
                            </div>
                            <div>
                                <button onClick={() => setIsCartOpen(true)}

                                    className="relative w-10 h-10 flex items-center justify-center rounded-full cursor-pointer bg-neutral-light/80 hover:bg-neutral-light  transition-colors">
                                    <UserIcon weight='bold' size={20} className='text-text-' />
                                </button>
                            </div>
                            <div className='md:hidden flex'>
                                <button
                                    className="relative w-10 h-10 flex items-center justify-center rounded-full cursor-pointer bg-neutral-light/80 hover:bg-neutral-light  transition-colors">
                                    <ListIcon weight="bold" className="text-primar" size={24} />
                                </button>
                            </div>

                        </div>

                    </div >

                </div >
            </nav >
            <CartDrawer />

        </>
    );
}