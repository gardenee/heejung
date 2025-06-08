import { type ReactNode } from 'react';
import { useGetParties } from '@/queries/party';
import { useAuth } from '@/hooks/use-auth';
import { MetadataContext, type MetadataContextValue } from './metadata-context';

interface MetadataProviderProps {
  children: ReactNode;
}

export const MetadataProvider = ({ children }: MetadataProviderProps) => {
  const { userId } = useAuth();
  const { data: partiesResponse, status } = useGetParties();
  const parties = partiesResponse?.data ?? [];

  const value: MetadataContextValue = {
    userId,
    parties,
    status,
  };

  return (
    <MetadataContext.Provider value={value}>
      {children}
    </MetadataContext.Provider>
  );
};
