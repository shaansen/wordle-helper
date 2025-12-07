import { useState, useEffect, useCallback, useRef } from 'react'
import WordleGrid from './components/WordleGrid'
import Suggestions from './components/Suggestions'
import { solveWordleClient } from './services/clientSolver'

export type LetterState = 'empty' | 'grey' | 'yellow' | 'green'

export interface Guess {
  word: string
  states: LetterState[]
}

function App() {
  const [guesses, setGuesses] = useState<Guess[]>([
    { word: '', states: Array(5).fill('empty') },
  ])
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const solveTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const buildConstraints = useCallback(() => {
    const acceptedChars = new Set<string>()
    const deniedChars = new Set<string>()
    const knownPositions: Record<number, string> = {}
    const rejectedPositions: Record<number, string[]> = {}

    guesses.forEach(guess => {
      if (guess.word.length !== 5) return

      const word = guess.word.toLowerCase()
      const greenChars = new Map<string, number>()
      const yellowChars = new Set<string>()

      for (let i = 0; i < 5; i++) {
        const char = word[i]
        const state = guess.states[i]

        if (state === 'green') {
          acceptedChars.add(char)
          knownPositions[i + 1] = char
          greenChars.set(char, (greenChars.get(char) || 0) + 1)
        } else if (state === 'yellow') {
          acceptedChars.add(char)
          yellowChars.add(char)
          if (!rejectedPositions[i + 1]) {
            rejectedPositions[i + 1] = []
          }
          rejectedPositions[i + 1].push(char)
        } else if (state === 'grey') {
          const greenCount = greenChars.get(char) || 0
          const yellowCount = yellowChars.has(char) ? 1 : 0
          if (greenCount === 0 && yellowCount === 0) {
            deniedChars.add(char)
          } else {
            if (!rejectedPositions[i + 1]) {
              rejectedPositions[i + 1] = []
            }
            rejectedPositions[i + 1].push(char)
          }
        }
      }
    })

    return {
      acceptedChars: Array.from(acceptedChars),
      deniedChars: Array.from(deniedChars),
      knownPositions,
      rejectedPositions,
    }
  }, [guesses])

  const solveWordle = useCallback(async () => {
    const constraints = buildConstraints()
    const hasValidGuess = guesses.some(guess => {
      if (guess.word.length !== 5) return false
      return guess.states.some(state => state !== 'empty')
    })

    if (!hasValidGuess) {
      setSuggestions([])
      return
    }

    setLoading(true)
    setError(null)

    try {
      const words = await solveWordleClient(constraints)
      setSuggestions(words)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to solve Wordle. Please try again.',
      )
      setSuggestions([])
    } finally {
      setLoading(false)
    }
  }, [buildConstraints, guesses])

  useEffect(() => {
    if (solveTimeoutRef.current) {
      clearTimeout(solveTimeoutRef.current)
    }

    solveTimeoutRef.current = setTimeout(() => {
      solveWordle()
    }, 500)

    return () => {
      if (solveTimeoutRef.current) {
        clearTimeout(solveTimeoutRef.current)
      }
    }
  }, [solveWordle])

  const handleUpdateGuess = useCallback(
    (index: number, word: string, states: LetterState[]) => {
      const newGuesses = [...guesses]
      newGuesses[index] = { word, states }
      setGuesses(newGuesses)
    },
    [guesses],
  )

  const handleAddGuess = () => {
    setGuesses([...guesses, { word: '', states: Array(5).fill('empty') }])
  }

  const handleReset = () => {
    setGuesses([{ word: '', states: Array(5).fill('empty') }])
    setSuggestions([])
    setError(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-200 via-purple-200 to-indigo-300 bg-fixed">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl p-6 md:p-8 border-2 border-white/50">
          <header className="text-center mb-8">
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent mb-3 drop-shadow-lg">
              Wordle Solver
            </h1>
            <p className="text-gray-600 text-lg">
              Enter your guesses and mark letter states
            </p>
          </header>

          <div className="mb-8">
            <WordleGrid
              guesses={guesses}
              onUpdateGuess={handleUpdateGuess}
              onAddGuess={handleAddGuess}
              onReset={handleReset}
            />
          </div>

          <Suggestions
            suggestions={suggestions}
            loading={loading}
            error={error}
          />
        </div>
      </div>
    </div>
  )
}

export default App
