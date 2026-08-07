import { Minus, Plus } from 'lucide-react'

import { cn } from '@/lib/utils'

type StepButtonTone = 'blue' | 'purple' | 'ink'

const TONE_CLASSES: Record<StepButtonTone, string> = {
  blue: 'bg-game-blue text-white',
  purple: 'bg-game-purple text-white',
  ink: 'bg-game-ink text-white',
}

interface StepButtonProps {
  tone: StepButtonTone
  direction: 'increment' | 'decrement'
  onClick: () => void
  disabled?: boolean
  label: string
}

function StepButton(props: StepButtonProps) {
  const { tone, direction, onClick, disabled, label } = props
  const Icon = direction === 'increment' ? Plus : Minus

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="group relative inline-flex shrink-0 disabled:pointer-events-none disabled:opacity-50"
    >
      <span
        aria-hidden="true"
        className="absolute inset-0 rounded-full bg-game-ink translate-x-1 translate-y-1"
      />
      <span
        className={cn(
          'relative flex size-12 items-center justify-center rounded-full border-4 border-game-ink transition-transform duration-100 group-active:translate-x-1 group-active:translate-y-1',
          TONE_CLASSES[tone]
        )}
      >
        <Icon className="size-5" strokeWidth={3} />
      </span>
    </button>
  )
}

export { StepButton }
export type { StepButtonTone }
