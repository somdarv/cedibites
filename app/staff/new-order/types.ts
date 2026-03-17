// ─── Types: Staff New Order Wizard (UI-only) ──────────────────────────────────
// OrderSource, FulfillmentType, PaymentMethod come from @/types/order

export interface StaffCartItem {
    cartKey: string;       // unique: `${itemId}|${variantKey}` — allows multiple variants in cart
    id: string;            // base item id
    name: string;
    variantLabel?: string; // e.g., 'Plain', 'Large', '350ml', 'Fried Rice'
    price: number;
    quantity: number;
    category: string;
    sizeId?: number;       // menu_item_size_id for backend API
}

export interface CustomerDetails {
    name: string;
    phone: string;
    email: string;
    address: string;
    notes: string;
}
