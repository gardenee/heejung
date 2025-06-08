export interface CheerNote {
  id: number;
  party_id: number;
  user_id: string;
  user_name: string;
  message: string;
  created_at: string;
  is_deleted: boolean;
}

export interface CreateCheerNoteInput {
  party_id: number;
  user_id: string;
  user_name: string;
  message: string;
}
