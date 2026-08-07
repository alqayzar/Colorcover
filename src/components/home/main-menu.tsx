import * as React from 'react'
import { Palette, VenetianMask } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { CartoonButton } from '@/components/home/cartoon-button'
import { ColorPickerDialog } from '@/components/home/color-picker-dialog'
import { CounterField } from '@/components/home/counter-field'
import { Logo } from '@/components/home/logo'
import { RolesDialog } from '@/components/home/roles-dialog'
import { useColorPalette } from '@/hooks/use-color-palette'
import { useGameSetup } from '@/hooks/use-game-setup'
import { useSpecialRoles } from '@/hooks/use-special-roles'
import { createGameSession, fillDebugNames } from '@/lib/game-session'
import { writeGameSession } from '@/lib/game-session-storage'

const LONG_PRESS_MS = 600

function MainMenu() {
  const navigate = useNavigate()
  const setup = useGameSetup()
  const { colors } = useColorPalette()
  const { enabledIds: enabledSpecialRoleIds } = useSpecialRoles()
  const [isColorDialogOpen, setIsColorDialogOpen] = React.useState(false)
  const [isRolesDialogOpen, setIsRolesDialogOpen] = React.useState(false)
  const longPressTimer = React.useRef<number | null>(null)
  const longPressTriggered = React.useRef(false)

  function buildSession() {
    const enabledColorHexes = colors.filter((color) => color.enabled).map((color) => color.hex)
    return createGameSession({
      players: setup.players,
      undercovers: setup.undercovers,
      mrWhites: setup.mrWhites,
      enabledColorHexes,
      enabledSpecialRoleIds,
    })
  }

  function handleLaunch() {
    writeGameSession(buildSession())
    navigate('/game')
  }

  function handleDebugLaunch() {
    writeGameSession(fillDebugNames(buildSession()))
    navigate('/game')
  }

  function handleLaunchClick() {
    if (longPressTriggered.current) {
      longPressTriggered.current = false
      return
    }
    handleLaunch()
  }

  function clearLongPressTimer() {
    if (longPressTimer.current !== null) {
      window.clearTimeout(longPressTimer.current)
      longPressTimer.current = null
    }
  }

  function handlePressStart() {
    longPressTriggered.current = false
    clearLongPressTimer()
    longPressTimer.current = window.setTimeout(() => {
      longPressTriggered.current = true
      handleDebugLaunch()
    }, LONG_PRESS_MS)
  }

  return (
    <main className="bg-grid flex min-h-svh flex-col items-center justify-center gap-10 bg-white p-6">
      <Logo />

      <div className="flex w-full max-w-xs flex-col items-center gap-8">
        <CounterField
          label="🎨 Joueurs"
          tone="blue"
          value={setup.players}
          onChange={setup.setPlayers}
          canIncrement={setup.canIncrementPlayers}
          canDecrement={setup.canDecrementPlayers}
        />
        <CounterField
          label="🕵️ Undercover"
          tone="purple"
          value={setup.undercovers}
          onChange={setup.setUndercovers}
          canIncrement={setup.canIncrementUndercovers}
          canDecrement={setup.canDecrementUndercovers}
        />
        <CounterField
          label="👻 Mr. White"
          tone="ink"
          value={setup.mrWhites}
          onChange={setup.setMrWhites}
          canIncrement={setup.canIncrementMrWhites}
          canDecrement={setup.canDecrementMrWhites}
        />

        <CartoonButton tone="purple" onClick={() => setIsRolesDialogOpen(true)}>
          <VenetianMask className="size-5" strokeWidth={3} />
          Rôles
        </CartoonButton>

        <CartoonButton tone="yellow" onClick={() => setIsColorDialogOpen(true)}>
          <Palette className="size-5" strokeWidth={3} />
          Couleurs
        </CartoonButton>

        <CartoonButton
          tone="green"
          className="touch-manipulation select-none"
          onClick={handleLaunchClick}
          onPointerDown={handlePressStart}
          onPointerUp={clearLongPressTimer}
          onPointerLeave={clearLongPressTimer}
          onPointerCancel={clearLongPressTimer}
          onContextMenu={(event) => event.preventDefault()}
        >
          Lancer
        </CartoonButton>
      </div>

      <RolesDialog open={isRolesDialogOpen} onOpenChange={setIsRolesDialogOpen} />
      <ColorPickerDialog open={isColorDialogOpen} onOpenChange={setIsColorDialogOpen} />
    </main>
  )
}

export { MainMenu }
