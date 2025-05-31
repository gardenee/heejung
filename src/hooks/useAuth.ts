import { useEffect, useState } from 'react'
import { getAnonymousUserId } from '../stores/auth'

interface UseAuthReturn {
  userId: string | null
  isInitialized: boolean
  isLoading: boolean
}

export const useAuth = (): UseAuthReturn => {
  const [userId, setUserId] = useState<string | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setIsLoading(true)
        
        const anonymousId = getAnonymousUserId()
        setUserId(anonymousId)
        setIsInitialized(true)
        
        console.log('Auth initialized with user ID:', anonymousId)
      } catch (error) {
        console.error('Auth initialization failed:', error)
        setIsInitialized(false)
      } finally {
        setIsLoading(false)
      }
    }

    initializeAuth()
  }, [])

  return {
    userId,
    isInitialized,
    isLoading
  }
}

export const useAuthInitializer = (): UseAuthReturn => {
  return useAuth()
}

export const useCurrentUserId = (): string => {
  const anonymousId = getAnonymousUserId()
  return anonymousId
} 