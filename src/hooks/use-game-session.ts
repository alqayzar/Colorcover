import * as React from 'react'

import type { GameSession } from '@/lib/game-session'
import { clearGameSession, readGameSession, writeGameSession } from '@/lib/game-session-storage'

function useGameSession() {
  const [session, setSession] = React.useState<GameSession | null>(() => readGameSession())

  React.useEffect(() => {
    if (session) writeGameSession(session)
  }, [session])

  const currentPlayer =
    session && session.phase === 'reveal' ? session.players[session.currentIndex] : null

  function submitName(name: string) {
    const trimmed = name.trim()
    if (!trimmed) return
    setSession((prev) => {
      if (!prev) return prev
      const players = prev.players.map((player, index) =>
        index === prev.currentIndex ? { ...player, name: trimmed } : player
      )
      return { ...prev, players, currentStep: 'role' }
    })
  }

  function acknowledgeRole() {
    setSession((prev) => {
      if (!prev) return prev
      const isLast = prev.currentIndex >= prev.players.length - 1
      if (isLast) return { ...prev, phase: 'board' }
      return { ...prev, currentIndex: prev.currentIndex + 1, currentStep: 'name' }
    })
  }

  function eliminatePlayer(id: string) {
    setSession((prev) => {
      if (!prev) return prev
      const players = prev.players.map((player) =>
        player.id === id ? { ...player, eliminated: true } : player
      )
      return { ...prev, players }
    })
  }

  function finishGame() {
    setSession((prev) => (prev ? { ...prev, phase: 'finished' } : prev))
  }

  function quitGame() {
    clearGameSession()
    setSession(null)
  }

  return { session, currentPlayer, submitName, acknowledgeRole, eliminatePlayer, finishGame, quitGame }
}

export { useGameSession }
