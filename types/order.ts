// lib/types/order.ts

export type OrderStatus =
    | 'pending' | 'confirmed' | 'received' | 'preparing' | 'ready'
    | 'out_for_delivery' | 'delivered'
    | 'ready_for_pickup' | 'completed' | 'cancelled';

export type OrderSource = 'online' | 'phone' | 'whatsapp' | 'instagram' | 'facebook' | 'pos';
export type OrderType = 'delivery' | 'pickup';
export type PaymentMethod = 'momo' | 'cash_delivery' | 'cash_pickup';

export interface OrderItem {
    id: string;
    name: string;
    image?: string;
    icon?: string;
    sizeLabel: string;
    price: number;
    quantity: number;
}

export interface OrderTimelineEvent {
    status: OrderStatus;
    label: string;
    description: string;
    timestamp: number | null;
    done: boolean;
    active: boolean;
}

export interface Order {
    id: string;
    orderNumber: string;
    status: OrderStatus;
    source: OrderSource;
    orderType: OrderType;
    paymentMethod: PaymentMethod;
    isPaid: boolean;
    items: OrderItem[];
    subtotal: number;
    deliveryFee: number;
    tax: number;
    total: number;
    contact: { name: string; phone: string; address?: string; note?: string; };
    branch: {
        id: string; name: string; address: string; phone: string;
        coordinates: { latitude: number; longitude: number };
    };
    placedAt: number;
    estimatedMinutes: number;
    timeline: OrderTimelineEvent[];
}

export const STATUS_CONFIG: Record<OrderStatus, {
    label: string; color: string; bg: string; textColor: string;
}> = {
    pending: { label: 'Pending', color: 'text-info', bg: 'bg-info/8', textColor: '#1976d2' },
    confirmed: { label: 'Confirmed', color: 'text-info', bg: 'bg-info/8', textColor: '#1976d2' },
    received: { label: 'Received', color: 'text-info', bg: 'bg-info/8', textColor: '#1976d2' },
    preparing: { label: 'Preparing', color: 'text-warning', bg: 'bg-warning/8', textColor: '#f9a61a' },
    ready: { label: 'Ready', color: 'text-primary', bg: 'bg-primary/8', textColor: '#e49925' },
    out_for_delivery: { label: 'On the way', color: 'text-primary', bg: 'bg-primary/8', textColor: '#e49925' },
    delivered: { label: 'Delivered', color: 'text-secondary', bg: 'bg-secondary/8', textColor: '#6c833f' },
    ready_for_pickup: { label: 'Ready for pickup', color: 'text-primary', bg: 'bg-primary/8', textColor: '#e49925' },
    completed: { label: 'Completed', color: 'text-secondary', bg: 'bg-secondary/8', textColor: '#6c833f' },
    cancelled: { label: 'Cancelled', color: 'text-error', bg: 'bg-error/8', textColor: '#d32f2f' },
};

export const SOURCE_CONFIG: Record<OrderSource, { label: string }> = {
    online: { label: 'Online' },
    phone: { label: 'Phone' },
    whatsapp: { label: 'WhatsApp' },
    instagram: { label: 'Instagram' },
    facebook: { label: 'Facebook' },
    pos: { label: 'Walk-in' },
};

export const PAY_LABEL: Record<PaymentMethod, string> = {
    momo: 'Mobile Money',
    cash_delivery: 'Cash on delivery',
    cash_pickup: 'Cash at pickup',
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
export const formatPrice = (p: number | string | null | undefined): string => {
    const n = typeof p === 'number' ? p : Number(p);
    if (Number.isNaN(n)) return 'GHS 0.00';
    return `GHS ${n.toFixed(2)}`;
};

export function timeAgo(ts: number): string {
    const d = Date.now() - ts;
    const m = Math.floor(d / 60_000);
    const h = Math.floor(m / 60);
    const dy = Math.floor(h / 24);
    if (m < 1) return 'Just now';
    if (m < 60) return `${m}m ago`;
    if (h < 24) return `${h}h ago`;
    if (dy === 1) return 'Yesterday';
    return `${dy}d ago`;
}

export function formatTime(ts: number): string {
    return new Date(ts).toLocaleTimeString('en-GH', { hour: '2-digit', minute: '2-digit', hour12: true });
}

// ─── Maps ─────────────────────────────────────────────────────────────────────
export function staticMapUrl(lat: number, lng: number, zoom = 15, size = '600x280'): string {
    const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!key) return '';
    const marker = `color:0xe49925|${lat},${lng}`;
    return [
        `https://maps.googleapis.com/maps/api/staticmap`,
        `?center=${lat},${lng}&zoom=${zoom}&size=${size}&scale=2`,
        `&maptype=roadmap`,
        `&markers=${encodeURIComponent(marker)}`,
        `&style=feature:poi|visibility:off`,
        `&style=feature:transit|visibility:off`,
        `&style=feature:road|element:labels.icon|visibility:off`,
        `&key=${key}`,
    ].join('');
}

export function directionsUrl(lat: number, lng: number, name: string): string {
    return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
}

// ─── Timeline builders ────────────────────────────────────────────────────────
function buildTimeline(
    steps: { status: OrderStatus; label: string; description: string; offsetMins: number }[],
    current: OrderStatus,
    placedAt: number,
): OrderTimelineEvent[] {
    const idx = steps.findIndex(s => s.status === current);
    return steps.map((s, i) => ({
        status: s.status,
        label: s.label,
        description: s.description,
        timestamp: i <= idx ? placedAt + s.offsetMins * 60_000 : null,
        done: i < idx,
        active: i === idx,
    }));
}

export function buildDeliveryTimeline(status: OrderStatus, placedAt: number) {
    return buildTimeline([
        { status: 'received', label: 'Order received', description: 'Confirming your order', offsetMins: 0 },
        { status: 'preparing', label: 'Preparing', description: 'Kitchen is cooking your food', offsetMins: 2 },
        { status: 'out_for_delivery', label: 'Out for delivery', description: 'Rider is heading to you', offsetMins: 20 },
        { status: 'delivered', label: 'Delivered', description: 'Enjoy your meal', offsetMins: 35 },
    ], status, placedAt);
}

export function buildPickupTimeline(status: OrderStatus, placedAt: number) {
    return buildTimeline([
        { status: 'received', label: 'Order received', description: 'Confirming your order', offsetMins: 0 },
        { status: 'preparing', label: 'Preparing', description: 'Kitchen is cooking your food', offsetMins: 2 },
        { status: 'ready_for_pickup', label: 'Ready for pickup', description: 'Come collect at the branch', offsetMins: 15 },
        { status: 'completed', label: 'Completed', description: 'Thanks for choosing CediBites', offsetMins: 20 },
    ], status, placedAt);
}

// ─── Mock data ────────────────────────────────────────────────────────────────
type RawOrder = Omit<Order, 'timeline'>;

const RAW: RawOrder[] = [
    {
        id: 'CB847291', orderNumber: 'CB847291',
        status: 'out_for_delivery', source: 'online', orderType: 'delivery',
        paymentMethod: 'momo', isPaid: true,
        items: [
            { id: '1', name: 'Jollof Rice & Chicken', icon: '🍛', sizeLabel: 'Large', price: 45, quantity: 2 },
            { id: '4', name: 'Kelewele', icon: '🍌', sizeLabel: 'Regular', price: 15, quantity: 1 },
            { id: '11', name: 'Malta Guinness', icon: '🥤', sizeLabel: 'Regular', price: 8, quantity: 2 },
        ],
        subtotal: 121, deliveryFee: 15, tax: 3.03, total: 139.03,
        contact: { name: 'Kwame Mensah', phone: '+233241234567', address: '14 Osu Badu Street, Osu, Accra', note: 'Blue gate — call on arrival' },
        branch: { id: 'accra-central', name: 'Accra Central', address: 'Ring Road Central, Accra', phone: '+233241234567', coordinates: { latitude: 5.5557, longitude: -0.1769 } },
        placedAt: Date.now() - 22 * 60_000, estimatedMinutes: 35,
    },
    {
        id: 'CB391045', orderNumber: 'CB391045',
        status: 'delivered', source: 'whatsapp', orderType: 'delivery',
        paymentMethod: 'cash_delivery', isPaid: true,
        items: [
            { id: '2', name: 'Waakye Special', icon: '🍚', sizeLabel: 'Regular', price: 35, quantity: 1 },
            { id: '12', name: 'Fresh Coconut Water', icon: '🥥', sizeLabel: 'Regular', price: 12, quantity: 1 },
        ],
        subtotal: 47, deliveryFee: 15, tax: 1.18, total: 63.18,
        contact: { name: 'Kwame Mensah', phone: '+233241234567', address: '14 Osu Badu Street, Osu, Accra' },
        branch: { id: 'east-legon', name: 'East Legon', address: 'American House Junction, Accra', phone: '+233509876543', coordinates: { latitude: 5.6465, longitude: -0.1549 } },
        placedAt: Date.now() - 2 * 24 * 60 * 60_000, estimatedMinutes: 35,
    },
    {
        id: 'CB204837', orderNumber: 'CB204837',
        status: 'completed', source: 'pos', orderType: 'pickup',
        paymentMethod: 'cash_pickup', isPaid: true,
        items: [
            { id: '3', name: 'Banku & Tilapia', icon: '🐟', sizeLabel: 'Regular', price: 55, quantity: 1 },
        ],
        subtotal: 55, deliveryFee: 0, tax: 1.38, total: 56.38,
        contact: { name: 'Kwame Mensah', phone: '+233241234567' },
        branch: { id: 'labadi', name: 'Labadi', address: 'Labadi Road, Near Labadi Beach, Accra', phone: '+233205551234', coordinates: { latitude: 5.6372, longitude: -0.0924 } },
        placedAt: Date.now() - 5 * 24 * 60 * 60_000, estimatedMinutes: 15,
    },
    {
        id: 'CB173920', orderNumber: 'CB173920',
        status: 'completed', source: 'online', orderType: 'delivery',
        paymentMethod: 'momo', isPaid: true,
        items: [
            { id: '5', name: 'Fufu & Light Soup', icon: '🥘', sizeLabel: 'Regular', price: 40, quantity: 1 },
            { id: '11', name: 'Malta Guinness', icon: '🥤', sizeLabel: 'Regular', price: 8, quantity: 1 },
        ],
        subtotal: 48, deliveryFee: 15, tax: 1.20, total: 64.20,
        contact: { name: 'Kwame Mensah', phone: '+233241234567', address: 'East Legon Hills, Accra' },
        branch: { id: 'east-legon', name: 'East Legon', address: 'American House Junction, Accra', phone: '+233509876543', coordinates: { latitude: 5.6465, longitude: -0.1549 } },
        placedAt: Date.now() - 12 * 24 * 60 * 60_000, estimatedMinutes: 35,
    },
];

export const MOCK_ORDERS: Order[] = RAW.map(o => ({
    ...o,
    timeline: o.orderType === 'delivery'
        ? buildDeliveryTimeline(o.status, o.placedAt)
        : buildPickupTimeline(o.status, o.placedAt),
}));

export function getMockOrder(id: string): Order | null {
    return MOCK_ORDERS.find(o => o.id.toUpperCase() === id.toUpperCase()) ?? null;
}

export function getMockOrdersForUser(): Order[] { return MOCK_ORDERS; }