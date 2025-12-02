/**
 * Word constraint checking utilities
 * Validates words against Wordle game constraints
 */

export interface WordConstraints {
  acceptedChars: string[]
  deniedChars: string[]
  knownPositions: Record<number, string>
  rejectedPositions: Record<number, string[]>
}

/**
 * Check if a word contains all required characters
 */
export function hasAllRequiredCharacters(
  word: string,
  acceptedChars: string[],
): boolean {
  return acceptedChars.every(char => word.includes(char))
}

/**
 * Check if a word has correct characters in known positions
 */
export function hasCorrectKnownPositions(
  word: string,
  knownPositions: Record<number, string>,
): boolean {
  const knownPositionKeys = Object.keys(knownPositions).map(Number)

  for (const position of knownPositionKeys) {
    if (word.charAt(position - 1) !== knownPositions[position]) {
      return false
    }
  }

  return true
}

/**
 * Check if a word doesn't have rejected characters in specific positions
 */
export function hasValidRejectedPositions(
  word: string,
  rejectedPositions: Record<number, string[]>,
): boolean {
  const rejectedPositionKeys = Object.keys(rejectedPositions).map(Number)

  for (const position of rejectedPositionKeys) {
    const rejectedChars = rejectedPositions[position] || []
    const currentChar = word.charAt(position - 1)

    if (rejectedChars.includes(currentChar)) {
      return false
    }
  }

  return true
}

/**
 * Check if a word matches all constraints
 */
export function matchesAllConstraints(
  word: string,
  constraints: WordConstraints,
): boolean {
  if (
    !hasAllRequiredCharacters(word, constraints.acceptedChars) ||
    !hasCorrectKnownPositions(word, constraints.knownPositions) ||
    !hasValidRejectedPositions(word, constraints.rejectedPositions)
  ) {
    return false
  }

  // Check denied characters
  for (const char of constraints.deniedChars) {
    if (word.includes(char)) {
      return false
    }
  }

  return true
}
