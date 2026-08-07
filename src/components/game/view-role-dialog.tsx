import { CartoonButton } from '@/components/home/cartoon-button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import type { SessionPlayer } from '@/lib/game-session'

interface ViewRoleDialogProps {
  player: SessionPlayer | null
  onOpenChange: (open: boolean) => void
}

function ViewRoleDialog(props: ViewRoleDialogProps) {
  const { player, onOpenChange } = props

  return (
    <Dialog open={player !== null} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100%-0.75rem)] max-w-sm rounded-[2rem] border-4 border-game-ink p-4 shadow-[6px_6px_0_0_var(--color-game-ink)]">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-black text-game-ink">
            {player?.name}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center gap-6 py-2">
          {player?.color ? (
            <div className="relative">
              <span
                aria-hidden="true"
                className="absolute inset-0 rounded-full bg-game-ink translate-x-1.5 translate-y-1.5"
              />
              <div
                className="relative size-32 rounded-full border-8 border-game-ink"
                style={{ backgroundColor: player.color }}
              />
            </div>
          ) : (
            <p className="comic-title font-logo px-2 text-center text-3xl font-bold text-white">
              Vous êtes Mr White
            </p>
          )}

          <CartoonButton tone="blue" className="h-12 text-lg" onClick={() => onOpenChange(false)}>
            Ok
          </CartoonButton>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export { ViewRoleDialog }
