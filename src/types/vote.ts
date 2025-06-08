export interface Vote {
  id: number;
  createdAt: string;
  partyId: number;
  userId: string;
  isDeleted: boolean;
}

export interface CreateVoteInput {
  partyId: number;
  userId: string;
}
