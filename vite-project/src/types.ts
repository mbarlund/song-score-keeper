export interface Player {
  id: string
  name: string
}

export interface TripScore {
  playerId: string
  score: number
}

export interface Trip {
  id: string
  date: string       // YYYY-MM-DD local time
  scores: TripScore[]
}

export interface ActiveTrip {
  id: string
  date: string
  scores: TripScore[] // one entry per selected player, score starts at 0
}

export interface AppState {
  players: Player[]
  trips: Trip[]
  activeTrip: ActiveTrip | null
}

export type TripResult = 'win' | 'tie' | 'loss'

// Returns the result for a specific player in a completed trip.
// win  = sole highest scorer
// tie  = tied for highest score with at least one other player
// loss = not the highest scorer
export function playerTripResult(trip: Trip, playerId: string): TripResult {
  const entry = trip.scores.find(s => s.playerId === playerId)
  if (!entry) return 'loss'
  const max = Math.max(...trip.scores.map(s => s.score))
  if (entry.score < max) return 'loss'
  const atMax = trip.scores.filter(s => s.score === max)
  return atMax.length === 1 ? 'win' : 'tie'
}

export interface PlayerStats {
  playerId: string
  wins: number
  losses: number
  ties: number
  currentStreak: number
  longestStreak: number
}
