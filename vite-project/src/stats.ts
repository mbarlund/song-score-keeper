import { tripWinner } from './types'
import type { Trip, Stats } from './types'

export function computeStats(trips: Trip[]): Stats {
  let totalWins = 0
  let totalLosses = 0
  let totalTies = 0

  for (const trip of trips) {
    const w = tripWinner(trip)
    if (w === 'me') totalWins++
    else if (w === 'wife') totalLosses++
    else totalTies++
  }

  // Current streak: walk backwards from most recent trip
  let currentStreak = 0
  for (let i = trips.length - 1; i >= 0; i--) {
    if (tripWinner(trips[i]) === 'me') currentStreak++
    else break
  }

  // Longest streak: single forward pass
  let longestStreak = 0
  let runningStreak = 0
  for (const trip of trips) {
    if (tripWinner(trip) === 'me') {
      runningStreak++
      if (runningStreak > longestStreak) longestStreak = runningStreak
    } else {
      runningStreak = 0
    }
  }

  return { totalWins, totalLosses, totalTies, currentStreak, longestStreak }
}
