import { playerTripResult } from '../types'
import type { Trip, Player } from '../types'

interface Props {
  trips: Trip[]
  players: Player[]
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function playerName(players: Player[], id: string): string {
  return players.find(p => p.id === id)?.name ?? 'Unknown'
}

function tripSummary(trip: Trip, players: Player[]): string {
  const max = Math.max(...trip.scores.map(s => s.score))
  const winners = trip.scores.filter(s => s.score === max)
  if (winners.length > 1) {
    return `Tie (${max} pts)`
  }
  return `${playerName(players, winners[0].playerId)} wins`
}

export default function TripHistory({ trips, players }: Props) {
  if (trips.length === 0) {
    return <div className="empty-history">No trips yet — head to the park! 🏰</div>
  }

  const sorted = [...trips].reverse()

  return (
    <div>
      <div className="section-title">Trip History</div>
      <div className="trip-list">
        {sorted.map(trip => {
          const max = Math.max(...trip.scores.map(s => s.score))
          const winners = trip.scores.filter(s => s.score === max)
          const isTie = winners.length > 1

          return (
            <div key={trip.id} className="trip-row">
              <div className="trip-row-top">
                <span className="trip-date">{formatDate(trip.date)}</span>
                <span className={`trip-badge ${isTie ? 'tie' : 'win'}`}>
                  {tripSummary(trip, players)}
                </span>
              </div>
              <div className="trip-scores-row">
                {trip.scores
                  .slice()
                  .sort((a, b) => b.score - a.score)
                  .map(s => {
                    const result = playerTripResult(trip, s.playerId)
                    return (
                      <span
                        key={s.playerId}
                        className={`trip-player-score ${result}`}
                      >
                        {playerName(players, s.playerId)}: {s.score}
                      </span>
                    )
                  })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
