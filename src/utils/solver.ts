import {
  solveWordleWithConstraints,
  initializeSpellchecker,
} from '../services/spellcheckService'
import { WordConstraints } from './wordConstraints'

export async function solveWordle(
  constraints: WordConstraints,
  spellchecker?: ReturnType<typeof initializeSpellchecker>,
): Promise<{
  success: boolean
  count: number
  words: string[]
  constraints: WordConstraints
}> {
  try {
    const checker = spellchecker || initializeSpellchecker()
    const validWords = await solveWordleWithConstraints(constraints, checker)

    return {
      success: true,
      count: validWords.length,
      words: validWords,
      constraints,
    }
  } catch (error) {
    throw new Error(
      `Failed to solve Wordle: ${error instanceof Error ? error.message : 'Unknown error'}`,
    )
  }
}




