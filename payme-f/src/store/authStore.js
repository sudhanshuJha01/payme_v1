import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
    persist(
        (set) => ({
            user: null,
            accessToken: null,
            login: (userData, token) => set({ user: userData, accessToken: token }),
            logout: () => set({ user: null, accessToken: null }),
        }),
        {
            name: 'auth-storage',
        }
    )
);