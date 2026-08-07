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

interface GameSetupState {
  players: number
  undercovers: number
  mrWhites: number
}

function loadInitialState(): GameSetupState {
  const stored = readGameSetup()
  const players = Math.min(MAX_PLAYERS, Math.max(MIN_PLAYERS, stored?.players ?? DEFAULT_PLAYERS))
  const clamped = clampSpecialCounts(
    players,
    stored?.undercovers ?? DEFAULT_UNDERCOVERS,
    stored?.mrWhites ?? DEFAULT_MR_WHITES
  )
  return { players, ...clamped }
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
    setState({ players, ...clamped })
  }

  function setUndercovers(next: number) {
    const max = Math.max(0, maxSpecial - state.mrWhites)
    setState((prev) => ({ ...prev, undercovers: Math.min(max, Math.max(0, next)) }))
  }

  function setMrWhites(next: number) {
    const max = Math.max(0, maxSpecial - state.undercovers)
    setState((prev) => ({ ...prev, mrWhites: Math.min(max, Math.max(0, next)) }))
  }

  return {
    players: state.players,
    undercovers: state.undercovers,
    mrWhites: state.mrWhites,
    maxSpecial,
    minPlayers: MIN_PLAYERS,
    maxPlayers: MAX_PLAYERS,
    setPlayers,
    setUndercovers,
    setMrWhites,
    canIncrementPlayers: state.players < MAX_PLAYERS,
    canDecrementPlayers: state.players > MIN_PLAYERS,
    canIncrementUndercovers: state.undercovers + state.mrWhites < maxSpecial,
    canDecrementUndercovers: state.undercovers > 0,
    canIncrementMrWhites: state.undercovers + state.mrWhites < maxSpecial,
    canDecrementMrWhites: state.mrWhites > 0,
  }
}

export { useGameSetup }
