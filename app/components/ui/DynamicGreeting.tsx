'use client';

import { useEffect, useState } from 'react';
import { useBranch } from '../providers/BranchProvider';
import LocationBadge from './LocationBadge';
import { useLocation } from '../providers/LocationProvider';
import { useModal } from '../providers/ModalProvider';

export default function DynamicGreeting() {
    const [greeting, setGreeting] = useState('Good Evening!');

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) setGreeting('Good Morning!');
        else if (hour < 17) setGreeting('Good Afternoon!');
        else setGreeting('Good Evening!');
    }, []);

    const { selectedBranch, getBranchesWithDistance } = useBranch();
    const { openBranchSelector } = useModal();
    const { coordinates, permissionStatus } = useLocation();
    const [mounted, setMounted] = useState(false);

    const branchDistance = coordinates && selectedBranch
        ? getBranchesWithDistance(coordinates.latitude, coordinates.longitude)
            .find(b => b.id === selectedBranch.id)?.distance
        : null;
    const isLocationLoading = permissionStatus === 'prompt' && !coordinates;

    useEffect(() => {
        setMounted(true);
    }, []);

    // Check if branch is currently open
    const isBranchOpen = () => {
        if (!selectedBranch?.operatingHours) return null;
        const now = new Date();
        const hour = now.getHours();
        return hour >= 9 && hour < 22;
    };

    const isOpen = isBranchOpen();

    return (
        <div className="relative overflow-hidden transition-all duration-300 rounded-2xl p-6 flex-1 flex flex-col">
            {/* Gradient Background - Primary Color Gradient */}
            <div
                className="absolute inset-0"
                style={{
                    background: 'linear-gradient(135deg, #f1ab3e 0%, #e49925 50%, #c8821f 100%)',
                }}
            />

            {/* Pattern Overlay */}
            <div
                className="absolute inset-0 opacity-[0.07]"
                style={{
                    backgroundImage: `repeating-linear-gradient(
                        45deg,
                        #fff 0px,
                        #fff 1px,
                        transparent 1px,
                        transparent 18px
                    )`,
                }}
            />

            {/* Glow blob */}
            <div
                className="absolute -right-8 -top-8 w-32 h-32 rounded-full blur-2xl opacity-20 pointer-events-none"
                style={{ backgroundColor: '#ffe2b5' }}
            />

            {/* Content */}
            <div className="relative z-10 flex flex-col gap-3">
                {/* Greeting */}
                <div className="shrink-0">
                    <h2 className="text-4xl font-family-body md:text-2xl lg:text-3xl font-bold text-brown">
                        {greeting}
                    </h2>
                    <p className="text-xl md:text-base lg:text-lg font-medium text-brown/80">
                        What Would you like?
                    </p>
                </div>

                {/* Branch Location */}
                <div className="shrink-0">
                    <LocationBadge
                        branch={selectedBranch}
                        distance={branchDistance}
                        onClick={openBranchSelector}
                        fullWidth={false}
                        isLoading={isLocationLoading}
                    />
                </div>

                {/* Open/Closed badge */}
                {selectedBranch && isOpen !== null && (
                    <div className="pt-2 border-t border-brown/20">
                        <span
                            className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full ${isOpen
                                ? 'bg-secondary text-white'
                                : 'bg-brown/20 text-brown'
                                }`}
                        >
                            <span className={`w-1.5 h-1.5 rounded-full ${isOpen ? 'bg-white animate-pulse' : 'bg-brown/60'}`} />
                            {isOpen ? 'Open Now' : 'Closed'}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}