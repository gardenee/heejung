export interface CheerNoteReaction {
  id: number;
  cheerNoteId: number;
  userId: string;
  type: string;
  createdAt: string;
  isDeleted: boolean;
}

export interface CreateCheerNoteReactionInput {
  cheerNoteId: number;
  userId: string;
  type: string;
}

export interface CheerNoteReactionStats {
  cheerNoteId: number;
  reactionCounts: { [key: string]: number };
  totalReactions: number;
  userReaction?: string | null;
}
