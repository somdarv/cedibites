export interface Branch {
    id: string;
    name: string;
    address: string;
    area: string;
    phone: string;
    coordinates: {
        latitude: number;
        longitude: number;
    };
    deliveryRadius: number; // in kilometers
    operatingHours: string;
    isOpen: boolean;
}

export interface BranchWithDistance extends Branch {
    distance: number;
    deliveryTime: string;
    isWithinRadius: boolean;
}