import * as React from 'react'

import { readColorPalette, writeColorPalette } from '@/lib/color-palette-storage'
import { createDefaultColors, MIN_ENABLED_COLORS, normalizeHex, type GameColorEntry } from '@/lib/colors'

function loadInitialColors(): GameColorEntry[] {
  return readColorPalette() ?? createDefaultColors()
}

function useColorPalette() {
  const [colors, setColors] = React.useState<GameColorEntry[]>(loadInitialColors)

  React.useEffect(() => {
    writeColorPalette(colors)
  }, [colors])

  const enabledCount = colors.filter((color) => color.enabled).length

  function canDisable(id: string): boolean {
    const color = colors.find((entry) => entry.id === id)
    if (!color || !color.enabled) return true
    return enabledCount > MIN_ENABLED_COLORS
  }

  function toggleColor(id: string) {
    setColors((prev) =>
      prev.map((color) => {
        if (color.id !== id) return color
        if (color.enabled && enabledCount <= MIN_ENABLED_COLORS) return color
        return { ...color, enabled: !color.enabled }
      })
    )
  }

  function addCustomColor(rawHex: string, name: string): { ok: true } | { ok: false; error: string } {
    const hex = normalizeHex(rawHex)
    if (!hex) return { ok: false, error: 'Couleur invalide' }
    if (colors.some((color) => color.hex === hex)) {
      return { ok: false, error: 'Cette couleur existe déjà' }
    }

    const trimmedName = name.trim()
    const newColor: GameColorEntry = {
      id: crypto.randomUUID(),
      name: trimmedName || hex.toUpperCase(),
      hex,
      isDefault: false,
      enabled: true,
    }
    setColors((prev) => [...prev, newColor])
    return { ok: true }
  }

  function removeCustomColor(id: string) {
    setColors((prev) => {
      const color = prev.find((entry) => entry.id === id)
      if (!color || color.isDefault) return prev
      if (color.enabled && enabledCount <= MIN_ENABLED_COLORS) return prev
      return prev.filter((entry) => entry.id !== id)
    })
  }

  function resetColors() {
    setColors(createDefaultColors())
  }

  return {
    colors,
    enabledCount,
    canDisable,
    toggleColor,
    addCustomColor,
    removeCustomColor,
    resetColors,
  }
}

export { useColorPalette }
