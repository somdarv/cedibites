/**
 * Calculate distance between two GPS coordinates using Haversine formula
 * Returns distance in kilometers
 */
export function calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRadians(lat1)) *
        Math.cos(toRadians(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return Math.round(distance * 10) / 10; // Round to 1 decimal place
}

function toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
}

/**
 * Calculate distance and format for display
 */
export function formatDistance(distanceInKm: number): string {
    if (distanceInKm < 1) {
        return `${Math.round(distanceInKm * 1000)}m`;
    }
    return `${distanceInKm.toFixed(1)}km`;
}

/**
 * Calculate estimated delivery time based on distance
 * Assumes average speed of 30 km/h in city traffic
 */
export function estimateDeliveryTime(distanceInKm: number): string {
    const baseTime = 15; // Base preparation time in minutes
    const travelTime = (distanceInKm / 30) * 60; // Travel time in minutes
    const totalTime = Math.ceil(baseTime + travelTime);

    return `${totalTime}-${totalTime + 10} mins`;
}