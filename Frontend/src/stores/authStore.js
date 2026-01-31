import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { onAuthStateChange, logout as firebaseLogout } from '../services/authService';

/**
 * Auth Store - Zustand
 * Manages authentication state with Firebase integration
 */
const useAuthStore = create(
    persist(
        (set, get) => ({
            // State
            user: null,
            accessToken: null,
            isAuthenticated: false,
            isLoading: true, // Start as loading until we check auth state
            isEmailVerified: false,
            authError: null,

            // Actions
            setUser: (user) => set({
                user,
                isAuthenticated: !!user,
                isEmailVerified: user?.emailVerified || false,
                isLoading: false
            }),

            setToken: (token) => {
                set({ accessToken: token });
                if (token) {
                    localStorage.setItem('accessToken', token);
                } else {
                    localStorage.removeItem('accessToken');
                }
            },

            login: (user, token) => {
                set({
                    user,
                    accessToken: token,
                    isAuthenticated: true,
                    isEmailVerified: user?.emailVerified || false,
                    isLoading: false,
                    authError: null,
                });
                if (token) {
                    localStorage.setItem('accessToken', token);
                }
            },

            logout: async () => {
                await firebaseLogout();
                set({
                    user: null,
                    accessToken: null,
                    isAuthenticated: false,
                    isEmailVerified: false,
                    authError: null,
                });
                localStorage.removeItem('accessToken');
            },

            setLoading: (isLoading) => set({ isLoading }),

            setError: (error) => set({ authError: error }),

            clearError: () => set({ authError: null }),

            // Force refresh user data from Firestore (clears cache)
            forceRefresh: async () => {
                const currentUser = get().user;
                if (currentUser?.uid) {
                    // Clear persisted state to force fresh data
                    localStorage.removeItem('auth-storage');
                    set({ isLoading: true });
                }
            },

            // Initialize auth state observer
            initAuthObserver: () => {
                set({ isLoading: true });
                const unsubscribe = onAuthStateChange(async (user) => {
                    if (user) {
                        set({
                            user,
                            isAuthenticated: true,
                            isEmailVerified: user.emailVerified || false,
                            isLoading: false,
                        });
                    } else {
                        set({
                            user: null,
                            isAuthenticated: false,
                            isEmailVerified: false,
                            isLoading: false,
                        });
                    }
                });
                return unsubscribe;
            },
        }),
        {
            name: 'auth-storage',
            // Only persist user data, NOT isAuthenticated
            // isAuthenticated will be determined by Firebase observer on each load
            partialize: (state) => ({
                user: state.user,
                accessToken: state.accessToken,
                // isEmailVerified is derived from user, kept for convenience
            }),
        }
    )
);

export default useAuthStore;
