import { Check } from 'lucide-react'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useSpecialRoles } from '@/hooks/use-special-roles'
import { cn } from '@/lib/utils'

interface RolesDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

function RolesDialog(props: RolesDialogProps) {
  const { open, onOpenChange } = props
  const { roles, isEnabled, toggleRole } = useSpecialRoles()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100%-0.75rem)] max-w-sm rounded-[2rem] border-4 border-game-ink p-4 shadow-[6px_6px_0_0_var(--color-game-ink)]">
        <DialogHeader>
          <DialogTitle className="text-center text-3xl font-black text-game-ink">Rôles</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-3">
          {roles.map((role) => {
            const enabled = isEnabled(role.id)
            return (
              <button
                key={role.id}
                type="button"
                onClick={() => toggleRole(role.id)}
                className={cn(
                  'flex w-full items-center gap-3 rounded-3xl border-4 border-game-ink bg-white px-4 py-3 text-left transition-opacity',
                  !enabled && 'opacity-50'
                )}
              >
                <span className="text-3xl">{role.emoji}</span>
                <span className="min-w-0 flex-1">
                  <span className="block text-lg font-black text-game-ink">{role.name}</span>
                  <span className="block text-xs font-bold text-game-ink/60">{role.description}</span>
                </span>
                <span
                  className={cn(
                    'flex size-8 shrink-0 items-center justify-center rounded-full border-4 border-game-ink',
                    enabled ? 'bg-game-green text-white' : 'bg-white text-transparent'
                  )}
                >
                  <Check className="size-4" strokeWidth={4} />
                </span>
              </button>
            )
          })}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export { RolesDialog }
