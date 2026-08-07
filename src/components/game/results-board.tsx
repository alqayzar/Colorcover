import { CartoonButton } from '@/components/home/cartoon-button'
import { ROLE_LABELS, type SessionPlayer } from '@/lib/game-session'

interface ResultsBoardProps {
  players: SessionPlayer[]
  onQuit: () => void
}

function ResultsBoard(props: ResultsBoardProps) {
  const { players, onQuit } = props

  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-6">
      <h2 className="text-center text-2xl font-black text-game-ink">Résultats</h2>

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
            </div>
            <span className="truncate text-base font-black text-game-ink">{player.name}</span>
            <span className="text-xs font-black tracking-wide text-game-ink/60 uppercase">
              {ROLE_LABELS[player.role]}
            </span>
          </div>
        ))}
      </div>

      <CartoonButton tone="red" onClick={onQuit}>
        Quitter
      </CartoonButton>
    </div>
  )
}

export { ResultsBoard }
