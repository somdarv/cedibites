'use client';

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import type { SearchableItem } from './MenuDiscoveryProvider';

// ============================================
// TYPES
// ============================================
export interface CartItem {
    cartItemId: string; // unique: itemId + sizeKey
    item: SearchableItem;
    selectedSize: string;
    sizeLabel: string;
    price: number;
    quantity: number;
}

interface CartContextType {
    items: CartItem[];
    addToCart: (item: SearchableItem, sizeKey: string) => void;
    removeFromCart: (cartItemId: string) => void;
    updateQuantity: (cartItemId: string, quantity: number) => void;
    clearCart: () => void;
    isInCart: (itemId: string, sizeKey?: string) => boolean;
    getCartItem: (itemId: string, sizeKey: string) => CartItem | undefined;
    totalItems: number;
    subtotal: number;
}

// ============================================
// CONTEXT
// ============================================
const CartContext = createContext<CartContextType | undefined>(undefined);
const STORAGE_KEY = 'cedibites-cart';

function makeCartItemId(itemId: string, sizeKey: string) {
    return `${itemId}__${sizeKey}`;
}

function getPriceForSize(item: SearchableItem, sizeKey: string): number {
    if (item.sizes?.length) {
        return item.sizes.find((s: any) => s.key === sizeKey)?.price ?? item.price ?? 0;
    }
    return item.price ?? 0;
}

function getSizeLabel(item: SearchableItem, sizeKey: string): string {
    return item.sizes?.find((s: any) => s.key === sizeKey)?.label ?? sizeKey;
}

// ============================================
// PROVIDER
// ============================================
export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [hydrated, setHydrated] = useState(false);

    // Load from localStorage on mount
    useEffect(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) setItems(JSON.parse(saved));
        } catch { /* ignore */ }
        setHydrated(true);
    }, []);

    // Persist to localStorage on change
    useEffect(() => {
        if (!hydrated) return;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }, [items, hydrated]);

    // ── Add ──
    const addToCart = useCallback((item: SearchableItem, sizeKey: string) => {
        const cartItemId = makeCartItemId(item.id, sizeKey);
        setItems((prev) => {
            const existing = prev.find((i) => i.cartItemId === cartItemId);
            if (existing) {
                return prev.map((i) =>
                    i.cartItemId === cartItemId
                        ? { ...i, quantity: i.quantity + 1 }
                        : i
                );
            }
            return [...prev, {
                cartItemId,
                item,
                selectedSize: sizeKey,
                sizeLabel: getSizeLabel(item, sizeKey),
                price: getPriceForSize(item, sizeKey),
                quantity: 1,
            }];
        });
    }, []);

    // ── Remove ──
    const removeFromCart = useCallback((cartItemId: string) => {
        setItems((prev) => prev.filter((i) => i.cartItemId !== cartItemId));
    }, []);

    // ── Update qty (0 = remove) ──
    const updateQuantity = useCallback((cartItemId: string, quantity: number) => {
        if (quantity <= 0) {
            setItems((prev) => prev.filter((i) => i.cartItemId !== cartItemId));
        } else {
            setItems((prev) =>
                prev.map((i) => i.cartItemId === cartItemId ? { ...i, quantity } : i)
            );
        }
    }, []);

    // ── Clear ──
    const clearCart = useCallback(() => {
        setItems([]);
        localStorage.removeItem(STORAGE_KEY);
    }, []);

    // ── Helpers ──
    const isInCart = useCallback((itemId: string, sizeKey?: string) => {
        if (sizeKey) return items.some((i) => i.cartItemId === makeCartItemId(itemId, sizeKey));
        return items.some((i) => i.item.id === itemId);
    }, [items]);

    const getCartItem = useCallback((itemId: string, sizeKey: string) => {
        return items.find((i) => i.cartItemId === makeCartItemId(itemId, sizeKey));
    }, [items]);

    const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
    const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

    return (
        <CartContext.Provider value={{
            items, addToCart, removeFromCart, updateQuantity,
            clearCart, isInCart, getCartItem, totalItems, subtotal,
        }}>
            {children}
        </CartContext.Provider>
    );
}

// ============================================
// HOOK
// ============================================
export function useCart() {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error('useCart must be used within CartProvider');
    return ctx;
}