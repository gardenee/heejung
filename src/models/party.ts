export interface Party {
  id: number
  created_at: string
  party_name: string
  color: string
}

export interface CreatePartyInput {
  party_name: string
  color: string
}
