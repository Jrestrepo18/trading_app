import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { signOut } from 'firebase/auth';
import { auth } from '../services/firebase';

interface User {
    uid: string;
    email: string | null;
    name: string | null;
    emailVerified: boolean;
    photoURL?: string | null;
    role?: string;
}

interface AuthState {
    user: User | null;
    accessToken: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    setUser: (user: User | null) => void;
    setToken: (token: string | null) => void;
    login: (user: User, token: string) => void;
    logout: () => Promise<void>;
    setLoading: (isLoading: boolean) => void;
}

const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            accessToken: null,
            isAuthenticated: false,
            isLoading: true,

            setUser: (user) => set({
                user,
                isAuthenticated: !!user,
                isLoading: false
            }),

            setToken: (token) => set({ accessToken: token }),

            login: (user, token) => set({
                user,
                accessToken: token,
                isAuthenticated: true,
                isLoading: false,
            }),

            logout: async () => {
                await signOut(auth);
                set({
                    user: null,
                    accessToken: null,
                    isAuthenticated: false,
                });
            },

            setLoading: (isLoading) => set({ isLoading }),
        }),
        {
            name: 'auth-storage',
            storage: createJSONStorage(() => AsyncStorage),
            partialize: (state) => ({
                user: state.user,
                accessToken: state.accessToken,
            }),
        }
    )
);

export default useAuthStore;
