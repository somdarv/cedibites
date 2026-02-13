'use client';

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { sampleMenuItems } from '@/lib/data/SampleMenu';

// ============================================
// TYPES
// ============================================
export interface SearchableItem {
    id: string;
    name: string;
    description?: string;
    category?: string;
    price?: number;
    icon?: string;
    image?: string;
    url?: string;
    [key: string]: any;
}

interface MenuDiscoveryContextType {
    // Search
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    searchResults: SearchableItem[];
    isSearching: boolean;
    clearSearch: () => void;

    // Categories
    selectedCategory: string | null;
    setSelectedCategory: (categoryId: string | null) => void;

    // Combined filtered results
    filteredItems: SearchableItem[];

    // Recent searches
    recentSearches: string[];
    addRecentSearch: (query: string) => void;
    clearRecentSearches: () => void;

    // All items
    allItems: SearchableItem[];
}

// ============================================
// CONTEXT
// ============================================
const MenuDiscoveryContext = createContext<MenuDiscoveryContextType | undefined>(undefined);

// ============================================
// PROVIDER
// ============================================
export function MenuDiscoveryProvider({ children }: { children: ReactNode }) {
    const [searchQuery, setSearchQueryState] = useState('');
    const [selectedCategory, setSelectedCategoryState] = useState<string | null>(null);
    const [recentSearches, setRecentSearches] = useState<string[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    const allItems: SearchableItem[] = sampleMenuItems;

    // ============================================
    // LOAD RECENT SEARCHES FROM LOCALSTORAGE
    // ============================================
    useEffect(() => {
        const saved = localStorage.getItem('cedibites-recent-searches');
        if (saved) {
            try {
                setRecentSearches(JSON.parse(saved));
            } catch {
                console.error('Failed to load recent searches');
            }
        }
    }, []);

    // ============================================
    // PERSIST CATEGORY SELECTION
    // ============================================
    useEffect(() => {
        const savedCategory = sessionStorage.getItem('cedibites-selected-category');
        if (savedCategory) {
            setSelectedCategoryState(savedCategory === 'null' ? null : savedCategory);
        }
    }, []);

    // ============================================
    // SEARCH QUERY HANDLER
    // ============================================
    const setSearchQuery = useCallback((query: string) => {
        setSearchQueryState(query);
        setIsSearching(query.trim().length > 0);
    }, []);

    // ============================================
    // CATEGORY HANDLER
    // ============================================
    const setSelectedCategory = useCallback((categoryId: string | null) => {
        setSelectedCategoryState(categoryId);
        sessionStorage.setItem('cedibites-selected-category', String(categoryId));
    }, []);

    // ============================================
    // CLEAR SEARCH
    // ============================================
    const clearSearch = useCallback(() => {
        setSearchQueryState('');
        setIsSearching(false);
    }, []);

    // ============================================
    // ADD RECENT SEARCH
    // ============================================
    const addRecentSearch = useCallback((query: string) => {
        if (!query.trim()) return;
        setRecentSearches((prev) => {
            const updated = [query, ...prev.filter((s) => s !== query)].slice(0, 10);
            localStorage.setItem('cedibites-recent-searches', JSON.stringify(updated));
            return updated;
        });
    }, []);

    // ============================================
    // CLEAR RECENT SEARCHES
    // ============================================
    const clearRecentSearches = useCallback(() => {
        setRecentSearches([]);
        localStorage.removeItem('cedibites-recent-searches');
    }, []);

    // ============================================
    // SEARCH RESULTS - filter by query only
    // ============================================
    const searchResults = useCallback((): SearchableItem[] => {
        if (!searchQuery.trim()) return [];
        const lower = searchQuery.toLowerCase();
        return allItems.filter(
            (item) =>
                item.name.toLowerCase().includes(lower) ||
                item.description?.toLowerCase().includes(lower) ||
                item.category?.toLowerCase().includes(lower)
        );
    }, [searchQuery, allItems])();

    // ============================================
    // FILTERED ITEMS - filter by both query + category
    // ============================================
    const filteredItems = useCallback((): SearchableItem[] => {
        let results = allItems;

        // Filter by category
        if (selectedCategory && selectedCategory !== 'all') {
            results = results.filter(
                (item) => item.category?.toLowerCase() === selectedCategory.toLowerCase()
            );
        }

        // Filter by search query
        if (searchQuery.trim()) {
            const lower = searchQuery.toLowerCase();
            results = results.filter(
                (item) =>
                    item.name.toLowerCase().includes(lower) ||
                    item.description?.toLowerCase().includes(lower) ||
                    item.category?.toLowerCase().includes(lower)
            );
        }

        return results;
    }, [selectedCategory, searchQuery, allItems])();

    const value: MenuDiscoveryContextType = {
        searchQuery,
        setSearchQuery,
        searchResults,
        isSearching,
        clearSearch,
        selectedCategory,
        setSelectedCategory,
        filteredItems,
        recentSearches,
        addRecentSearch,
        clearRecentSearches,
        allItems,
    };

    return (
        <MenuDiscoveryContext.Provider value={value}>
            {children}
        </MenuDiscoveryContext.Provider>
    );
}

// ============================================
// HOOK
// ============================================
export function useMenuDiscovery() {
    const context = useContext(MenuDiscoveryContext);
    if (!context) {
        throw new Error('useMenuDiscovery must be used within a MenuDiscoveryProvider');
    }
    return context;
}   