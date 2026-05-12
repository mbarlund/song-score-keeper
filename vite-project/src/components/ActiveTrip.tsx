import type { Trip, PlayerNames } from '../types'

interface Props {
  trip: Trip
  playerNames: PlayerNames
  onIncrement: (player: 'me' | 'wife') => void
  onEnd: () => void
  onCancel: () => void
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

export default function ActiveTrip({ trip, playerNames, onIncrement, onEnd, onCancel }: Props) {
  return (
    <>
      <header className="active-trip-header">
        <h2>🎵 Current Trip</h2>
        <div className="trip-date-label">{formatDate(trip.date)}</div>
      </header>

      <div className="scorers">
        <div className="scorer">
          <div className="scorer-name">{playerNames.me}</div>
          <div className="scorer-score">{trip.myScore}</div>
          <button className="score-btn" onClick={() => onIncrement('me')}>
            +1
          </button>
        </div>

        <div className="scorer">
          <div className="scorer-name">{playerNames.wife}</div>
          <div className="scorer-score">{trip.wifeScore}</div>
          <button className="score-btn" onClick={() => onIncrement('wife')}>
            +1
          </button>
        </div>
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
