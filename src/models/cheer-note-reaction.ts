export interface CheerNoteReaction {
  id: number;
  cheer_note_id: number;
  user_id: string;
  type: string;
  created_at: string;
  is_deleted: boolean;
}

export interface CreateCheerNoteReactionInput {
  cheer_note_id: number;
  user_id: string;
  type: string;
}

export interface CheerNoteReactionStats {
  cheer_note_id: number;
  reaction_counts: { [key: string]: number };
  total_reactions: number;
  user_reaction?: string | null;
}
