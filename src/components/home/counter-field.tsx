import * as React from 'react'

import { StepButton, type StepButtonTone } from '@/components/home/step-button'

interface CounterFieldProps {
  label: string
  tone: StepButtonTone
  value: number
  onChange: (next: number) => void
  canIncrement: boolean
  canDecrement: boolean
}

function CounterField(props: CounterFieldProps) {
  const { label, tone, value, onChange, canIncrement, canDecrement } = props
  const [text, setText] = React.useState(String(value))

  React.useEffect(() => {
    setText(String(value))
  }, [value])

  function commit(raw: string) {
    const parsed = Number.parseInt(raw, 10)
    if (Number.isNaN(parsed)) {
      setText(String(value))
      return
    }
    onChange(parsed)
  }

  return (
    <div className="flex w-full flex-col items-center gap-2">
      <span className="text-sm font-black tracking-wide text-game-ink uppercase">{label}</span>
      <div className="flex w-full items-center gap-3">
        <StepButton
          tone={tone}
          direction="decrement"
          disabled={!canDecrement}
          onClick={() => onChange(value - 1)}
          label={`Moins de ${label}`}
        />

        <div className="relative min-w-0 flex-1">
          <span
            aria-hidden="true"
            className="absolute inset-0 rounded-full bg-game-ink translate-x-1 translate-y-1"
          />
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={text}
            onChange={(event) => setText(event.target.value.replace(/[^0-9]/g, ''))}
            onBlur={(event) => commit(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') event.currentTarget.blur()
            }}
            aria-label={label}
            className="relative h-14 w-full rounded-full border-4 border-game-ink bg-white text-center text-2xl font-black text-game-ink outline-none"
          />
        </div>

        <StepButton
          tone={tone}
          direction="increment"
          disabled={!canIncrement}
          onClick={() => onChange(value + 1)}
          label={`Plus de ${label}`}
        />
      </div>
    </div>
  )
}

export { CounterField }
