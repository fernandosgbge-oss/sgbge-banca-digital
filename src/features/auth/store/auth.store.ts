import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
    id: string;
    name: string;
    email: string;
    biometricsRegistered: boolean;
    credentialId?: string;
}

export interface AuditEvent {
    timestamp: number;
    event: 'LOGIN_SUCCESS' | 'LOGIN_FAILURE' | 'LOGOUT' | 'BIOMETRICS_REGISTERED' | 'SESSION_EXPIRED';
    details?: string;
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    lastActivity: number;
    auditLog: AuditEvent[];

    // Actions
    login: (user: User) => void;
    logout: (reason?: string) => void;
    updateActivity: () => void;
    registerBiometrics: (credentialId: string) => void;
    logEvent: (event: AuditEvent['event'], details?: string) => void;
    checkSession: () => boolean; // Returns false if expired
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            isAuthenticated: false,
            lastActivity: Date.now(),
            auditLog: [],

            login: (user) => {
                set((state) => ({
                    user,
                    isAuthenticated: true,
                    lastActivity: Date.now(),
                    auditLog: [...state.auditLog, { timestamp: Date.now(), event: 'LOGIN_SUCCESS', details: `User ${user.email} logged in` }]
                }));
            },

            logout: (reason = 'User initiated') => {
                set((state) => ({
                    user: null, // Keep user null on logout
                    isAuthenticated: false,
                    auditLog: [...state.auditLog, { timestamp: Date.now(), event: 'LOGOUT', details: reason }]
                }));
            },

            updateActivity: () => set({ lastActivity: Date.now() }),

            registerBiometrics: (credentialId) => {
                const { user, auditLog } = get();
                if (user) {
                    set({
                        user: { ...user, biometricsRegistered: true, credentialId },
                        auditLog: [...auditLog, { timestamp: Date.now(), event: 'BIOMETRICS_REGISTERED' }]
                    });
                }
            },

            logEvent: (event, details) => {
                set((state) => ({
                    auditLog: [...state.auditLog, { timestamp: Date.now(), event, details }]
                }));
            },

            checkSession: () => {
                const { lastActivity, isAuthenticated, logout } = get();
                if (!isAuthenticated) return true;

                const now = Date.now();
                const TO_MS = 60 * 60 * 1000; // 60 minutes for verification

                if (now - lastActivity > TO_MS) {
                    logout('Session Expired by Security Policy');
                    return false;
                }
                return true;
            }
        }),
        {
            name: 'sgbge-auth-storage',
        }
    )
);
