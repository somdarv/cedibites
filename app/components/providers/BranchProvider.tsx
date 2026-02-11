'use client';

import { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { Branch, BranchWithDistance } from '@/types/branch';
import { calculateDistance, estimateDeliveryTime } from '@/lib/utils/distance';
import { useLocation } from './LocationProvider';

interface BranchContextType {
    selectedBranch: Branch | null;
    setSelectedBranch: (branch: Branch) => void;
    clearBranch: () => void;
    branches: Branch[];
    getBranchesWithDistance: (userLat: number, userLon: number) => BranchWithDistance[];
    findNearestBranch: (userLat: number, userLon: number) => BranchWithDistance | null;
}

const BranchContext = createContext<BranchContextType | undefined>(undefined);

export function BranchProvider({ children }: { children: ReactNode }) {
    const [selectedBranch, setSelectedBranchState] = useState<Branch | null>(null);
    const previousCoordinatesRef = useRef<{ latitude: number; longitude: number } | null>(null);

    const { coordinates } = useLocation();

    // Your branches data
    const branches: Branch[] = [
        {
            id: '1',
            name: 'Osu Branch',
            address: '123 Oxford Street, Osu',
            area: 'Osu',
            phone: '+233 24 123 4567',
            coordinates: { latitude: 5.5557, longitude: -0.1769 },
            deliveryRadius: 5,
            operatingHours: '8:00 AM - 10:00 PM',
            isOpen: true,
        },
        {
            id: '2',
            name: 'East Legon Branch',
            address: '45 American House, East Legon',
            area: 'East Legon',
            phone: '+233 50 987 6543',
            coordinates: { latitude: 5.6465, longitude: -0.1549 },
            deliveryRadius: 5,
            operatingHours: '8:00 AM - 11:00 PM',
            isOpen: true,
        },
        {
            id: '3',
            name: 'Spintex Branch',
            address: '78 Spintex Road',
            area: 'Spintex',
            phone: '+233 20 555 1234',
            coordinates: { latitude: 5.6372, longitude: -0.0924 },
            deliveryRadius: 4,
            operatingHours: '9:00 AM - 9:00 PM',
            isOpen: false,
        },
        {
            id: '4',
            name: 'Tema Branch',
            address: 'Community 1, Tema',
            area: 'Tema',
            phone: '+233 24 777 8888',
            coordinates: { latitude: 5.6698, longitude: -0.0166 },
            deliveryRadius: 6,
            operatingHours: '8:00 AM - 10:00 PM',
            isOpen: true,
        },
        {
            id: '5',
            name: 'Madina Branch',
            address: 'Remy Junction, Madina',
            area: 'Madina',
            phone: '+233 55 444 3333',
            coordinates: { latitude: 5.6805, longitude: -0.1665 },
            deliveryRadius: 5,
            operatingHours: '8:00 AM - 10:00 PM',
            isOpen: true,
        },
        {
            id: '6',
            name: 'La Paz Branch',
            address: 'Abeka-Lapaz, Near Lapaz Market',
            area: 'La Paz',
            phone: '+233 24 789 1234',
            coordinates: { latitude: 5.6095, longitude: -0.2508 },
            deliveryRadius: 5,
            operatingHours: '8:00 AM - 10:00 PM',
            isOpen: true,
        },
        {
            id: '7',
            name: 'Dzorwulu Branch',
            address: 'Dzorwulu, Near US Embassy',
            area: 'Dzorwulu',
            phone: '+233 50 123 9876',
            coordinates: { latitude: 5.6141, longitude: -0.1956 },
            deliveryRadius: 5,
            operatingHours: '8:00 AM - 11:00 PM',
            isOpen: true,
        },
    ];

    // Load from localStorage on mount
    useEffect(() => {
        const stored = localStorage.getItem('selected-branch');
        if (stored) {
            try {
                setSelectedBranchState(JSON.parse(stored));
            } catch (e) {
                console.error('Failed to load selected branch');
            }
        }
    }, []);

    // 👇 NEW: Auto-select nearest branch when location changes significantly
    useEffect(() => {
        if (!coordinates) return;

        // Check if location has changed significantly (more than 0.5km)
        const hasLocationChanged = previousCoordinatesRef.current
            ? calculateDistance(
                previousCoordinatesRef.current.latitude,
                previousCoordinatesRef.current.longitude,
                coordinates.latitude,
                coordinates.longitude
            ) > 0.5 // Only re-select if moved more than 500m
            : true; // First time, always select

        if (hasLocationChanged) {
            console.log('📍 Location changed significantly, finding nearest branch...');
            console.log('Previous:', previousCoordinatesRef.current);
            console.log('Current:', coordinates);

            const nearest = findNearestBranch(coordinates.latitude, coordinates.longitude);

            if (nearest) {
                // Check if it's a different branch than currently selected
                if (!selectedBranch || selectedBranch.id !== nearest.id) {
                    console.log('✅ Auto-selecting nearest branch:', nearest.name, `(${nearest.distance}km)`);
                    setSelectedBranch(nearest);
                } else {
                    console.log('ℹ️ Already at nearest branch:', nearest.name);
                }
            } else {
                console.log('⚠️ No suitable branch found within delivery radius');
            }

            // Update previous coordinates
            previousCoordinatesRef.current = coordinates;
        } else {
            console.log('📍 Location changed slightly, keeping current branch');
        }
    }, [coordinates]); // Only watch coordinates, not selectedBranch

    const setSelectedBranch = (branch: Branch) => {
        setSelectedBranchState(branch);
        localStorage.setItem('selected-branch', JSON.stringify(branch));
        console.log('🏢 Selected branch:', branch.name);
    };

    const clearBranch = () => {
        setSelectedBranchState(null);
        localStorage.removeItem('selected-branch');
        console.log('🗑️ Cleared selected branch');
    };

    const getBranchesWithDistance = (
        userLat: number,
        userLon: number
    ): BranchWithDistance[] => {
        console.log('📏 Calculating distances from:', { userLat, userLon });

        const branchesWithDistance = branches
            .map((branch) => {
                const distance = calculateDistance(
                    userLat,
                    userLon,
                    branch.coordinates.latitude,
                    branch.coordinates.longitude
                );

                return {
                    ...branch,
                    distance,
                    deliveryTime: estimateDeliveryTime(distance),
                    isWithinRadius: distance <= branch.deliveryRadius,
                };
            })
            .sort((a, b) => a.distance - b.distance);

        console.log('📊 Branches with distances:', branchesWithDistance.map(b => ({
            name: b.name,
            distance: b.distance,
            isOpen: b.isOpen,
            isWithinRadius: b.isWithinRadius
        })));

        return branchesWithDistance;
    };

    const findNearestBranch = (
        userLat: number,
        userLon: number
    ): BranchWithDistance | null => {
        const branchesWithDistance = getBranchesWithDistance(userLat, userLon);

        const nearest = branchesWithDistance.find(
            (branch) => branch.isOpen && branch.isWithinRadius
        );

        if (nearest) {
            console.log('🎯 Nearest branch found:', nearest.name, `(${nearest.distance}km away)`);
            console.log('   - Delivery time:', nearest.deliveryTime);
            console.log('   - Within radius:', nearest.isWithinRadius);
        } else {
            console.log('❌ No branches within delivery radius');
            console.log('Available branches (including out of range):');
            branchesWithDistance.forEach(b => {
                console.log(`   - ${b.name}: ${b.distance}km (${b.isOpen ? 'Open' : 'Closed'}, ${b.isWithinRadius ? 'In Range' : 'Out of Range'})`);
            });
        }

        return nearest || null;
    };

    console.log('🏢 Currently Selected Branch:', selectedBranch);

    return (
        <BranchContext.Provider
            value={{
                selectedBranch,
                setSelectedBranch,
                clearBranch,
                branches,
                getBranchesWithDistance,
                findNearestBranch,
            }}
        >
            {children}
        </BranchContext.Provider>
    );
}

export function useBranch() {
    const context = useContext(BranchContext);
    if (!context) throw new Error('useBranch must be used within BranchProvider');
    return context;
}