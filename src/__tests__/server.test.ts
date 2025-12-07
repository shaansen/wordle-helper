import request from 'supertest'
import { app } from '../server'
import { solveWordle } from '../utils/solver'

jest.mock('../utils/solver')
jest.mock('../services/spellcheckService', () => ({
  initializeSpellchecker: jest.fn(() => ({ check: jest.fn() })),
}))

const mockSolveWordle = solveWordle as jest.MockedFunction<typeof solveWordle>

describe('API', () => {
  it('should handle POST /api/solve', async () => {
    mockSolveWordle.mockResolvedValue({
      success: true,
      count: 1,
      words: ['tests'],
      constraints: {
        acceptedChars: [],
        deniedChars: [],
        knownPositions: {},
        rejectedPositions: {},
      },
    })

    const response = await request(app)
      .post('/api/solve')
      .send({
        acceptedChars: [],
        deniedChars: [],
        knownPositions: {},
        rejectedPositions: {},
      })

    expect(response.status).toBe(200)
    expect(response.body.success).toBe(true)
  })
})

