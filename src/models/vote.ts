export interface Vote {
  id: number;
  created_at: string;
  party_id: number;
  user_id: string;
  is_deleted: boolean;
}

export interface CreateVoteInput {
  party_id: number;
  user_id: string;
}
