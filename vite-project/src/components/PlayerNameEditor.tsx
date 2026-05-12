import { useState } from 'react'
import type { PlayerNames } from '../types'

interface Props {
  playerNames: PlayerNames
  onSave: (me: string, wife: string) => void
}

type Editing = 'me' | 'wife' | null

export default function PlayerNameEditor({ playerNames, onSave }: Props) {
  const [editing, setEditing] = useState<Editing>(null)
  const [draft, setDraft] = useState('')

  function startEdit(player: 'me' | 'wife') {
    setEditing(player)
    setDraft(playerNames[player])
  }

  function commit(player: 'me' | 'wife') {
    const trimmed = draft.trim()
    if (trimmed) {
      const next = { ...playerNames, [player]: trimmed }
      onSave(next.me, next.wife)
    }
    setEditing(null)
  }

  function handleKeyDown(e: React.KeyboardEvent, player: 'me' | 'wife') {
    if (e.key === 'Enter') commit(player)
    if (e.key === 'Escape') setEditing(null)
  }

  return (
    <div className="player-names">
      {editing === 'me' ? (
        <input
          className="name-input"
          value={draft}
          maxLength={20}
          autoFocus
          onChange={e => setDraft(e.target.value)}
          onBlur={() => commit('me')}
          onKeyDown={e => handleKeyDown(e, 'me')}
        />
      ) : (
        <button className="name-btn" onClick={() => startEdit('me')}>
          {playerNames.me} ✏️
        </button>
      )}

      <span className="vs">vs</span>

      {editing === 'wife' ? (
        <input
          className="name-input"
          value={draft}
          maxLength={20}
          autoFocus
          onChange={e => setDraft(e.target.value)}
          onBlur={() => commit('wife')}
          onKeyDown={e => handleKeyDown(e, 'wife')}
        />
      ) : (
        <button className="name-btn" onClick={() => startEdit('wife')}>
          {playerNames.wife} ✏️
        </button>
      )}
    </div>
  )
}
