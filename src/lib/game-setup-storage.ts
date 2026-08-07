const STORAGE_KEY = 'colorcover:game-setup'

interface StoredGameSetup {
  players: number
  undercovers: number
  mrWhites: number
  allowMrWhiteFirst?: boolean
}

function readGameSetup(): StoredGameSetup | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (
      typeof parsed?.players !== 'number' ||
      typeof parsed?.undercovers !== 'number' ||
      typeof parsed?.mrWhites !== 'number' ||
      (parsed?.allowMrWhiteFirst !== undefined && typeof parsed.allowMrWhiteFirst !== 'boolean')
    ) {
      return null
    }
    return parsed
  } catch {
    return null
  }
}

function writeGameSetup(setup: StoredGameSetup) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(setup))
  } catch {
    // Storage unavailable (private browsing, quota) — setup just won't persist.
  }
}

export { readGameSetup, writeGameSetup }
export type { StoredGameSetup }
