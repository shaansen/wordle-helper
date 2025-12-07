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
        return 'bg-gradient-to-br from-gray-300 to-gray-400 text-white border-gray-500 shadow-lg'
      case 'yellow':
        return 'bg-gradient-to-br from-yellow-300 via-yellow-400 to-yellow-500 text-white border-yellow-600 shadow-lg'
      case 'green':
        return 'bg-gradient-to-br from-green-400 via-green-500 to-green-600 text-white border-green-700 shadow-lg'
      default:
        return 'bg-white/60 border-gray-300 text-gray-700 backdrop-blur-sm'
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
                  className={`w-14 h-14 sm:w-16 sm:h-16 border-4 rounded-lg flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-110 hover:shadow-xl ${getStateClass(
                    state,
                  )}`}
                  onClick={() => cycleCellState(guessIndex, letterIndex)}
                  onTouchEnd={e => {
                    e.preventDefault()
                    cycleCellState(guessIndex, letterIndex)
                  }}
                >
                  <input
                    ref={el => {
                      inputRefs.current[key] = el
                    }}
                    type="text"
                    maxLength={1}
                    value={letter.toUpperCase()}
                    placeholder=""
                    className="w-full h-full bg-transparent border-none text-center text-2xl sm:text-3xl font-bold uppercase text-inherit focus:outline-none cursor-pointer pointer-events-auto"
                    onChange={e =>
                      handleLetterInput(guessIndex, letterIndex, e.target.value)
                    }
                    onKeyDown={e => handleKeyDown(e, guessIndex, letterIndex)}
                    onFocus={e => e.target.select()}
                  />
                </div>
              )
            })}
          </div>
        ))}
      </div>

      <div className="flex gap-3 justify-center flex-wrap">
        <button
          onClick={onAddGuess}
          className="px-6 py-3 bg-gradient-to-r from-pink-400 to-purple-500 text-white rounded-xl font-semibold hover:from-pink-500 hover:to-purple-600 active:scale-95 transition-all duration-200 shadow-lg hover:shadow-xl min-h-[48px]"
        >
          Add Guess
        </button>
        <button
          onClick={onReset}
          className="px-6 py-3 bg-gradient-to-r from-gray-400 to-gray-500 text-white rounded-xl font-semibold hover:from-gray-500 hover:to-gray-600 active:scale-95 transition-all duration-200 shadow-lg hover:shadow-xl min-h-[48px]"
        >
          Reset
        </button>
      </div>
    </div>
  )
}
