import type { GameColorEntry } from '@/lib/colors'

const STORAGE_KEY = 'colorcover:colors'

function readColorPalette(): GameColorEntry[] | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return null
    const isValid = parsed.every(
      (entry) =>
        typeof entry?.id === 'string' &&
        typeof entry?.name === 'string' &&
        typeof entry?.hex === 'string' &&
        typeof entry?.isDefault === 'boolean' &&
        typeof entry?.enabled === 'boolean'
    )
    return isValid ? parsed : null
  } catch {
    return null
  }
}

function writeColorPalette(colors: GameColorEntry[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(colors))
  } catch {
    // Storage unavailable (private browsing, quota) — palette just won't persist.
  }
}

export { readColorPalette, writeColorPalette }
