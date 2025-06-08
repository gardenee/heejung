import { createContext, useContext } from 'react';

import type { Party } from '@/types/party';

export interface MetadataContextValue {
  userId: string | null;
  parties: Array<Party> | undefined;
  status: 'pending' | 'success' | 'error';
}

export const MetadataContext = createContext<MetadataContextValue | undefined>(
  undefined,
);

export const useMetadata = (): MetadataContextValue => {
  const context = useContext(MetadataContext);
  if (context === undefined) {
    throw new Error('useMetadata must be used within a MetadataProvider');
  }
  return context;
};
