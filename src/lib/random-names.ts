import { shuffle } from '@/lib/shuffle'

const NAME_POOL = [
  'Alex',
  'Camille',
  'Léa',
  'Hugo',
  'Chloé',
  'Nathan',
  'Manon',
  'Louis',
  'Emma',
  'Jules',
  'Sarah',
  'Adam',
  'Zoé',
  'Noah',
  'Inès',
  'Théo',
  'Lina',
  'Gabriel',
  'Jade',
  'Arthur',
  'Anna',
  'Léon',
  'Mia',
  'Sacha',
]

function pickRandomNames(count: number): string[] {
  const shuffled = shuffle(NAME_POOL)
  return Array.from({ length: count }, (_, index) => {
    const base = shuffled[index % shuffled.length]
    const cycle = Math.floor(index / shuffled.length)
    return cycle === 0 ? base : `${base} ${cycle + 1}`
  })
}

export { pickRandomNames }
