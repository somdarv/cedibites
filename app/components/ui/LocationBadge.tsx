import { formatDistance } from "@/lib/utils/distance";
import { CaretRightIcon, MapPinAreaIcon, MapPinIcon } from "@phosphor-icons/react";
import Loader from "../base/Loader";

interface LocationBadgeProps {
    branch: any;
    distance: number | null | undefined;
    onClick: () => void;
    fullWidth?: boolean;
    isLoading?: boolean;
}


export default function LocationBadge({ branch, distance, onClick, fullWidth, isLoading = false }: LocationBadgeProps) {
    // if (isLoading) {
    //     return (
    //         <button
    //             disabled
    //             className={`flex items-center gap-2 px- py-2.5 bg-primary/50 rounded-full cursor-wait ${fullWidth ? 'w-full justify-center' : ''
    //                 }`}
    //         >
    //             <Loader size="sm" variant="white" />
    //             <span className="text-xs font-semibold text-white">
    //                 Finding location...
    //             </span>
    //         </button>
    //     );
    // }
    if (!branch) {
        return (
            <button
                onClick={onClick}
                className={`flex items-center gap-2 px-2 py-1 bg-primary-light/50 hover:bg-primary-hover border-2 border-dashed border-neutral-gray rounded-full transition-all group ${fullWidth ? 'w-full justify-center' : ''
                    }`}
            >
                <span className="text-sm font-semibold text-text-gray">
                    Select Branch
                </span>
                <span className="text- flex items-center font-bold  tracking-wide">
                    <CaretRightIcon weight="bold" size={16} className="text-text-dark" />                </span>
            </button>
        );
    }

    return (
        <button
            onClick={onClick}
            className={`flex cursor-pointer hover:bg-brown-light/10  bordes border-dashed border-text-text-light items-center gap-2 hover:gap-2.5 lg:py-0 lg:px- md:py-2 bg-transparent  text-text-dark rounded-full transition-all group  '
                }`}
        >
            {/* <MapPinAreaIcon size={20} weight="fill" className="group-hover:scale-110 transition-transform" /> */}
            <div className="flex items-center gap-">
                <span className="text- flex items-center font-bold  tracking-wide">
                    {branch.name.replace(' Branch', ' Branch')}
                </span>
                <span className="text- flex items-center font-bold  tracking-wide">
                    <CaretRightIcon weight="bold" size={16} className="text-text-dark" />                </span>
                {/* {distance && (
                    <>
                        <span className="text-text-light">•</span>
                        <span className="text-xs font-semibold text-text-light">
                            {formatDistance(distance)}
                        </span>
                    </>
                )} */}
            </div>
        </button>
    );
}