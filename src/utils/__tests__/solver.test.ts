import { solveWordle } from '../solver'
import { solveWordleWithConstraints } from '../../services/spellcheckService'
import { WordConstraints } from '../wordConstraints'

jest.mock('../../services/spellcheckService', () => ({
  initializeSpellchecker: jest.fn(() => ({ check: jest.fn() })),
  solveWordleWithConstraints: jest.fn(),
}))

const mockSolveWordleWithConstraints =
  solveWordleWithConstraints as jest.MockedFunction<
    typeof solveWordleWithConstraints
  >

describe('solver', () => {
  it('should solve wordle', async () => {
    const constraints: WordConstraints = {
      acceptedChars: [],
      deniedChars: [],
      knownPositions: {},
      rejectedPositions: {},
    }

    mockSolveWordleWithConstraints.mockResolvedValue(['tests'])

    const result = await solveWordle(constraints)

    expect(result.success).toBe(true)
    expect(result.words).toEqual(['tests'])
  })
})
