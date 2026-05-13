import type { ActiveTrip as ActiveTripType, Player } from '../types'

interface Props {
  trip: ActiveTripType
  players: Player[]
  onIncrement: (playerId: string) => void
  onDecrement: (playerId: string) => void
  onEnd: () => void
  onCancel: () => void
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

export default function ActiveTrip({ trip, players, onIncrement, onDecrement, onEnd, onCancel }: Props) {
  return (
    <>
      <header className="active-trip-header">
        <h2>🎵 Current Trip</h2>
        <div className="trip-date-label">{formatDate(trip.date)}</div>
      </header>

      <div className="scorers-grid" style={{ '--player-count': players.length } as React.CSSProperties}>
        {players.map(player => {
          const entry = trip.scores.find(s => s.playerId === player.id)
          const score = entry?.score ?? 0
          return (
            <div key={player.id} className="scorer">
              <div className="scorer-name">{player.name}</div>
              <div className="scorer-score">{score}</div>
              <button className="score-btn" onClick={() => onIncrement(player.id)}>
                +1
              </button>
              <button
                className="score-btn-minus"
                onClick={() => onDecrement(player.id)}
                disabled={score === 0}
              >
                −1
              </button>
            </div>
          )
        })}
      </div>

      <div className="trip-actions">
        <button className="btn-end-trip" onClick={onEnd}>
          End Trip ✓
        </button>
        <button className="btn-cancel-trip" onClick={onCancel}>
          Cancel trip (no score saved)
        </button>
      </div>
    </>
  )
}
