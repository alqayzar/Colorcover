import * as React from 'react'

import { RoleReveal } from '@/components/game/role-reveal'
import { CartoonButton } from '@/components/home/cartoon-button'
import type { RevealStep, SessionPlayer } from '@/lib/game-session'

interface RevealCardProps {
  player: SessionPlayer
  index: number
  total: number
  step: RevealStep
  onSubmitName: (name: string) => void
  onAcknowledge: () => void
  onCancel: () => void
}

function RevealCard(props: RevealCardProps) {
  const { player, index, total, step, onSubmitName, onAcknowledge, onCancel } = props
  const [name, setName] = React.useState(player.name)

  function handleSubmit() {
    if (!name.trim()) return
    onSubmitName(name)
  }

  return (
    <div className="w-full max-w-xs rounded-[2.5rem] border-4 border-game-ink bg-white p-6 shadow-[6px_6px_0_0_var(--color-game-ink)]">
      <p className="text-center text-sm font-black tracking-wide text-game-ink/50 uppercase">
        Joueur {index + 1} / {total}
      </p>

      {step === 'name' ? (
        <div className="mt-4 flex flex-col items-center gap-6">
          <h2 className="text-center text-2xl font-black text-game-ink">Ton prénom ?</h2>
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') handleSubmit()
            }}
            placeholder="Prénom"
            maxLength={20}
            autoFocus
            className="h-14 w-full rounded-full border-4 border-game-ink bg-white text-center text-xl font-bold text-game-ink outline-none"
          />
          <CartoonButton tone="purple" disabled={!name.trim()} onClick={handleSubmit}>
            Révéler
          </CartoonButton>
          <CartoonButton tone="blue" onClick={onCancel}>
            Annuler
          </CartoonButton>
        </div>
      ) : (
        <div className="mt-4 flex flex-col items-center gap-6">
          <h2 className="text-center text-2xl font-black text-game-ink">{player.name}</h2>

          <RoleReveal player={player} />

          <CartoonButton tone="green" onClick={onAcknowledge}>
            Ok
          </CartoonButton>
          <CartoonButton tone="blue" onClick={onCancel}>
            Annuler
          </CartoonButton>
        </div>
      )}
    </div>
  )
}

export { RevealCard }
