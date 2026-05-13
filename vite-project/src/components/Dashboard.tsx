import type { Trip, Player, PlayerStats } from '../types'
import Leaderboard from './Leaderboard'
import PlayerManager from './PlayerManager'
import TripHistory from './TripHistory'

interface Props {
  players: Player[]
  trips: Trip[]
  allStats: PlayerStats[]
  onStartTrip: () => void
  onAddPlayer: (name: string) => void
  onRenamePlayer: (id: string, name: string) => void
}

export default function Dashboard({ players, trips, allStats, onStartTrip, onAddPlayer, onRenamePlayer }: Props) {
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

        <PlayerManager players={players} onAdd={onAddPlayer} onRename={onRenamePlayer} />

        <div style={{ marginTop: 28 }}>
          <TripHistory trips={trips} players={players} />
        </div>
      </div>
    </>
  )
}
