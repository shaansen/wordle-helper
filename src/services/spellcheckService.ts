/**
 * Spellcheck service that can be used by both index.ts and React app
 * Exports the main solving function from index.ts
 */

import SpellChecker from 'hunspell-spellchecker'
import { readFileSync } from 'fs'
import { join } from 'path'
import {
  hasAllRequiredCharacters,
  hasCorrectKnownPositions,
  hasValidRejectedPositions,
  WordConstraints,
} from '../utils/wordConstraints'

const WORD_LENGTH = 5

/**
 * Initialize spellchecker with dictionary files
 */
export function initializeSpellchecker(): SpellChecker {
  const spellchecker = new SpellChecker()

  try {
    const dictionary = spellchecker.parse({
      aff: readFileSync(join(__dirname, '..', 'en_EN.aff')),
      dic: readFileSync(join(__dirname, '..', 'en_EN.dic')),
    })

    spellchecker.use(dictionary)
    return spellchecker
  } catch (error) {
    console.error('Failed to load dictionary files:', error)
    throw new Error(
      'Dictionary files not found. Please ensure en_EN.aff and en_EN.dic are in the src directory.',
    )
  }
}

/**
 * Generate all possible word combinations recursively
 * Uses a mutable results array to avoid stack overflow from array spreading
 */
export function generateWordCombinations({
  index,
  maxLengthOfWord,
  str,
  allowedChars,
  results,
}: {
  index: number
  maxLengthOfWord: number
  str: string
  allowedChars: string[]
  results: string[]
}): void {
  if (index === maxLengthOfWord) {
    results.push(str)
    return
  }

  for (const char of allowedChars) {
    generateWordCombinations({
      index: index + 1,
      maxLengthOfWord,
      str: str + char,
      allowedChars,
      results,
    })
  }
}

/**
 * Main solving function - can be called from index.ts or exported for use elsewhere
 */
export async function solveWordleWithConstraints(
  constraints: WordConstraints,
  spellchecker?: SpellChecker,
): Promise<string[]> {
  const ALL_CHARS: string[] = 'abcdefghijklmnopqrstuvwxyz'.split('')
  const allowedChars = ALL_CHARS.filter(
    char => !constraints.deniedChars.includes(char),
  )

  // Generate all possible combinations
  const allResults: string[] = []
  generateWordCombinations({
    index: 0,
    maxLengthOfWord: WORD_LENGTH,
    str: '',
    allowedChars,
    results: allResults,
  })

  // Filter words that contain all required characters
  const wordsWithAllCharacters = allResults.filter(word =>
    hasAllRequiredCharacters(word, constraints.acceptedChars),
  )

  // Filter words with correct known positions
  const wordsWithCorrectPositions = wordsWithAllCharacters.filter(word =>
    hasCorrectKnownPositions(word, constraints.knownPositions),
  )

  // Filter words with valid rejected positions
  const wordsWithValidPositions = wordsWithCorrectPositions.filter(word =>
    hasValidRejectedPositions(word, constraints.rejectedPositions),
  )

  // If spellchecker is provided, filter valid words
  let validWords = wordsWithValidPositions
  if (spellchecker) {
    validWords = wordsWithValidPositions.filter(word =>
      spellchecker.check(word),
    )
  }

  return validWords
}
