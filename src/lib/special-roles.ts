type SpecialRoleId = 'fou'

interface SpecialRoleDefinition {
  id: SpecialRoleId
  name: string
  emoji: string
  description: string
}

const SPECIAL_ROLES: readonly SpecialRoleDefinition[] = [
  {
    id: 'fou',
    name: 'Le Fou',
    emoji: '🤡',
    description: 'Gagne s’il est éliminé en premier',
  },
]

export { SPECIAL_ROLES }
export type { SpecialRoleDefinition, SpecialRoleId }
