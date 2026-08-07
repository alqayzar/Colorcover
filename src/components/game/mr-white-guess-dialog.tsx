import * as React from 'react'

import { CartoonButton } from '@/components/home/cartoon-button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import type { GameColorEntry } from '@/lib/colors'
import type { SessionPlayer } from '@/lib/game-session'

interface MrWhiteGuessDialogProps {
  player: SessionPlayer | null
  colors: readonly GameColorEntry[]
  innocentColor: string | null
  onOpenChange: (open: boolean) => void
  onCorrectGuess: () => void
}

function MrWhiteGuessDialog(props: MrWhiteGuessDialogProps) {
  const { player, colors, innocentColor, onOpenChange, onCorrectGuess } = props
  const [guessedHex, setGuessedHex] = React.useState<string | null>(null)

  const isCorrect = guessedHex !== null && guessedHex === innocentColor

  return (
    <Dialog open={player !== null} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100%-0.75rem)] max-w-sm rounded-[2rem] border-4 border-game-ink p-4 shadow-[6px_6px_0_0_var(--color-game-ink)]">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-black text-game-ink">
            {guessedHex === null
              ? `${player?.name} devine la couleur`
              : isCorrect
                ? 'Bravo !'
                : 'Raté !'}
          </DialogTitle>
        </DialogHeader>

        {guessedHex === null ? (
          <div className="flex flex-wrap items-center justify-center gap-3">
            {colors.map((color) => (
              <button
                key={color.id}
                type="button"
                onClick={() => setGuessedHex(color.hex)}
                aria-label={color.name}
                title={color.name}
                style={{ backgroundColor: color.hex }}
                className="flex size-12 items-center justify-center rounded-full border-4 border-game-ink"
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-6 py-2">
            <div className="relative">
              <span
                aria-hidden="true"
                className="absolute inset-0 rounded-full bg-game-ink translate-x-1.5 translate-y-1.5"
              />
              <div
                className="relative size-24 rounded-full border-8 border-game-ink"
                style={{ backgroundColor: guessedHex }}
              />
            </div>
            <p className="text-center text-lg font-bold text-game-ink">
              {isCorrect
                ? 'Mr White a deviné la bonne couleur !'
                : "Ce n'était pas la bonne couleur."}
            </p>
            {isCorrect ? (
              <CartoonButton tone="green" className="h-12 text-lg" onClick={onCorrectGuess}>
                Voir les résultats
              </CartoonButton>
            ) : (
              <CartoonButton tone="blue" className="h-12 text-lg" onClick={() => onOpenChange(false)}>
                Continuer
              </CartoonButton>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

export { MrWhiteGuessDialog }
