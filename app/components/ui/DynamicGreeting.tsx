
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



    return (
        <div>
            {/* Left: Greeting */}
            <div className="shrink-0 flex bg-red-2 justify-cente py- rounded-xl ">
                <div className='bg-red-2 '>
                    <h2 className="text-4xl font-family-body md:text-2xl lg:text-3xl w-auto font-bold text-primary mb-">
                        {greeting}
                    </h2>
                    <p className="text-xl md:text-base lg:text-lg font-medium text-text-dark dark:text-text-light">
                        What Would you like?{' '}
                    </p>
                </div>

            </div>


            <div className='hid my-1 shrink-0 lg:my- md:flex'>
                <LocationBadge
                    branch={selectedBranch}
                    distance={branchDistance}
                    onClick={openBranchSelector}
                    fullWidth={false}
                    isLoading={isLocationLoading}

                />
            </div>


        </div>
    )
}
