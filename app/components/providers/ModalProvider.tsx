'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface ModalContextType {
    // Branch Selector
    isBranchSelectorOpen: boolean;
    openBranchSelector: () => void;
    closeBranchSelector: () => void;

    // Location Request
    isLocationModalOpen: boolean;
    openLocationModal: () => void;
    closeLocationModal: () => void;

    // Cart Drawer
    isCartOpen: boolean;
    openCart: () => void;
    closeCart: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: { children: ReactNode }) {
    const [isBranchSelectorOpen, setIsBranchSelectorOpen] = useState(false);
    const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);

    // ── Single scroll lock — fires whenever any modal state changes ──
    useEffect(() => {
        const anyOpen = isBranchSelectorOpen || isLocationModalOpen || isCartOpen;
        document.body.style.overflow = anyOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [isBranchSelectorOpen, isLocationModalOpen, isCartOpen]);

    // Branch Selector
    const openBranchSelector = () => {
        setIsBranchSelectorOpen(true);
        setIsLocationModalOpen(false);
    };
    const closeBranchSelector = () => setIsBranchSelectorOpen(false);

    // Location Modal
    const openLocationModal = () => {
        setIsLocationModalOpen(true);
        setIsBranchSelectorOpen(false);
    };
    const closeLocationModal = () => setIsLocationModalOpen(false);

    // Cart Drawer
    const openCart = () => setIsCartOpen(true);
    const closeCart = () => setIsCartOpen(false);

    return (
        <ModalContext.Provider value={{
            isBranchSelectorOpen, openBranchSelector, closeBranchSelector,
            isLocationModalOpen, openLocationModal, closeLocationModal,
            isCartOpen, openCart, closeCart,
        }}>
            {children}
        </ModalContext.Provider>
    );
}

export function useModal() {
    const context = useContext(ModalContext);
    if (!context) throw new Error('useModal must be used within ModalProvider');
    return context;
}