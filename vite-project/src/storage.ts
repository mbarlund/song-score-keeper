import type { AppState, PlayerNames } from './types'

const STORAGE_KEY = 'disney-song-game-v1'

function defaultState(): AppState {
  return {
    trips: [],
    activeTrip: null,
    playerNames: { me: 'Me', wife: 'Wife' } satisfies PlayerNames,
  }
}

export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultState()
    return JSON.parse(raw) as AppState
  } catch {
    return defaultState()
  }
}

export function saveState(state: AppState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // localStorage unavailable (private browsing, quota exceeded) — silently skip
  }
}
