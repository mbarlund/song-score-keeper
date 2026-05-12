export interface Trip {
  id: string
  date: string // YYYY-MM-DD in local time
  myScore: number
  wifeScore: number
}

export type TripWinner = 'me' | 'wife' | 'tie'

export function tripWinner(trip: Trip): TripWinner {
  if (trip.myScore > trip.wifeScore) return 'me'
  if (trip.wifeScore > trip.myScore) return 'wife'
  return 'tie'
}

export interface PlayerNames {
  me: string
  wife: string
}

export interface AppState {
  trips: Trip[]
  activeTrip: Trip | null
  playerNames: PlayerNames
}

export interface Stats {
  totalWins: number
  totalLosses: number
  totalTies: number
  currentStreak: number
  longestStreak: number
}
