import { useState } from 'react'
import type { AppState } from './types'
import { loadState, saveState } from './storage'
import { computeStats } from './stats'
import Dashboard from './components/Dashboard'
import ActiveTrip from './components/ActiveTrip'

export default function App() {
  const [state, setState] = useState<AppState>(loadState)

  function mutate(updater: (prev: AppState) => AppState) {
    setState(prev => {
      const next = updater(prev)
      saveState(next)
      return next
    })
  }

  function startTrip() {
    const now = new Date()
    const date = now.toLocaleDateString('en-CA') // YYYY-MM-DD in local time
    mutate(prev => ({
      ...prev,
      activeTrip: {
        id: crypto.randomUUID(),
        date,
        myScore: 0,
        wifeScore: 0,
      },
    }))
  }

  function incrementScore(player: 'me' | 'wife') {
    mutate(prev => {
      if (!prev.activeTrip) return prev
      return {
        ...prev,
        activeTrip: {
          ...prev.activeTrip,
          myScore: player === 'me' ? prev.activeTrip.myScore + 1 : prev.activeTrip.myScore,
          wifeScore: player === 'wife' ? prev.activeTrip.wifeScore + 1 : prev.activeTrip.wifeScore,
        },
      }
    })
  }

  function endTrip() {
    mutate(prev => {
      if (!prev.activeTrip) return prev
      return {
        ...prev,
        trips: [...prev.trips, prev.activeTrip],
        activeTrip: null,
      }
    })
  }

  function cancelTrip() {
    mutate(prev => ({ ...prev, activeTrip: null }))
  }

  function updatePlayerNames(me: string, wife: string) {
    mutate(prev => ({ ...prev, playerNames: { me, wife } }))
  }

  const stats = computeStats(state.trips)

  if (state.activeTrip) {
    return (
      <ActiveTrip
        trip={state.activeTrip}
        playerNames={state.playerNames}
        onIncrement={incrementScore}
        onEnd={endTrip}
        onCancel={cancelTrip}
      />
    )
  }

  return (
    <Dashboard
      trips={state.trips}
      playerNames={state.playerNames}
      stats={stats}
      onStartTrip={startTrip}
      onUpdateNames={updatePlayerNames}
    />
  )
}
