'use client';

import React, { useState, useCallback } from 'react';
import Image from 'next/image';
import { PlusIcon, StarIcon, FireIcon } from '@phosphor-icons/react';
import type { SearchableItem } from '@/app/components/providers/MenuDiscoveryProvider';

// ============================================
// TYPES
// ============================================
interface MenuItemCardProps {
    item: SearchableItem;
    onAddToCart?: (item: SearchableItem, selectedSize: string) => void;
}

// ============================================
// HELPERS
// ============================================
const formatPrice = (price: number) => `GHS ${price.toFixed(2)}`;

// const getCategoryColor = (category?: string) => {
//     switch (category?.toLowerCase()) {
//         case 'main dishes': return 'bg-primary/15 text-primary';
//         case 'drinks': return 'bg-info/15 text-info';
//         case 'desserts': return 'bg-error/15 text-error';
//         case 'appetizers': return 'bg-secondary/15 text-secondary';
//         default: return 'bg-neutral-gray/15 text-neutral-gray';
//     }
// };

// ============================================
// COMPONENT
// ============================================
export default function MenuItemCard({ item, onAddToCart }: MenuItemCardProps) {
    const sizes: { label: string; key: string; price: number }[] = item.sizes ?? [];
    const hasSizes = sizes.length > 0;

    const [selectedSize, setSelectedSize] = useState<string>(
        hasSizes ? sizes[0].key : 'regular'
    );
    const [added, setAdded] = useState(false);
    const [imgError, setImgError] = useState(false);

    const activePrice = hasSizes
        ? sizes.find((s) => s.key === selectedSize)?.price ?? item.price ?? 0
        : item.price ?? 0;

    const handleAdd = useCallback(() => {
        onAddToCart?.(item, selectedSize);
        setAdded(true);
        setTimeout(() => setAdded(false), 1000);
    }, [item, selectedSize, onAddToCart]);

    const isPopular = item.popular === true;
    const isNew = item.isNew === true;

    return (
        <article className="group cursor-pointer relative flex flex-col bg-neutral-light dark:bg-brown rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 will-change-transform">

            {/* ── Image ── */}
            <div className="relative w-full aspect-4/3 bg-primary dark:bg-brand-dark overflow-hidden shrink-0">
                {item.image && !imgError ? (
                    <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        onError={() => setImgError(true)}
                    />
                ) : (
                    /* Fallback placeholder */
                    <div className="w-full h-full flex items-center justify-center text-5xl select-none">
                        {item.icon ?? ''}
                    </div>
                )}

                {/* Badges */}
                <div className="absolute top-2 left-2 flex flex-col gap-1">
                    {isPopular && (
                        <span className="flex items-center gap-1 bg-primary text-white text-[10px] font-semibold px-2 py-0.5 rounded-full leading-none">
                            <FireIcon weight="fill" size={10} />
                            Popular
                        </span>
                    )}
                    {isNew && (
                        <span className="flex items-center gap-1 bg-secondary text-white text-[10px] font-semibold px-2 py-0.5 rounded-full leading-none">
                            <StarIcon weight="fill" size={10} />
                            New
                        </span>
                    )}
                </div>

                {/* Category chip */}
                {item.category && (
                    <span className={`absolute  bottom-2 right-2 text-[10px] font-semibold px-2 py-0.5 rounded-full backdrop-blur-sm bg-neutral-gray/80 text-text-light dark:text-text-light`}>
                        {item.category}
                    </span>
                )}
            </div>

            {/* ── Body ── */}
            <div className="flex flex-col flex-1 p-3 gap-2">

                {/* Name + Description */}
                <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm text-text-dark dark:text-text-light leading-tight truncate">
                        {item.name}
                    </h3>
                    {item.description && (
                        <p className="mt-0.5 text-xs text-neutral-gray line-clamp-2 leading-snug">
                            {item.description}
                        </p>
                    )}
                </div>

                {/* Size Selector */}
                {hasSizes && (
                    <div className="flex gap-1 flex-wrap">
                        {sizes.map((s) => (
                            <button
                                key={s.key}
                                onClick={() => setSelectedSize(s.key)}
                                className={`px-2.5 py-0.5 rounded-full text-[10px] font-medium border transition-colors duration-150
                                    ${selectedSize === s.key
                                        ? 'bg-neutral-gray  text-white'
                                        : 'border-neutral-gray/30 text-neutral-gray hover:border-primary/60'
                                    }`}
                            >
                                {s.label}
                            </button>
                        ))}
                    </div>
                )}

                {/* Price + Add Button */}
                <div className="flex items-center justify-between gap-2 mt-auto pt-1">
                    <span className="text-base font-bold text-primary leading-none">
                        {formatPrice(activePrice)}
                    </span>

                    <button
                        onClick={handleAdd}
                        aria-label={`Add ${item.name} to cart`}
                        className={`flex items-center gap-1.5 px-2 py-2 rounded-full cursor-pointer text-xs font-semibold transition-all duration-150 active:scale-95
                            ${added
                                ? 'bg-secondary text-white'
                                : 'bg-primary hover:bg-primary-hover text-white'
                            }`}
                    >
                        <PlusIcon weight="bold" size={13} />
                        {added ? 'Added!' : ''}
                    </button>
                </div>
            </div>
        </article>
    );
}