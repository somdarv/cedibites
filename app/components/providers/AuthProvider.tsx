'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────
export interface AuthUser {
    name: string;
    phone: string;
    savedAddresses?: string[];
    createdAt: number;
}

type AuthStep = 'idle' | 'phone' | 'otp' | 'naming' | 'done';

interface AuthContextType {
    // Session
    user: AuthUser | null;
    isLoggedIn: boolean;
    logout: () => void;

    // OTP flow
    authStep: AuthStep;
    setAuthStep: (step: AuthStep) => void;
    pendingPhone: string;
    setPendingPhone: (phone: string) => void;

    // Actions
    sendOTP: (phone: string) => Promise<{ success: boolean; error?: string }>;
    verifyOTP: (code: string) => Promise<{ success: boolean; error?: string }>;
    saveProfile: (name: string, phone: string) => void;

    // Post-order quick save (from checkout)
    saveFromCheckout: (name: string, phone: string) => void;

    // Dev helpers
    devOTP: string; // visible in dev mode only
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'cedibites-auth-user';
const OTP_LENGTH = 6;

// ─── Provider ─────────────────────────────────────────────────────────────────
export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [authStep, setAuthStep] = useState<AuthStep>('idle');
    const [pendingPhone, setPendingPhone] = useState('');
    const [devOTP, setDevOTP] = useState('');
    const [generatedOTP, setGeneratedOTP] = useState('');

    // ── Load persisted session ──
    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) setUser(JSON.parse(stored));
        } catch { /* ignore */ }
    }, []);

    const persistUser = (u: AuthUser) => {
        setUser(u);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
    };

    const logout = useCallback(() => {
        setUser(null);
        localStorage.removeItem(STORAGE_KEY);
        setAuthStep('idle');
        setPendingPhone('');
    }, []);

    // ── Send OTP ──────────────────────────────────────────────────────────────
    // Dev: generates locally and logs to console / exposes via devOTP state
    // Prod: swap the body for your Africa's Talking / Hubtel SMS API call
    const sendOTP = useCallback(async (phone: string): Promise<{ success: boolean; error?: string }> => {
        try {
            // Generate 6-digit OTP
            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            setGeneratedOTP(otp);
            setPendingPhone(phone);

            if (process.env.NODE_ENV === 'development') {
                // DEV: show OTP in console + state (no real SMS)
                console.log(`%c[CediBites OTP] ${otp}`, 'color: #e49925; font-size: 18px; font-weight: bold;');
                setDevOTP(otp);

                // ─────────────────────────────────────────────────────────────
                // PRODUCTION: replace the block above with Africa's Talking:
                //
                // const AT = require('africastalking')({
                //     apiKey: process.env.AT_API_KEY,
                //     username: process.env.AT_USERNAME,
                // });
                // await AT.SMS.send({
                //     to: [phone],
                //     message: `Your CediBites verification code is: ${otp}`,
                //     from: 'CediBites',
                // });
                //
                // Or Hubtel SMS (once live):
                // await fetch('https://api.hubtel.com/v1/messages/send', {
                //     method: 'POST',
                //     headers: { Authorization: `Basic ${btoa(clientId + ':' + clientSecret)}` },
                //     body: JSON.stringify({ From: 'CediBites', To: phone, Content: `Your code: ${otp}` }),
                // });
                // ─────────────────────────────────────────────────────────────
            }

            setAuthStep('otp');
            return { success: true };
        } catch (err) {
            return { success: false, error: 'Failed to send OTP. Please try again.' };
        }
    }, []);

    // ── Verify OTP ────────────────────────────────────────────────────────────
    const verifyOTP = useCallback(async (code: string): Promise<{ success: boolean; error?: string }> => {
        if (code !== generatedOTP) {
            return { success: false, error: 'Incorrect code. Please try again.' };
        }

        // OTP valid — check if user already has a saved profile
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                const existing: AuthUser = JSON.parse(stored);
                if (existing.phone === pendingPhone) {
                    setUser(existing);
                    setAuthStep('done');
                    setDevOTP('');
                    return { success: true };
                }
            } catch { /* ignore */ }
        }

        // New user — ask for name
        setAuthStep('naming');
        setDevOTP('');
        return { success: true };
    }, [generatedOTP, pendingPhone]);

    // ── Save profile (after name entry) ──────────────────────────────────────
    const saveProfile = useCallback((name: string, phone: string) => {
        const newUser: AuthUser = { name, phone, savedAddresses: [], createdAt: Date.now() };
        persistUser(newUser);
        setAuthStep('done');
    }, []);

    // ── Quick save from checkout (no OTP needed — they just ordered) ──────────
    // Called from StepDone "Save for next time" prompt
    const saveFromCheckout = useCallback((name: string, phone: string) => {
        if (!name.trim() || !phone.trim()) return;
        const newUser: AuthUser = { name, phone, savedAddresses: [], createdAt: Date.now() };
        persistUser(newUser);
    }, []);

    return (
        <AuthContext.Provider value={{
            user, isLoggedIn: !!user, logout,
            authStep, setAuthStep,
            pendingPhone, setPendingPhone,
            sendOTP, verifyOTP, saveProfile,
            saveFromCheckout,
            devOTP,
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
}