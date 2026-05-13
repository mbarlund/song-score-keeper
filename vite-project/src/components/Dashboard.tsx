import { useState } from 'react'
import type { Trip, Player, PlayerStats } from '../types'
import Leaderboard from './Leaderboard'
import PlayerManager from './PlayerManager'
import TripHistory from './TripHistory'

interface Props {
  players: Player[]
  deletedPlayers: Player[]
  trips: Trip[]
  allStats: PlayerStats[]
  onStartTrip: () => void
  onAddPlayer: (name: string) => void
  onRenamePlayer: (id: string, name: string) => void
  onDeletePlayer: (id: string) => void
  onClearHistory: () => void
}

export default function Dashboard({ players, deletedPlayers, trips, allStats, onStartTrip, onAddPlayer, onRenamePlayer, onDeletePlayer, onClearHistory }: Props) {
  const [confirming, setConfirming] = useState(false)

  function handleClear() {
    onClearHistory()
    setConfirming(false)
  }

  return (
    <>
      <header className="app-header">
        <h1>🎵 Disney Song Game</h1>
        <div className="subtitle">Who knows their Disney best?</div>
      </header>

      <div className="page">
        <Leaderboard players={players} allStats={allStats} />

        <button className="btn-primary" onClick={onStartTrip} style={{ marginTop: 24 }}>
          🏰 Start New Trip
        </button>

        <PlayerManager players={players} onAdd={onAddPlayer} onRename={onRenamePlayer} onDelete={onDeletePlayer} />

        <div style={{ marginTop: 28 }}>
          <TripHistory trips={trips} players={players} deletedPlayers={deletedPlayers} />
        </div>

        {trips.length > 0 && (
          <div className="clear-history-section">
            {confirming ? (
              <div className="confirm-clear">
                <span>Clear all trip history?</span>
                <div className="confirm-clear-actions">
                  <button className="btn-confirm-yes" onClick={handleClear}>Yes, clear it</button>
                  <button className="btn-confirm-no" onClick={() => setConfirming(false)}>Cancel</button>
                </div>
              </div>
            ) : (
              <button className="btn-clear-history" onClick={() => setConfirming(true)}>
                Clear History
              </button>
            )}
          </div>
        )}
      </div>
    </>
  )
}
