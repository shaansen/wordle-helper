import { parseConstraintsFromBody } from '../requestParser'

describe('requestParser', () => {
  it('should parse constraints from body', () => {
    const body = {
      acceptedChars: ['a'],
      deniedChars: [],
      knownPositions: {},
      rejectedPositions: {},
    }

    const result = parseConstraintsFromBody(body)

    expect(result?.acceptedChars).toEqual(['a'])
  })
})



