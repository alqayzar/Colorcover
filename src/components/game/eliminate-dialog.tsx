import { CartoonButton } from '@/components/home/cartoon-button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import type { SessionPlayer } from '@/lib/game-session'

interface EliminateDialogProps {
  player: SessionPlayer | null
  onOpenChange: (open: boolean) => void
  onConfirm: (id: string) => void
}

function EliminateDialog(props: EliminateDialogProps) {
  const { player, onOpenChange, onConfirm } = props

  function handleConfirm() {
    if (!player) return
    onConfirm(player.id)
  }

  return (
    <Dialog open={player !== null} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100%-0.75rem)] max-w-sm rounded-[2rem] border-4 border-game-ink p-4 shadow-[6px_6px_0_0_var(--color-game-ink)]">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-black text-game-ink">
            Éliminer {player?.name} ?
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-2">
          <CartoonButton tone="red" className="h-12 text-lg" onClick={handleConfirm}>
            Éliminer
          </CartoonButton>
          <CartoonButton tone="blue" className="h-12 text-lg" onClick={() => onOpenChange(false)}>
            Annuler
          </CartoonButton>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export { EliminateDialog }
