import {
  solveWordleWithConstraints,
  initializeSpellchecker,
} from './services/spellcheckService'
import { WordConstraints } from './utils/wordConstraints'

// Configuration constants - can be modified or passed as parameters
const ACCEPTED_CHARS: string[] = 'cat'.split('')
const DENIED_CHARS: string[] = 'rneslohy'.split('')

// Wordle constraints
const knownCharacterPositions: Record<number, string> = {
  1: 'c',
  2: 'a',
  4: 't',
}

const knownCharacterRejectedPositions: Record<number, string[]> = {
  1: [],
  2: [],
  3: ['a'],
  4: [],
  5: [],
}

/**
 * Main function - now uses shared solving logic
 * Can also be imported and called programmatically
 */
export async function main() {
  try {
    console.log('Generating word combinations...')

    // Build constraints object
    const constraints: WordConstraints = {
      acceptedChars: ACCEPTED_CHARS,
      deniedChars: DENIED_CHARS,
      knownPositions: knownCharacterPositions,
      rejectedPositions: knownCharacterRejectedPositions,
    }

    // Initialize spellchecker
    const spellchecker = initializeSpellchecker()

    // Solve using shared function
    const validWords = await solveWordleWithConstraints(
      constraints,
      spellchecker,
    )

    console.log(`\nFound ${validWords.length} valid words:`)
    validWords.forEach(word => console.log(`  → ${word}`))

    if (validWords.length === 0) {
      console.log('\nNo valid words found with the given constraints.')
    }

    return validWords
  } catch (error) {
    console.error('Error solving Wordle:', error)
    throw error
  }
}

// Run if called directly
if (require.main === module) {
  main()
}
