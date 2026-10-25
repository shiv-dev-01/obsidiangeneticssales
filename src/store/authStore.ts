import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { useProductLineStore } from './productLineStore';
import type { User } from '../types/auth';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

interface AuthActions {
  login: (user: User) => void;
  logout: () => void;
  getAdminId: () => number | null;
  getPermissionLevel: () => string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
};

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set, get) => ({
      ...initialState,
      
      login: (user) => {
        set({ user, isAuthenticated: true });
        // Initialize product line after setting user
        useProductLineStore.getState().initializeProductLine(user.is_permission);
      },
      
      logout: () => {
        useProductLineStore.getState().reset();
        set(initialState);
      },
      
      getAdminId: () => get().user?.admin_id || null,
      getPermissionLevel: () => get().user?.is_permission || null,
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      version: 1,
    }
  )
);