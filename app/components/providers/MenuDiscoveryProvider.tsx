'use client';

import React, { createContext, useContext, useState, useMemo, useCallback, useEffect } from 'react';
import type { MenuItem } from '@/lib/data/SampleMenu';

// Export the type that matches our MenuItem exactly
export type SearchableItem = MenuItem;

const RECENT_SEARCHES_KEY = 'cedibites-recent-searches';
const MAX_RECENT = 8;

interface MenuDiscoveryContextType {
    allItems: SearchableItem[];
    filteredItems: SearchableItem[];
    searchResults: SearchableItem[];
    isSearching: boolean;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    selectedCategory: string | null;
    setSelectedCategory: (category: string | null) => void;
    recentSearches: string[];
    addRecentSearch: (term: string) => void;
    clearRecentSearches: () => void;
}

const MenuDiscoveryContext = createContext<MenuDiscoveryContextType | null>(null);

interface MenuDiscoveryProviderProps {
    children: React.ReactNode;
    items: SearchableItem[];
}

export function MenuDiscoveryProvider({ children, items }: MenuDiscoveryProviderProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [recentSearches, setRecentSearches] = useState<string[]>([]);

    // Load recent searches from localStorage on mount
    useEffect(() => {
        try {
            const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
            if (stored) setRecentSearches(JSON.parse(stored));
        } catch {
            // ignore
        }
    }, []);

    const filteredItems = useMemo(() => {
        let result = items;

        // Filter by category
        if (selectedCategory) {
            if (selectedCategory === 'Most Popular') {
                result = result.filter(item => item.popular);
            } else {
                result = result.filter(item => item.category === selectedCategory);
            }
        }

        // Filter by search query
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase().trim();
            result = result.filter(item => {
                // Search in name
                if (item.name.toLowerCase().includes(query)) return true;

                // Search in description
                if (item.description?.toLowerCase().includes(query)) return true;

                // Search in category
                if (item.category.toLowerCase().includes(query)) return true;

                return false;
            });
        }

        return result;
    }, [items, searchQuery, selectedCategory]);

    // searchResults: only populated when there's an active query
    const searchResults = useMemo(() => {
        if (!searchQuery.trim()) return [];
        return filteredItems;
    }, [searchQuery, filteredItems]);

    const handleSetSearchQuery = useCallback((query: string) => {
        setSearchQuery(query);
        // Clear category when searching
        if (query.trim()) {
            setSelectedCategory(null);
        }
    }, []);

    const addRecentSearch = useCallback((term: string) => {
        if (!term.trim()) return;
        setRecentSearches(prev => {
            const deduped = [term, ...prev.filter(s => s.toLowerCase() !== term.toLowerCase())].slice(0, MAX_RECENT);
            try { localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(deduped)); } catch { /* ignore */ }
            return deduped;
        });
    }, []);

    const clearRecentSearches = useCallback(() => {
        setRecentSearches([]);
        try { localStorage.removeItem(RECENT_SEARCHES_KEY); } catch { /* ignore */ }
    }, []);

    const value: MenuDiscoveryContextType = {
        allItems: items,
        filteredItems,
        searchResults,
        isSearching: false, // filtering is synchronous
        searchQuery,
        setSearchQuery: handleSetSearchQuery,
        selectedCategory,
        setSelectedCategory,
        recentSearches,
        addRecentSearch,
        clearRecentSearches,
    };

    return (
        <MenuDiscoveryContext.Provider value={value}>
            {children}
        </MenuDiscoveryContext.Provider>
    );
}

export function useMenuDiscovery() {
    const context = useContext(MenuDiscoveryContext);
    if (!context) {
        throw new Error('useMenuDiscovery must be used within MenuDiscoveryProvider');
    }
    return context;
}