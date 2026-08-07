import * as React from 'react'
import { Check, Plus, RotateCcw, X } from 'lucide-react'

import { CartoonButton } from '@/components/home/cartoon-button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useColorPalette } from '@/hooks/use-color-palette'
import { cn } from '@/lib/utils'

const HEX_INPUT_PATTERN = /^#[0-9a-f]{6}$/i

interface ColorPickerDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

function ColorPickerDialog(props: ColorPickerDialogProps) {
  const { open, onOpenChange } = props
  const { colors, canDisable, toggleColor, addCustomColor, removeCustomColor, resetColors } =
    useColorPalette()
  const [hexInput, setHexInput] = React.useState('#8b2fff')
  const [nameInput, setNameInput] = React.useState('')
  const [error, setError] = React.useState<string | null>(null)

  function handleAdd() {
    const result = addCustomColor(hexInput, nameInput)
    if (!result.ok) {
      setError(result.error)
      return
    }
    setError(null)
    setNameInput('')
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100%-0.75rem)] max-w-sm rounded-[2rem] border-4 border-game-ink p-4 shadow-[6px_6px_0_0_var(--color-game-ink)]">
        <DialogHeader>
          <DialogTitle className="text-center text-3xl font-black text-game-ink">
            Couleurs
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-wrap items-center justify-center gap-3">
          {colors.map((color) => {
            const locked = color.enabled && !canDisable(color.id)
            return (
              <div key={color.id} className="relative">
                <button
                  type="button"
                  onClick={() => toggleColor(color.id)}
                  disabled={locked}
                  aria-pressed={color.enabled}
                  aria-label={color.name}
                  title={color.name}
                  style={{ backgroundColor: color.hex }}
                  className={cn(
                    'flex size-12 items-center justify-center rounded-full border-4 border-game-ink transition-opacity',
                    !color.enabled && 'opacity-35',
                    locked && 'cursor-not-allowed'
                  )}
                >
                  {color.enabled && (
                    <Check
                      className="size-5 text-white"
                      strokeWidth={4}
                      style={{ filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.5))' }}
                    />
                  )}
                </button>
                {!color.isDefault && (
                  <button
                    type="button"
                    onClick={() => removeCustomColor(color.id)}
                    aria-label={`Supprimer ${color.name}`}
                    className="absolute -top-1 -right-1 flex size-5 items-center justify-center rounded-full border-2 border-game-ink bg-white text-game-ink"
                  >
                    <X className="size-3" strokeWidth={3} />
                  </button>
                )}
              </div>
            )
          })}
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={HEX_INPUT_PATTERN.test(hexInput) ? hexInput : '#000000'}
              onChange={(event) => {
                setHexInput(event.target.value)
                setError(null)
              }}
              aria-label="Choisir une couleur"
              className="size-12 shrink-0 cursor-pointer rounded-full border-4 border-game-ink bg-transparent p-0 [&::-webkit-color-swatch]:rounded-full [&::-webkit-color-swatch]:border-0 [&::-webkit-color-swatch-wrapper]:p-0"
            />
            <input
              type="text"
              value={hexInput}
              onChange={(event) => {
                setHexInput(event.target.value)
                setError(null)
              }}
              placeholder="#RRGGBB"
              maxLength={7}
              className="h-12 flex-1 rounded-full border-4 border-game-ink bg-white px-4 text-center font-black text-game-ink uppercase outline-none"
            />
          </div>
          <input
            type="text"
            value={nameInput}
            onChange={(event) => setNameInput(event.target.value)}
            placeholder="Nom (optionnel)"
            maxLength={20}
            className="h-12 rounded-full border-4 border-game-ink bg-white px-4 text-center font-bold text-game-ink outline-none"
          />
          {error && <p className="text-center text-sm font-black text-game-red">{error}</p>}
          <CartoonButton tone="blue" className="h-12 text-lg" onClick={handleAdd}>
            <Plus className="size-5" strokeWidth={3} />
            Ajouter
          </CartoonButton>
        </div>

        <CartoonButton tone="red" nearShadow className="h-12 text-lg" onClick={resetColors}>
          <RotateCcw className="size-5" strokeWidth={3} />
          Réinitialiser
        </CartoonButton>
      </DialogContent>
    </Dialog>
  )
}

export { ColorPickerDialog }
