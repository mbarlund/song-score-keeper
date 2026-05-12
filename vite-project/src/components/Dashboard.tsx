import type { Trip, PlayerNames, Stats } from '../types'
import StatsCards from './StatsCards'
import TripHistory from './TripHistory'
import PlayerNameEditor from './PlayerNameEditor'

interface Props {
  trips: Trip[]
  playerNames: PlayerNames
  stats: Stats
  onStartTrip: () => void
  onUpdateNames: (me: string, wife: string) => void
}

export default function Dashboard({ trips, playerNames, stats, onStartTrip, onUpdateNames }: Props) {
  return (
    <>
      <header className="app-header">
        <h1>🎵 Disney Song Game</h1>
        <div className="subtitle">Who knows their Disney best?</div>
      </header>

      <div className="page">
        <PlayerNameEditor playerNames={playerNames} onSave={onUpdateNames} />

        <StatsCards stats={stats} myName={playerNames.me} />

        <button className="btn-primary" onClick={onStartTrip}>
          🏰 Start New Trip
        </button>

        <TripHistory trips={trips} playerNames={playerNames} />
      </div>
    </>
  )
}
