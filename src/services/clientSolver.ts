// Client-side solver that uses a word list instead of Hunspell
import {
  hasAllRequiredCharacters,
  hasCorrectKnownPositions,
  hasValidRejectedPositions,
  WordConstraints,
} from '../utils/wordConstraints'

const WORD_LIST_URL =
  'https://raw.githubusercontent.com/darkermango/5-Letter-words/main/words.json'

let wordListCache: string[] | null = null

export async function loadWordList(): Promise<string[]> {
  if (wordListCache) {
    return wordListCache
  }

  try {
    const response = await fetch(WORD_LIST_URL)
    const data = await response.json()
    const words = data.words || data || []
    wordListCache = words
      .filter((word: any) => typeof word === 'string' && word.length === 5)
      .map((word: string) => word.toLowerCase())
    return wordListCache
  } catch (error) {
    console.error('Failed to load word list:', error)
    throw new Error('Failed to load word list')
  }
}

export async function solveWordleClient(
  constraints: WordConstraints,
): Promise<string[]> {
  const wordList = await loadWordList()

  // Filter by denied characters
  let validWords = wordList.filter(word => {
    return !constraints.deniedChars.some(char => word.includes(char))
  })

  // Filter by accepted characters
  if (constraints.acceptedChars.length > 0) {
    validWords = validWords.filter(word =>
      hasAllRequiredCharacters(word, constraints.acceptedChars),
    )
  }

  // Filter by known positions
  if (Object.keys(constraints.knownPositions).length > 0) {
    validWords = validWords.filter(word =>
      hasCorrectKnownPositions(word, constraints.knownPositions),
    )
  }

  // Filter by rejected positions
  if (Object.keys(constraints.rejectedPositions).length > 0) {
    validWords = validWords.filter(word =>
      hasValidRejectedPositions(word, constraints.rejectedPositions),
    )
  }

  return validWords
}


