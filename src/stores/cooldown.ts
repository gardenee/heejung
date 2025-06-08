import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const DEFAULT_COOLDOWNS: Record<string, number> = {
  cheer_note: 10 * 1000,
  vote: 5 * 1000,
  reaction: 1 * 1000,
};

export interface CooldownConfig {
  action: string;
  cooldownMs: number;
}

interface CooldownState {
  actionTimes: Record<string, number>; // userId_action -> timestamp
  setLastActionTime: (userId: string, action: string) => void;
  getLastActionTime: (userId: string, action: string) => number | null;
}

export const useCooldownStore = create<CooldownState>()(
  persist(
    (set, get) => ({
      actionTimes: {},
      setLastActionTime: (userId: string, action: string) => {
        const key = getCooldownKey(userId, action);
        const now = Date.now();
        set(state => ({
          actionTimes: {
            ...state.actionTimes,
            [key]: now,
          },
        }));
      },
      getLastActionTime: (userId: string, action: string) => {
        const key = getCooldownKey(userId, action);
        const { actionTimes } = get();
        return actionTimes[key] || null;
      },
    }),
    {
      name: 'cooldown-store',
    },
  ),
);

const getCooldownKey = (userId: string, action: string): string => {
  return `${userId}_${action}`;
};

export const setLastActionTime = (userId: string, action: string): void => {
  useCooldownStore.getState().setLastActionTime(userId, action);
};

export const getLastActionTime = (
  userId: string,
  action: string,
): number | null => {
  return useCooldownStore.getState().getLastActionTime(userId, action);
};

export const isCooldownExpired = (
  userId: string,
  action: string,
  cooldownMs?: number,
): boolean => {
  const lastActionTime = getLastActionTime(userId, action);

  if (!lastActionTime) {
    return true;
  }

  const now = Date.now();
  const cooldown = cooldownMs || DEFAULT_COOLDOWNS[action] || 0;

  return now - lastActionTime >= cooldown;
};

export const getRemainingCooldown = (
  userId: string,
  action: string,
  cooldownMs?: number,
): number => {
  const lastActionTime = getLastActionTime(userId, action);

  if (!lastActionTime) {
    return 0;
  }

  const now = Date.now();
  const cooldown = cooldownMs || DEFAULT_COOLDOWNS[action] || 0;
  const elapsed = now - lastActionTime;

  return Math.max(0, cooldown - elapsed);
};

export const checkCooldown = (
  userId: string,
  action: string,
  cooldownMs?: number,
): {
  canExecute: boolean;
  remainingMs: number;
  remainingSeconds: number;
} => {
  const canExecute = isCooldownExpired(userId, action, cooldownMs);
  const remainingMs = getRemainingCooldown(userId, action, cooldownMs);
  const remainingSeconds = Math.ceil(remainingMs / 1000);

  return {
    canExecute,
    remainingMs,
    remainingSeconds,
  };
};

export class CooldownError extends Error {
  public remainingMs: number;
  public remainingSeconds: number;

  constructor(action: string, remainingMs: number) {
    const remainingSeconds = Math.ceil(remainingMs / 1000);
    super(
      `${action} 액션은 ${remainingSeconds}초 후에 다시 시도할 수 있습니다.`,
    );
    this.name = 'CooldownError';
    this.remainingMs = remainingMs;
    this.remainingSeconds = remainingSeconds;
  }
}
