import { useState } from 'react'
import type { AppState, Player } from './types'
import { loadState, saveState } from './storage'
import { computeAllStats } from './stats'
import Dashboard from './components/Dashboard'
import TripSetup from './components/TripSetup'
import ActiveTrip from './components/ActiveTrip'

type View = 'dashboard' | 'trip-setup'

export default function App() {
  const [state, setState] = useState<AppState>(loadState)
  const [view, setView] = useState<View>('dashboard')

  function mutate(updater: (prev: AppState) => AppState) {
    setState(prev => {
      const next = updater(prev)
      saveState(next)
      return next
    })
  }

  function addPlayer(name: string) {
    mutate(prev => ({
      ...prev,
      players: [...prev.players, { id: crypto.randomUUID(), name: name.trim() }],
    }))
  }

  function renamePlayer(id: string, name: string) {
    mutate(prev => ({
      ...prev,
      players: prev.players.map(p => p.id === id ? { ...p, name: name.trim() } : p),
    }))
  }

  function startTrip(selectedPlayers: Player[]) {
    const date = new Date().toLocaleDateString('en-CA')
    mutate(prev => ({
      ...prev,
      activeTrip: {
        id: crypto.randomUUID(),
        date,
        scores: selectedPlayers.map(p => ({ playerId: p.id, score: 0 })),
      },
    }))
    setView('dashboard')
  }

  function incrementScore(playerId: string) {
    mutate(prev => {
      if (!prev.activeTrip) return prev
      return {
        ...prev,
        activeTrip: {
          ...prev.activeTrip,
          scores: prev.activeTrip.scores.map(s =>
            s.playerId === playerId ? { ...s, score: s.score + 1 } : s
          ),
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

  // Active trip takes over the whole screen
  if (state.activeTrip) {
    const activePlayers = state.players.filter(p =>
      state.activeTrip!.scores.some(s => s.playerId === p.id)
    )
    return (
      <ActiveTrip
        trip={state.activeTrip}
        players={activePlayers}
        onIncrement={incrementScore}
        onEnd={endTrip}
        onCancel={cancelTrip}
      />
    )
  }

  if (view === 'trip-setup') {
    return (
      <TripSetup
        players={state.players}
        onAddPlayer={addPlayer}
        onStart={startTrip}
        onCancel={() => setView('dashboard')}
      />
    )
  }

  const allStats = computeAllStats(state.trips, state.players.map(p => p.id))

  return (
    <Dashboard
      players={state.players}
      trips={state.trips}
      allStats={allStats}
      onStartTrip={() => setView('trip-setup')}
      onAddPlayer={addPlayer}
      onRenamePlayer={renamePlayer}
    />
  )
}
