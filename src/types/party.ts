export interface Party {
  id: number;
  createdAt: string;
  partyName: string;
  color: string;
  sortSeq: number;
}

export interface CreatePartyInput {
  partyName: string;
  color: string;
}
