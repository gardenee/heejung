export interface CheerNote {
  id: number;
  partyId: number;
  userId: string;
  userName: string;
  message: string;
  createdAt: string;
  isDeleted: boolean;
}

export interface CreateCheerNoteInput {
  partyId: number;
  userId: string;
  userName: string;
  message: string;
}
