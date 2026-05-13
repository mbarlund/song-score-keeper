import type { AppState, Trip } from './types'

const KEY = 'disney-song-game-v2'
const OLD_KEY = 'disney-song-game-v1'

function defaultState(): AppState {
  return {
    players: [
      { id: 'player-me', name: 'Me' },
      { id: 'player-wife', name: 'Wife' },
    ],
    deletedPlayers: [],
    trips: [],
    activeTrip: null,
  }
}

// Migrate v1 data (myScore/wifeScore) into the new multi-player format.
function migrateV1(): AppState | null {
  try {
    const raw = localStorage.getItem(OLD_KEY)
    if (!raw) return null
    const old = JSON.parse(raw) as {
      trips?: Array<{ id: string; date: string; myScore: number; wifeScore: number }>
      playerNames?: { me: string; wife: string }
    }
    const meId = 'player-me'
    const wifeId = 'player-wife'
    const meName = old.playerNames?.me ?? 'Me'
    const wifeName = old.playerNames?.wife ?? 'Wife'
    const trips: Trip[] = (old.trips ?? []).map(t => ({
      id: t.id,
      date: t.date,
      scores: [
        { playerId: meId, score: t.myScore },
        { playerId: wifeId, score: t.wifeScore },
      ],
    }))
    return {
      players: [
        { id: meId, name: meName },
        { id: wifeId, name: wifeName },
      ],
      deletedPlayers: [],
      trips,
      activeTrip: null,
    }
  } catch {
    return null
  }
}

export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<AppState> & Omit<AppState, 'deletedPlayers'>
      // Backfill deletedPlayers for existing saves that predate this field
      return { deletedPlayers: [], ...parsed } as AppState
    }
    // Try migrating from v1
    const migrated = migrateV1()
    if (migrated) {
      saveState(migrated)
      return migrated
    }
  } catch {
    // fall through to default
  }
  return defaultState()
}

export function saveState(state: AppState): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(state))
  } catch {
    // localStorage unavailable — silently skip
  }
}
