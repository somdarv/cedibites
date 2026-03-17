'use client';

import { useState, useEffect, useCallback } from 'react';
import { menuConfigService } from '@/lib/api/services/menuConfig.service';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface OptionTemplate {
    id: string;
    name: string;
    options: { label: string; price: string }[];
}

export interface AddOn {
    id: string;
    name: string;
    price: number;
    perPiece: boolean;
}

export type DayKey = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';

export interface DayHours {
    open: string;    // "09:00"
    close: string;   // "22:00"
    closed: boolean;
}

export interface BranchSettings {
    isOpen: boolean;
    orderTypes: {
        delivery: boolean;
        pickup: boolean;
        dineIn: boolean;
    };
    paymentMethods: {
        momo: boolean;
        cashDelivery: boolean;
        cashPickup: boolean;
    };
    hours: Record<DayKey, DayHours>;
}

export interface MenuConfig {
    categories: string[];
    optionTemplates: OptionTemplate[];
    addOns: AddOn[];
    branch: BranchSettings;
}

// ─── Defaults ─────────────────────────────────────────────────────────────────

const DEFAULT_HOURS: Record<DayKey, DayHours> = {
    mon: { open: '09:00', close: '22:00', closed: false },
    tue: { open: '09:00', close: '22:00', closed: false },
    wed: { open: '09:00', close: '22:00', closed: false },
    thu: { open: '09:00', close: '22:00', closed: false },
    fri: { open: '09:00', close: '23:00', closed: false },
    sat: { open: '09:00', close: '23:00', closed: false },
    sun: { open: '10:00', close: '21:00', closed: false },
};

export const DEFAULT_CONFIG: MenuConfig = {
    categories: ['Basic Meals', 'Budget Bowls', 'Combos', 'Top Ups', 'Drinks'],
    optionTemplates: [
        {
            id: 'tpl-sm-lg',
            name: 'Small / Large',
            options: [{ label: 'Small', price: '' }, { label: 'Large', price: '' }],
        },
        {
            id: 'tpl-plain-assorted',
            name: 'Plain / Assorted',
            options: [{ label: 'Plain', price: '' }, { label: 'Assorted', price: '' }],
        },
        {
            id: 'tpl-full-half-quarter',
            name: 'Full / Half / Quarter',
            options: [
                { label: 'Full',    price: '' },
                { label: 'Half',    price: '' },
                { label: 'Quarter', price: '' },
            ],
        },
        {
            id: 'tpl-350ml-500ml',
            name: '350ml / 500ml',
            options: [{ label: '350ml', price: '' }, { label: '500ml', price: '' }],
        },
    ],
    addOns: [
        { id: 'addon-drumsticks', name: 'Drumsticks',               price: 12, perPiece: true  },
        { id: 'addon-tilapia',    name: 'Charcoal Grilled Tilapia', price: 60, perPiece: false },
    ],
    branch: {
        isOpen: true,
        orderTypes:     { delivery: true, pickup: true, dineIn: false },
        paymentMethods: { momo: true, cashDelivery: true, cashPickup: true },
        hours: DEFAULT_HOURS,
    },
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useMenuConfig() {
    const [config, setConfig] = useState<MenuConfig>(DEFAULT_CONFIG);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        menuConfigService
            .get()
            .then((fetched) => {
                setConfig({
                    categories: fetched.categories ?? DEFAULT_CONFIG.categories,
                    optionTemplates: fetched.optionTemplates ?? DEFAULT_CONFIG.optionTemplates,
                    addOns: fetched.addOns ?? DEFAULT_CONFIG.addOns,
                    branch: fetched.branch ?? DEFAULT_CONFIG.branch,
                });
            })
            .catch(() => {
                // Fall back to defaults on error (e.g. network, 401)
            })
            .finally(() => setReady(true));
    }, []);

    const save = useCallback((updated: MenuConfig) => {
        setConfig(updated);
        menuConfigService.save(updated).catch(() => {
            // API error — config already updated locally; next load will fetch from API
        });
    }, []);

    return { config, save, ready };
}
