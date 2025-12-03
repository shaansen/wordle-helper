export interface WordConstraints {
  acceptedChars: string[]
  deniedChars: string[]
  knownPositions: Record<number, string>
  rejectedPositions: Record<number, string[]>
}

export function hasAllRequiredCharacters(
  word: string,
  acceptedChars: string[],
): boolean {
  return acceptedChars.every(char => word.includes(char))
}

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
