import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserProfile } from '../types/auth';

interface AuthState {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  
  // Actions
  login: (user: UserProfile, token: string) => void;
  logout: () => void;
  updateUser: (user: Partial<UserProfile>) => void;
}

/**
 * Zustand Store for Global Authentication.
 * We use the `persist` middleware to automatically back this up to LocalStorage.
 * That way, if the user refreshes the page, they don't get logged out!
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isAdmin: false,

      login: (user, token) => {
        // Also save token explicitly for Axios to grab easily, though persist handles the state
        localStorage.setItem('token', token);
        set({
          user,
          token,
          isAuthenticated: true,
          isAdmin: user.role === 'ROLE_ADMIN',
        });
      },

      logout: () => {
        localStorage.removeItem('token');
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isAdmin: false,
        });
      },

      updateUser: (updatedFields) => 
        set((state) => ({
          user: state.user ? { ...state.user, ...updatedFields } : null
        })),
    }),
    {
      name: 'auth-store', // The key it saves under in LocalStorage
    }
  )
);
