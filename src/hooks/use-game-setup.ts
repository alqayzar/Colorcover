import * as React from 'react'

import {
  clampSpecialCounts,
  MAX_PLAYERS,
  maxSpecialCount,
  MIN_PLAYERS,
} from '@/lib/game-setup'
import { readGameSetup, writeGameSetup } from '@/lib/game-setup-storage'

const DEFAULT_PLAYERS = 6
const DEFAULT_UNDERCOVERS = 1
const DEFAULT_MR_WHITES = 1
const DEFAULT_ALLOW_MR_WHITE_FIRST = false

interface GameSetupState {
  players: number
  undercovers: number
  mrWhites: number
  allowMrWhiteFirst: boolean
}

function loadInitialState(): GameSetupState {
  const stored = readGameSetup()
  const players = Math.min(MAX_PLAYERS, Math.max(MIN_PLAYERS, stored?.players ?? DEFAULT_PLAYERS))
  const clamped = clampSpecialCounts(
    players,
    stored?.undercovers ?? DEFAULT_UNDERCOVERS,
    stored?.mrWhites ?? DEFAULT_MR_WHITES
  )
  return {
    players,
    ...clamped,
    allowMrWhiteFirst: stored?.allowMrWhiteFirst ?? DEFAULT_ALLOW_MR_WHITE_FIRST,
  }
}

function useGameSetup() {
  const [state, setState] = React.useState<GameSetupState>(loadInitialState)

  React.useEffect(() => {
    writeGameSetup(state)
  }, [state])

  const maxSpecial = maxSpecialCount(state.players)

  function setPlayers(next: number) {
    const players = Math.min(MAX_PLAYERS, Math.max(MIN_PLAYERS, next))
    const clamped = clampSpecialCounts(players, state.undercovers, state.mrWhites)
    setState((prev) => ({ ...prev, players, ...clamped }))
  }

  function setUndercovers(next: number) {
    const max = Math.max(0, maxSpecial - state.mrWhites)
    setState((prev) => ({ ...prev, undercovers: Math.min(max, Math.max(0, next)) }))
  }

  function setMrWhites(next: number) {
    const max = Math.max(0, maxSpecial - state.undercovers)
    setState((prev) => ({ ...prev, mrWhites: Math.min(max, Math.max(0, next)) }))
  }

  function setAllowMrWhiteFirst(next: boolean) {
    setState((prev) => ({ ...prev, allowMrWhiteFirst: next }))
  }

  return {
    players: state.players,
    undercovers: state.undercovers,
    mrWhites: state.mrWhites,
    allowMrWhiteFirst: state.allowMrWhiteFirst,
    maxSpecial,
    minPlayers: MIN_PLAYERS,
    maxPlayers: MAX_PLAYERS,
    setPlayers,
    setUndercovers,
    setMrWhites,
    setAllowMrWhiteFirst,
    canIncrementPlayers: state.players < MAX_PLAYERS,
    canDecrementPlayers: state.players > MIN_PLAYERS,
    canIncrementUndercovers: state.undercovers + state.mrWhites < maxSpecial,
    canDecrementUndercovers: state.undercovers > 0,
    canIncrementMrWhites: state.undercovers + state.mrWhites < maxSpecial,
    canDecrementMrWhites: state.mrWhites > 0,
  }
}

export { useGameSetup }
