import type { SessionPlayer } from '@/lib/game-session'
import { cn } from '@/lib/utils'

interface RoleRevealProps {
  player: SessionPlayer
  compact?: boolean
}

function RoleReveal(props: RoleRevealProps) {
  const { player, compact = false } = props

  if (!player.color) {
    return (
      <p className="comic-title font-logo px-2 text-center text-3xl font-bold text-white">
        Vous êtes Mr White
      </p>
    )
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative">
        <span
          aria-hidden="true"
          className="absolute inset-0 rounded-full bg-game-ink translate-x-1.5 translate-y-1.5"
        />
        <div
          className={cn(
            'relative rounded-full border-8 border-game-ink',
            compact ? 'size-32' : 'size-36'
          )}
          style={{ backgroundColor: player.color }}
        />
      </div>

      {player.role === 'fou' && (
        <p className="text-center text-lg font-black text-game-ink">
          🤡 Tu es Le Fou
          <br />
          <span className="text-sm font-bold text-game-ink/60">
            Tu gagnes si tu es éliminé en premier
          </span>
        </p>
      )}
    </div>
  )
}

export { RoleReveal }
