'use client';

// ─── Drop-in replacement for StepDone in checkout-page.tsx ───────────────────
// Paste this in place of the existing StepDone function

import React, { useState } from 'react';
import Link from 'next/link';
import { CheckCircleIcon, ShoppingBagIcon, ArrowRightIcon, SparkleIcon, XIcon, UserCircleIcon } from '@phosphor-icons/react';
import { useAuth } from '@/app/components/providers/AuthProvider';

type OrderType = 'delivery' | 'pickup';
interface ContactDetails { name: string; phone: string; address: string; note: string; }

export function StepDone({ orderNumber, orderType, contact }: {
    orderNumber: string; orderType: OrderType; contact: ContactDetails;
}) {
    const { isLoggedIn, saveFromCheckout } = useAuth();

    // Prompt state — hidden once saved or dismissed
    const [promptState, setPromptState] = useState<'idle' | 'saving' | 'saved' | 'dismissed'>(
        isLoggedIn ? 'saved' : 'idle' // skip if already logged in
    );

    const handleSave = async () => {
        setPromptState('saving');
        await new Promise(r => setTimeout(r, 600)); // tiny delay feels more intentional
        saveFromCheckout(contact.name, contact.phone);
        setPromptState('saved');
    };

    return (
        <div className="flex flex-col items-center gap-6 py-8 text-center">
            {/* Success icon */}
            <div className="relative">
                <div className="w-24 h-24 rounded-full bg-secondary/15 flex items-center justify-center">
                    <CheckCircleIcon weight="fill" size={52} className="text-secondary" />
                </div>
                <div className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                    <ShoppingBagIcon weight="fill" size={16} className="text-white" />
                </div>
            </div>

            <div>
                <h2 className="text-2xl font-bold text-text-dark dark:text-text-light">Order Placed!</h2>
                <p className="text-neutral-gray mt-1">Your delicious food is being prepared</p>
            </div>

            {/* Order details */}
            <div className="bg-white dark:bg-brand-dark rounded-2xl p-5 w-full shadow-sm flex flex-col gap-3">
                <div className="flex items-center justify-between">
                    <span className="text-sm text-neutral-gray">Order Number</span>
                    <span className="text-base font-bold text-primary font-mono">#{orderNumber}</span>
                </div>
                <div className="h-px bg-neutral-gray/10" />
                <div className="flex items-center justify-between">
                    <span className="text-sm text-neutral-gray">{orderType === 'delivery' ? 'Delivering to' : 'Pickup at'}</span>
                    <span className="text-sm font-semibold text-text-dark dark:text-text-light text-right max-w-[60%]">
                        {orderType === 'delivery' ? contact.address : 'Branch location'}
                    </span>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-sm text-neutral-gray">Estimated Time</span>
                    <span className="text-sm font-semibold text-text-dark dark:text-text-light">
                        {orderType === 'delivery' ? '25 – 40 mins' : '15 – 20 mins'}
                    </span>
                </div>
            </div>

            {/* SMS confirmation */}
            <div className="bg-primary/10 border border-primary/20 rounded-2xl p-4 w-full text-sm text-text-dark dark:text-text-light">
                Confirmation SMS sent to <strong>{contact.phone}</strong> with your tracking link.
            </div>

            {/* ── Post-order save prompt ─────────────────────────────────────── */}
            {promptState === 'idle' && (
                <div className="w-full bg-white dark:bg-brand-dark rounded-2xl p-4 shadow-sm border border-primary/15 relative">
                    {/* Dismiss */}
                    <button
                        onClick={() => setPromptState('dismissed')}
                        className="absolute top-3 right-3 w-6 h-6 flex items-center justify-center rounded-full hover:bg-neutral-gray/10 transition-colors"
                    >
                        <XIcon size={13} weight="bold" className="text-neutral-gray" />
                    </button>

                    <div className="flex items-start gap-3 mb-4">
                        <div className="w-9 h-9 rounded-xl bg-primary/15 flex items-center justify-center shrink-0 mt-0.5">
                            <SparkleIcon weight="fill" size={18} className="text-primary" />
                        </div>
                        <div className="text-left">
                            <p className="text-sm font-bold text-text-dark dark:text-text-light">Save your info for next time?</p>
                            <p className="text-xs text-neutral-gray mt-0.5">
                                Faster checkout — your name and number are pre-filled automatically.
                            </p>
                        </div>
                    </div>

                    {/* Pre-filled preview */}
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-neutral-light dark:bg-brown/30 mb-4">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                            <UserCircleIcon weight="fill" size={22} className="text-primary" />
                        </div>
                        <div className="text-left min-w-0">
                            <p className="text-sm font-semibold text-text-dark dark:text-text-light truncate">{contact.name}</p>
                            <p className="text-xs text-neutral-gray">{contact.phone}</p>
                        </div>
                    </div>

                    <button
                        onClick={handleSave}
                        className="w-full py-3 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold text-sm transition-all active:scale-[0.98]"
                    >
                        Yes, save my info
                    </button>
                </div>
            )}

            {/* Saving state */}
            {promptState === 'saving' && (
                <div className="w-full bg-white dark:bg-brand-dark rounded-2xl p-4 shadow-sm flex items-center justify-center gap-2 text-sm text-neutral-gray">
                    <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    Saving your details...
                </div>
            )}

            {/* Saved confirmation */}
            {promptState === 'saved' && (
                <div className="w-full bg-secondary/10 border border-secondary/20 rounded-2xl p-4 flex items-center gap-3">
                    <CheckCircleIcon weight="fill" size={20} className="text-secondary shrink-0" />
                    <div className="text-left">
                        <p className="text-sm font-bold text-text-dark dark:text-text-light">
                            {isLoggedIn ? 'You\'re already signed in 👍' : 'Details saved!'}
                        </p>
                        <p className="text-xs text-neutral-gray">
                            {isLoggedIn ? 'Your info is pre-filled on every order.' : 'Your next checkout will be instant.'}
                        </p>
                    </div>
                </div>
            )}

            {/* CTA buttons */}
            <div className="flex flex-col gap-3 w-full">
                <Link href="/orders"
                    className="flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white font-bold py-4 rounded-2xl transition-all active:scale-[0.98]">
                    Track My Order <ArrowRightIcon weight="bold" size={16} />
                </Link>
                <Link href="/"
                    className="flex items-center justify-center text-sm font-semibold text-neutral-gray hover:text-primary transition-colors py-2">
                    Back to Menu
                </Link>
            </div>
        </div>
    );
}