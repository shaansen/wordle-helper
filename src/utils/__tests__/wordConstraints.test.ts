import {
  hasAllRequiredCharacters,
  hasCorrectKnownPositions,
  hasValidRejectedPositions,
} from '../wordConstraints'

describe('wordConstraints', () => {
  it('should validate constraints correctly', () => {
    expect(hasAllRequiredCharacters('hello', ['h', 'e'])).toBe(true)
    expect(hasCorrectKnownPositions('hello', { 1: 'h' })).toBe(true)
    expect(hasValidRejectedPositions('hello', { 1: ['x'] })).toBe(true)
  })
})



