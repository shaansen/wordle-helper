import { WordConstraints } from './wordConstraints'

export function parseConstraintsFromBody(body: any): WordConstraints | null {
  if (!body || typeof body !== 'object') {
    return null
  }

  const acceptedChars: string[] = Array.isArray(body.acceptedChars)
    ? body.acceptedChars.filter(
        (c: any) => typeof c === 'string' && c.length === 1,
      )
    : []

  const deniedChars: string[] = Array.isArray(body.deniedChars)
    ? body.deniedChars.filter(
        (c: any) => typeof c === 'string' && c.length === 1,
      )
    : []

  const knownPositions: Record<number, string> = {}
  if (typeof body.knownPositions === 'object' && body.knownPositions !== null) {
    for (const [key, value] of Object.entries(body.knownPositions)) {
      const numKey = Number(key)
      if (
        !isNaN(numKey) &&
        numKey >= 1 &&
        numKey <= 5 &&
        typeof value === 'string' &&
        value.length === 1
      ) {
        knownPositions[numKey] = value
      }
    }
  }

  const rejectedPositions: Record<number, string[]> = {}
  if (
    typeof body.rejectedPositions === 'object' &&
    body.rejectedPositions !== null
  ) {
    for (const [key, value] of Object.entries(body.rejectedPositions)) {
      const numKey = Number(key)
      if (
        !isNaN(numKey) &&
        numKey >= 1 &&
        numKey <= 5 &&
        Array.isArray(value)
      ) {
        rejectedPositions[numKey] = value.filter(
          (c: any) => typeof c === 'string' && c.length === 1,
        )
      }
    }
  }

  return {
    acceptedChars,
    deniedChars,
    knownPositions,
    rejectedPositions,
  }
}

export function parseConstraintsFromQuery(query: any): WordConstraints {
  const constraints: WordConstraints = {
    acceptedChars: query.acceptedChars
      ? (query.acceptedChars as string)
          .split(',')
          .map(c => c.trim().toLowerCase())
      : [],
    deniedChars: query.deniedChars
      ? (query.deniedChars as string)
          .split(',')
          .map(c => c.trim().toLowerCase())
      : [],
    knownPositions: query.knownPositions
      ? JSON.parse(query.knownPositions as string)
      : {},
    rejectedPositions: query.rejectedPositions
      ? JSON.parse(query.rejectedPositions as string)
      : {},
  }

  const knownPositions: Record<number, string> = {}
  for (const [key, value] of Object.entries(constraints.knownPositions)) {
    const numKey = Number(key)
    if (
      !isNaN(numKey) &&
      numKey >= 1 &&
      numKey <= 5 &&
      typeof value === 'string'
    ) {
      knownPositions[numKey] = value.toLowerCase()
    }
  }
  constraints.knownPositions = knownPositions

  const rejectedPositions: Record<number, string[]> = {}
  for (const [key, value] of Object.entries(constraints.rejectedPositions)) {
    const numKey = Number(key)
    if (!isNaN(numKey) && numKey >= 1 && numKey <= 5 && Array.isArray(value)) {
      rejectedPositions[numKey] = value.map(c => c.toLowerCase())
    }
  }
  constraints.rejectedPositions = rejectedPositions

  return constraints
}




