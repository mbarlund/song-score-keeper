import { useState } from 'react'
import type { Player } from '../types'

interface Props {
  players: Player[]
  onAdd: (name: string) => void
  onRename: (id: string, name: string) => void
  onDelete: (id: string) => void
}

export default function PlayerManager({ players, onAdd, onRename, onDelete }: Props) {
  const [newName, setNewName] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editDraft, setEditDraft] = useState('')
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)

  function handleAdd() {
    const trimmed = newName.trim()
    if (!trimmed) return
    onAdd(trimmed)
    setNewName('')
  }

  function startEdit(p: Player) {
    setConfirmDeleteId(null)
    setEditingId(p.id)
    setEditDraft(p.name)
  }

  function commitEdit(id: string) {
    const trimmed = editDraft.trim()
    if (trimmed) onRename(id, trimmed)
    setEditingId(null)
  }

  function handleEditKey(e: React.KeyboardEvent, id: string) {
    if (e.key === 'Enter') commitEdit(id)
    if (e.key === 'Escape') setEditingId(null)
  }

  return (
    <div className="player-manager">
      <div className="section-title">Players</div>
      <ul className="player-list">
        {players.map(p => (
          <li key={p.id} className="player-list-item">
            {editingId === p.id ? (
              <input
                className="player-edit-input"
                value={editDraft}
                maxLength={20}
                autoFocus
                onChange={e => setEditDraft(e.target.value)}
                onBlur={() => commitEdit(p.id)}
                onKeyDown={e => handleEditKey(e, p.id)}
              />
            ) : confirmDeleteId === p.id ? (
              <div className="player-delete-confirm">
                <span>Delete {p.name}?</span>
                <div className="player-delete-actions">
                  <button className="btn-confirm-yes" onClick={() => { onDelete(p.id); setConfirmDeleteId(null) }}>
                    Delete
                  </button>
                  <button className="btn-confirm-no" onClick={() => setConfirmDeleteId(null)}>
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <span className="player-list-name">{p.name}</span>
                <div className="player-action-btns">
                  <button className="player-edit-btn" onClick={() => startEdit(p)} title="Rename">✏️</button>
                  <button className="player-delete-btn" onClick={() => setConfirmDeleteId(p.id)} title="Delete">🗑️</button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
      <div className="add-player-row">
        <input
          className="add-player-input"
          placeholder="Add player…"
          value={newName}
          maxLength={20}
          onChange={e => setNewName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleAdd()}
        />
        <button className="add-player-btn" onClick={handleAdd} disabled={!newName.trim()}>
          Add
        </button>
      </div>
    </div>
  )
}
