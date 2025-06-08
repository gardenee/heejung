export const PARTY_QUERY_KEYS = {
  all: ['metadata', 'parties'],
  getParties: () => [...PARTY_QUERY_KEYS.all, 'getParties'],
};
