import { Navigate } from 'react-router-dom'

import { PlayerBoard } from '@/components/game/player-board'
import { RevealCard } from '@/components/game/reveal-card'
import { ResultsBoard } from '@/components/game/results-board'
import { useColorPalette } from '@/hooks/use-color-palette'
import { useGameSession } from '@/hooks/use-game-session'

function GameScreen() {
  const { session, currentPlayer, submitName, acknowledgeRole, eliminatePlayer, finishGame, quitGame } =
    useGameSession()
  const { colors } = useColorPalette()

  if (!session) {
    return <Navigate to="/" replace />
  }

  const enabledColors = colors.filter((color) => color.enabled)

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
        <ResultsBoard players={session.players} onQuit={quitGame} />
      )}
    </main>
  )
}

export { GameScreen }
