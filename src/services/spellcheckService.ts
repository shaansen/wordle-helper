/**
 * Spellcheck service for Wordle solver
 * Handles dictionary initialization and word generation/filtering
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
 * Main solving function
 * Generates all possible 5-letter combinations and filters by constraints
 * 
 * @param constraints - Wordle game constraints (accepted/denied chars, positions)
 * @param spellchecker - Optional spellchecker to validate words against dictionary
 * @returns Array of valid words matching all constraints
 */
export async function solveWordleWithConstraints(
  constraints: WordConstraints,
  spellchecker?: SpellChecker,
): Promise<string[]> {
  // Get allowed characters (all letters except denied ones)
  const ALL_CHARS: string[] = 'abcdefghijklmnopqrstuvwxyz'.split('')
  const allowedChars = ALL_CHARS.filter(
    char => !constraints.deniedChars.includes(char),
  )

  // Generate all possible 5-letter combinations
  const allResults: string[] = []
  generateWordCombinations({
    index: 0,
    maxLengthOfWord: WORD_LENGTH,
    str: '',
    allowedChars,
    results: allResults,
  })

  // Apply constraint filters in sequence
  // 1. Must contain all accepted characters
  const wordsWithAllCharacters = allResults.filter(word =>
    hasAllRequiredCharacters(word, constraints.acceptedChars),
  )

  // 2. Must have correct letters in known positions
  const wordsWithCorrectPositions = wordsWithAllCharacters.filter(word =>
    hasCorrectKnownPositions(word, constraints.knownPositions),
  )

  // 3. Must not have rejected letters in specific positions
  const wordsWithValidPositions = wordsWithCorrectPositions.filter(word =>
    hasValidRejectedPositions(word, constraints.rejectedPositions),
  )

  // 4. Validate against dictionary if spellchecker provided
  let validWords = wordsWithValidPositions
  if (spellchecker) {
    validWords = wordsWithValidPositions.filter(word =>
      spellchecker.check(word),
    )
  }

  return validWords
}
