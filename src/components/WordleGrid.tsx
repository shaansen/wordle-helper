import { useRef, KeyboardEvent } from 'react'
import { Guess, LetterState } from '../App'

interface WordleGridProps {
  guesses: Guess[]
  onUpdateGuess: (index: number, word: string, states: LetterState[]) => void
  onAddGuess: () => void
  onReset: () => void
}

export default function WordleGrid({
  guesses,
  onUpdateGuess,
  onAddGuess,
  onReset,
}: WordleGridProps) {
  const inputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({})

  const getStateClass = (state: LetterState): string => {
    switch (state) {
      case 'grey':
        return 'state-grey'
      case 'yellow':
        return 'state-yellow'
      case 'green':
        return 'state-green'
      default:
        return 'state-empty'
    }
  }

  const handleLetterInput = (
    guessIndex: number,
    letterIndex: number,
    value: string,
  ) => {
    const letter = value.toLowerCase().replace(/[^a-z]/g, '')
    const guess = guesses[guessIndex]
    const newWord =
      guess.word.substring(0, letterIndex) +
      letter +
      guess.word.substring(letterIndex + 1)

    // Update states to maintain length
    const newStates = [...guess.states]
    if (newWord.length > guess.word.length) {
      newStates[letterIndex] = 'empty'
    }

    onUpdateGuess(guessIndex, newWord, newStates)

    if (letter && letterIndex < 4) {
      const nextKey = `${guessIndex}-${letterIndex + 1}`
      inputRefs.current[nextKey]?.focus()
    }
  }

  const handleKeyDown = (
    e: KeyboardEvent<HTMLInputElement>,
    guessIndex: number,
    letterIndex: number,
  ) => {
    if (e.key === 'Backspace' && !e.target.value && letterIndex > 0) {
      const prevKey = `${guessIndex}-${letterIndex - 1}`
      inputRefs.current[prevKey]?.focus()
    } else if (e.key === 'ArrowLeft' && letterIndex > 0) {
      e.preventDefault()
      const prevKey = `${guessIndex}-${letterIndex - 1}`
      inputRefs.current[prevKey]?.focus()
    } else if (e.key === 'ArrowRight' && letterIndex < 4) {
      e.preventDefault()
      const nextKey = `${guessIndex}-${letterIndex + 1}`
      inputRefs.current[nextKey]?.focus()
    }
  }

  const cycleCellState = (guessIndex: number, letterIndex: number) => {
    const guess = guesses[guessIndex]
    if (!guess.word[letterIndex]) return

    const states: LetterState[] = ['empty', 'grey', 'yellow', 'green']
    const currentState = guess.states[letterIndex]
    const currentIndex = states.indexOf(currentState)
    const nextIndex = (currentIndex + 1) % states.length
    const newStates = [...guess.states]
    newStates[letterIndex] = states[nextIndex]

    onUpdateGuess(guessIndex, guess.word, newStates)
  }

  const handleCellClick = (
    e: React.MouseEvent | React.TouchEvent,
    guessIndex: number,
    letterIndex: number,
  ) => {
    const guess = guesses[guessIndex]

    // If cell is empty, focus the input
    if (!guess.word[letterIndex]) {
      const key = `${guessIndex}-${letterIndex}`
      inputRefs.current[key]?.focus()
      return
    }

    // If cell has a letter, cycle the state
    cycleCellState(guessIndex, letterIndex)
  }

  return (
    <div>
      <div className="space-y-3 mb-6">
        {guesses.map((guess, guessIndex) => (
          <div key={guessIndex} className="flex gap-2 justify-center">
            {Array.from({ length: 5 }).map((_, letterIndex) => {
              const key = `${guessIndex}-${letterIndex}`
              const letter = guess.word[letterIndex] || ''
              const state = guess.states[letterIndex]

              return (
                <div
                  key={key}
                  className={`card-cell ${getStateClass(state)}`}
                  onClick={e => handleCellClick(e, guessIndex, letterIndex)}
                  onTouchEnd={e => {
                    // Don't prevent default - let the input focus naturally
                    handleCellClick(e, guessIndex, letterIndex)
                  }}
                >
                  <input
                    ref={el => {
                      inputRefs.current[key] = el
                    }}
                    type="text"
                    inputMode="text"
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck="false"
                    maxLength={1}
                    value={letter.toUpperCase()}
                    placeholder=""
                    className="input-cell"
                    onChange={e =>
                      handleLetterInput(guessIndex, letterIndex, e.target.value)
                    }
                    onKeyDown={e => handleKeyDown(e, guessIndex, letterIndex)}
                    onFocus={e => {
                      // Select text on mobile
                      if (e.target instanceof HTMLInputElement) {
                        e.target.select()
                      }
                    }}
                    onClick={e => {
                      const guess = guesses[guessIndex]
                      // If there's a letter, cycle state instead of focusing
                      if (guess.word[letterIndex]) {
                        e.preventDefault()
                        e.stopPropagation()
                        // Blur the input if it was focused
                        if (e.target instanceof HTMLInputElement) {
                          e.target.blur()
                        }
                        cycleCellState(guessIndex, letterIndex)
                      }
                      // If empty, let it focus naturally (don't stop propagation)
                    }}
                    onTouchEnd={e => {
                      const guess = guesses[guessIndex]
                      // If there's a letter, cycle state on touch
                      if (guess.word[letterIndex]) {
                        e.preventDefault()
                        e.stopPropagation()
                        // Blur the input if it was focused
                        if (e.target instanceof HTMLInputElement) {
                          e.target.blur()
                        }
                        cycleCellState(guessIndex, letterIndex)
                      }
                      // If empty, let it focus naturally
                    }}
                  />
                </div>
              )
            })}
          </div>
        ))}
      </div>

      <div className="flex gap-3 justify-center flex-wrap">
        <button onClick={onAddGuess} className="btn-primary">
          Add Guess
        </button>
        <button onClick={onReset} className="btn-secondary">
          Reset
        </button>
      </div>
    </div>
  )
}
