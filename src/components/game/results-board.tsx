import { Repeat } from 'lucide-react'

import { CartoonButton } from '@/components/home/cartoon-button'
import { getWinnerIds, ROLE_LABELS, type GameOutcome, type SessionPlayer } from '@/lib/game-session'

interface ResultsBoardProps {
  players: SessionPlayer[]
  outcome?: GameOutcome
  onReplay: () => void
  onQuit: () => void
}

function ResultsBoard(props: ResultsBoardProps) {
  const { players, outcome, onReplay, onQuit } = props
  const winnerIds = getWinnerIds(outcome, players)

  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-6">
      <h2 className="text-center text-2xl font-black text-game-ink">{outcome?.reason ?? 'Résultats'}</h2>

      <div className="grid w-full max-h-[60vh] grid-cols-2 gap-4 overflow-y-auto overscroll-contain p-1">
        {players.map((player) => (
          <div
            key={player.id}
            className="flex flex-col items-center gap-2 rounded-3xl border-4 border-game-ink bg-white px-4 py-4 text-center"
          >
            <div className="relative">
              <span
                aria-hidden="true"
                className="absolute inset-0 rounded-full bg-game-ink translate-x-1 translate-y-1"
              />
              {player.color ? (
                <div
                  className="relative size-10 rounded-full border-4 border-game-ink"
                  style={{ backgroundColor: player.color }}
                />
              ) : (
                <div className="relative flex size-10 items-center justify-center rounded-full border-4 border-game-ink bg-white text-lg font-black text-game-ink">
                  ?
                </div>
              )}
              {winnerIds.has(player.id) && (
                <span
                  aria-hidden="true"
                  className="absolute -top-6 -right-5 rotate-30 text-4xl"
                >
                  👑
                </span>
              )}
            </div>
            <span className="truncate text-base font-black text-game-ink">{player.name}</span>
            <span className="text-xs font-black tracking-wide text-game-ink/60 uppercase">
              {ROLE_LABELS[player.role]}
            </span>
          </div>
        ))}
      </div>

      <CartoonButton tone="green" onClick={onReplay}>
        <Repeat className="size-5" strokeWidth={3} />
        Rejouer
      </CartoonButton>
      <CartoonButton tone="red" onClick={onQuit}>
        Quitter
      </CartoonButton>
    </div>
  )
}

export { ResultsBoard }
