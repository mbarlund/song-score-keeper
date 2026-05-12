import { tripWinner } from '../types'
import type { Trip, PlayerNames } from '../types'

interface Props {
  trips: Trip[]
  playerNames: PlayerNames
}

function formatDate(dateStr: string): string {
  // Parse as local time by appending T00:00:00 to avoid UTC offset shifting the date
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function TripHistory({ trips, playerNames }: Props) {
  if (trips.length === 0) {
    return (
      <div className="empty-history">
        No trips yet — head to the park! 🏰
      </div>
    )
  }

  const sorted = [...trips].reverse()

  return (
    <div>
      <div className="section-title">Trip History</div>
      <div className="trip-list">
        {sorted.map(trip => {
          const winner = tripWinner(trip)
          return (
            <div key={trip.id} className="trip-row">
              <span className="trip-date">{formatDate(trip.date)}</span>
              <span className="trip-score">
                {trip.myScore} – {trip.wifeScore}
              </span>
              <span className={`trip-badge ${winner === 'me' ? 'win' : winner === 'wife' ? 'loss' : 'tie'}`}>
                {winner === 'me'
                  ? `${playerNames.me} wins`
                  : winner === 'wife'
                  ? `${playerNames.wife} wins`
                  : 'Tie'}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
