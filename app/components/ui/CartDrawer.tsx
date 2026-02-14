'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
    XIcon, TrashIcon, PlusIcon, MinusIcon,
    ShoppingBagIcon, ArrowRightIcon, TagIcon
} from '@phosphor-icons/react';
import { useCart } from '@/app/components/providers/CartProvider';
import { useModal } from '@/app/components/providers/ModalProvider';

const formatPrice = (p: number) => `GHS ${p.toFixed(2)}`;
const DELIVERY_FEE = 15;
const TAX_RATE = 0.025;

export default function CartDrawer() {
    const { isCartOpen, closeCart } = useModal();
    const { items, removeFromCart, updateQuantity, totalItems, subtotal } = useCart();

    const tax = subtotal * TAX_RATE;
    const total = subtotal + DELIVERY_FEE + tax;

    // Close on Escape
    useEffect(() => {
        const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') closeCart(); };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [closeCart]);

    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300
                    ${isCartOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                onClick={closeCart}
            />

            {/* Drawer - bottom sheet on mobile, right panel on desktop */}
            <div
                className={`fixed z-50 bg-neutral-light dark:bg-brand-darker flex flex-col transition-transform duration-300 ease-out shadow-2xl
                    bottom-0 left-0 right-0 rounded-t-3xl max-h-[92dvh]
                    md:bottom-auto md:top-0 md:left-auto md:right-0 md:h-full md:w-[420px] md:rounded-none md:rounded-l-3xl md:max-h-full
                    ${isCartOpen ? 'translate-y-0 md:translate-x-0' : 'translate-y-full md:translate-y-0 md:translate-x-full'}`}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-neutral-gray/10 shrink-0">
                    <div className="flex items-center gap-3">
                        <h2 className="text-lg font-bold text-text-dark dark:text-text-light">Your Order</h2>
                        {totalItems > 0 && (
                            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-neutral-gray text-white">
                                {totalItems}
                            </span>
                        )}
                    </div>
                    <button
                        onClick={closeCart}
                        className="w-9 h-9 flex cursor-pointer items-center justify-center rounded-full hover:bg-neutral-gray/15 transition-colors"
                    >
                        <XIcon size={20} weight="bold" className="text-text-dark dark:text-text-light" />
                    </button>
                </div>

                {/* Items list */}
                <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-4 flex flex-col gap-3">
                    {items.length === 0 ? (
                        <EmptyCart />
                    ) : (
                        <>
                            {items.map((cartItem) => (
                                <CartItemRow
                                    key={cartItem.cartItemId}
                                    cartItem={cartItem}
                                    onRemove={() => removeFromCart(cartItem.cartItemId)}
                                    onIncrease={() => updateQuantity(cartItem.cartItemId, cartItem.quantity + 1)}
                                    onDecrease={() => {
                                        if (cartItem.quantity <= 1) removeFromCart(cartItem.cartItemId);
                                        else updateQuantity(cartItem.cartItemId, cartItem.quantity - 1);
                                    }}
                                />
                            ))}
                            <button
                                onClick={closeCart}
                                className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl border-2 border-dashed border-neutral-gray/25 text-neutral-gray hover:border-primary/40 hover:text-primary transition-colors text-sm font-medium"
                            >
                                <PlusIcon weight="bold" size={14} />
                                Add more items
                            </button>
                        </>
                    )}
                </div>

                {/* Footer */}
                {items.length > 0 && (
                    <div className="shrink-0 px-5 pb-6 pt-4 border-t border-neutral-gray/10 flex flex-col gap-4">
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-neutral-gray">Subtotal</span>
                                <span className="font-semibold text-text-dark dark:text-text-light">{formatPrice(subtotal)}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-neutral-gray flex items-center gap-1">
                                    <TagIcon size={12} /> Delivery Fee
                                </span>
                                <span className="font-semibold text-text-dark dark:text-text-light">{formatPrice(DELIVERY_FEE)}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-neutral-gray">Tax (2.5%)</span>
                                <span className="font-semibold text-text-dark dark:text-text-light">{formatPrice(tax)}</span>
                            </div>
                            <div className="h-px bg-neutral-gray/15 my-1" />
                            <div className="flex items-center justify-between">
                                <span className="font-bold text-text-dark dark:text-text-light">Total</span>
                                <span className="text-xl font-bold text-primary">{formatPrice(total)}</span>
                            </div>
                        </div>
                        <Link
                            href="/checkout"
                            onClick={closeCart}
                            className="flex items-center justify-between bg-brown dark:bg-brand-dark hover:bg-brown-light text-white font-bold px-6 py-4 rounded-2xl transition-all active:scale-[0.98] group"
                        >
                            <span className="text-base">Checkout</span>
                            <div className="flex items-center gap-2">
                                <span className="text-primary font-bold">{formatPrice(total)}</span>
                                <ArrowRightIcon weight="bold" size={18} className="group-hover:translate-x-1 transition-transform" />
                            </div>
                        </Link>
                    </div>
                )}
            </div>
        </>
    );
}

function CartItemRow({ cartItem, onRemove, onIncrease, onDecrease }: {
    cartItem: any; onRemove: () => void; onIncrease: () => void; onDecrease: () => void;
}) {
    const [imgError, setImgError] = React.useState(false);
    return (
        <div className="flex items-center gap-3 bg-white/60 dark:bg-white/5 rounded-2xl p-3">
            <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-primary/10 shrink-0">
                {cartItem.item.image && !imgError ? (
                    <Image src={cartItem.item.image} alt={cartItem.item.name} fill sizes="64px" className="object-cover" onError={() => setImgError(true)} />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl">{cartItem.item.icon ?? '🍽️'}</div>
                )}
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-text-dark dark:text-text-light leading-tight truncate">{cartItem.item.name}</p>
                <p className="text-xs text-neutral-gray mt-0.5">{cartItem.sizeLabel}</p>
                <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-2 bg-neutral-gray/10 rounded-full px-1 py-0.5">
                        <button onClick={onDecrease} className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-primary/20 active:scale-90 transition-all">
                            <MinusIcon weight="bold" size={10} className="text-text-dark dark:text-text-light" />
                        </button>
                        <span className="text-xs font-bold text-text-dark dark:text-text-light w-4 text-center tabular-nums">{cartItem.quantity}</span>
                        <button onClick={onIncrease} className="w-6 h-6 flex items-center justify-center rounded-full bg-primary text-white active:scale-90 transition-all">
                            <PlusIcon weight="bold" size={10} />
                        </button>
                    </div>
                    <span className="text-sm font-bold text-primary">{`GHS ${(cartItem.price * cartItem.quantity).toFixed(2)}`}</span>
                </div>
            </div>
            <button onClick={onRemove} className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-error/15 text-neutral-gray hover:text-error transition-colors shrink-0">
                <TrashIcon weight="bold" size={15} />
            </button>
        </div>
    );
}

function EmptyCart() {
    const { closeCart } = useModal();
    return (
        <div className="flex flex-col items-center justify-center flex-1 py-16 gap-4 text-center">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                <ShoppingBagIcon weight="fill" size={36} className="text-primary/40" />
            </div>
            <div>
                <p className="font-bold text-text-dark dark:text-text-light">Your cart is empty</p>
                <p className="text-sm text-neutral-gray mt-1">Add something delicious to get started</p>
            </div>
            <button onClick={closeCart} className="bg-primary text-white font-bold px-6 py-3 rounded-2xl hover:bg-primary-hover transition-all active:scale-95 text-sm">
                Browse Menu
            </button>
        </div>
    );
}