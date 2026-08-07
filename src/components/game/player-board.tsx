import * as React from 'react'
import { Eye, Skull, X } from 'lucide-react'

import { EliminateDialog } from '@/components/game/eliminate-dialog'
import { MrWhiteGuessDialog } from '@/components/game/mr-white-guess-dialog'
import { ViewRoleDialog } from '@/components/game/view-role-dialog'
import { CartoonButton } from '@/components/home/cartoon-button'
import type { GameColorEntry } from '@/lib/colors'
import { getInnocentColor, ROLE_LABELS, type GameOutcome, type SessionPlayer } from '@/lib/game-session'
import { cn } from '@/lib/utils'

type SelectionMode = 'idle' | 'eliminate' | 'view-role'

interface PlayerBoardProps {
  players: SessionPlayer[]
  colors: readonly GameColorEntry[]
  onEliminate: (id: string) => void
  onFinish: (outcome: GameOutcome) => void
}

function PlayerBoard(props: PlayerBoardProps) {
  const { players, colors, onEliminate, onFinish } = props
  const [mode, setMode] = React.useState<SelectionMode>('idle')
  const [pendingEliminateId, setPendingEliminateId] = React.useState<string | null>(null)
  const [viewingRoleId, setViewingRoleId] = React.useState<string | null>(null)
  const [mrWhiteGuessId, setMrWhiteGuessId] = React.useState<string | null>(null)

  const pendingEliminatePlayer = players.find((player) => player.id === pendingEliminateId) ?? null
  const viewingRolePlayer = players.find((player) => player.id === viewingRoleId) ?? null
  const mrWhiteGuessPlayer = players.find((player) => player.id === mrWhiteGuessId) ?? null
  const innocentColor = getInnocentColor(players)

  function toggleMode(next: SelectionMode) {
    setMode((prev) => (prev === next ? 'idle' : next))
  }

  function handleCardClick(player: SessionPlayer) {
    if (player.eliminated) return
    if (mode === 'eliminate') setPendingEliminateId(player.id)
    else if (mode === 'view-role') setViewingRoleId(player.id)
  }

  function handleConfirmEliminate(id: string) {
    const eliminatedPlayer = pendingEliminatePlayer
    const isFirstElimination = players.every((player) => !player.eliminated)
    onEliminate(id)
    setPendingEliminateId(null)
    setMode('idle')
    if (eliminatedPlayer?.role === 'mrwhite') {
      setMrWhiteGuessId(eliminatedPlayer.id)
    } else if (eliminatedPlayer?.role === 'fou' && isFirstElimination) {
      onFinish({ reason: '🤡 Le Fou a gagné !', winner: 'fou', playerId: eliminatedPlayer.id })
    }
  }

  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-8">
      <div className="grid w-full max-h-[60vh] grid-cols-2 gap-4 overflow-y-auto overscroll-contain p-2">
        {players.map((player) => (
          <button
            key={player.id}
            type="button"
            disabled={player.eliminated || mode === 'idle'}
            onClick={() => handleCardClick(player)}
            className={cn(
              'relative flex flex-col items-center justify-center gap-1 rounded-3xl border-4 border-game-ink bg-white px-4 py-4 text-center text-lg font-black text-game-ink',
              player.eliminated && 'opacity-60'
            )}
          >
            {!player.eliminated && mode === 'eliminate' && (
              <span
                aria-hidden="true"
                className="absolute -top-2 -right-2 flex size-7 items-center justify-center rounded-full border-4 border-game-ink bg-game-red text-white"
              >
                <X className="size-3.5" strokeWidth={3.5} />
              </span>
            )}
            {!player.eliminated && mode === 'view-role' && (
              <span
                aria-hidden="true"
                className="absolute -top-2 -right-2 flex size-7 items-center justify-center rounded-full border-4 border-game-ink bg-game-blue text-white"
              >
                <Eye className="size-3.5" strokeWidth={3} />
              </span>
            )}
            <span className="flex max-w-full items-center gap-2">
              {player.eliminated && <Skull className="size-5 shrink-0" strokeWidth={2.5} />}
              <span className={cn('truncate', player.eliminated && 'line-through')}>{player.name}</span>
            </span>
            {player.eliminated && (
              <span className="text-xs font-black tracking-wide text-game-red uppercase">
                {ROLE_LABELS[player.role]}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="flex w-full flex-col gap-3">
        <CartoonButton tone="purple" onClick={() => toggleMode('eliminate')}>
          Éliminer
        </CartoonButton>
        <CartoonButton tone="blue" onClick={() => toggleMode('view-role')}>
          Voir rôle
        </CartoonButton>
        <CartoonButton
          tone="red"
          onClick={() => onFinish({ reason: 'Manche terminée', winner: 'none' })}
        >
          Quitter
        </CartoonButton>
      </div>

      <EliminateDialog
        player={pendingEliminatePlayer}
        onOpenChange={(open) => {
          if (!open) setPendingEliminateId(null)
        }}
        onConfirm={handleConfirmEliminate}
      />

      <ViewRoleDialog
        player={viewingRolePlayer}
        onOpenChange={(open) => {
          if (!open) setViewingRoleId(null)
        }}
      />

      <MrWhiteGuessDialog
        key={mrWhiteGuessPlayer?.id}
        player={mrWhiteGuessPlayer}
        colors={colors}
        innocentColor={innocentColor}
        onOpenChange={(open) => {
          if (!open) setMrWhiteGuessId(null)
        }}
        onCorrectGuess={() => {
          if (mrWhiteGuessPlayer) {
            onFinish({
              reason: '👻 Mr White a deviné juste !',
              winner: 'mrwhite',
              playerId: mrWhiteGuessPlayer.id,
            })
          }
          setMrWhiteGuessId(null)
        }}
      />
    </div>
  )
}

export { PlayerBoard }
