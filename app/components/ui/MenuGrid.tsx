'use client';

import React, { useMemo } from 'react';
import { MagnifyingGlassIcon, SmileySadIcon } from '@phosphor-icons/react';
import { useMenuDiscovery } from '@/app/components/providers/MenuDiscoveryProvider';
import type { SearchableItem } from '@/app/components/providers/MenuDiscoveryProvider';
import MenuItemCard from './MenuItemCard';

// ============================================
// PROPS
// ============================================
interface MenuGridProps {
    onAddToCart?: (item: SearchableItem, selectedSize: string) => void;
}

// ============================================
// EMPTY STATE
// ============================================
function EmptyState({ query, category }: { query: string; category: string | null }) {
    const isSearch = query.trim().length > 0;

    return (
        <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
            {isSearch ? (
                <MagnifyingGlassIcon size={48} className="text-neutral-gray/40" />
            ) : (
                <SmileySadIcon size={48} className="text-neutral-gray/40" />
            )}
            <p className="text-base font-semibold text-text-dark dark:text-text-light">
                {isSearch
                    ? `No results for "${query}"`
                    : `Nothing in ${category ?? 'this category'} yet`}
            </p>
            <p className="text-sm text-neutral-gray">
                {isSearch ? 'Try a different search term' : 'Check back soon!'}
            </p>
        </div>
    );
}

// ============================================
// SKELETON CARD (for initial load feel)
// ============================================
function SkeletonCard() {
    return (
        <div className="flex flex-col bg-white dark:bg-brown rounded-2xl overflow-hidde animate-pulse">
            <div className="w-full aspect-[4/3] bg-neutral-gray/15" />
            <div className="p-3 flex flex-col gap-2">
                <div className="h-3.5 w-3/4 bg-neutral-gray/15 rounded-full" />
                <div className="h-2.5 w-full  bg-neutral-gray/10 rounded-full" />
                <div className="h-2.5 w-2/3  bg-neutral-gray/10 rounded-full" />
                <div className="flex justify-between items-center mt-2">
                    <div className="h-4 w-16 bg-primary/20 rounded-full" />
                    <div className="h-7 w-16 bg-primary/20 rounded-xl" />
                </div>
            </div>
        </div>
    );
}

// ============================================
// SECTION HEADER
// ============================================
function SectionHeader({ label, count }: { label: string; count: number }) {
    return (
        <div className="flex items-baseline gap-2 mb-4">
            <h2 className="text-lg md:text-xl font-bold text-text-dark dark:text-text-light">
                {label}
            </h2>
            <span className="text-sm text-neutral-gray">
                ({count} item{count !== 1 ? 's' : ''})
            </span>
        </div>
    );
}

// ============================================
// MAIN COMPONENT
// ============================================
export default function MenuGrid({ onAddToCart }: MenuGridProps) {
    const { filteredItems, searchQuery, selectedCategory, allItems } = useMenuDiscovery();

    // Group by category when no search + no category filter
    const showGrouped = !searchQuery.trim() && !selectedCategory;

    const grouped = useMemo(() => {
        if (!showGrouped) return null;
        return allItems.reduce<Record<string, SearchableItem[]>>((acc, item) => {
            const cat = item.category ?? 'Other';
            if (!acc[cat]) acc[cat] = [];
            acc[cat].push(item);
            return acc;
        }, {});
    }, [showGrouped, allItems]);

    const isFiltering = searchQuery.trim().length > 0 || !!selectedCategory;
    const headerLabel = searchQuery.trim()
        ? `Results for "${searchQuery}"`
        : selectedCategory
            ? selectedCategory
            : '';

    // ── Grouped View (default homepage state) ──
    if (showGrouped && grouped) {
        return (
            <section className="w-[95%]  md:w-[80%] xl:w-[70%] mx-auto pb-16 mt-6">
                {Object.entries(grouped).map(([cat, items]) => (
                    <div key={cat} className="mb-10">
                        <SectionHeader label={cat} count={items.length} />
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                            {items.map((item) => (
                                <MenuItemCard
                                    key={item.id}
                                    item={item}
                                    onAddToCart={onAddToCart}
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </section>
        );
    }

    // ── Filtered View (search or category active) ──
    return (
        <section className="w-[95%] md:w-[80%] xl:w-[70%] mx-auto pb-16 mt-6">
            {isFiltering && (
                <SectionHeader label={headerLabel} count={filteredItems.length} />
            )}

            {filteredItems.length === 0 ? (
                <EmptyState query={searchQuery} category={selectedCategory} />
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                    {filteredItems.map((item) => (
                        <MenuItemCard
                            key={item.id}
                            item={item}
                            onAddToCart={onAddToCart}
                        />
                    ))}
                </div>
            )}
        </section>
    );
}