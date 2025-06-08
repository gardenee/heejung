import { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/auth';

interface UseAuthReturn {
  isAuthenticated: boolean;
  userId: string | null;
  isInitialized: boolean;
  isLoading: boolean;
}

export const useAuth = (): UseAuthReturn => {
  const { initAnonymousUserId } = useAuthStore();

  const [userId, setUserId] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setIsLoading(true);

        const anonymousId = initAnonymousUserId();
        setUserId(anonymousId);
        setIsAuthenticated(false); // 현재는 모든 사용자가 익명 사용자
        setIsInitialized(true);
        console.log('Auth initialized with user ID:', userId);
      } catch (error) {
        setIsInitialized(false);
        console.error('Auth initialization failed:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, [initAnonymousUserId]);

  return {
    isAuthenticated,
    userId,
    isLoading,
    isInitialized,
  };
};
