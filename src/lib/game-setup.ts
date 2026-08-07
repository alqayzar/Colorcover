export const MIN_PLAYERS = 3
export const MAX_PLAYERS = 20

export function maxSpecialCount(players: number): number {
  return Math.max(0, Math.ceil(players / 2) - 1)
}

export function clampSpecialCounts(
  players: number,
  undercovers: number,
  mrWhites: number
): { undercovers: number; mrWhites: number } {
  const max = maxSpecialCount(players)
  let undercoversNext = Math.max(0, undercovers)
  let mrWhitesNext = Math.max(0, mrWhites)

  const overflow = undercoversNext + mrWhitesNext - max
  if (overflow > 0) {
    const reduceFromMrWhites = Math.min(mrWhitesNext, overflow)
    mrWhitesNext -= reduceFromMrWhites
    const remaining = overflow - reduceFromMrWhites
    undercoversNext -= Math.min(undercoversNext, remaining)
  }

  return { undercovers: undercoversNext, mrWhites: mrWhitesNext }
}
