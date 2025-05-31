import { v4 as uuidv4 } from 'uuid'

const ANONYMOUS_USER_KEY = 'anonymous_user_id'

export const getAnonymousUserId = (): string => {
  const existingUserId = localStorage.getItem(ANONYMOUS_USER_KEY)
  
  if (existingUserId) {
    return existingUserId
  }
  
  const newUserId = uuidv4()
  localStorage.setItem(ANONYMOUS_USER_KEY, newUserId)
  
  return newUserId
}

export const resetAnonymousUserId = (): string => {
  localStorage.removeItem(ANONYMOUS_USER_KEY)
  return getAnonymousUserId()
}

export const hasAnonymousUserId = (): boolean => {
  return localStorage.getItem(ANONYMOUS_USER_KEY) !== null
} 