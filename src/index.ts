import {
  solveWordleWithConstraints,
  initializeSpellchecker,
} from './services/spellcheckService'
import { WordConstraints } from './utils/wordConstraints'

/**
 * Wordle Solver - Command Line Interface
 * 
 * Configure your Wordle constraints below:
 * - ACCEPTED_CHARS: Letters that must be in the word
 * - DENIED_CHARS: Letters that are not in the word
 * - knownCharacterPositions: Letters in known positions (1-indexed)
 * - knownCharacterRejectedPositions: Letters that can't be in specific positions
 */

// Letters that must be present in the word
const ACCEPTED_CHARS: string[] = 'cat'.split('')

// Letters that are not in the word
const DENIED_CHARS: string[] = 'rneslohy'.split('')

// Known letter positions (1-indexed: position 1 = first letter)
const knownCharacterPositions: Record<number, string> = {
  1: 'c',
  2: 'a',
  4: 't',
}

// Letters that cannot be in specific positions (1-indexed)
const knownCharacterRejectedPositions: Record<number, string[]> = {
  1: [],
  2: [],
  3: ['a'],
  4: [],
  5: [],
}

/**
 * Main solver function
 * Generates word combinations, applies constraints, and validates with dictionary
 */
export async function main(): Promise<string[]> {
  try {
    console.log('Generating word combinations...')

    // Build constraints from configuration
    const constraints: WordConstraints = {
      acceptedChars: ACCEPTED_CHARS,
      deniedChars: DENIED_CHARS,
      knownPositions: knownCharacterPositions,
      rejectedPositions: knownCharacterRejectedPositions,
    }

    // Initialize dictionary spellchecker
    const spellchecker = initializeSpellchecker()

    // Solve Wordle with constraints
    const validWords = await solveWordleWithConstraints(
      constraints,
      spellchecker,
    )

    // Display results
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
