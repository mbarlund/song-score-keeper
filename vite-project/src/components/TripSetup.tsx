import { useState } from 'react'
import type { Player } from '../types'

interface Props {
  players: Player[]
  onAddPlayer: (name: string) => void
  onStart: (selected: Player[]) => void
  onCancel: () => void
}

export default function TripSetup({ players, onAddPlayer, onStart, onCancel }: Props) {
  const [selected, setSelected] = useState<Set<string>>(
    () => new Set(players.slice(0, 2).map(p => p.id))
  )
  const [newName, setNewName] = useState('')

  function toggle(id: string) {
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function handleAddAndSelect() {
    const trimmed = newName.trim()
    if (!trimmed) return
    onAddPlayer(trimmed)
    setNewName('')
    // The new player will appear in `players` on next render; we can't get the id here
    // so we rely on the parent updating players and the user toggling manually.
    // Instead, we optimistically generate the same id logic — but we can't since
    // onAddPlayer generates the UUID internally. So just clear the field and let them tick.
  }

  const selectedPlayers = players.filter(p => selected.has(p.id))
  const canStart = selectedPlayers.length >= 2

  return (
    <>
      <header className="app-header">
        <h1>🏰 New Trip</h1>
        <div className="subtitle">Who's playing today?</div>
      </header>

      <div className="page">
        <div className="player-select-list">
          {players.map(p => (
            <label key={p.id} className={`player-select-item${selected.has(p.id) ? ' checked' : ''}`}>
              <input
                type="checkbox"
                checked={selected.has(p.id)}
                onChange={() => toggle(p.id)}
              />
              <span>{p.name}</span>
            </label>
          ))}
        </div>

        <div className="add-player-row" style={{ marginBottom: 24 }}>
          <input
            className="add-player-input"
            placeholder="Add new player…"
            value={newName}
            maxLength={20}
            onChange={e => setNewName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAddAndSelect()}
          />
          <button
            className="add-player-btn"
            onClick={handleAddAndSelect}
            disabled={!newName.trim()}
          >
            Add
          </button>
        </div>

        {!canStart && (
          <p className="setup-hint">Select at least 2 players to start.</p>
        )}

        <button className="btn-primary" onClick={() => onStart(selectedPlayers)} disabled={!canStart}>
          Start Trip ({selectedPlayers.length} players)
        </button>

        <button className="btn-cancel-trip" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </>
  )
}
