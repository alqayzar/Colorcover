import { Navigate } from 'react-router-dom'

import { PlayerBoard } from '@/components/game/player-board'
import { RevealCard } from '@/components/game/reveal-card'
import { ResultsBoard } from '@/components/game/results-board'
import { useColorPalette } from '@/hooks/use-color-palette'
import { useGameSession } from '@/hooks/use-game-session'
import { useGameSetup } from '@/hooks/use-game-setup'
import { useSpecialRoles } from '@/hooks/use-special-roles'
import { createGameSession } from '@/lib/game-session'

function GameScreen() {
  const {
    session,
    currentPlayer,
    submitName,
    acknowledgeRole,
    eliminatePlayer,
    finishGame,
    quitGame,
    startSession,
  } = useGameSession()
  const { colors } = useColorPalette()
  const setup = useGameSetup()
  const { enabledIds: enabledSpecialRoleIds } = useSpecialRoles()

  if (!session) {
    return <Navigate to="/" replace />
  }

  const currentSession = session
  const enabledColors = colors.filter((color) => color.enabled)

  function handleReplay() {
    const previousNames = currentSession.players.map((player) => player.name)
    startSession(
      createGameSession({
        players: setup.players,
        undercovers: setup.undercovers,
        mrWhites: setup.mrWhites,
        enabledColorHexes: enabledColors.map((color) => color.hex),
        enabledSpecialRoleIds,
        previousNames,
        allowMrWhiteFirst: setup.allowMrWhiteFirst,
      })
    )
  }

  return (
    <main className="bg-grid flex min-h-svh flex-col items-center justify-center gap-8 bg-white p-6">
      {session.phase === 'reveal' && currentPlayer ? (
        <RevealCard
          key={session.currentIndex}
          player={currentPlayer}
          index={session.currentIndex}
          total={session.players.length}
          step={session.currentStep}
          onSubmitName={submitName}
          onAcknowledge={acknowledgeRole}
          onCancel={quitGame}
        />
      ) : session.phase === 'board' ? (
        <PlayerBoard
          players={session.players}
          colors={enabledColors}
          onEliminate={eliminatePlayer}
          onFinish={finishGame}
        />
      ) : (
        <ResultsBoard
          players={session.players}
          outcome={session.outcome}
          onReplay={handleReplay}
          onQuit={quitGame}
        />
      )}
    </main>
  )
}

export { GameScreen }
