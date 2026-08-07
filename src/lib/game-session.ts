import { pickRandomNames } from '@/lib/random-names'
import { shuffle } from '@/lib/shuffle'

type PlayerRole = 'innocent' | 'undercover' | 'mrwhite'
type RevealStep = 'name' | 'role'
type GamePhase = 'reveal' | 'board' | 'finished'

const ROLE_LABELS: Record<PlayerRole, string> = {
  innocent: 'Innocent',
  undercover: 'Undercover',
  mrwhite: 'Mr. White',
}

interface SessionPlayer {
  id: string
  name: string
  role: PlayerRole
  color: string | null
  eliminated: boolean
}

interface GameSession {
  players: SessionPlayer[]
  currentIndex: number
  currentStep: RevealStep
  phase: GamePhase
}

function pickRandom<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)]
}

interface CreateGameSessionParams {
  players: number
  undercovers: number
  mrWhites: number
  enabledColorHexes: readonly string[]
}

function createGameSession(params: CreateGameSessionParams): GameSession {
  const { players, undercovers, mrWhites, enabledColorHexes } = params
  const innocents = Math.max(0, players - undercovers - mrWhites)

  const roles: PlayerRole[] = [
    ...Array<PlayerRole>(innocents).fill('innocent'),
    ...Array<PlayerRole>(undercovers).fill('undercover'),
    ...Array<PlayerRole>(mrWhites).fill('mrwhite'),
  ]
  const shuffledRoles = shuffle(roles)

  const innocentColor = pickRandom(enabledColorHexes)
  const otherColors = enabledColorHexes.filter((hex) => hex !== innocentColor)
  const undercoverColor =
    undercovers > 0 ? pickRandom(otherColors.length > 0 ? otherColors : enabledColorHexes) : null

  const sessionPlayers: SessionPlayer[] = shuffledRoles.map((role) => ({
    id: crypto.randomUUID(),
    name: '',
    role,
    color: role === 'innocent' ? innocentColor : role === 'undercover' ? undercoverColor : null,
    eliminated: false,
  }))

  return {
    players: sessionPlayers,
    currentIndex: 0,
    currentStep: 'name',
    phase: 'reveal',
  }
}

function getInnocentColor(players: readonly SessionPlayer[]): string | null {
  return players.find((player) => player.role === 'innocent')?.color ?? null
}

function fillDebugNames(session: GameSession): GameSession {
  const names = pickRandomNames(session.players.length)
  return {
    ...session,
    phase: 'board',
    players: session.players.map((player, index) => ({ ...player, name: names[index] })),
  }
}

export { createGameSession, fillDebugNames, getInnocentColor, ROLE_LABELS }
export type { GamePhase, GameSession, PlayerRole, RevealStep, SessionPlayer }
