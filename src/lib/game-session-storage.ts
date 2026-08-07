import type { GameSession } from '@/lib/game-session'

const STORAGE_KEY = 'colorcover:game-session'

function readGameSession(): GameSession | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (
      !Array.isArray(parsed?.players) ||
      typeof parsed?.currentIndex !== 'number' ||
      (parsed?.currentStep !== 'name' && parsed?.currentStep !== 'role') ||
      (parsed?.phase !== 'reveal' && parsed?.phase !== 'board' && parsed?.phase !== 'finished')
    ) {
      return null
    }
    return parsed
  } catch {
    return null
  }
}

function writeGameSession(session: GameSession) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session))
  } catch {
    // Storage unavailable (private browsing, quota) — session just won't persist.
  }
}

function clearGameSession() {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // Storage unavailable — nothing to clear.
  }
}

export { clearGameSession, readGameSession, writeGameSession }
