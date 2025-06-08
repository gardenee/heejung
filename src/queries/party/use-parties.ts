import { getParties } from '@/api/party';
import { PARTY_QUERY_KEYS } from './party-query-keys';
import type { Party as PartyModel } from '@/models/party';
import type { Party } from '@/types/party';
import { useReactQuery } from '@/hooks/use-react-query';

export const useGetParties = () => {
  return useReactQuery<Array<PartyModel>, Array<Party>>({
    queryKey: PARTY_QUERY_KEYS.getParties(),
    queryFn: () => getParties(),
    staleTime: 24 * 60 * 60 * 1000,
    gcTime: 24 * 60 * 60 * 1000,
  });
};
