import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

interface AuthState {
  anonymousUserId: string | null;
  initAnonymousUserId: () => string;
  resetAnonymousUserId: () => void;
  hasAnonymousUserId: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      anonymousUserId: null,
      initAnonymousUserId: () => {
        const currentUserId = get().anonymousUserId;
        if (currentUserId) {
          return currentUserId;
        }
        const newUserId = uuidv4();
        set({ anonymousUserId: newUserId });
        return newUserId;
      },
      resetAnonymousUserId: () => {
        set({ anonymousUserId: null });
      },
      hasAnonymousUserId: () => {
        return get().anonymousUserId !== null;
      },
    }),
    {
      name: 'auth-storage',
    },
  ),
);
