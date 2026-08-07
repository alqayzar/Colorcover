import type { SpecialRoleId } from '@/lib/special-roles'

const STORAGE_KEY = 'colorcover:special-roles'

function readEnabledSpecialRoles(): SpecialRoleId[] | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed) || !parsed.every((id) => typeof id === 'string')) return null
    return parsed as SpecialRoleId[]
  } catch {
    return null
  }
}

function writeEnabledSpecialRoles(ids: readonly SpecialRoleId[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids))
  } catch {
    // Storage unavailable (private browsing, quota) — selection just won't persist.
  }
}

export { readEnabledSpecialRoles, writeEnabledSpecialRoles }
