import { playerTripResult } from './types'
import type { Trip, PlayerStats } from './types'

export function computePlayerStats(trips: Trip[], playerId: string): PlayerStats {
  let wins = 0, losses = 0, ties = 0

  for (const trip of trips) {
    // Only count trips the player participated in
    if (!trip.scores.some(s => s.playerId === playerId)) continue
    const result = playerTripResult(trip, playerId)
    if (result === 'win') wins++
    else if (result === 'loss') losses++
    else ties++
  }

  // Current streak: consecutive wins walking backwards (tie or loss breaks it)
  let currentStreak = 0
  for (let i = trips.length - 1; i >= 0; i--) {
    if (!trips[i].scores.some(s => s.playerId === playerId)) continue
    if (playerTripResult(trips[i], playerId) === 'win') currentStreak++
    else break
  }

  // Longest streak: single forward pass over trips the player participated in
  let longestStreak = 0, runningStreak = 0
  for (const trip of trips) {
    if (!trip.scores.some(s => s.playerId === playerId)) continue
    if (playerTripResult(trip, playerId) === 'win') {
      runningStreak++
      if (runningStreak > longestStreak) longestStreak = runningStreak
    } else {
      runningStreak = 0
    }
  }

  return { playerId, wins, losses, ties, currentStreak, longestStreak }
}

export function computeAllStats(trips: Trip[], playerIds: string[]): PlayerStats[] {
  return playerIds.map(id => computePlayerStats(trips, id))
}
