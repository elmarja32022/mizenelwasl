export type IntegrityVoteStatus = 'ACTIVE' | 'DISPUTED' | 'REMOVED'

export interface VoteStats {
  total: number
  active: number
  disputed: number
  removed: number
  avgScores: {
    honesty: number
    commitment: number
    quality: number
    cooperation: number
    overall: number
  }
}

export interface IntegrityVoteWithUsers {
  id: string
  voterId: string
  targetId: string
  exchangeId: string | null
  honestyScore: number
  commitmentScore: number
  qualityScore: number
  cooperationScore: number
  overallScore: number
  comment: string | null
  isAnonymous: boolean
  status: string
  createdAt: Date
  updatedAt: Date
  voter: {
    id: string
    name: string
    email: string
    image: string | null
  }
  target: {
    id: string
    name: string
    email: string
    image: string | null
    integrityScore: number
  }
  exchange?: {
    id: string
    type: string
    timeAmount: number
  } | null
}
