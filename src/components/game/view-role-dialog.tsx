import { RoleReveal } from '@/components/game/role-reveal'
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
          {player && <RoleReveal player={player} compact />}

          <CartoonButton tone="blue" className="h-12 text-lg" onClick={() => onOpenChange(false)}>
            Ok
          </CartoonButton>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export { ViewRoleDialog }
