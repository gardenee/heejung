import { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/auth';

interface UseAuthReturn {
  userId: string | null;
}

export const useAuth = (): UseAuthReturn => {
  const { initAnonymousUserId } = useAuthStore();
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const anonymousId = initAnonymousUserId();
        setUserId(anonymousId);
        console.log('Auth initialized with user ID:', userId);
      } catch (error) {
        console.error('Auth initialization failed:', error);
      }
    };

    initializeAuth();
  }, [initAnonymousUserId]);

  return {
    userId,
  };
};
