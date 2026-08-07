import { pickRandomNames } from '@/lib/random-names'
import { shuffle } from '@/lib/shuffle'
import type { SpecialRoleId } from '@/lib/special-roles'

type PlayerRole = 'innocent' | 'undercover' | 'mrwhite' | 'fou'
type RevealStep = 'name' | 'role'
type GamePhase = 'reveal' | 'board' | 'finished'

const ROLE_LABELS: Record<PlayerRole, string> = {
  innocent: 'Innocent',
  undercover: '🕵️ Undercover',
  mrwhite: '👻 Mr. White',
  fou: '🤡 Le Fou',
}

interface SessionPlayer {
  id: string
  name: string
  role: PlayerRole
  color: string | null
  eliminated: boolean
}

type GameOutcome =
  | { reason: string; winner: 'innocents' }
  | { reason: string; winner: 'imposters' }
  | { reason: string; winner: 'fou'; playerId: string }
  | { reason: string; winner: 'mrwhite'; playerId: string }
  | { reason: string; winner: 'none' }

interface GameSession {
  players: SessionPlayer[]
  currentIndex: number
  currentStep: RevealStep
  phase: GamePhase
  outcome?: GameOutcome
}

function pickRandom<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)]
}

interface CreateGameSessionParams {
  players: number
  undercovers: number
  mrWhites: number
  enabledColorHexes: readonly string[]
  enabledSpecialRoleIds?: readonly SpecialRoleId[]
  previousNames?: readonly string[]
}

function createGameSession(params: CreateGameSessionParams): GameSession {
  const {
    players,
    undercovers,
    mrWhites,
    enabledColorHexes,
    enabledSpecialRoleIds = [],
    previousNames,
  } = params
  const baseInnocents = Math.max(0, players - undercovers - mrWhites)
  const includeFou = enabledSpecialRoleIds.includes('fou') && baseInnocents > 0
  const innocents = includeFou ? baseInnocents - 1 : baseInnocents

  const roles: PlayerRole[] = [
    ...Array<PlayerRole>(innocents).fill('innocent'),
    ...Array<PlayerRole>(undercovers).fill('undercover'),
    ...Array<PlayerRole>(mrWhites).fill('mrwhite'),
    ...Array<PlayerRole>(includeFou ? 1 : 0).fill('fou'),
  ]
  const shuffledRoles = shuffle(roles)

  const innocentColor = pickRandom(enabledColorHexes)
  const otherColors = enabledColorHexes.filter((hex) => hex !== innocentColor)
  const undercoverColor =
    undercovers > 0 ? pickRandom(otherColors.length > 0 ? otherColors : enabledColorHexes) : null

  const sessionPlayers: SessionPlayer[] = shuffledRoles.map((role, index) => ({
    id: crypto.randomUUID(),
    name: previousNames?.[index] ?? '',
    role,
    color:
      role === 'innocent' || role === 'fou'
        ? innocentColor
        : role === 'undercover'
          ? undercoverColor
          : null,
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

function getWinnerIds(
  outcome: GameOutcome | undefined,
  players: readonly SessionPlayer[]
): Set<string> {
  if (!outcome) return new Set()
  switch (outcome.winner) {
    case 'innocents':
      return new Set(
        players.filter((player) => player.role === 'innocent' || player.role === 'fou').map((player) => player.id)
      )
    case 'imposters':
      return new Set(
        players
          .filter((player) => player.role === 'undercover' || player.role === 'mrwhite')
          .map((player) => player.id)
      )
    case 'fou':
    case 'mrwhite':
      return new Set([outcome.playerId])
    case 'none':
      return new Set()
  }
}

function fillDebugNames(session: GameSession): GameSession {
  const names = pickRandomNames(session.players.length)
  return {
    ...session,
    phase: 'board',
    players: session.players.map((player, index) => ({ ...player, name: names[index] })),
  }
}

export { createGameSession, fillDebugNames, getInnocentColor, getWinnerIds, ROLE_LABELS }
export type { GameOutcome, GamePhase, GameSession, PlayerRole, RevealStep, SessionPlayer }
