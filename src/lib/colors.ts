interface GameColorEntry {
  id: string
  name: string
  hex: string
  isDefault: boolean
  enabled: boolean
}

const DEFAULT_COLORS: readonly Omit<GameColorEntry, 'enabled'>[] = [
  { id: 'red', name: 'Rouge', hex: '#ff3b3f', isDefault: true },
  { id: 'blue', name: 'Bleu', hex: '#0ea5ff', isDefault: true },
  { id: 'yellow', name: 'Jaune', hex: '#ffd23f', isDefault: true },
  { id: 'green', name: 'Vert', hex: '#1fc463', isDefault: true },
  { id: 'purple', name: 'Violet', hex: '#8b2fff', isDefault: true },
  { id: 'pink', name: 'Rose', hex: '#ff4fa3', isDefault: true },
  { id: 'orange', name: 'Orange', hex: '#db8a3c', isDefault: true },
  { id: 'black', name: 'Noir', hex: '#000000', isDefault: true },
]

const MIN_ENABLED_COLORS = 2

const HEX_PATTERN = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i

function normalizeHex(value: string): string | null {
  const trimmed = value.trim()
  if (!HEX_PATTERN.test(trimmed)) return null
  if (trimmed.length === 4) {
    const [, r, g, b] = trimmed
    return `#${r}${r}${g}${g}${b}${b}`.toLowerCase()
  }
  return trimmed.toLowerCase()
}

function createDefaultColors(): GameColorEntry[] {
  return DEFAULT_COLORS.map((color) => ({ ...color, enabled: true }))
}

export { createDefaultColors, MIN_ENABLED_COLORS, normalizeHex }
export type { GameColorEntry }
